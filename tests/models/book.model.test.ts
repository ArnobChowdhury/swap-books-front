/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { expect } from 'chai';
import mongodb from 'mongodb';
import faker from 'faker';
import { getDb } from '../../server/utils/database';
import Book from '../../server/models/book';

const { ObjectId } = mongodb;

describe('Book Model', () => {
  describe('General Methods', () => {
    const bookName = 'Exciting times';
    const bookAuthor = 'Naoise Dolan';
    const bookPicturePath = '/images/numbers.jpg';
    const bookOwnerName = faker.name.firstName();
    const userId = new ObjectId('123415223adef12334da1235');
    const coordinates = [86.023, 23.442];

    after(async () => {
      await getDb()
        .collection('books')
        .deleteMany({ bookName });
    });

    it('Book model could be created and saved to the database', async () => {
      const book = new Book(
        bookName,
        bookAuthor,
        bookPicturePath,
        bookOwnerName,
        userId,
        coordinates,
      );
      await book.save();

      const bookInDB = await getDb()
        .collection('books')
        .findOne({ bookName: 'Exciting times' });

      expect(bookInDB.bookName).to.equal(bookName);
      expect(bookInDB.bookAuthor).to.equal(bookAuthor);
      expect(bookInDB.bookPicturePath).to.equal(bookPicturePath);
      expect(bookInDB.userId.toString()).to.equal(userId.toString());
      coordinates.forEach((el, ind) => {
        expect(el).to.equal(bookInDB.location.coordinates[ind]);
      });
    });
  });

  describe('Static methods', () => {
    const bookName = 'Exciting times';
    const bookAuthor = 'Naoise Dolan';
    const bookPicturePath = '/images/numbers.jpg';
    const bookOwnerName = '/images/numbers.jpg';
    const userId = new ObjectId('123415223adef12334da1235');
    const coordinates = [86.023, 23.442];

    let _id: string;
    before(async () => {
      const book = new Book(
        bookName,
        bookAuthor,
        bookPicturePath,
        bookOwnerName,
        userId,
        coordinates,
      );
      const bookInDb = await book.save();
      _id = String(bookInDb.insertedId);
    });

    after(async () => {
      await getDb()
        .collection('books')
        .deleteMany({ bookName });
    });

    it('fetchById static method should fetch a book when an id is passed as an argument', async () => {
      const book = await Book.findById(_id);
      expect(book.bookName).equal(bookName);
      expect(book.bookAuthor).equal(bookAuthor);
      expect(book.bookPicturePath).equal(bookPicturePath);
      expect(book.userId.toHexString()).equal(userId.toHexString());
      expect(book.interestedUsers.length).equal(0);
      coordinates.forEach((el, ind) => {
        expect(el).equal(book.location.coordinates[ind]);
      });
    });

    it('getLocationBasedBooks static method should fetch books that is within 5kms', async () => {
      const booksArray = await Book.getLocationBasedBooks([86.022, 23.45]);
      const book = booksArray[0];
      expect(book.bookName).equal(bookName);
      expect(book.bookAuthor).equal(bookAuthor);
      expect(book.bookPicturePath).equal(bookPicturePath);
      expect(book.userId.toHexString()).equal(userId.toHexString());
      expect(book.interestedUsers.length).equal(0);
      // @ts-ignore
      // eslint-disable-next-line no-unused-expressions
      expect(book.location).to.be.undefined;
    });
  });
});
