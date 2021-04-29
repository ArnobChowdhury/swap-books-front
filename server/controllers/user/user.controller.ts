import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import Room from '../../models/room';
import Notification, { NotificationWithId } from '../../models/notification';
import Swap from '../../models/swap';
import { ModifiedRequest } from '../../interface';
import {
  processUserInfo,
  processRoomNotification,
  processSwapNotification,
  _idToRequiredProp,
  transformRoomWithBookNameAndId,
} from '../../utils/general';
import createError from 'http-errors';
import Book from '../../models/book';
import mongodb from 'mongodb';

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as ModifiedRequest;
  try {
    const user = await User.getUserNameAndLoc(userId as string);
    const userIdAsMongoId = new mongodb.ObjectID(userId);
    const booksAvailableToSwap = await Book.getNumberOfBooksByUser(userIdAsMongoId);
    if (user) {
      const userProcessed = processUserInfo(user);
      res.status(201).json({ ...userProcessed, booksAvailableToSwap });
    } else {
      throw new createError.NotFound('User NOT Found!');
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getProfileInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userId } = req.query;
  try {
    const userInfo = await User.getProfileInfo(userId as string);
    // TODO: if we cannot find user we want to throw an error
    res.status(201).json(userInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateUserLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userLon, userLat } = req.body;
    const { userId } = req as ModifiedRequest;
    await User.updateLocation(userId, userLon, userLat);
    res.status(201).json({ userLon, userLat });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getUserNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userId } = req as ModifiedRequest;
  const { skip } = req.query;

  try {
    const allnotifications = await Notification.getNotificationsForUser(
      userId,
      Number(skip),
    );
    const interestOrMatchNotifications = allnotifications.filter(
      ({ type }) => type === 'interest' || type === 'match',
    );

    const swapNotifications = allnotifications.filter(
      ({ type }) =>
        type === 'swapReq' || type === 'swapApprove' || type === 'swapReject',
    );

    const idOfInterestOrMatchNotifications = interestOrMatchNotifications.map(
      ({ roomId }) => roomId,
    );
    const roomsforNotifications = await Room.getRoomsInBatch(
      // @ts-ignore
      idOfInterestOrMatchNotifications,
    );

    const idOfSwapsNotifications = swapNotifications.map(({ swapId }) => swapId);
    // @ts-ignore
    const swapsForNotifications = await Swap.getSwapsInBatch(idOfSwapsNotifications);
    const allRequiredBookIds: string[] = [];
    roomsforNotifications.forEach(room => {
      room.participants[0].interests.forEach(bookId => {
        allRequiredBookIds.push(bookId);
      });
      room.participants[1].interests.forEach(bookId => {
        allRequiredBookIds.push(bookId);
      });
    });
    swapsForNotifications.forEach(swap => {
      allRequiredBookIds.push(swap.swapBook.toHexString());
      allRequiredBookIds.push(swap.swapWithBook.toHexString());
    });

    const requiredBooksForNotifications = await Book.getBooksInBatches(
      allRequiredBookIds,
      'bookName',
    );

    const notificationsFromIds = allnotifications.map(noti => noti.fromId);
    const notificationsFromIdsAndNames = await User.findUserNamesByIdsInBatch(
      notificationsFromIds,
    );

    const roomNotificationsProcessed = roomsforNotifications.map(room => {
      const notification = allnotifications.find(
        noti => noti.roomId?.toHexString() === room._id.toHexString(),
      );

      const roomMateIndex = room.participants.findIndex(
        participant => participant.userId.toHexString() !== userId,
      );
      const roomMateId = room.participants[roomMateIndex].userId.toHexString();
      const roomMateUserDoc = notificationsFromIdsAndNames.find(
        user => user._id.toHexString() === roomMateId,
      );
      const roomMateName = roomMateUserDoc?.name;

      const newTransformedRoom = transformRoomWithBookNameAndId(
        room,
        // @ts-ignore
        requiredBooksForNotifications,
      );

      return processRoomNotification(
        notification as NotificationWithId,
        // @ts-ignore
        newTransformedRoom,
        roomMateId,
        roomMateName as string,
      );
    });

    const swapNotificationsProcessed = swapsForNotifications.map(swap => {
      const notification = allnotifications.find(
        noti => noti.swapId?.toHexString() === swap._id.toHexString(),
      );
      const swapBook = requiredBooksForNotifications.find(
        book => book._id.toHexString() === swap.swapBook.toHexString(),
      );
      const swapWithBook = requiredBooksForNotifications.find(
        book => book._id.toHexString() === swap.swapWithBook.toHexString(),
      );

      const swapReqFromUserWithName = notificationsFromIdsAndNames.find(
        user => user._id.toHexString() === notification?.fromId.toHexString(),
      );
      const fromIdName = swapReqFromUserWithName?.name;

      return processSwapNotification(
        notification as NotificationWithId,
        swap,
        swapBook?.bookName,
        swapWithBook?.bookName,
        fromIdName as string,
      );
    });

    const notifications = [
      ...roomNotificationsProcessed,
      ...swapNotificationsProcessed,
    ];

    notifications.sort(
      // @ts-ignore
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified),
    );

    const unseen = await Notification.getCountOfUnseenNotification(userId);

    res.status(201).json({ notifications, unseen });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

export const setNotificationAsSeen = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { notificationId } = req.body;
  // const { userId } = req as ModifiedRequest;
  try {
    // TODO This function does not error even when we send a roomId that does not exist
    await Notification.setNotificationAsSeen(notificationId);
    res.status(201).json({ message: 'Notification updated' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
