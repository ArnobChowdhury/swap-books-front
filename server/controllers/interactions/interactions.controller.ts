import { Server } from 'socket.io';
import { SocketDecoded } from '../../interface';
import Book from '../../models/book';
import Room from '../../models/room';
import {
  RECEIVE_LATEST_NOTIFICATION,
  RECEIVE_INTEREST,
  RECEIVE_NEW_MSG,
  JOIN_SINGLE_ROOM,
  LEAVE_SINGLE_ROOM,
  SET_MSG_AS_SEEN,
} from '../../socketTypes';
import Message, { MessageWithId } from '../../models/message';
import { Timestamp } from '../../utils/general';
import { addTimestampToMongoCollection, isAMatchedRoom } from '../../utils/general';
import {
  setSocketIdToRedis,
  getSocketIdFromRedis,
  delSocketIdFromRedis,
} from '../../utils/sockets';
import { RoomWithLastModifiedAndID } from '../../models/room';
import { ObjectID } from 'mongodb';
import { processRoomForUser } from '../../utils/general';

/**
 * TODOS:
 * //1. Make user join a room when it is a match if that user is online and is not already in that room
 * 2. Send single chats to front end instead of sending bulk msgs
 */

export const saveSocketToRedis = async (socket: SocketDecoded) => {
  const {
    decoded_token: { aud },
    id: socketId,
  } = socket;

  try {
    await setSocketIdToRedis(socketId, aud);
  } catch {
    console.error(
      `Failed to save socket id to redis, disconnecting socket - socket:${aud}`,
    );
    socket.disconnect();
  }
};

export const expressInterest = async (
  io: Server,
  socket: SocketDecoded,
  {
    userId,
    userName,
    bookId,
    bookName,
    bookOwnerId,
    bookOwnerName,
    isInterested,
  }: {
    userId: string;
    userName: string;
    bookId: string;
    bookName: string;
    bookOwnerId: string;
    bookOwnerName: string;
    isInterested: string;
  },
) => {
  try {
    let interestNotification: RoomWithLastModifiedAndID;
    if (isInterested) {
      interestNotification = await Book.addInterestTransaction(
        bookId,
        bookName,
        bookOwnerId,
        bookOwnerName,
        userId,
        userName,
      );
    } else {
      interestNotification = await Book.removeInterestTransaction(
        bookId,
        bookName,
        bookOwnerId,
        userId,
      );
    }

    let isMatch = false;
    if (interestNotification) {
      isMatch = isAMatchedRoom(interestNotification);
    }

    const numOfUnseenNotificationForBookOwner = await Room.getCountOfUnseenNotification(
      bookOwnerId,
    );

    const bookOwnerSocketId = await getSocketIdFromRedis(bookOwnerId);

    /**
     * TODO /
     * 1. For now, we are sending notification only when user is interested in a book NOT
     * when the user removes the notification. We might want to think about this.
     */
    if (bookOwnerSocketId !== null && isInterested) {
      socket.broadcast.to(bookOwnerSocketId).emit(RECEIVE_LATEST_NOTIFICATION, {
        notifications: [interestNotification],
        unseen: numOfUnseenNotificationForBookOwner,
      });
    }

    const roomId = interestNotification._id.toHexString();
    const roomMembers = io.sockets.adapter.rooms.get(roomId);

    let userIsInRoom: boolean = false;
    let bookOwnerIsInRoom: boolean = false;

    if (roomMembers) {
      userIsInRoom = roomMembers.has(socket.id);
      bookOwnerIsInRoom = bookOwnerSocketId
        ? roomMembers.has(bookOwnerSocketId)
        : false;
    }

    if (isMatch) {
      const numOfUnseenNotificationForUser = await Room.getCountOfUnseenNotification(
        userId,
      );
      // Send rooms to these people if they are online
      if (!userIsInRoom) {
        socket.join(roomId);
        //TODO emit a the newly joined room name to user
        socket.emit(
          JOIN_SINGLE_ROOM,
          processRoomForUser(interestNotification, userId),
        );
      }

      if (!bookOwnerIsInRoom && bookOwnerSocketId) {
        const bookOwnerSocket = io.sockets.sockets.get(bookOwnerSocketId);
        bookOwnerSocket?.join(roomId);
        //TODO emit a the newly joined room name to bookOwner
        bookOwnerSocket?.emit(
          JOIN_SINGLE_ROOM,
          processRoomForUser(interestNotification, bookOwnerId),
        );
      }

      socket.emit(RECEIVE_LATEST_NOTIFICATION, {
        notifications: [interestNotification],
        unseen: numOfUnseenNotificationForUser,
      });
    }

    if (!isMatch) {
      if (userIsInRoom) {
        socket.leave(roomId);
        //TODO emit a the newly joined room name to user
        socket.emit(LEAVE_SINGLE_ROOM, roomId);
      }

      if (bookOwnerIsInRoom && bookOwnerSocketId) {
        const bookOwnerSocket = io.sockets.sockets.get(bookOwnerSocketId);
        bookOwnerSocket?.leave(roomId);
        bookOwnerSocket?.emit(LEAVE_SINGLE_ROOM, roomId);
      }
    }

    socket.emit(RECEIVE_INTEREST, { bookId, isInterested });
  } catch (err) {
    // TODO if there is an error we will let the user know about this. We will create an error type for this
    // eslint-disable-next-line no-console
  }
};
interface RoomResponse {
  roomId: ObjectID;
  roomMateName: string;
  roomMateId: string;
  roomMateInterests: RoomWithLastModifiedAndID['participants'][0]['interests'];
  userInterests: RoomWithLastModifiedAndID['participants'][0]['interests'];
}

export const joinAllRooms = async (
  socket: SocketDecoded,
  cb: (rooms: RoomResponse[]) => void,
) => {
  // get all active rooms for this user
  const {
    decoded_token: { aud: userId },
  } = socket;

  // TODO Move async function iniside try catch block and send error to front end if something goes wrong
  const allRoomsOfThisUser = await Room.findAllRoomsByUserId(userId);
  const allMatchedRooms = allRoomsOfThisUser.filter(room => isAMatchedRoom(room));
  // join all rooms
  allRoomsOfThisUser.forEach(room => {
    socket.join(room._id.toHexString());
  });

  const allRooms = allMatchedRooms.map(room => processRoomForUser(room, userId));
  // TODO we need to sort the rooms according to lastMessage before sending it to front-end

  // TODO check if user has unseen message in db
  cb(allRooms);
};

interface SendMsgShape {
  room: string;
  msg: string;
  userId: string;
  roomMateId: string;
  msgId: string;
}

export const sendMsg = async (
  socket: SocketDecoded,
  { room, msg, userId, roomMateId, msgId }: SendMsgShape,
  cb: (registeredMsg: { _id: string; timestamp: number }) => void,
) => {
  const message = new Message(room, msg, userId, roomMateId, false, msgId);
  // TODO before storing a message in a room we need to store the latest message time to our Room db
  const { ops } = await message.saveMsgAndReturn();
  const [insertedDocument] = ops;

  const msgsWithTimeStamp = addTimestampToMongoCollection(insertedDocument);

  socket.to(room).emit(RECEIVE_NEW_MSG, msgsWithTimeStamp);
  // TODO error handling

  cb({
    _id: insertedDocument._id.toHexString(),
    timestamp: msgsWithTimeStamp.timestamp,
  });
};

// Todo we might think of moving it to a GET method using Axios
export const initMsgs = async (
  room: string,
  cb: (msgs: (MessageWithId & Timestamp)[] | undefined) => void,
) => {
  const latestMsgsFromDb = await Message.returnLatestMsgs(room);

  let latestMsgsWithTimeStamp;
  if (latestMsgsFromDb !== undefined) {
    latestMsgsWithTimeStamp = latestMsgsFromDb.map(addTimestampToMongoCollection);
  }

  cb(latestMsgsWithTimeStamp);
};

export const socketDisconnect = async (socket: SocketDecoded) => {
  const {
    decoded_token: { aud },
  } = socket;
  await delSocketIdFromRedis(aud);
};

export const setMsgAsSeen = async (
  socket: SocketDecoded,
  roomId: string,
  msgId: string,
  cb: () => void,
) => {
  const {
    decoded_token: { aud },
  } = socket;
  await Message.setMsgAsSeen(roomId, aud, msgId);
  socket.to(roomId).emit(SET_MSG_AS_SEEN, roomId, msgId);
  cb();
};
