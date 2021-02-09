import mongodb, { MongoClient as MongoClientType, Db } from 'mongodb';
import { databaseKey, refToMongoTest } from '../config';

const { MongoClient } = mongodb;

let _dbClient: MongoClientType;
let _db: Db;

export const mongoConnect = (callback: () => void): Promise<void> => {
  return databaseKey().then(databaseString => {
    MongoClient.connect(databaseString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(client => {
        // eslint-disable-next-line no-console
        console.log('\x1b[35m%s\x1b[0m', 'Mongo Connected');
        _dbClient = client;
        _db = client.db();
        callback();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      });
  });
};

export const getDb = (): mongodb.Db => {
  if (_db) {
    return _db;
  }
  throw new Error('No database found!');
};

export const getDbClient = (): mongodb.MongoClient => {
  if (_dbClient) {
    return _dbClient;
  }
  throw new Error('No database client found!');
};

export const closeDb = (callback: (err?: unknown) => void): void => {
  _dbClient.close().then(() => {
    if (refToMongoTest) {
      refToMongoTest.stop().then(() => {
        callback();
      });
    } else {
      callback();
    }
  });
};
