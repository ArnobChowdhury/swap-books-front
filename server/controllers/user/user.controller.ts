import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import Room from '../../models/room';
import Notification from '../../models/notification';
import Swap from '../../models/swap';
import { ModifiedRequest } from '../../interface';
import {
  processUserInfo,
  addLastModifiedFieldToNotification,
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

    const idOfSwapsNotifications = swapNotifications.map(({ swapId }) => swapId);

    const roomsAsNotifications = await Room.getRoomsInBatch(
      // @ts-ignore
      idOfInterestOrMatchNotifications,
    );
    const roomNotificationsWithLastModified = addLastModifiedFieldToNotification(
      roomsAsNotifications,
      interestOrMatchNotifications,
      'roomId',
    );

    // @ts-ignore
    const swapsAsNotifications = await Swap.getSwapsInBatch(idOfSwapsNotifications);
    const swapNotificationsWithLastModified = addLastModifiedFieldToNotification(
      swapsAsNotifications,
      swapNotifications,
      'roomId',
    );

    const notifications = [
      ...roomNotificationsWithLastModified,
      ...swapNotificationsWithLastModified,
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
  const { roomId } = req.body;
  const { userId } = req as ModifiedRequest;
  try {
    // TODO This function does not error even when we send a roomId that does not exist
    await Room.setNotificationAsSeen(roomId, userId);
    res.status(201).json({ message: 'Notification updated' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
