import mongodb, { Timestamp } from 'mongodb';
import { getDb } from '../../utils/database';

const { ObjectId } = mongodb;

interface InterestProps {
  bookId: string;
  bookName: string;
}

interface ParticipatntsProps {
  userId: mongodb.ObjectId;
  userName: string;
  interests: InterestProps[];
  interestSeen: boolean;
  unreadMsgs: boolean;
}

export interface RoomWithLastModifiedAndID extends Room {
  lastModified: Timestamp;
  _id: mongodb.ObjectId;
}

export default class Room {
  participants: ParticipatntsProps[];

  constructor(
    participants: {
      userId: string;
      userName: string;
      interests: InterestProps[];
      interestSeen: boolean;
    }[],
  ) {
    const participantsWithObjectId = participants.map(participant => {
      const { userId, userName, interests, interestSeen } = participant;
      const userIdAsObjectId = new ObjectId(userId);
      const newParticipantObject: ParticipatntsProps = {
        userName,
        userId: userIdAsObjectId,
        interests,
        interestSeen,
        unreadMsgs: false,
      };
      return newParticipantObject;
    });
    this.participants = participantsWithObjectId;
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<RoomWithLastModifiedAndID>> {
    const db = getDb();
    return db.collection('rooms').insertOne({ ...this, lastModified: new Date() });
  }

  static async findRoomWithParticipants(
    ...participants: string[]
  ): Promise<RoomWithLastModifiedAndID | null> {
    const db = getDb();
    const arrayOfParticipants = participants.map(participant => {
      return new ObjectId(participant);
    });
    try {
      const room = await db.collection('rooms').findOne<RoomWithLastModifiedAndID>({
        participants: {
          $all: [
            { $elemMatch: { userId: arrayOfParticipants[0] } },
            { $elemMatch: { userId: arrayOfParticipants[1] } },
          ],
        },
      });
      return room;
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Something went wrong');
    }
  }

  /**
   * TODO for findAllRoomsByUserId
   * 1. Limit number of responses
   * 2. Paginate
   */
  static async findAllRoomsByUserId(
    userId: string,
  ): Promise<RoomWithLastModifiedAndID[]> {
    const db = getDb();
    try {
      const room = await db
        .collection('rooms')
        .find({ participants: { $elemMatch: { userId: new ObjectId(userId) } } })
        .toArray();
      return room;
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Something went wrong');
    }
  }

  static async getNotificationForUser(
    userId: string,
    skip: number,
  ): Promise<RoomWithLastModifiedAndID[]> {
    const userIdAsMongoId = new ObjectId(userId);
    const db = getDb();

    const notifications = await db
      .collection('rooms')
      .find({
        participants: {
          $elemMatch: {
            userId: userIdAsMongoId,
            interests: { $type: 'array', $ne: [] },
          },
        },
      })
      .sort({ lastModified: -1, _id: -1 })
      .skip(skip)
      .limit(5)
      .toArray();

    return notifications;
  }

  static async getCountOfUnseenNotification(
    userIdAsString: string,
  ): Promise<number> {
    const db = getDb();
    const userId = new ObjectId(userIdAsString);

    return db
      .collection('rooms')
      .find({
        participants: {
          $elemMatch: {
            userId,
            interests: { $type: 'array', $ne: [] },
            interestSeen: false,
          },
        },
      })
      .count();
  }

  static async setNotificationAsSeen(
    roomId: string,
    userIdAsString: string,
  ): Promise<mongodb.UpdateWriteOpResult> {
    const db = getDb();
    const _id = new ObjectId(roomId);
    const userId = new ObjectId(userIdAsString);
    return db
      .collection('rooms')
      .updateOne(
        { _id, 'participants.userId': userId },
        { $set: { 'participants.$.interestSeen': true } },
      );
  }

  static async getNotificationByRoomId(
    _id: mongodb.ObjectId,
  ): Promise<RoomWithLastModifiedAndID | null> {
    const db = getDb();
    return db.collection('rooms').findOne({ _id });
  }
}
