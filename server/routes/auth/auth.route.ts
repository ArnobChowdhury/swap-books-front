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
} from '../../controllers/auth';
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  checkResetPasswordLinkSchema,
  emailVerificationSchema,
} from './auth.validator';
import { validation } from '../../middlewares/validation';

const router = express.Router();

router.post('/signup', validation(signupSchema), signup);
router.post('/login', validation(loginSchema), login);
router.post('/refresh-token', validation(refreshTokenSchema), refreshToken);
router.post('/logout', validation(logoutSchema), logout);
router.post('/forgot-password', validation(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validation(resetPasswordSchema), resetPassword);
router.post(
  '/check-reset-password-link',
  validation(checkResetPasswordLinkSchema),
  checkResetPasswordLink,
);
router.post('/mail-verify', validation(emailVerificationSchema), emailVerification);

export default router;
