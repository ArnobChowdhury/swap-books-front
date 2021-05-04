import mongodb, { ObjectId } from 'mongodb';
import { HttpException } from '../../interface';
import { getDb, getDbClient } from '../../utils/database';
import { RoomWithId } from '../room';
import {
  isAMatchedRoom,
  isEmptyRoom,
  oneWayInterestOfRoomMate,
} from '../../utils/general';
import { NotificationWithId } from '../notification';
import User from '../user';

export interface BookWithId extends Book {
  _id: mongodb.ObjectId;
}

export type BookWithoutLocationProp = Omit<BookWithId, 'location'>;

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

  interestedUsers: mongodb.ObjectId[];

  validTill: Date;

  swapRequested: boolean;

  constructor(
    bookName: string,
    bookAuthor: string,
    bookPicturePath: string,
    // TODO: IMPORTANT GET RID OF bookOwnerName // WE ARE GOING THE NORMALIZATION WAY
    bookOwnerName: string,
    userId: mongodb.ObjectId,
    coordinates: number[],
    createdAt: number,
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
    this.validTill = new Date(createdAt + 10 * 24 * 60 * 60 * 1000);
    this.interestedUsers = [];
    this.swapRequested = false;
  }

  save(): Promise<mongodb.InsertOneWriteOpResult<BookWithId>> {
    const db = getDb();
    return db.collection('books').insertOne(this);
  }

  // TODO GET RID OF THIS SHAMBLES
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

  static async editBook(
    bookId: string,
    bookName: string,
    bookAuthor: string,
    bookPicturePath?: string,
  ): Promise<BookWithoutLocationProp> {
    const db = getDb();
    let res;
    try {
      if (bookPicturePath) {
        res = await db
          .collection('books')
          .findOneAndUpdate(
            { _id: new ObjectId(bookId) },
            { $set: { bookName, bookAuthor, bookPicturePath } },
            { returnOriginal: false, projection: {} },
          );
      } else {
        res = await db
          .collection('books')
          .findOneAndUpdate(
            { _id: new ObjectId(bookId) },
            { $set: { bookName, bookAuthor } },
            { returnOriginal: false, projection: { location: 0 } },
          );
      }

      return res.value;
    } catch (err) {
      throw err;
    }
  }

  static async getBookPicturePath(bookId: string) {
    const db = getDb();
    const _id = new ObjectId(bookId);
    return db
      .collection('books')
      .findOne({ _id }, { projection: { _id: 0, bookPicturePath: 1 } });
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
            swapRequested: {
              $ne: true,
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

  static async getUserBooks(
    userId: string,
    page: number,
    isOwners?: boolean,
  ): Promise<BookWithoutLocationProp[]> {
    const db = getDb();
    const userIdAsObjectId = new ObjectId(userId);
    // TODO: Can we move this hard coded 6 to some other place??? Maybe a config???
    const limit = 6;
    const skip = (page > 1 ? page - 1 : 0) * limit;
    const sendSwapRequested = isOwners ? {} : { swapRequested: { $ne: true } };

    return db
      .collection('books')
      .find<BookWithoutLocationProp>(
        { userId: userIdAsObjectId, ...sendSwapRequested },
        { projection: { location: 0 }, sort: { _id: -1 }, skip, limit },
      )
      .toArray();
  }

  static async getNumberOfBooksByUser(userId: mongodb.ObjectId) {
    const db = getDb();
    return db.collection('books').countDocuments({ userId });
  }

  static async getStaleBookIds() {
    const db = getDb();
    return db
      .collection('books')
      .find({ validTill: { $lte: new Date() } })
      .project({ _id: 1, userId: 1, bookPicturePath: 1 })
      .toArray();
  }

  static async extendBookValidity(
    bookId: string,
    requestedAt: number,
  ): Promise<BookWithId> {
    const db = getDb();
    const bookIdAsMongoId = new ObjectId(bookId);
    const validTill = new Date(requestedAt + 10 * 24 * 60 * 60 * 1000);
    const updateDoc = await db
      .collection('books')
      .findOneAndUpdate(
        { _id: bookIdAsMongoId },
        { $set: { validTill } },
        { returnOriginal: false },
      );
    return updateDoc.value;
  }

  static async addInterestTransaction(
    bookId: string,
    bookOwnerId: string,
    userId: string,
  ): Promise<{
    room: RoomWithId;
    outGoingNotification: NotificationWithId;
    inComingNotification?: NotificationWithId;
    userName: string;
    bookOwnerName?: string;
  }> {
    const client = getDbClient();
    const usersCollection = client.db().collection('users');
    const booksCollection = client.db().collection('books');
    const roomsCollection = client.db().collection('rooms');
    const notificationsCollection = client.db().collection('notifications');
    const session = client.startSession();

    // todo skipping "transaction options" for now. Study later
    let room: RoomWithId;
    let outGoingNotification: NotificationWithId;
    let inComingNotification: NotificationWithId;
    let userName: string;
    let bookOwnerName: string | undefined;

    try {
      await session.withTransaction(async () => {
        await booksCollection.updateOne(
          { _id: new ObjectId(bookId) },
          { $push: { interestedUsers: new ObjectId(userId) } },
        );

        const updatedUser = await usersCollection.findOneAndUpdate(
          { _id: new ObjectId(userId) },
          { $push: { currentInterests: new ObjectId(bookId) } },
        );
        const { value: userVal } = updatedUser;
        userName = userVal.name;

        const userIdAsMongoId = new ObjectId(userId);
        const bookOwnerIdAsMongoId = new ObjectId(bookOwnerId);

        const existingRoom = await roomsCollection.findOne({
          participants: {
            $all: [
              { $elemMatch: { userId: userIdAsMongoId } },
              { $elemMatch: { userId: bookOwnerIdAsMongoId } },
            ],
          },
        });

        if (existingRoom !== null) {
          // update room
          const updatedResult = await roomsCollection.findOneAndUpdate(
            { _id: existingRoom._id, 'participants.userId': bookOwnerIdAsMongoId },
            {
              $push: {
                'participants.$.interests': {
                  $each: [bookId],
                  $position: 0,
                },
              },
            },
            {
              returnOriginal: false,
            },
          );
          const { value: roomVal } = updatedResult;
          room = roomVal;
        } else {
          // create room
          const insertedRoom = await roomsCollection.insertOne({
            participants: [
              {
                userId: userIdAsMongoId,
                interests: [],
                unreadMsgs: false,
              },
              {
                userId: bookOwnerIdAsMongoId,
                interests: [bookId],
                unreadMsgs: false,
              },
            ],
          });
          [room] = insertedRoom.ops;
        }

        const isMatch = isAMatchedRoom(room);
        const outGoingNotificationUpsertResult = await notificationsCollection.findOneAndUpdate(
          {
            fromId: userIdAsMongoId,
            toId: bookOwnerIdAsMongoId,
            roomId: room._id,
          },
          {
            $set: { type: isMatch ? 'match' : 'interest', seen: false },
            $currentDate: { lastModified: true },
          },
          { returnOriginal: false, upsert: true },
        );
        outGoingNotification = outGoingNotificationUpsertResult.value;

        if (isMatch) {
          const inComingNotificationUpsertResult = await notificationsCollection.findOneAndUpdate(
            {
              fromId: bookOwnerIdAsMongoId,
              toId: userIdAsMongoId,
              roomId: room._id,
            },
            {
              $set: { type: 'match', seen: false },
              $currentDate: { lastModified: true },
            },
            { returnOriginal: false, upsert: true },
          );
          const bookOwner = await User.findById(bookOwnerId);
          bookOwnerName = bookOwner?.name;

          inComingNotification = inComingNotificationUpsertResult.value;
        }
      });
      // prettier-ignore
      // @ts-ignore

      return { room, outGoingNotification, inComingNotification, userName, bookOwnerName };
    } finally {
      session.endSession();
    }
  }
  // TODO Needs to be aligned with addInterestTransation
  static async removeInterestTransaction(
    bookId: string,
    bookOwnerId: string,
    userId: string,
  ): Promise<RoomWithId> {
    const client = getDbClient();
    const usersCollection = client.db().collection('users');
    const booksCollection = client.db().collection('books');
    const roomsCollection = client.db().collection('rooms');
    const notificationsCollection = client.db().collection('notifications');
    const session = client.startSession();

    const userIdAsMongoId = new ObjectId(userId);
    const bookOwnerIdAsMongoId = new ObjectId(bookOwnerId);
    const bookIdAsMongoId = new ObjectId(bookId);
    let result: RoomWithId;

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
              'participants.$.interests': bookId,
            },
          },
          { returnOriginal: false },
        );
        const { value } = updatedDoc;

        if (isEmptyRoom(value)) {
          await roomsCollection.deleteOne({ _id: value._id });
          await notificationsCollection.deleteMany({ roomId: value._id });
        }

        if (oneWayInterestOfRoomMate(value, userId)) {
          await notificationsCollection.updateOne(
            { fromId: bookOwnerIdAsMongoId, roomId: (value as RoomWithId)._id },
            { $set: { type: 'interest' } },
          );
          await notificationsCollection.deleteOne({
            fromId: userIdAsMongoId,
            roomId: (value as RoomWithId)._id,
          });
        }

        result = value;
      });
    } finally {
      session.endSession();
    }
    // @ts-ignore
    return result;
  }

  static async removeBook(bookId: string, userId: string): Promise<void> {
    const client = getDbClient();
    const usersCollection = client.db().collection('users');
    const booksCollection = client.db().collection('books');
    const roomsCollection = client.db().collection('rooms');
    const notificationsCollection = client.db().collection('notifications');
    const session = client.startSession();

    const userIdAsMongoId = new ObjectId(userId);
    const bookIdAsMongoId = new ObjectId(bookId);

    // TODO Since more databases has been added - swap, notifications etc. we need to re-think what else we have to do for safely removing a book

    try {
      await session.withTransaction(async () => {
        const deletedBook = await booksCollection.findOneAndDelete({
          _id: bookIdAsMongoId,
          userId: userIdAsMongoId,
        });

        // TODO Throw error if document is not found
        if (deletedBook.value.interestedUsers.length > 0) {
          await usersCollection.bulkWrite(
            deletedBook.value.interestedUsers.map((user: mongodb.ObjectId) => {
              return {
                updateOne: {
                  filter: {
                    _id: user,
                  },
                  update: {
                    $pull: {
                      currentInterests: bookIdAsMongoId,
                    },
                  },
                },
              };
            }),
          );

          await roomsCollection.updateMany(
            { 'participants.userId': userIdAsMongoId },
            {
              $pull: {
                'participants.$.interests': bookId,
              },
            },
          );

          const allRoomsBookOwner = await roomsCollection
            .find({ 'participants.userId': userIdAsMongoId })
            .toArray();

          if (allRoomsBookOwner.length > 0) {
            const roomDeleteOps: mongodb.BulkWriteOperation<any>[] = [];
            const notificationsOps: mongodb.BulkWriteOperation<any>[] = [];
            allRoomsBookOwner.forEach(room => {
              console.log('is room empty', isEmptyRoom(room));
              if (isEmptyRoom(room)) {
                roomDeleteOps.push({
                  deleteOne: {
                    filter: {
                      _id: room._id,
                    },
                  },
                });
                notificationsOps.push({
                  deleteMany: {
                    filter: {
                      roomId: room._id,
                    },
                  },
                });
              }

              const roomMateIndex =
                (room as RoomWithId).participants[0].userId.toHexString() !== userId
                  ? 0
                  : 1;
              const roomMateId = (room as RoomWithId).participants[roomMateIndex]
                .userId;

              const oneWayInterestOfUser = oneWayInterestOfRoomMate; // Just so that it a bit readable
              if (oneWayInterestOfUser(room, roomMateId.toHexString())) {
                notificationsOps.push(
                  {
                    deleteOne: {
                      filter: {
                        fromId: roomMateId,
                        roomId: room._id,
                      },
                    },
                  },
                  {
                    updateOne: {
                      filter: {
                        fromId: new ObjectId(userId),
                      },
                      update: {
                        $set: {
                          type: 'interest',
                        },
                      },
                    },
                  },
                );
              }
            });

            if (roomDeleteOps.length > 0) {
              await roomsCollection.bulkWrite(roomDeleteOps);
            }
            if (notificationsOps.length > 0) {
              await notificationsCollection.bulkWrite(notificationsOps);
            }
          }
        }
      });
    } catch (err) {
      throw err;
    } finally {
      session.endSession();
    }
  }

  static async getBooksInBatches(
    bookIds: string[],
    ...props: (keyof Book)[]
  ): Promise<
    {
      _id: ObjectId;
      [key: string]: any;
    }[]
  > {
    const db = getDb();
    const bookIdsAsMongoObjectIds = bookIds.map(id => new ObjectId(id));
    const projection: { [key: string]: 1 } = {};
    props.forEach(prop => (projection[prop] = 1));

    return db
      .collection('books')
      .find({ _id: { $in: bookIdsAsMongoObjectIds } }, { projection })
      .toArray();
  }

  static async setAsSwapped(bookId: string) {
    const db = getDb();
    const bookIdAsMongoId = new ObjectId(bookId);
    return db
      .collection('books')
      .updateOne({ _id: bookIdAsMongoId }, { $set: { swapRequested: true } });
  }
}
