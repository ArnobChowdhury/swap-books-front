import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { ModifiedRequest } from '../interface';

export const protectedRoute = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!(req as ModifiedRequest).isAuthenticated) {
    next(new createError.Unauthorized());
  }
  next();
};
