import { SocketDecoded } from '../../interface';
import Book from '../../models/book';
import Room from '../../models/room';
import {
  INIT_SOCKET,
  RECEIVE_LATEST_NOTIFICATION,
  RECEIVE_INTEREST,
  EXPRESS_INTEREST,
  DISCONNECT,
  JOIN_ALL_ROOMS,
  SEND_MSG,
  RECEIVE_MSG,
  INIT_MSGS,
} from '../../socketTypes';
import Message from '../../models/message';
import { addTimestampToMongoCollection, isAMatchedRoom } from '../../utils/general';
import {
  setSocketIdToRedis,
  getSocketIdFromRedis,
  delSocketIdFromRedis,
} from '../../utils/sockets';

/**
 * TODOS:
 * 1. Make user join a room when it is a match if that user is not already in that room
 * 2. Send single chats to front end instead of sending bulk msgs
 */

export const interactionController = (socket: SocketDecoded): void => {
  socket.on(INIT_SOCKET, async () => {
    const {
      decoded_token: { aud },
      id: socketId,
    } = socket;

    try {
      await setSocketIdToRedis(socketId, aud);
    } catch {
      // TODO emit an error to let the client know that something has went wrong
    }
  });

  socket.on(
    EXPRESS_INTEREST,
    async ({
      userId,
      userName,
      bookId,
      bookName,
      bookOwnerId,
      bookOwnerName,
      isInterested,
    }) => {
      try {
        let interestNotification;
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

        if (bookOwnerSocketId !== null) {
          socket.broadcast.to(bookOwnerSocketId).emit(RECEIVE_LATEST_NOTIFICATION, {
            notifications: [interestNotification],
            unseen: numOfUnseenNotificationForBookOwner,
          });
        }

        if (isMatch) {
          const numOfUnseenNotificationForUser = await Room.getCountOfUnseenNotification(
            userId,
          );
          socket.emit(RECEIVE_LATEST_NOTIFICATION, {
            notifications: [interestNotification],
            unseen: numOfUnseenNotificationForUser,
          });
        }

        socket.emit(RECEIVE_INTEREST, { bookId, isInterested });
      } catch (err) {
        // TODO if there is an error we will let the user know about this. We will create an error type for this
        // eslint-disable-next-line no-console
      }
    },
  );

  socket.on(JOIN_ALL_ROOMS, async cb => {
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

    const allRooms = allMatchedRooms.map(room => {
      const roomMateIndex = room.participants.findIndex(
        participant => participant.userId.toHexString() !== userId,
      );
      const userIndex = roomMateIndex === 0 ? 1 : 0;
      return {
        roomId: room._id,
        roomMateName: room.participants[roomMateIndex].userName,
        roomMateId: room.participants[roomMateIndex].userId.toHexString(),
        roomMateInterests: room.participants[userIndex].interests,
        userInterests: room.participants[roomMateIndex].interests,
      };
    });
    // TODO we need to sort the rooms according to lastMessage before sending it to front-end

    // TODO check if user has unseen message in db
    cb(allRooms);
  });

  socket.on(SEND_MSG, async ({ room, msg, userId, roomMateId }, cb) => {
    const message = new Message(room, msg, userId, roomMateId, false);
    // TODO before storing a message in a room we need to store the latest message time to our Room db
    const latestMsgsFromDb = await message.saveMsgAndReturnLatest();

    let latestMsgsWithTimeStamp;
    if (latestMsgsFromDb !== undefined) {
      latestMsgsWithTimeStamp = addTimestampToMongoCollection(latestMsgsFromDb);
    }

    socket.to(room).emit(RECEIVE_MSG, latestMsgsWithTimeStamp);
    // FIXME error handling

    cb(latestMsgsWithTimeStamp);
  });

  socket.on(INIT_MSGS, async (room, cb) => {
    const latestMsgsFromDb = await Message.returnLatestMsgs(room);

    let latestMsgsWithTimeStamp;
    if (latestMsgsFromDb !== undefined) {
      latestMsgsWithTimeStamp = addTimestampToMongoCollection(latestMsgsFromDb);
    }

    cb(latestMsgsWithTimeStamp);
  });

  socket.on(DISCONNECT, async () => {
    const {
      decoded_token: { aud },
    } = socket;
    await delSocketIdFromRedis(aud);
    // TODO get rid of below code
  });
};
