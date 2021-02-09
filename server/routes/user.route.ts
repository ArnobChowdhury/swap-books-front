import express from 'express';
import { protectedRoute } from '../middlewares/protectedRoute';
import {
  getUserInfo,
  updateUserLocation,
  setNotificationAsSeen,
  getUserNotifications,
} from '../controllers/user';

const router = express.Router();

router.get('/', getUserInfo);
router.put('/loc', protectedRoute, updateUserLocation);

// TODO change below route from '/notifications' to '/notifications?seen=roomId'
router.get('/notifications', protectedRoute, getUserNotifications);
router.put('/notifications', protectedRoute, setNotificationAsSeen);

export default router;
