import mongodb, { ObjectId, InsertOneWriteOpResult } from 'mongodb';
import { getDb, getDbClient } from '../../utils/database';
import { sortMongoCollectionByTimeStamp } from '../../utils/general';

// const { ObjectId } = mongodb;
export interface MessageWithId extends Message {
  _id: mongodb.ObjectId;
}

export default class Message {
  roomId: mongodb.ObjectId;

  msg: string;

  fromId: string;

  toId: string;

  registered: boolean;

  seen: boolean;

  _id: ObjectId;

  constructor(
    roomId: string,
    msg: string,
    fromId: string,
    toId: string,
    seen: boolean,
    id: string,
  ) {
    this.roomId = new ObjectId(roomId);
    this.msg = msg;
    this.fromId = fromId;
    this.toId = toId;
    this.registered = true;
    this.seen = seen;
    this._id = new ObjectId(id);
  }

  // TODO this method is unused and should be removed later
  save(): Promise<mongodb.InsertOneWriteOpResult<MessageWithId>> {
    const db = getDb();
    return db.collection('messages').insertOne(this);
  }

  async saveMsgAndReturn(): Promise<InsertOneWriteOpResult<Message>> {
    const db = getDb();
    return db.collection('messages').insertOne(this);
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
    const recentSortedMessages = sortMongoCollectionByTimeStamp(
      recentMessagesFromDb,
    );
    return recentSortedMessages;
  }

  static setMsgAsSeen = (msgId: string) => {
    const db = getDb();
    const _id = new ObjectId(msgId);
    return db.collection('messages').updateOne({ _id }, { $set: { seen: true } });
  };
}
