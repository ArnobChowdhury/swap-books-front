import { Server } from 'socket.io';
import { SocketDecoded } from '../../interface';
import Book from '../../models/book';
import Room from '../../models/room';
import Notification, { NotificationWithId } from '../../models/notification';
import Swap from '../../models/swap';
import {
  RECEIVE_LATEST_NOTIFICATION,
  RECEIVE_INTEREST,
  RECEIVE_NEW_MSG,
  JOIN_SINGLE_ROOM,
  LEAVE_SINGLE_ROOM,
  SET_MSG_AS_SEEN,
} from '../../socketTypes';
import Message, { MessageWithId } from '../../models/message';
import {
  addTimestampToMongoCollection,
  isAMatchedRoom,
  processRoomForUser,
  Timestamp,
  processRoomNotification,
  _idToRequiredProp,
  transformRoomWithBookNameAndId,
  processSwapNotification,
} from '../../utils/general';
import {
  setSocketIdToRedis,
  getSocketIdFromRedis,
  delSocketIdFromRedis,
} from '../../utils/sockets';
import { RoomWithId } from '../../models/room';
import { ObjectId } from 'mongodb';
import createHttpError from 'http-errors';
import User from '../../models/user';
import fs from 'fs';
import path from 'path';

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

export const removeInterest = async (
  io: Server,
  socket: SocketDecoded,
  {
    userId,
    bookId,
    bookOwnerId,
  }: {
    userId: string;
    bookId: string;
    bookOwnerId: string;
  },
) => {
  try {
    const removedFromRoom = await Book.removeInterestTransaction(
      bookId,
      bookOwnerId,
      userId,
    );

    const isMatch = isAMatchedRoom(removedFromRoom);
    const bookOwnerSocketId = await getSocketIdFromRedis(bookOwnerId);

    const roomId = removedFromRoom._id.toHexString();
    const roomMembers = io.sockets.adapter.rooms.get(roomId);

    let userIsInRoom: boolean = false;
    let bookOwnerIsInRoom: boolean = false;

    if (roomMembers) {
      userIsInRoom = roomMembers.has(socket.id);
      bookOwnerIsInRoom = bookOwnerSocketId
        ? roomMembers.has(bookOwnerSocketId)
        : false;
    }

    if (!isMatch) {
      if (userIsInRoom) {
        socket.leave(roomId);
        socket.emit(LEAVE_SINGLE_ROOM, roomId);
      }

      if (bookOwnerIsInRoom && bookOwnerSocketId) {
        const bookOwnerSocket = io.sockets.sockets.get(bookOwnerSocketId);
        bookOwnerSocket?.leave(roomId);
        bookOwnerSocket?.emit(LEAVE_SINGLE_ROOM, roomId);
      }
    }

    socket.emit(RECEIVE_INTEREST, { bookId, isInterested: false });
  } catch {
    // TODO if there is an error we will let the user know about this. We will create an error type for this
  }
};

export const expressInterest = async (
  io: Server,
  socket: SocketDecoded,
  {
    userId,
    bookId,
    bookOwnerId,
  }: {
    userId: string;
    bookId: string;
    bookOwnerId: string;
  },
) => {
  try {
    const {
      room,
      outGoingNotification,
      inComingNotification,
      userName,
      bookOwnerName,
    } = await Book.addInterestTransaction(bookId, bookOwnerId, userId);

    const numOfUnseenNotificationForBookOwner = await Notification.getCountOfUnseenNotification(
      bookOwnerId,
    );

    const allRequiredBookIds: string[] = [];
    room.participants.forEach(particpant => {
      particpant.interests.forEach(bookId => {
        allRequiredBookIds.push(bookId);
      });
    });

    const requiredBooksForNotifications = await Book.getBooksInBatches(
      allRequiredBookIds,
      'bookName',
    );

    const newTransformedRoom = transformRoomWithBookNameAndId(
      room,
      // @ts-ignore
      requiredBooksForNotifications,
    );

    const outGoingNotificationProcessed = processRoomNotification(
      outGoingNotification,
      // @ts-ignore
      newTransformedRoom,
      userId,
      userName,
    );

    const bookOwnerSocketId = await getSocketIdFromRedis(bookOwnerId);

    if (bookOwnerSocketId !== null) {
      socket.broadcast.to(bookOwnerSocketId).emit(RECEIVE_LATEST_NOTIFICATION, {
        notifications: [outGoingNotificationProcessed],
        unseen: numOfUnseenNotificationForBookOwner,
      });
    }

    const roomId = room._id.toHexString();
    const roomMembers = io.sockets.adapter.rooms.get(roomId);

    let userIsInRoom: boolean = false;
    let bookOwnerIsInRoom: boolean = false;

    if (roomMembers) {
      userIsInRoom = roomMembers.has(socket.id);
      bookOwnerIsInRoom = bookOwnerSocketId
        ? roomMembers.has(bookOwnerSocketId)
        : false;
    }

    if (inComingNotification && bookOwnerName) {
      // having inComingNotification meaning it is a match so we should join the room if we are not already and send the notification to user as well
      const numOfUnseenNotificationForUser = await Notification.getCountOfUnseenNotification(
        userId,
      );
      // Send rooms to these people if they are online
      if (!userIsInRoom) {
        socket.join(roomId);
        socket.emit(
          JOIN_SINGLE_ROOM,
          processRoomForUser(room, userId, bookOwnerName),
        );
      }

      if (!bookOwnerIsInRoom && bookOwnerSocketId) {
        const bookOwnerSocket = io.sockets.sockets.get(bookOwnerSocketId);
        bookOwnerSocket?.join(roomId);
        //TODO emit a the newly joined room name to bookOwner
        bookOwnerSocket?.emit(
          JOIN_SINGLE_ROOM,
          processRoomForUser(room, bookOwnerId, userName),
        );
      }

      const inComingNotificationProcessed = processRoomNotification(
        inComingNotification,
        // @ts-ignore
        newTransformedRoom,
        bookOwnerId,
        bookOwnerName,
      );
      socket.emit(RECEIVE_LATEST_NOTIFICATION, {
        notifications: [inComingNotificationProcessed],
        unseen: numOfUnseenNotificationForUser,
      });
    }

    socket.emit(RECEIVE_INTEREST, { bookId, isInterested: true });
  } catch (err) {
    // TODO if there is an error we will let the user know about this. We will create an error type for this
    console.log(err);
  }
};
interface RoomResponse {
  roomId: ObjectId;
  roomMateName: string;
  roomMateId: string;
  unreadMsgs: boolean;
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
  allMatchedRooms.forEach(room => {
    socket.join(room._id.toHexString());
  });

  const allRoomMateIds = allMatchedRooms.map(room => {
    const roomMate = room.participants.find(
      room => room.userId.toHexString() !== userId,
    );
    // @ts-ignore
    return roomMate.userId;
  });

  const allRoomMatesWithNameAndId = await User.findUserNamesByIdsInBatch(
    allRoomMateIds,
  );

  const allRooms = allMatchedRooms.map(room => {
    const roomMateIndex = room.participants.findIndex(
      participant => participant.userId.toHexString() !== userId,
    );
    const roomMate = allRoomMatesWithNameAndId.find(
      ({ _id }) =>
        _id.toHexString() === room.participants[roomMateIndex].userId.toHexString(),
    );
    return processRoomForUser(room, userId, roomMate?.name as string);
  });
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

export const createSwapRequest = async (
  io: Server,
  socket: SocketDecoded,
  swapWithId: string,
  swapWithBook: string,
  swapBook: string,
  cb: (isSuccess: boolean) => void,
) => {
  const {
    decoded_token: { aud: userId },
  } = socket;
  try {
    const room = await Room.findRoomWithParticipants(swapWithId, userId);
    if (!room) {
      throw new createHttpError.NotFound('Match could not be found!');
    }

    const { swap, notification } = await Swap.requestTransaction(
      userId,
      swapWithId,
      room._id,
      swapBook,
      swapWithBook,
    );

    const swapWithSocketId = await getSocketIdFromRedis(swapWithId);
    const roomId = room._id.toHexString();
    const roomMembers = io.sockets.adapter.rooms.get(roomId);

    let matchIsInRoom: boolean = false;

    if (roomMembers) {
      matchIsInRoom = swapWithSocketId ? roomMembers.has(swapWithSocketId) : false;
    }

    const numOfUnseenNotificationForMatch = await Notification.getCountOfUnseenNotification(
      swapWithId,
    );

    const fromUser = await User.findById(userId);

    const notificationForSwapWith = processSwapNotification(
      notification,
      swap,
      fromUser?.name as string,
    );

    if (matchIsInRoom && swapWithSocketId) {
      const swapWithSocket = io.sockets.sockets.get(swapWithSocketId);
      swapWithSocket?.emit(RECEIVE_LATEST_NOTIFICATION, {
        notifications: [notificationForSwapWith],
        unseen: numOfUnseenNotificationForMatch,
      });
    }

    // TODO Emit the swap notification to user if online
    cb(true);
  } catch {
    cb(false);
  }
};

export const acceptOrRejectSwapRequest = async (
  io: Server,
  socket: SocketDecoded,
  notificationId: string,
  bookId: string,
  hasAccepted: boolean,
  cb: (isSuccess: boolean) => void,
) => {
  const {
    decoded_token: { aud: userId },
  } = socket;
  try {
    const pendingSwap = await Swap.pendingSwap(bookId);
    if (!pendingSwap) throw new createHttpError.BadRequest('Swap not found');

    const { notification, swap, bookPicturePaths } = await Swap.approvalTransaction(
      notificationId,
      userId,
      hasAccepted,
    );
    if (hasAccepted && bookPicturePaths.length > 0) {
      bookPicturePaths.forEach(picturePath => {
        fs.unlinkSync(path.join(__dirname, '..', '..', '..', picturePath));
      });
    }
    const { fromId: reqSenderIdAsObjectId, roomId } = swap;
    const reqSenderId = reqSenderIdAsObjectId.toHexString();
    const reqSendersSocketId = await getSocketIdFromRedis(reqSenderId);
    let reqSenderIsInRoom = false;
    const roomMembers = io.sockets.adapter.rooms.get(roomId.toHexString());
    if (roomMembers) {
      reqSenderIsInRoom = reqSendersSocketId
        ? roomMembers.has(reqSendersSocketId)
        : false;
    }
    const fromUser = await User.findById(userId);
    const notificationForSwapAccpetance = processSwapNotification(
      notification,
      swap,
      fromUser?.name as string,
    );
    const numOfUnseenNotificationForMatch = await Notification.getCountOfUnseenNotification(
      reqSenderId,
    );
    if (reqSenderIsInRoom && reqSendersSocketId) {
      const reqSenderSocket = io.sockets.sockets.get(reqSendersSocketId);
      reqSenderSocket?.emit(RECEIVE_LATEST_NOTIFICATION, {
        notifications: [notificationForSwapAccpetance],
        unseen: numOfUnseenNotificationForMatch,
      });
    }
    cb(true);
  } catch {
    cb(false);
    // TODO Handle error
  }
};
