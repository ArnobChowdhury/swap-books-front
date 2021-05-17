import mongodb, { Timestamp } from 'mongodb';
import { getDb } from '../../utils/database';

const { ObjectId } = mongodb;

interface ParticipatntsProps {
  userId: mongodb.ObjectId;
  interests: string[];
  unreadMsgs: boolean;
}

export interface RoomWithId extends Room {
  _id: mongodb.ObjectId;
}

export default class Room {
  participants: ParticipatntsProps[];

  lastModified: Date;

  constructor(
    participants: {
      userId: string;
      interests: string[];
    }[],
  ) {
    const participantsWithObjectId = participants.map(participant => {
      const { userId, interests } = participant;
      const userIdAsObjectId = new ObjectId(userId);
      const newParticipantObject: ParticipatntsProps = {
        userId: userIdAsObjectId,
        interests,
        unreadMsgs: false,
      };
      return newParticipantObject;
    });
    this.participants = participantsWithObjectId;
    this.lastModified = new Date();
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<RoomWithId>> {
    const db = getDb();
    return db.collection('rooms').insertOne({ ...this, lastModified: new Date() });
  }

  static async findById(roomId: string) {
    const db = getDb();
    const _id = new ObjectId(roomId);
    return db.collection<RoomWithId>('rooms').findOne({ _id });
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
    // TODO RETURN ROOMS AFTER SORTING ACCORDING TO LAST MESSAGE
    const db = getDb();
    // .skip(skip)
    // .limit(5)
    try {
      const room = await db
        .collection('rooms')
        .find({ participants: { $elemMatch: { userId: new ObjectId(userId) } } })
        .sort({ lastModified: -1 })
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
        'participants.interests': bookId,
      })
      .toArray();
  }
}
