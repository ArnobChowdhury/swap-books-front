import { ObjectSchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const validation = (schema: ObjectSchema) => async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { body, file } = req;
  try {
    let filename;
    if (file) {
      filename = file.filename;
    }
    const resource = { ...body, filename };
    await schema.validate(resource);
    next();
  } catch (err) {
    const error = new createHttpError.BadRequest('Bad data');
    next(error);
  }
};
