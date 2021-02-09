import mongodb from 'mongodb';
import { HttpException } from '../../interface';
import { getDb, getDbClient } from '../../utils/database';
import { RoomWithLastModifiedAndID } from '../room';

const { ObjectId } = mongodb;

export type BookWithoutLocationProp = Omit<Book, 'location'>;

export default class Book {
  bookName: string;

  bookAuthor: string;

  bookPicturePath: string;

  userId: mongodb.ObjectId;

  bookOwnerName: string;

  location: {
    type: 'Point';
    coordinates: number[];
  };

  _id: number | undefined;

  interestedUsers: mongodb.ObjectId[];

  constructor(
    bookName: string,
    bookAuthor: string,
    bookPicturePath: string,
    bookOwnerName: string,
    userId: mongodb.ObjectId,
    coordinates: number[],
    id?: number,
  ) {
    this.bookName = bookName;
    this.bookAuthor = bookAuthor;
    this.bookPicturePath = bookPicturePath;
    this.bookOwnerName = bookOwnerName;
    this.userId = userId;
    this.location = {
      type: 'Point',
      coordinates,
    };
    this._id = id;
    this.interestedUsers = [];
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<this>> {
    const db = getDb();
    return db.collection('books').insertOne(this);
  }

  static throwError(msg: string): void {
    const err: HttpException = new Error(msg);
    err.statusCode = 401;
    throw err;
  }

  static async findById(userId: string): Promise<Book> {
    const db = getDb();
    try {
      const book = await db
        .collection('books')
        .findOne({ _id: new ObjectId(userId) });
      return book;
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Could not retrieve any books for the user');
    }
  }

  static async getLocationBasedBooks(
    location: number[],
    page: number,
  ): Promise<BookWithoutLocationProp[]> {
    const db = getDb();
    const limit = 6;
    const skip = (page > 1 ? page - 1 : 0) * limit;
    try {
      const books = await db
        .collection('books')
        .find(
          {
            location: {
              $nearSphere: {
                $geometry: { type: 'Point', coordinates: location },
                $maxDistance: 5000,
              },
            },
          },
          { projection: { location: 0 }, sort: { _id: -1 }, skip, limit },
        )
        .toArray();
      return books;
    } catch {
      // todo is it the right way to catch an error
      throw new Error('Something went wrong!');
    }
  }

  static async addInterestTransaction(
    bookId: string,
    bookName: string,
    bookOwnerId: string,
    bookOwnerName: string,
    userId: string,
    userName: string,
  ): Promise<RoomWithLastModifiedAndID | undefined> {
    const client = getDbClient();
    const usersCollection = client.db().collection('users');
    const booksCollection = client.db().collection('books');
    const roomsCollection = client.db().collection('rooms');
    const session = client.startSession();

    // todo skipping "transaction options" for now. Study later
    let result;

    try {
      await session.withTransaction(async () => {
        await booksCollection.updateOne(
          { _id: new ObjectId(bookId) },
          { $push: { interestedUsers: new ObjectId(userId) } },
        );

        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { currentInterests: new ObjectId(bookId) } },
        );
        const userIdAsMongoId = new ObjectId(userId);
        const bookOwnerIdAsMongoId = new ObjectId(bookOwnerId);
        // TODO need to do upsert for Room
        const room = await roomsCollection.findOne({
          participants: {
            $all: [
              { $elemMatch: { userId: userIdAsMongoId } },
              { $elemMatch: { userId: bookOwnerIdAsMongoId } },
            ],
          },
        });

        if (room !== null) {
          // update room
          await roomsCollection.updateOne(
            { _id: room._id, 'participants.userId': bookOwnerIdAsMongoId },
            {
              $push: {
                'participants.$.interests': {
                  $each: [{ bookName, bookId }],
                  $position: 0,
                },
              },
              $set: {
                'participants.$.interestSeen': false,
              },
            },
          );
          const updatedDoc = await roomsCollection.findOneAndUpdate(
            { _id: room._id, 'participants.userId': userIdAsMongoId },
            {
              $set: {
                'participants.$.interestSeen': false,
              },
              $currentDate: {
                lastModified: true,
              },
            },
            { returnOriginal: false },
          );

          const { value } = updatedDoc;
          result = value;
        } else {
          // create room
          const insertedResult = await roomsCollection.insertOne({
            participants: [
              {
                userId: userIdAsMongoId,
                userName,
                interests: [],
                interestSeen: true,
              },
              {
                userId: bookOwnerIdAsMongoId,
                userName: bookOwnerName,
                interests: [{ bookName, bookId }],
                interestSeen: false,
              },
            ],
            lastModified: new Date(),
          });
          [result] = insertedResult.ops;
        }
      });
    } finally {
      session.endSession();
    }
    return result;
  }

  static async removeInterestTransaction(
    bookId: string,
    bookName: string,
    bookOwnerId: string,
    userId: string,
  ): Promise<RoomWithLastModifiedAndID | undefined> {
    const client = getDbClient();
    const usersCollection = client.db().collection('users');
    const booksCollection = client.db().collection('books');
    const roomsCollection = client.db().collection('rooms');
    const session = client.startSession();

    const userIdAsMongoId = new ObjectId(userId);
    const bookOwnerIdAsMongoId = new ObjectId(bookOwnerId);
    const bookIdAsMongoId = new ObjectId(bookId);
    let result;

    try {
      await session.withTransaction(async () => {
        await booksCollection.updateOne(
          { _id: bookIdAsMongoId },
          { $pull: { interestedUsers: userIdAsMongoId } },
        );

        await usersCollection.updateOne(
          { _id: userIdAsMongoId },
          { $pull: { currentInterests: bookIdAsMongoId } },
        );

        const updatedDoc = await roomsCollection.findOneAndUpdate(
          {
            participants: {
              $all: [
                { $elemMatch: { userId: userIdAsMongoId } },
                { $elemMatch: { userId: bookOwnerIdAsMongoId } },
              ],
            },
            'participants.userId': bookOwnerIdAsMongoId,
          },
          {
            $pull: {
              'participants.$.interests': {
                bookId,
                bookName,
              },
            },
            $currentDate: {
              lastModified: true,
            },
          },
        );
        const { value } = updatedDoc;
        result = value;
      });
    } finally {
      session.endSession();
    }
    return result;
  }

  static async getUserBooks(userId: string): Promise<Book[]> {
    const db = getDb();
    const userIdAsObjectId = new ObjectId(userId);

    return db
      .collection('books')
      .find<Book>({ userId: userIdAsObjectId })
      .toArray();
  }
}