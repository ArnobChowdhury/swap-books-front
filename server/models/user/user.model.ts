import mongodb, { ObjectId } from 'mongodb';
import { getDb, getDbClient } from '../../utils/database';
import Swap from '../swap';

interface UserWithId extends User {
  _id: mongodb.ObjectID;
}

export default class User {
  name: string;

  email: string;

  password: string;

  ageConfirmation: boolean;

  termsConfirmation: boolean;

  emailVerified: boolean;

  locationObj?: {
    type: string;
    coordinates: number[];
  };

  currentInterests: mongodb.ObjectId[];

  constructor(
    name: string,
    email: string,
    password: string,
    ageConfirmation: boolean,
    termsConfirmation: boolean,
    emailVerified: boolean = false,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.ageConfirmation = ageConfirmation;
    this.termsConfirmation = termsConfirmation;
    this.emailVerified = emailVerified;
    this.currentInterests = [];
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<UserWithId>> {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static async findByEmail(email: string) {
    const db = getDb();
    try {
      const user = await db.collection('users').findOne<UserWithId>({ email });
      return user;
    } catch {
      throw new Error('No user with this email was found.');
    }
  }

  static async updateLocation(userId: string, lon: number, lat: number) {
    const client = getDbClient();
    const userCollection = client.db().collection('users');
    const booksCollection = client.db().collection('books');
    const session = client.startSession();
    const userIdAsMongoId = new ObjectId(userId);

    try {
      await session.withTransaction(async () => {
        await userCollection.updateOne(
          { _id: userIdAsMongoId },
          {
            $set: {
              'locationObj.coordinates': [lon, lat],
              'locationObj.type': 'Point',
            },
          },
        );

        await booksCollection.updateMany(
          { userId: userIdAsMongoId },
          {
            $set: {
              'location.coordinates': [lon, lat],
            },
          },
        );
      });
    } catch {
      throw new Error('Something went wrong! Could not update.');
    }
  }

  static async findById(userId: string) {
    const db = getDb();
    try {
      const user = await db
        .collection('users')
        .findOne<UserWithId>({ _id: new ObjectId(userId) });
      return user;
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Could not retrieve user');
    }
  }

  static async findUserNamesByIdsInBatch(
    userIds: ObjectId[],
  ): Promise<{ name: string; _id: ObjectId }[]> {
    const db = getDb();
    try {
      const user = await db
        .collection('users')
        .find({ _id: { $in: userIds } }, { projection: { name: 1 } })
        .toArray();
      return user;
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Could not retrieve users');
    }
  }

  static async verifyEmail(userId: string) {
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: { emailVerified: true } });
  }

  static getUserNameAndLoc(
    userId: string,
  ): Promise<{ name: string; locationObj: User['locationObj'] } | null> {
    const db = getDb();
    return db
      .collection('users')
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { _id: -1, name: 1, locationObj: 1 } },
      );
  }

  static async getProfileInfo(userId: string) {
    // const db = getDb();
    const client = getDbClient();
    const userCollection = client.db().collection('users');
    const booksCollection = client.db().collection('books');
    const session = client.startSession();
    const userIdAsMongoId = new ObjectId(userId);
    let userName: string = '';
    let numberOfbooksAvailable: number = 0;
    let booksSwapped;

    //*IMPORTANT TODO
    // TODO: Right way to achieve this is aggregation since we are just querying DB not writing anything, so transaction is pointless. Or, we can just query this like we do for normal user
    try {
      await session.withTransaction(async () => {
        const userDoc = await userCollection.findOne<UserWithId>(
          {
            _id: userIdAsMongoId,
          },
          { projection: { _id: 0, name: 1 } },
        );
        if (userDoc) {
          userName = userDoc.name;
        }

        numberOfbooksAvailable = await booksCollection.countDocuments({
          userId: userIdAsMongoId,
        });

        booksSwapped = await Swap.numberOfApprovedSwap(userIdAsMongoId);
      });
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Could not retrieve user');
    }
    return { userName, numberOfbooksAvailable, booksSwapped };
  }

  static async toggleInterest(bookId: string, userId: string): Promise<void> {
    const db = getDb();
    try {
      const userAlreadyInterested = await db
        .collection('users')
        .find({
          _id: new ObjectId(userId),
          currentInterests: { $in: [new ObjectId(bookId)] },
        })
        .toArray();
      if (userAlreadyInterested.length > 0) {
        await db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { currentInterests: new ObjectId(bookId) } },
          );
      } else {
        await db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(userId) },
            { $push: { currentInterests: new ObjectId(bookId) } },
          );
      }
    } catch {
      throw new Error('Something went wrong!');
    }
  }

  static async updatePassword(userId: string, password: string) {
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: { password } });
  }
}
