import chai from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../server';
import { getDb } from '../../server/utils/database';

chai.use(chaiHttp);
const { expect, request } = chai;

describe('auth routes', () => {
  let requester: ChaiHttp.Agent;

  before(() => {
    requester = request(app).keepOpen();
  });

  after(() => {
    requester.close();
  });

  describe('POST /auth', () => {
    describe('/signup', () => {
      const email = faker.internet.email();

      it('Should sign a user up', done => {
        requester
          .post('/auth/signup')
          .send({
            name: faker.name.firstName(),
            email,
            password: faker.internet.password(),
            dob: '12-12-12',
            sex: 'Female',
            locationObj: {
              latitude: faker.address.latitude(),
              longitude: faker.address.longitude(),
            },
          })
          .end((err, response) => {
            expect(response.body)
              .to.have.property('message')
              .to.equal('User created!');
            expect(response.body).to.have.property('userId');
            expect(response).to.have.status(201);
            done(err);
          });
      });

      it('Should NOT sign a user up if the email already exists', done => {
        requester
          .post('/auth/signup')
          .send({
            name: faker.name.firstName(),
            email,
            password: faker.internet.password(),
            dob: '12-12-12',
            sex: 'Male',
            locationObj: {
              latitude: faker.address.latitude(),
              longitude: faker.address.longitude(),
            },
          })
          .end((err, response) => {
            expect(response.body)
              .to.have.property('message')
              .to.equal('Something went wrong!');
            expect(response).to.have.status(401);
            done(err);
          });
      });
    });

    describe('POST /login', () => {
      let _id: string;
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
          .end((err, response) => {
            _id = response.body.userId;
            done(err);
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

      it('Should log a user in', done => {
        requester
          .post('/auth/login')
          .send({
            email,
            password,
          })
          .end((err, response) => {
            expect(response.body)
              .to.have.property('userId')
              .to.equal(_id);
            expect(response.body).to.have.property('accessToken');
            expect(response.body).to.have.property('refreshToken');
            expect(response.body).to.have.property('expiresIn');
            expect(response).to.have.status(200);
            done(err);
          });
      });

      it("Should NOT log a user in when the email doesn't exist", done => {
        requester
          .post('/auth/login')
          .send({
            email: faker.internet.email(),
            password,
          })
          .end((err, response) => {
            expect(response.body)
              .to.have.property('message')
              .to.equal('A user with this email could not be found.');
            expect(response).to.have.status(401);
            done(err);
          });
      });

      it("Should NOT log a user in when the password doesn't match", done => {
        requester
          .post('/auth/login')
          .send({
            email,
            password: faker.internet.password(),
          })
          .end((err, response) => {
            expect(response.body)
              .to.have.property('message')
              .to.equal('Wrong password!');
            expect(response).to.have.status(401);
            done(err);
          });
      });
    });
  });
});
