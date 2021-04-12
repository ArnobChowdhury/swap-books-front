import mongodb, { ObjectId } from 'mongodb';
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

  async saveMsgAndReturn(): Promise<mongodb.InsertOneWriteOpResult<Message>> {
    const client = getDbClient();
    const messagesCollection = client.db().collection('messages');
    const roomsCollection = client.db().collection('rooms');
    const session = client.startSession();

    let msgCreationOpResult: mongodb.InsertOneWriteOpResult<Message>;
    try {
      await session.withTransaction(async () => {
        msgCreationOpResult = await messagesCollection.insertOne(this);
        const roomIdAsObjectId = new ObjectId(this.roomId);
        const userIdAsObjectId = new ObjectId(this.toId);
        await roomsCollection.updateOne(
          { _id: roomIdAsObjectId, 'participants.userId': userIdAsObjectId },
          {
            $set: { 'participants.$.unreadMsgs': true },
            $currentDate: { lastModified: true },
          },
        );
      });
    } finally {
      session.endSession();
    }
    // @ts-ignore
    return msgCreationOpResult;
  }

  static async returnLatestMsgs(roomId: string): Promise<MessageWithId[]> {
    const db = getDb();
    const recentMessagesFromDb = await db
      .collection('messages')
      .find({ roomId: new ObjectId(roomId) })
      .sort({ _id: -1 })
      .limit(20)
      .toArray();

    // TODO the below function should be re-written since we're using it twice
    const recentSortedMessages = sortMongoCollectionByTimeStamp(
      recentMessagesFromDb,
    );
    return recentSortedMessages;
  }

  /**
   * TODO for later
   * Right now we are calling this function every time we want to set a message as seen,
   * Let's think of changing that behavior and set unreadMsgs as false only when
   * the user opens a chatroom
   * And then we mark other messages as seen separately
   */
  static async setMsgAsSeen(roomId: string, userId: string, msgId: string) {
    const client = getDbClient();
    const messagesCollection = client.db().collection('messages');
    const roomsCollection = client.db().collection('rooms');
    const session = client.startSession();
    const msgIdAsObjectId = new ObjectId(msgId);
    const roomIdAsObjectId = new ObjectId(roomId);
    const userIdAsObjectId = new ObjectId(userId);
    try {
      await session.withTransaction(async () => {
        await messagesCollection.updateOne(
          { _id: msgIdAsObjectId },
          { $set: { seen: true } },
        );
        await roomsCollection.updateOne(
          {
            _id: roomIdAsObjectId,
            'participants.userId': userIdAsObjectId,
          },
          {
            $set: {
              'participants.$.unreadMsgs': false,
            },
          },
        );
      });
    } finally {
      session.endSession();
    }
  }
}
