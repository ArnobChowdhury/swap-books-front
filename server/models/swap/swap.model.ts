import mongodb, { ObjectId } from 'mongodb';
import { getDb, getDbClient } from '../../utils/database';
import Notification, { NotificationWithId } from '../notification';
import Book from '../book';
import { _idToRequiredProp, ObjWithId } from '../../utils/general';

export interface SwapWithId extends Swap {
  _id: mongodb.ObjectId;
}

interface BookProps {
  bookId: string;
  bookName: string;
}

export default class Swap {
  fromId: mongodb.ObjectId;
  toId: mongodb.ObjectId;
  roomId: mongodb.ObjectId;
  swapBook: BookProps;
  swapWithBook: BookProps;
  status: 'approved' | 'pending' | 'rejected';

  constructor(
    fromId: string,
    toId: string,
    roomId: ObjectId,
    swapBook: BookProps,
    swapWithBook: BookProps,
  ) {
    this.fromId = new ObjectId(fromId);
    this.toId = new ObjectId(toId);
    this.roomId = roomId;
    this.swapBook = swapBook;
    this.swapWithBook = swapWithBook;
    this.status = 'pending';
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<SwapWithId>> {
    const db = getDb();
    return db.collection('swaps').insertOne(this);
  }

  static findById(_id: ObjectId): Promise<SwapWithId> {
    const db = getDb();
    return db.collection('swaps').findOne({ _id });
  }

  static async getSwapsInBatch(_ids: mongodb.ObjectId[]): Promise<SwapWithId[]> {
    const db = getDb();
    return db
      .collection('swaps')
      .find({ _id: { $in: _ids } })
      .toArray();
  }

  static async pendingSwap(bookId: string) {
    const db = getDb();

    return db.collection<SwapWithId>('swaps').findOne({
      $or: [{ 'swapBook.bookId': bookId }, { 'swapWithBook.bookId': bookId }],
      status: 'pending',
    });
  }

  static async requestTransaction(
    fromId: string,
    toId: string,
    roomId: ObjectId,
    swapBookId: string,
    swapWithBookId: string,
  ): Promise<{ swap: SwapWithId; notification: NotificationWithId }> {
    const client = getDbClient();
    const session = client.startSession();

    let swap: SwapWithId | undefined;
    let notification: NotificationWithId | undefined;
    try {
      await session.withTransaction(async () => {
        const requiredBookNamesAndIds = await Book.getBooksInBatches(
          [swapBookId, swapWithBookId],
          'bookName',
        );
        const swapBookRaw = requiredBookNamesAndIds.find(
          book => book._id.toHexString() === swapBookId,
        );
        const swapWithBookRaw = requiredBookNamesAndIds.find(
          book => book._id.toHexString() === swapWithBookId,
        );
        const swapBook = _idToRequiredProp(swapBookRaw as ObjWithId, 'bookId');
        const swapWithBook = _idToRequiredProp(
          swapWithBookRaw as ObjWithId,
          'bookId',
        );

        const newSwap = new this(
          fromId,
          toId,
          roomId,
          // @ts-ignore
          swapBook,
          // @ts-ignore
          swapWithBook,
        );

        const inserteSwapResult = await newSwap.save();
        const { insertedId: swapId, ops: swapOp } = inserteSwapResult;
        [swap] = swapOp;

        const swapNotification = new Notification(
          fromId,
          toId,
          'swapReq',
          undefined,
          undefined,
          swapId.toHexString(),
        );
        const insertedNotification = await swapNotification.save();
        const { ops: notificationOp } = insertedNotification;
        [notification] = notificationOp;

        await Book.setAsSwapped(swapBookId);
      });

      // @ts-ignore
      return { swap, notification };
    } finally {
      session.endSession();
    }
  }

  static async updateStatusAndReturn(
    _id: ObjectId,
    status: Swap['status'],
  ): Promise<SwapWithId> {
    const db = getDb();
    try {
      const swapUpdateResult = await db
        .collection('swaps')
        .findOneAndUpdate({ _id }, { $set: { status } }, { returnOriginal: false });
      const { value } = swapUpdateResult;
      return value;
    } catch (err) {
      throw err;
    }
  }

  static async approvalTransaction(
    notificationIdAsString: string,
    toIdAsString: string,
    hasAccepted: boolean,
  ): Promise<{
    notification: NotificationWithId;
    swap: SwapWithId;
    bookPicturePaths: string[];
  }> {
    const client = getDbClient();
    const session = client.startSession();

    let swap: SwapWithId | undefined;
    let notification: NotificationWithId;
    const bookPicturePaths: string[] = [];
    try {
      await session.withTransaction(async () => {
        const { swapId, toId: notificationToId } = await Notification.findById(
          notificationIdAsString,
        );
        if (toIdAsString !== notificationToId.toHexString()) {
          throw new Error();
        }
        if (!swapId) {
          throw new Error('Wrong notification id.');
        }
        swap = await this.updateStatusAndReturn(
          swapId,
          hasAccepted ? 'approved' : 'rejected',
        );
        const { fromId, toId, swapBook, swapWithBook } = swap;

        const approvalNotification = new Notification(
          toId.toHexString(),
          fromId.toHexString(),
          hasAccepted ? 'swapApprove' : 'swapReject',
          undefined,
          undefined,
          swapId.toHexString(),
        );

        const { ops: approvalOps } = await approvalNotification.save();
        [notification] = approvalOps;

        if (hasAccepted) {
          const booksWithPicturePaths = await Book.getBooksInBatches(
            [swapBook.bookId, swapWithBook.bookId],
            'bookPicturePath',
          );
          booksWithPicturePaths.forEach(book =>
            bookPicturePaths.push(book.bookPicturePath),
          );
          await Book.removeBook(swapBook.bookId, fromId.toHexString());
          await Book.removeBook(swapWithBook.bookId, toId.toHexString());
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.endSession();
    }
    // @ts-ignore
    return { notification, swap, bookPicturePaths };
  }
}
