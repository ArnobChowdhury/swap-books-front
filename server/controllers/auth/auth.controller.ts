import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { HttpException } from '../../interface';
import User from '../../models/user';
import {
  generateJWT,
  verifyRefreshToken,
  decodePasswordResetToken,
} from '../../utils/jwt';
import { client as redisClient } from '../../utils/redis';
import { emailTransporter } from '../../utils/email';

// todo check if it is possible to use a single function for sign up and sign in
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // validation code should go here
  const { name, email, password, ageConfirmation, termsConfirmation } = req.body;

  try {
    const userExists = await User.findByEmail(email);

    if (userExists) {
      const err: HttpException = new Error('Something went wrong!');
      err.statusCode = 401;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User(
      name,
      email,
      hashedPassword,
      ageConfirmation,
      termsConfirmation,
    );
    const result = await user.save();
    // const { _id: userId } = result.ops[0];
    const userId = result.insertedId;

    res.status(201).json({ message: 'User created!', userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login: (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    // we don't know what is going to be returned if the user doesn't exist
    const user = await User.findByEmail(email);
    if (!user) {
      const err: HttpException = new Error('Invalid Username/Password!');
      err.statusCode = 401;
      throw err;
    }

    const { _id: dbId, password: dbPassword, name, locationObj } = user;
    let userLon: number | null = null;
    let userLat: number | null = null;
    if (locationObj) {
      [userLon, userLat] = locationObj.coordinates;
    }

    const isEqual = await bcrypt.compare(password, dbPassword);
    if (!isEqual) {
      const err: HttpException = new Error('Invalid Username/Password!');
      err.statusCode = 401;
      throw err;
    }
    const userId = dbId.toString();

    res.status(200).json({
      name,
      accessToken: generateJWT(userId, email, 'access'),
      refreshToken: generateJWT(userId, email, 'refresh'),
      userId,
      expiresIn: 3600,
      userLon,
      userLat,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { refreshToken: rfToken } = req.body;
  if (!rfToken) throw new createHttpError.BadRequest();
  try {
    const { userId, email } = await verifyRefreshToken(rfToken);
    res.send({
      accessToken: generateJWT(userId, email, 'access'),
      refreshToken: generateJWT(userId, email, 'refresh'),
      expiresIn: 3600,
    });
  } catch (err) {
    next(err);
  }
};

// TODO This function should changed. change this to make redis use promise
export const logout = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = req.body;
  if (!userId) throw new createHttpError.BadRequest();
  try {
    redisClient.DEL(`refreshToken:${userId}`, (err, redisRes) => {
      if (redisRes === 1) {
        res.status(201).json({ message: 'User logged out' });
      } else if (redisRes === 0) {
        res.status(201).json({ message: 'Log out from your end' });
      }
      if (err) {
        throw new createHttpError.InternalServerError();
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const forgotPassword: (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    // we don't know what is going to be returned if the user doesn't exist
    const user = await User.findByEmail(email);
    if (!user) {
      emailTransporter.sendMail({
        from: '"Pustokio" <no-reply@pustokio.com>', // sender address
        to: email,
        subject: 'No Account Found', // Subject line
        text: `
          Hi,

          We received a request to reset the password to access Pustokio with your email address ${email}, but we were unable to find an account associated with this address.

          If you use Pustokio and were expecting this email, consider trying to request a password reset using the email address associated with your account.

          If you do not use Pustokio or did not request a password reset, please ignore this email.

          Thanks, 
          The Pustokio team
        `,
        // @ts-ignore
        template: 'accountNotFound',
        context: {
          email,
        },
      });
    } else {
      const { _id, name, password } = user;
      const userId = _id.toHexString();
      const token = generateJWT(userId, email, 'passReset', password);
      emailTransporter.sendMail({
        from: '"Pustokio" <no-reply@pustokio.com>', // sender address
        to: email,
        subject: 'Account Password Reset', // Subject line
        text: `
          Hi ${name},

          You recently requested to reset your password for your Pustokio account. Use the link below to reset it. This password reset is only valid for the next 24 hours.          

          https://www.pustokio.com/reset-pass/${userId}?token=${token}

          If you did not request this change, please ignore this email. Your account information has not changed. 

          Thanks, 
          The Pustokio team
        `,
        // @ts-ignore
        template: 'resetPass',
        context: {
          name,
          action_url: `https://www.pustokio.com/reset-pass/${userId}?token=${token}`,
        },
      });
    }

    res.status(200).json({
      message:
        'We have sent an email to the address provided. Please check your inbox. It might take a few minutes. If not found in your inbox, please check your spam folder.',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const checkResetPasswordLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, token } = req.body;
  console.log(id);
  try {
    const { password: existingPassword } = await User.findById(id);
    decodePasswordResetToken(token, existingPassword);
    res.status(201).json({ message: 'Valid link' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    } else {
      err.message = 'Invalid Link!';
    }
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, token, password: newPassword } = req.body;
  try {
    const { password: existingPassword } = await User.findById(id);
    const { userId } = decodePasswordResetToken(token, existingPassword);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(userId, hashedPassword);
    res.status(201).json({ message: 'Password has been updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
