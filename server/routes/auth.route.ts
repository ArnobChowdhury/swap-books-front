import express from 'express';
import {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  checkResetPasswordLink,
} from '../controllers/auth';

const router = express.Router();

// TODO: Change underscores to hyphens
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/check-reset-password-link', checkResetPasswordLink);

export default router;
