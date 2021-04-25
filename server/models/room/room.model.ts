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
  unreadMsgs: boolean;
  lastMessage: Date | null;
}

export interface RoomWithId extends Room {
  _id: mongodb.ObjectId;
}

export default class Room {
  participants: ParticipatntsProps[];

  constructor(
    participants: {
      userId: string;
      userName: string;
      interests: InterestProps[];
    }[],
  ) {
    const participantsWithObjectId = participants.map(participant => {
      const { userId, userName, interests } = participant;
      const userIdAsObjectId = new ObjectId(userId);
      const newParticipantObject: ParticipatntsProps = {
        userName,
        userId: userIdAsObjectId,
        interests,
        unreadMsgs: false,
        lastMessage: null,
      };
      return newParticipantObject;
    });
    this.participants = participantsWithObjectId;
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<RoomWithId>> {
    const db = getDb();
    return db.collection('rooms').insertOne({ ...this, lastModified: new Date() });
  }

  static async findRoomWithParticipants(
    ...participants: string[]
  ): Promise<RoomWithId | null> {
    const db = getDb();
    const arrayOfParticipants = participants.map(participant => {
      return new ObjectId(participant);
    });
    try {
      const room = await db.collection('rooms').findOne<RoomWithId>({
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
   * 1. Do we need it anymore?
   * 2. Limit number of responses
   * 3. Paginate
   */
  static async findAllRoomsByUserId(userId: string): Promise<RoomWithId[]> {
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

  static async getRoomsInBatch(_ids: mongodb.ObjectId[]): Promise<RoomWithId[]> {
    const db = getDb();
    return db
      .collection('rooms')
      .find({ _id: { $in: _ids } })
      .toArray();
  }

  static async getMatchesForAbook(
    userId: string,
    bookId: string,
  ): Promise<RoomWithId[]> {
    const db = getDb();

    return db
      .collection('rooms')
      .find({
        'participants.userId': new ObjectId(userId),
        'participants.interests.bookId': bookId,
        'participants.interests': { $type: 'array', $ne: [] },
      })
      .toArray();
  }
}
