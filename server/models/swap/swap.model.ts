import mongodb, { ObjectId } from 'mongodb';
import { getDb, getDbClient } from '../../utils/database';
import Notification from '../notification';
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
  ) {
    const client = getDbClient();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const newSwap = new this(fromId, toId, roomId, swapBook, swapWithBook);
        const { insertedId: swapId } = await newSwap.save();

        const swapNotification = new Notification(
          fromId,
          toId,
          'swapReq',
          undefined,
          undefined,
          swapId.toHexString(),
        );
        await swapNotification.save();
        await Book.setAsSwapped(swapBook);
      });
    } finally {
      session.endSession();
    }
  }
}
