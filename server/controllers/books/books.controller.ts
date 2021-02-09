import mongodb from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import Book from '../../models/book';
import User from '../../models/user';
import { ModifiedRequest } from '../../interface';

const { ObjectId } = mongodb;

export const addABook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { bookName, bookAuthor } = req.body;
  const { filename } = req.file;
  const { userId } = req as ModifiedRequest;
  const bookPicturePath = `images/${filename}`;

  try {
    const { locationObj, name: bookOwnerName } = await User.findById(userId);
    if (locationObj) {
      const { coordinates } = locationObj;
      const book = new Book(
        bookName,
        bookAuthor,
        bookPicturePath,
        bookOwnerName,
        new ObjectId(userId),
        coordinates,
      );
      const result = await book.save();
      const { insertedId: bookId } = result;

      res.status(201).json({ message: 'Book added!', bookId });
    } else {
      throw new createError.Forbidden(
        'You need to update your location before you can add a book.',
      );
    }
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
      const ind = book.interestedUsers.find(el => el.toString() === userId);
      const bookWithInterestedField = { ...book, isInterested: ind !== undefined };
      delete bookWithInterestedField.interestedUsers;
      return bookWithInterestedField;
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
  const { userId } = req.query;

  try {
    let books;

    if (typeof profileId === 'string') {
      const booksWithoutInterestedUserFields = await Book.getUserBooks(profileId);
      // todo make this a single utility function since it is also being used in the home feed function
      books = booksWithoutInterestedUserFields.map(book => {
        const ind = book.interestedUsers.find(el => el.toString() === userId);
        const bookWithInterestedField = { ...book, isInterested: ind !== undefined };
        delete bookWithInterestedField.interestedUsers;
        return bookWithInterestedField;
      });
    }
    res.status(201).json({ books });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
