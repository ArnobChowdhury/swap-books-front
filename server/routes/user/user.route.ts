import express from 'express';
import { protectedRoute } from '../../middlewares/protectedRoute';
import { validation } from '../../middlewares/validation';
import {
  getUserInfo,
  getProfileInfo,
  updateUserLocation,
  setNotificationAsSeen,
  getUserNotifications,
} from '../../controllers/user';
import {
  updateUserLocationSchema,
  setNotificationAsSeenSchema,
} from './user.validator';

const router = express.Router();

router.get('/', protectedRoute, getUserInfo);
router.get('/profile', getProfileInfo);
router.put(
  '/loc',
  protectedRoute,
  validation(updateUserLocationSchema),
  updateUserLocation,
);

// TODO change below route from '/notifications' to '/notifications?seen=roomId'
router.get('/notifications', protectedRoute, getUserNotifications);
router.put(
  '/notifications',
  protectedRoute,
  validation(setNotificationAsSeenSchema),
  setNotificationAsSeen,
);

export default router;
