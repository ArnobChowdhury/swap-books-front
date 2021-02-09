import { Db } from 'mongodb';
import { expect } from 'chai';
import User from '../../src/models/user';
import { getDb } from '../../src/utils/database';

describe('User Model', () => {
  const name = 'Raul Sanllehi';
  const email = 'raul.sanllehi@gmail.com';
  const password = 'secretpassword';
  const dob = '12-12-2010';
  const sex = 'male';
  let db: Db;

  describe('General Methods', () => {
    before(() => {
      db = getDb();
    });

    after(async () => {
      await db.collection('users').deleteMany({ name });
    });

    it('Should be able to create a User model and save to the db', async () => {
      const user = new User(name, email, password, dob, sex);
      await user.save();
      const userInDb = await db.collection('users').findOne({ name });

      expect(userInDb.name).to.be.equal(name);
    });
  });

  describe('Static Methods', () => {
    before(async () => {
      db = getDb();
      const user = new User(name, email, password, dob, sex);
      await user.save();
    });
    after(() => {
      db.collection('users').deleteMany({ name });
    });

    it('findByEmail static method should be able to find an user by email', async () => {
      const user = await User.findByEmail(email);
      const userInDb = await db.collection('users').findOne({ email });
      expect(userInDb.email).to.equal(user.email);
      if (user._id !== undefined) {
        expect(userInDb._id.toString()).to.equal(user._id.toString());
      }
    });

    it('findById static method should be able to find an user by id', async () => {
      const userInDb = await db.collection('users').findOne({ email });
      const user = await User.findById(userInDb._id.toString());
      expect(userInDb.email).to.equal(user.email);
    });

    it('toggleInterest static method should add/remove a bookId to currentInterests field', async () => {
      const bookId = '1234567890ab1234567890ab';
      let userInDb = await db.collection('users').findOne({ email });
      await User.toggleInterest(bookId, userInDb._id.toString());
      userInDb = await db.collection('users').findOne({ _id: userInDb._id });
      expect(userInDb.currentInterests[0].toString()).to.equal(bookId);
    });
  });
});
