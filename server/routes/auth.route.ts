import express from 'express';
import {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
} from '../controllers/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot_password', forgotPassword);

export default router;
