/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { expect } from 'chai';
import { createSandbox, fake, SinonSandbox } from 'sinon';
import faker from 'faker';
import Book from '../../server/models/book';
import { addABook, getHomeFeedBooks } from '../../server/controllers/books';
import { getFakeResponseAndMocks } from '../utils';
import User from '../../server/models/user';

describe('Book controller', () => {
  let sandBox: SinonSandbox;
  let stub: sinon.SinonStubStatic;
  let spy: sinon.SinonSpyStatic;

  let fakeStatus: sinon.SinonSpy<unknown[], unknown>;
  let spiedJson: sinon.SinonSpy<unknown[], unknown>;

  let res: unknown;
  let next: sinon.SinonSpy<unknown[], unknown>;

  beforeEach(() => {
    sandBox = createSandbox();
    spy = sandBox.spy;
    stub = sandBox.stub;

    const fakeResponse = getFakeResponseAndMocks(spy, fake);
    res = fakeResponse.res;
    fakeStatus = fakeResponse.refToFakeStatusFunc;
    spiedJson = fakeResponse.refToSpiedJsonFunc;

    next = spy();
  });

  afterEach(() => {
    sandBox.restore();
  });

  describe('addABook', () => {
    const req = {
      file: {
        filename: faker.image.imageUrl(),
      },
      body: {
        bookName: faker.random.word(),
        bookAuthor: faker.name.firstName(),
        userId: '123456789abc123456789abc',
      },
    };

    it('Should run without an issue', async () => {
      const stubbedFindById = stub(User, 'findById').callsFake(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            // @ts-ignore
            resolve({
              locationObj: {
                type: 'Point',
                coordinates: [
                  Number(faker.address.longitude()),
                  Number(faker.address.latitude()),
                ],
              },
            });
          }, 100);
        });
      });

      const stubbedBookSave = stub(Book.prototype, 'save').callsFake(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            // @ts-ignore
            resolve({ insertedId: faker.random.uuid() });
          }, 100);
        });
      });

      // @ts-ignore
      await addABook(req, res, next);

      expect(stubbedFindById.calledOnce).to.equal(true);
      expect(stubbedBookSave.calledOnce).to.equal(true);
      expect(fakeStatus.calledWith(201)).to.equal(true);
      expect(spiedJson.calledOnce).to.equal(true);
    });

    it('should pass the error to next function if any', async () => {
      const err = new Error('Something went wrong!');
      const stubbedFindById = stub(User, 'findById').callsFake(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(err);
          }, 100);
        });
      });

      // @ts-ignore
      await addABook(req, res, next);

      expect(stubbedFindById.calledOnce).to.equal(true);
      expect(next.calledOnce).to.equal(true);
      // @ts-ignore
      expect(next.args[0][0].statusCode).to.equal(500);
    });
  });
  // describe('getHomeFeedBooks', () => {
  //   it('Should call getAllBooks static method of Book model when userId is NOT there', async () => {
  //     const req = {
  //       query: {},
  //     };

  //     const allBooksObj = [
  //       {
  //         bookName: faker.random.words(),
  //         bookAuthor: faker.name.firstName(),
  //         bookPicturePath: faker.image.imageUrl(),
  //       },
  //     ];

  //     const stubbedGetAllBooks = stub(Book, 'getLocationBasedBooks').callsFake(() => {
  //       return new Promise((resolve) => {
  //         setTimeout(() => {
  //           // @ts-ignore
  //           resolve(allBooksObj);
  //         }, 100);
  //       });
  //     });

  //     // @ts-ignore
  //     await getHomeFeedBooks(req, res, next);
  //     expect(stubbedGetAllBooks.calledOnce).to.equal(true);
  //     expect(fakeStatus.calledWith(200)).to.equal(true);
  //     expect(spiedJson.calledOnce).to.equal(true);
  //   });

  //   it('Should call getLocationBasedBooks static method of Book model when userId is there', async () => {
  //     const req = {
  //       query: {
  //         userId: '123456789abc123456789abc',
  //       },
  //     };

  //     const allBooksObj = [
  //       {
  //         bookName: faker.random.words(),
  //         bookAuthor: faker.name.firstName(),
  //         bookPicturePath: faker.image.imageUrl(),
  //         interestedUsers: [],
  //       },
  //     ];

  //     const stubbedFindUserById = stub(User, 'findById').callsFake(() => {
  //       return new Promise((resolve) => {
  //         setTimeout(() => {
  //           // @ts-ignore
  //           resolve({
  //             locationObj: {
  //               type: 'Point',
  //               coordinates: [Number(faker.address.longitude()), Number(faker.address.latitude())],
  //             },
  //           });
  //         }, 100);
  //       });
  //     });

  //     const stubbedlocationBasedBooks = stub(Book, 'getLocationBasedBooks').callsFake(() => {
  //       return new Promise((resolve) => {
  //         setTimeout(() => {
  //           // @ts-ignore
  //           resolve(allBooksObj);
  //         }, 100);
  //       });
  //     });

  //     // @ts-ignore
  //     await getHomeFeedBooks(req, res, next);

  //     expect(stubbedFindUserById.calledOnce).to.equal(true);
  //     expect(stubbedlocationBasedBooks.calledOnce).to.equal(true);
  //     expect(fakeStatus.calledWith(200)).to.equal(true);
  //     expect(spiedJson.calledOnce).to.equal(true);
  //     // @ts-ignore
  //     expect(spiedJson.args[0][0].books[0]).to.have.property('isInterested');
  //   });

  //   it('Should call next function if any error occurs', async () => {
  //     const req = {
  //       query: {
  //         userId: '123456789abc123456789abc',
  //       },
  //     };

  //     const err = new Error('Sorry! an error occured');

  //     const stubbedFindUserById = stub(User, 'findById').callsFake(() => {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           reject(err);
  //         }, 100);
  //       });
  //     });

  //     // @ts-ignore
  //     await getHomeFeedBooks(req, res, next);

  //     expect(stubbedFindUserById.calledOnce).to.equal(true);
  //     expect(next.calledOnce).to.equal(true);
  //     expect(next.calledWith(err)).to.equal(true);
  //   });
  // });
});
