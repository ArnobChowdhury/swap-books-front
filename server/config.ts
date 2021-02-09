import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

// todo need to change the type
let mongoTest: MongoMemoryServer | undefined;

if (process.env.NODE_ENV === 'test') {
  mongoTest = new MongoMemoryServer();
}

export const refToMongoTest = mongoTest;

export const databaseKey = async (): Promise<string> => {
  if (process.env.NODE_ENV === 'test' && mongoTest) {
    const testMongoString = await mongoTest.getUri();
    return testMongoString;
  }
  return process.env.DATABASE_KEY || '';
};
