import mongodb from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import Book, { BookWithoutLocationProp } from '../../models/book';
import User from '../../models/user';
import Room from '../../models/room';
import Swap from '../../models/swap';
import Notification from '../../models/notification';
import { ModifiedRequest } from '../../interface';
import {
  processBookForUser,
  extractRoomMateIdFromRoom,
  _idToRequiredProp,
  extractInterestsOfUserFromRoom,
  isAMatchedRoom,
} from '../../utils/general';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const deleteFile = promisify(fs.unlink);

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
        const newBook = new Book(
          bookName,
          bookAuthor,
          bookPicturePath,
          bookOwnerName,
          new ObjectId(userId),
          coordinates,
          Number(createdAt),
        );
        const { ops } = await newBook.save();
        const [insertedBook] = ops;
        delete insertedBook.location;
        const book = processBookForUser(
          insertedBook as BookWithoutLocationProp,
          userId,
        );

        res.status(201).json({ message: 'Book has been added!', book });
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

    const book = await Book.editBook(
      userId,
      bookId,
      bookName,
      bookAuthor,
      bookPicturePath,
    );
    const processedBook = processBookForUser(book, userId);

    if (deleteFilePath) {
      await deleteFile(path.join(__dirname, '..', '..', '..', deleteFilePath));
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
      await deleteFile(path.join(__dirname, '..', '..', '..', bookPicturePath));
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
  const { userId, page, swapRequested } = req.query;

  try {
    if (typeof profileId === 'string') {
      if (swapRequested && userId !== profileId) {
        throw new createError.Unauthorized();
      }

      const sendSwapRequested =
        Boolean(swapRequested) && swapRequested === 'true' && userId === profileId;
      const booksWithoutInterestedUserFields = await Book.getUserBooks(
        profileId,
        Number(page),
        sendSwapRequested,
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

    const pendingSwap = await Swap.pendingSwap(bookId as string);

    let pendingSwapRequestTo;
    let pendingSwapRequestFrom;

    if (pendingSwap) {
      const { _id: swapId, swapBook, swapWithBook, toId, fromId } = pendingSwap;

      if (swapBook.bookId === bookId) {
        const swapRequestSentTo = await User.findById(
          pendingSwap.toId.toHexString(),
        );
        pendingSwapRequestTo = {
          name: swapRequestSentTo?.name,
          bookName: swapWithBook.bookName,
          matchId: toId.toHexString(),
        };
      }

      if (swapWithBook.bookId === bookId) {
        const swapRequestSentFrom = await User.findById(
          pendingSwap.fromId.toHexString(),
        );

        const notification = await Notification.findNotificationBySwapIdforUser(
          userId,
          swapId,
        );

        if (!notification) {
          throw new createError.BadRequest('Insufficient information');
        }

        pendingSwapRequestFrom = {
          name: swapRequestSentFrom?.name,
          bookName: swapBook.bookName,
          notificationId: notification._id,
          matchId: fromId.toHexString(),
        };
      }
    }

    const rawMatches = await Room.getMatchesForAbook(userId, bookId as string);
    const matchedRooms = rawMatches.filter(isAMatchedRoom);
    const allRoomMatesIds = matchedRooms.map(match =>
      extractRoomMateIdFromRoom(userId, match),
    );
    const matchesWithNames = await User.findUserNamesByIdsInBatch(allRoomMatesIds);
    const matchesForBook = matchesWithNames.map(match =>
      _idToRequiredProp(match, 'userId'),
    );

    res.status(200).json({
      message: 'Get all matches',
      matchesForBook,
      pendingSwapRequestTo,
      pendingSwapRequestFrom,
    });
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

    const matchedBooksIds = extractInterestsOfUserFromRoom(userId, room);
    const books = await Book.getBooksInBatches(
      matchedBooksIds,
      'bookName',
      'bookAuthor',
      'bookPicturePath',
    );
    const booksOfTheMatch = books.map(book => _idToRequiredProp(book, 'bookId'));

    res.status(200).json({ message: 'Get all books', booksOfTheMatch });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getBooksOfARoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { roomId } = req.query;
  const { userId } = req as ModifiedRequest;

  try {
    if (!roomId) {
      throw new createError.BadRequest('Insufficient information');
    }

    const room = await Room.findById(roomId as string);

    if (!room) {
      throw new createError.NotFound('Sorry! Interests could not be found!');
    }

    const userInterestBookIds = extractInterestsOfUserFromRoom(userId, room);
    const roomMate = room.participants.find(
      participant => participant.userId.toHexString() !== userId,
    );
    const roomMateInterestBookIds = extractInterestsOfUserFromRoom(
      roomMate?.userId.toHexString() as string,
      room,
    );

    const books = await Book.getBooksInBatches(
      [...userInterestBookIds, ...roomMateInterestBookIds],
      'bookName',
    );
    const userInterests: string[] = [];
    const roomMateInterests: string[] = [];

    books.forEach(book => {
      const bookId = book._id.toHexString();
      if (userInterestBookIds.includes(bookId)) {
        userInterests.push(book.bookName);
      } else {
        roomMateInterests.push(book.bookName);
      }
    });

    res.status(200).json({
      message: 'Get all interests for this room',
      userInterests,
      roomMateInterests,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const bookIsEditable = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { bookId } = req.query;
  try {
    const hasSwap = await Swap.pendingSwap(bookId as string);
    const isEditable = hasSwap === null;

    let message;
    if (isEditable) {
      message = 'This book is editable.';
    } else {
      message = 'This book is not editable.';
    }

    res.status(200).json({ message, isEditable });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
