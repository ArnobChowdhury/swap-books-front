import express from 'express';
import {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  checkResetPasswordLink,
  emailVerification,
} from '../controllers/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/check-reset-password-link', checkResetPasswordLink);
router.post('/mail-verify', emailVerification);

export default router;
