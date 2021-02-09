import { mongoConnect, closeDb, getDb } from '../../server/utils/database';

before(done => {
  mongoConnect(() => {
    // eslint-disable-next-line no-console
    console.log('Test started.');
    getDb()
      .collection('books')
      .createIndex({ location: '2dsphere' })
      .then(() => {
        done();
      });
  });
});

after(done => {
  closeDb(done);
});
