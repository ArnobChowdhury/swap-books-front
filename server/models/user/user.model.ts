import mongodb from 'mongodb';
import { getDb, getDbClient } from '../../utils/database';

const { ObjectId } = mongodb;

interface UserWithId extends User {
  _id: mongodb.ObjectID;
}

export default class User {
  name: string;

  email: string;

  password: string;

  ageConfirmation: boolean;

  termsConfirmation: boolean;

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
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.ageConfirmation = ageConfirmation;
    this.termsConfirmation = termsConfirmation;
    this.currentInterests = [];
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<UserWithId>> {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static async findByEmail(email: string): Promise<UserWithId> {
    const db = getDb();
    try {
      const user = await db.collection('users').findOne({ email });
      return user;
    } catch {
      throw new Error('No user with this email was found.');
    }
  }

  static async updateLocation(
    userId: string,
    lon: number,
    lat: number,
  ): Promise<mongodb.UpdateWriteOpResult> {
    const db = getDb();
    try {
      return db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'locationObj.coordinates': [lon, lat],
            'locationObj.type': 'Point',
          },
        },
      );
    } catch {
      throw new Error('Something went wrong! Could not update.');
    }
  }

  static async findById(userId: string): Promise<UserWithId> {
    const db = getDb();
    try {
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) });
      return user;
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Could not retrieve user');
    }
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
        /**
         * TODO: Later
         * When the user is able to mark a book as swapped we need to return the number of
         * books user has swapped till now.
         */
      });
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Could not retrieve user');
    }
    return { userName, numberOfbooksAvailable };
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
}

/** TODO for mongodb
 * Can we create more than one user using the same email???
 * How about same email with different casing(uppercase/ lowercase)
 */
