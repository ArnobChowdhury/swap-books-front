import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import Room from '../../models/room';
import { ModifiedRequest } from '../../interface';

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userId } = req.query;

  try {
    let userInfo;

    if (typeof userId === 'string') {
      userInfo = await User.getProfileInfo(userId);
    }
    // todo if we cannot find user we might want throw an error
    res.status(201).json({ userInfo });
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
    const notifications = await Room.getNotificationForUser(userId, Number(skip));
    const unseen = await Room.getCountOfUnseenNotification(userId);

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
    await Room.setNotificationAsSeen(roomId, userId);
    res.status(201).json({ message: 'Notification updated' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
