import mongodb from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import Book from '../../models/book';
import User from '../../models/user';
import Room from '../../models/room';
import { ModifiedRequest } from '../../interface';
import {
  processBookForUser,
  extractRoomMateIdFromRoom,
  _idToRequiredProp,
  extractInterestsOfUserFromRoom,
} from '../../utils/general';
import path from 'path';
import fs from 'fs';

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

export const editBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { bookName, bookAuthor, bookId } = req.body;
  const { userId } = req as ModifiedRequest;
  let bookPicturePath;
  if (req.file) {
    const filename = req.file.filename;
    bookPicturePath = `images/${filename}`;
  }

  try {
    let deleteFilePath;
    if (bookPicturePath) {
      const { bookPicturePath: oldPicturePath } = await Book.getBookPicturePath(
        bookId,
      );
      deleteFilePath = oldPicturePath;
    }

    const book = await Book.editBook(bookId, bookName, bookAuthor, bookPicturePath);
    const processedBook = processBookForUser(book, userId);

    if (deleteFilePath) {
      fs.unlinkSync(path.join(__dirname, '..', '..', '..', deleteFilePath));
    }

    res
      .status(201)
      .json({ message: 'Book edited successfully!', book: processedBook });
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
    const { bookPicturePath } = await Book.getBookPicturePath(bookId);
    await Book.removeBook(bookId, userId);
    if (bookPicturePath) {
      fs.unlinkSync(path.join(__dirname, '..', '..', '..', bookPicturePath));
    }
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

export const getMatchesForAbook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { bookId } = req.query;
  const { userId } = req as ModifiedRequest;

  try {
    if (!bookId) {
      throw new createError.BadRequest('Insufficient information');
    }

    const rawMatches = await Room.getMatchesForAbook(userId, bookId as string);
    const allRoomMatesIds = rawMatches.map(match =>
      extractRoomMateIdFromRoom(userId, match),
    );
    const matchesWithNames = await User.findUserNamesByIdsInBatch(allRoomMatesIds);
    const matchesForBook = matchesWithNames.map(match =>
      _idToRequiredProp(match, 'userId'),
    );

    res.status(200).json({ message: 'Get all matches', matchesForBook });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getBooksOfAMatch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { matchId } = req.query;
  const { userId } = req as ModifiedRequest;

  try {
    if (!matchId) {
      throw new createError.BadRequest('Insufficient information');
    }

    const room = await Room.findRoomWithParticipants(
      matchId as string,
      userId as string,
    );
    if (!room) {
      throw new createError.NotFound(
        'Sorry! Interests of the user could not be found!',
      );
    }

    const matchedBooks = extractInterestsOfUserFromRoom(userId, room);
    // TODO: We can delete below line we start saving only bookId in the database instead of { bookName, bookId }
    const matchedBookIds = matchedBooks.map(book => book.bookId);
    const books = await Book.getBooksInBatches(matchedBookIds);
    const booksOfTheMatch = books.map(book => _idToRequiredProp(book, 'bookId'));

    res.status(200).json({ message: 'Get all books', booksOfTheMatch });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
