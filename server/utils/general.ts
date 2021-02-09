import mongo from 'mongodb';
import { RoomWithLastModifiedAndID } from '../models/room';

interface MongoCollection {
  _id: mongo.ObjectID;
}

interface Timestamp {
  timestamp: number;
}

export const addTimestampToMongoCollection = <T extends MongoCollection>(
  collections: T[],
): (T & Timestamp)[] => {
  const timestampAddedCollection = collections.map(collection => {
    const timestamp = collection._id.getTimestamp().getTime();
    return { ...collection, timestamp };
  });

  return timestampAddedCollection;
};

export const sortMongoCollectionByTimeStamp = <T extends MongoCollection>(
  collections: T[],
): T[] => {
  const sortedArray = collections.sort((a, b) => {
    return a._id.getTimestamp().getTime() - b._id.getTimestamp().getTime();
  });
  return sortedArray;
};

export const isAMatchedRoom = (room: RoomWithLastModifiedAndID): boolean => {
  if (
    room.participants[0].interests.length > 0 &&
    room.participants[1].interests.length > 0
  ) {
    return true;
  }
  return false;
};
