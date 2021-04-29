import mongodb, { ObjectId } from 'mongodb';
import { getDb, getDbClient } from '../../utils/database';
import Notification, { NotificationWithId } from '../notification';
import Book from '../book';

export interface SwapWithId extends Swap {
  _id: mongodb.ObjectId;
}

export default class Swap {
  fromId: mongodb.ObjectId;
  toId: mongodb.ObjectId;
  roomId: mongodb.ObjectId;
  swapBook: mongodb.ObjectId;
  swapWithBook: mongodb.ObjectId;

  constructor(
    fromId: string,
    toId: string,
    roomId: ObjectId,
    swapBook: string,
    swapWithBook: string,
  ) {
    this.fromId = new ObjectId(fromId);
    this.toId = new ObjectId(toId);
    this.roomId = roomId;
    this.swapBook = new ObjectId(swapBook);
    this.swapWithBook = new ObjectId(swapWithBook);
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<SwapWithId>> {
    const db = getDb();
    return db.collection('swaps').insertOne(this);
  }

  static async getSwapsInBatch(_ids: mongodb.ObjectId[]): Promise<SwapWithId[]> {
    const db = getDb();
    return db
      .collection('swaps')
      .find({ _id: { $in: _ids } })
      .toArray();
  }

  static async requestTransaction(
    fromId: string,
    toId: string,
    roomId: ObjectId,
    swapBook: string,
    swapWithBook: string,
  ): Promise<{ swap: SwapWithId; notification: NotificationWithId }> {
    const client = getDbClient();
    const session = client.startSession();

    let swap: SwapWithId | undefined;
    let notification: NotificationWithId | undefined;
    try {
      await session.withTransaction(async () => {
        const newSwap = new this(fromId, toId, roomId, swapBook, swapWithBook);
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

        await Book.setAsSwapped(swapBook);
      });

      // @ts-ignore
      return { swap, notification };
    } finally {
      session.endSession();
    }
  }
}
