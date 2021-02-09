import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import path from 'path';
import app from '../../server';
import { getDb } from '../../server/utils/database';

chai.use(chaiHttp);
const { request, expect } = chai;

describe('books routes', () => {
  let requester: ChaiHttp.Agent;

  before(() => {
    requester = request(app).keepOpen();
  });

  after(() => {
    requester.close();
  });

  it('GET /books should get all books', done => {
    requester.get('/books').end((err, getAllBooksRes) => {
      expect(getAllBooksRes.body).to.have.property('books');
      expect(getAllBooksRes.body)
        .to.have.property('message')
        .to.equal('Fetched books details successfully');
      expect(getAllBooksRes).to.have.status(200);
      done(err);
    });
  });

  describe('POST /books/add', () => {
    let _id: string;
    let accessToken: string;
    const email = faker.internet.email();
    const password = faker.internet.password();

    before(done => {
      requester
        .post('/auth/signup')
        .send({
          name: faker.name.firstName(),
          email,
          password,
          dob: '12-12-12',
          sex: 'Female',
        })
        .end((err, signUpRes) => {
          _id = signUpRes.body.userId;
          done(err);
        });
    });

    before(done => {
      requester
        .post('/auth/login')
        .send({ email, password })
        .end((loginErr, loginRes) => {
          // eslint-disable-next-line
          // @ts-ignore
          accessToken = loginRes.body.accessToken;
          done(loginErr);
        });
    });

    after(done => {
      getDb()
        .collection('users')
        .deleteOne({ email })
        .then(() => {
          done();
        })
        .catch(err => done(err));
    });

    it("should NOT be able to add a book when user's location is not updated", done => {
      requester
        .post('/books/add')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('bookName', 'Harry Potter and the Chamber of Secrets')
        .field('bookAuthor', 'JK Rowling')
        .field('userId', _id)
        .attach(
          'bookPicture',
          path.resolve(__dirname, '..', '..', 'images', 'test.png'),
        )
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body)
            .to.have.property('message')
            .to.equal('You need to update your location before you can add a book.');
          done(err);
        });
    });

    it('should add a book when user location is in db', done => {
      requester
        .put('/user/loc')
        .send({ userId: _id, userLon: 23.13, userLat: 90.14 })
        .end(err => {
          done(err);
          requester
            .post('/books/add')
            .set('Content-Type', 'multipart/form-data')
            .field('bookName', 'Harry Potter and the Chamber of Secrets')
            .field('bookAuthor', 'JK Rowling')
            .field('userId', _id)
            .attach(
              'bookPicture',
              path.resolve(__dirname, '..', '..', 'images', 'test.png'),
            )
            .end((bookAddErr, bookAddRes) => {
              expect(bookAddRes).to.have.status(201);
              expect(bookAddRes.body)
                .to.have.property('message')
                .to.equal('Book added!');
              expect(bookAddRes.body).to.have.property('bookId');
              done(bookAddErr);
            });
        });
    });
  });
});
