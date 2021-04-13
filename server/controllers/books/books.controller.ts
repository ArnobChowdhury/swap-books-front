import mongodb from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import Book from '../../models/book';
import User from '../../models/user';
import { ModifiedRequest } from '../../interface';
import { processBookForUser } from '../../utils/general';

const { ObjectId } = mongodb;

export const addABook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { bookName, bookAuthor, createdAt } = req.body;
  const { filename } = req.file;
  const { userId } = req as ModifiedRequest;
  const bookPicturePath = `images/${filename}`;

  try {
    const user = await User.findById(userId);
    if (user) {
      const { locationObj, name: bookOwnerName } = user;
      if (locationObj) {
        const { coordinates } = locationObj;
        const book = new Book(
          bookName,
          bookAuthor,
          bookPicturePath,
          bookOwnerName,
          new ObjectId(userId),
          coordinates,
          Number(createdAt),
        );
        const result = await book.save();
        const { insertedId: bookId } = result;

        res.status(201).json({ message: 'Book has been added!', bookId });
      } else {
        throw new createError.Forbidden(
          'You need to update your location before you can add a book.',
        );
      }
    } else {
      throw new createError.Unauthorized('No user found!');
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const extendBookValidity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { bookId: bookIdFromClient, requestedAt } = req.body;
  try {
    const updatedBook = await Book.extendBookValidity(
      bookIdFromClient,
      Number(requestedAt),
    );
    const { _id: bookId, validTill } = updatedBook;

    res
      .status(201)
      .json({ message: 'Extended for next ten days!', bookId, validTill });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteABook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { bookId } = req.body;
  const { userId } = req as ModifiedRequest;

  try {
    await Book.removeBook(bookId, userId);
    res.status(201).json({ message: 'Book deleted!', bookId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getHomeFeedBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userLon, userLat, userId, page } = req.query;

  try {
    const booksWithoutInterestedUserFields = await Book.getLocationBasedBooks(
      [Number(userLon), Number(userLat)],
      Number(page),
    );

    const books = booksWithoutInterestedUserFields.map(book => {
      return processBookForUser(book, userId as string);
    });
    res.status(200).json({
      message: 'Fetched books details successfully',
      books,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getProfileBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { profileId } = req.params;
  const { userId, page } = req.query;

  try {
    if (typeof profileId === 'string') {
      const booksWithoutInterestedUserFields = await Book.getUserBooks(
        profileId,
        Number(page),
      );

      const books = booksWithoutInterestedUserFields.map(book => {
        return processBookForUser(book, userId as string);
      });
      res.status(201).json({ books });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
