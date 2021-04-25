import mongodb from 'mongodb';
import { getDb } from '../../utils/database';

const { ObjectId } = mongodb;

export interface NotificationWithId extends Notification {
  _id: mongodb.ObjectId;
}

type NotificationType =
  | 'interest'
  | 'match'
  | 'swapReq'
  | 'swapApprove'
  | 'swapReject'
  | 'announcement';

export default class Notification {
  fromId: mongodb.ObjectId;
  toId: mongodb.ObjectId;
  type: NotificationType;
  lastModified: Date;
  notificationText?: string | null;
  roomId?: mongodb.ObjectId | null;
  swapId?: mongodb.ObjectId | null;
  seen: boolean;

  constructor(
    fromId: string,
    toId: string,
    type: NotificationType,
    notificationText?: string | null,
    roomId?: string | null,
    swapId?: string | null,
  ) {
    this.lastModified = new Date();
    this.fromId = new ObjectId(fromId);
    this.type = type;
    this.toId = new ObjectId(toId);
    this.notificationText = notificationText;
    if (roomId) this.roomId = new ObjectId(roomId);
    if (swapId) this.swapId = new ObjectId(swapId);
    this.seen = false;
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<NotificationWithId>> {
    const db = getDb();
    return db.collection('notifications').insertOne(this);
  }

  static async getNotificationsForUser(
    toIdAsString: string,
    skip: number,
  ): Promise<NotificationWithId[]> {
    const db = getDb();
    const toId = new ObjectId(toIdAsString);
    return db
      .collection('notifications')
      .find({ toId })
      .sort({ lastModified: -1 })
      .skip(skip)
      .limit(5)
      .toArray();
  }

  static async getCountOfUnseenNotification(toIdAsString: string): Promise<number> {
    const db = getDb();
    const toId = new ObjectId(toIdAsString);

    return db.collection('notifications').countDocuments({ toId, seen: false });
  }
}
