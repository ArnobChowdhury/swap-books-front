/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { expect } from 'chai';
import sinon, { fake } from 'sinon';
import faker from 'faker';
import bcrypt from 'bcryptjs';
import mongodb from 'mongodb';
import User from '../../server/models/user';
import { signup, login } from '../../server/controllers/auth';
import { getFakeResponseAndMocks } from '../utils';

describe('Auth Controller', () => {
  let stub: sinon.SinonStubStatic;
  let spy: sinon.SinonSpyStatic;
  let sandBox: sinon.SinonSandbox;

  let fakeStatus: sinon.SinonSpy<unknown[], unknown>;
  let spiedJson: sinon.SinonSpy<unknown[], unknown>;

  let res: unknown;
  let next: sinon.SinonSpy<unknown[], unknown>;

  beforeEach(() => {
    sandBox = sinon.createSandbox();
    stub = sandBox.stub;
    spy = sandBox.spy;

    const fakeResponseAndMocks = getFakeResponseAndMocks(spy, fake);
    res = fakeResponseAndMocks.res;
    spiedJson = fakeResponseAndMocks.refToSpiedJsonFunc;
    fakeStatus = fakeResponseAndMocks.refToFakeStatusFunc;

    next = spy();
  });

  afterEach(() => {
    sandBox.restore();
  });

  describe('signup function', () => {
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const fakeBirthDate = faker.date.past();
    const dob = `${fakeBirthDate.getFullYear()}-${fakeBirthDate.getMonth()}-${fakeBirthDate.getDate()}`;
    const sex = 'female';
    const password = faker.internet.password(12);
    const locationObj = {
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
    };

    const req = {
      body: {
        name,
        email,
        password,
        dob,
        sex,
        // @ts-ignore
        locationObj,
      },
    };

    it('should create a user', async () => {
      const stubbedUserSave = stub(User.prototype, 'save').callsFake(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            // @ts-ignore
            resolve({ insertedId: 123 });
          }, 100);
        });
      });

      // @ts-ignore
      const stubbedFindByEmail = stub(User, 'findByEmail').callsFake(() => {
        return false;
      });

      // @ts-ignore
      await signup(req, res, next);

      expect(stubbedFindByEmail.calledOnce).to.equal(true);
      expect(stubbedUserSave.calledOnce).to.equal(true);
      expect(fakeStatus.calledWith(201)).to.equal(true);
      expect(spiedJson.calledOnce).to.equal(true);
    });

    it('should NOT create a user if the email already exists', async () => {
      // @ts-ignore
      const stubbedFindByEmail = stub(User, 'findByEmail').callsFake(() => {
        return true;
      });

      // @ts-ignore
      await signup(req, res, next);

      expect(stubbedFindByEmail.calledOnce).to.equal(true);
      expect(next.calledOnce).to.equal(true);
    });

    it('should pass the next function the error caused by save function going wrong', async () => {
      const saveError = new Error("User couldn't be saved");
      // @ts-ignore
      const stubbedUserSave = stub(User.prototype, 'save').callsFake(() => {
        return new Promise((_resolve, reject) => {
          setTimeout(() => {
            // const error = new Error("User couldn't be saved");
            // @ts-ignore
            reject(saveError);
          }, 100);
        });
      });

      // @ts-ignore
      const stubbedFindByEmail = stub(User, 'findByEmail').callsFake(() => {
        return false;
      });

      // @ts-ignore
      await signup(req, res, next);

      expect(stubbedFindByEmail.calledOnce).to.equal(true);
      expect(stubbedUserSave.calledOnce).to.equal(true);
      expect(next.calledOnce).to.equal(true);
      expect(next.calledWith(saveError)).to.equal(true);
    });
  });

  describe('login function', () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.name.firstName();
    const dob = '12-12-2005';
    const sex = 'Male';
    const locationObj = {
      type: 'Point',
      coordinates: [
        Number(faker.address.latitude()),
        Number(faker.address.longitude()),
      ],
    };

    const req = {
      body: {
        email,
        password,
      },
    };

    it('should log in a user if the email exist in db', async () => {
      const stubbedFindByEmail = stub(User, 'findByEmail').callsFake(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              _id: (Number(faker.random.uuid()) as unknown) as mongodb.ObjectId,
              email,
              password,
              name,
              dob,
              sex,
              locationObj,
              currentInterests: [],
              save: fake(),
            });
          }, 100);
        });
      });
      const stubbedBCryptCompare = stub(bcrypt, 'compare').callsFake(() => {
        return true;
      });

      // @ts-ignore
      await login(req, res, next);

      expect(stubbedFindByEmail.calledOnce).to.equal(true);
      expect(stubbedBCryptCompare.calledOnce).to.equal(true);
      expect(fakeStatus.calledWith(200)).to.equal(true);
      expect(spiedJson.calledOnce).to.equal(true);
    });

    it('should call next function with error if the user is not found', async () => {
      const stubbedFindByEmail = stub(User, 'findByEmail').callsFake(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      });

      // @ts-ignore
      await login(req, res, next);

      expect(stubbedFindByEmail.calledOnce).to.equal(true);
      expect(next.calledOnce).to.equal(true);
    });

    it('should call next function with error password does not match', async () => {
      const stubbedFindByEmail = stub(User, 'findByEmail').callsFake(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              _id: (Number(faker.random.uuid()) as unknown) as mongodb.ObjectId,
              email,
              password,
              name,
              sex,
              dob,
              locationObj,
              currentInterests: [],
              save: fake(),
            });
          }, 100);
        });
      });

      const stubbedBCryptCompare = stub(bcrypt, 'compare').callsFake(() => {
        return false;
      });

      // @ts-ignore
      await login(req, res, next);

      expect(stubbedFindByEmail.calledOnce).to.equal(true);
      expect(stubbedBCryptCompare.calledOnce).to.equal(true);
      expect(next.calledOnce).to.equal(true);
      // @ts-ignore
      expect(next.args[0][0].statusCode).to.equal(401);
    });

    it('should call next function with error if something goes wrong', async () => {
      const serverError = new Error('Sorry could not reach db');
      const stubbedFindByEmail = stub(User, 'findByEmail').callsFake(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(serverError);
          }, 100);
        });
      });

      // @ts-ignore
      await login(req, res, next);

      expect(stubbedFindByEmail.calledOnce).to.equal(true);
      expect(next.calledOnce).to.equal(true);
      // @ts-ignore
      expect(next.args[0][0].statusCode).to.equal(500);
    });
  });
});
