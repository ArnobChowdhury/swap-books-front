import { Server } from 'socket.io';
import { Request, Response, NextFunction } from 'express';
import { SocketDecoded } from '../../interface';
import Book from '../../models/book';
import Room from '../../models/room';
import Notification from '../../models/notification';
import Swap from '../../models/swap';
import {
  RECEIVE_LATEST_NOTIFICATION,
  RECEIVE_INTEREST,
  RECEIVE_NEW_MSG,
  JOIN_SINGLE_ROOM,
  LEAVE_SINGLE_ROOM,
  SET_MSG_AS_SEEN,
  USER_ONLINE,
  USER_OFFLINE,
  SWAP_CONSENT,
} from '../../socketTypes';
import Message, { MessageWithId } from '../../models/message';
import {
  addTimestampToMongoCollection,
  isAMatchedRoom,
  processRoomForUser,
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
import { ObjectId } from 'mongodb';
import createHttpError from 'http-errors';
import User from '../../models/user';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const deleteFile = promisify(fs.unlink);

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

      if (!bookOwnerIsInRoom && bookOwnerSocketId) {
        const bookOwnerSocket = io.sockets.sockets.get(bookOwnerSocketId);
        bookOwnerSocket?.join(roomId);
        bookOwnerIsInRoom = true;
        bookOwnerSocket?.emit(
          JOIN_SINGLE_ROOM,
          processRoomForUser(room, bookOwnerId, userName, true),
        );
      }

      // Send rooms to these people if they are online
      if (!userIsInRoom) {
        socket.join(roomId);
        socket.emit(
          JOIN_SINGLE_ROOM,
          processRoomForUser(room, userId, bookOwnerName, bookOwnerIsInRoom),
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
  io: Server,
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

  const allRooms = await Promise.all(
    allMatchedRooms.map(async room => {
      const roomMateIndex = room.participants.findIndex(
        participant => participant.userId.toHexString() !== userId,
      );
      const roomMate = allRoomMatesWithNameAndId.find(
        ({ _id }) =>
          _id.toHexString() ===
          room.participants[roomMateIndex].userId.toHexString(),
      );

      const roomMateSocketId = await getSocketIdFromRedis(
        roomMate?._id.toHexString() as string,
      );
      const roomId = room._id.toHexString();
      const roomMembers = io.sockets.adapter.rooms.get(roomId);

      let roomMateIsActive: boolean = false;

      if (roomMembers && roomMateSocketId) {
        roomMateIsActive = roomMembers.has(roomMateSocketId);
      }

      socket.to(roomId).emit(USER_ONLINE, userId);

      return processRoomForUser(
        room,
        userId,
        roomMate?.name as string,
        roomMateIsActive,
      );
    }),
  );
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
  cb: (registeredMsg: { _id: string; timestamp: Date }) => void,
) => {
  const message = new Message(room, msg, userId, roomMateId, false, msgId);
  const { ops } = await message.saveMsgAndReturn();
  const [insertedMsg] = ops;
  const { timestamp } = insertedMsg;

  socket.to(room).emit(RECEIVE_NEW_MSG, insertedMsg);
  // TODO error handling

  cb({
    _id: insertedMsg._id.toHexString(),
    timestamp,
  });
};

// Todo we might think of moving it to a GET method using Axios
export const getMsgs = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId, skip } = req.query;
  try {
    const latestMsgsFromDb = await Message.returnMsgs(
      roomId as string,
      Number(skip),
    );

    res.status(200).json({
      message: 'Get initMsgs for this room',
      latestMsgsFromDb,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const socketDisconnecting = (socket: SocketDecoded) => {
  // TODO - THERE IS A ROOM INSIDE SOCKET.ROOMS THAT I DID NOT RECOGNIZE
  const {
    decoded_token: { aud: userId },
  } = socket;
  const allRooms = socket.rooms;

  allRooms.forEach(room => {
    socket.to(room).emit(USER_OFFLINE, userId);
  });
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
      await Promise.all(
        bookPicturePaths.map(async picturePath => {
          await deleteFile(path.join(__dirname, '..', '..', '..', picturePath));
        }),
      );
    }

    const { fromId: reqSenderIdAsObjectId, roomId, swapBook } = swap;
    const { bookId: swapBookId } = swapBook;

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
      if (hasAccepted) {
        reqSenderSocket?.emit(SWAP_CONSENT, swapBookId);
      }
    }
    cb(true);
  } catch {
    cb(false);
    // TODO Handle error
  }
};
