import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { ModifiedRequest, JWTDecoded } from '../interface';

export const jwtVerify = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string);
      (req as ModifiedRequest).isAuthenticated = true;
      (req as ModifiedRequest).userId = (decoded as JWTDecoded).aud;
    } catch (err) {
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      next(new createError.Unauthorized(message));
      return;
    }
  } else {
    // TODO: EITHER ALL PROTECTED ROUTES SHOULD TAKE INTO ACCOUNT THAT IF isAuthenticated IS FALSE THEY DO NOT DELIVER DATA
    // TODO IMPORTANT: SINCE WE ARE ONLY USING THIS MIDDLEWARE TO PROTECT OUR ROUTES WE CAN JUST THROW AN ERROR THAT YOU NEED TO AUTHENTICATED
    (req as ModifiedRequest).isAuthenticated = false;
  }
  next();
};
