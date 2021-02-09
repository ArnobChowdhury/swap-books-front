import mongodb from 'mongodb';
import { getDb, getDbClient } from '../../utils/database';
import { sortMongoCollectionByTimeStamp } from '../../utils/general';

const { ObjectId } = mongodb;
interface MessageWithId extends Message {
  _id: mongodb.ObjectId;
}

export default class Message {
  roomId: mongodb.ObjectId;

  msg: string;

  fromId: string;

  toId: string;

  seen: boolean;

  constructor(roomId: string, msg: string, fromId: string, toId: string, seen: boolean) {
    this.roomId = new ObjectId(roomId);
    this.msg = msg;
    this.fromId = fromId;
    this.toId = toId;
    this.seen = seen;
  }

  // TODO this method is unused and should be removed later
  save(): Promise<mongodb.InsertOneWriteOpResult<MessageWithId>> {
    const db = getDb();
    return db.collection('messages').insertOne(this);
  }

  async saveMsgAndReturnLatest(): Promise<MessageWithId[] | undefined> {
    const messageCollection = getDb().collection('messages');
    const session = getDbClient().startSession();
    session.startTransaction();

    let msgs: MessageWithId[] = [];
    try {
      const { insertedCount } = await messageCollection.insertOne(this);
      if (insertedCount !== 1) {
        session.abortTransaction();
      }

      const recentMessagesFromDb = await messageCollection
        .find<MessageWithId>({ roomId: this.roomId })
        .sort({ _id: -1 })
        .limit(20)
        .toArray();
      if (recentMessagesFromDb.length === 0) {
        session.abortTransaction();
      }

      const recentSortedMessages = sortMongoCollectionByTimeStamp(recentMessagesFromDb);
      await session.commitTransaction();
      session.endSession();
      msgs = recentSortedMessages;
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }
    return msgs;
  }

  static async returnLatestMsgs(roomId: string): Promise<MessageWithId[]> {
    const db = getDb();
    const recentMessagesFromDb = await db
      .collection('messages')
      .find<MessageWithId>({ roomId: new ObjectId(roomId) })
      .sort({ _id: -1 })
      .limit(20)
      .toArray();

    // TODO the below function should be re-written since we're using it twice
    const recentSortedMessages = sortMongoCollectionByTimeStamp(recentMessagesFromDb);
    return recentSortedMessages;
  }
}
