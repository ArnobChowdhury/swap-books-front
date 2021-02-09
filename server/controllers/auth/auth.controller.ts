import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { HttpException } from '../../interface';
import User from '../../models/user';
import { generateJWT, verifyRefreshToken } from '../../utils/jwt';
import { client as redisClient } from '../../utils/redis';

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
      const err: HttpException = new Error(
        'A user with this email could not be found.',
      );
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
      const err: HttpException = new Error('Wrong password!');
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
