import mongo from 'mongodb';
import { RoomWithLastModifiedAndID } from '../models/room';

interface MongoCollection {
  _id: mongo.ObjectID;
}

export interface Timestamp {
  timestamp: number;
}

export const addTimestampToMongoCollection = <T extends MongoCollection>(
  collection: T,
): T & Timestamp => {
  const timestamp = collection._id.getTimestamp().getTime();
  return { ...collection, timestamp };
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

export const processRoomForUser = (
  room: RoomWithLastModifiedAndID,
  userId: string,
) => {
  const roomMateIndex = room.participants.findIndex(
    participant => participant.userId.toHexString() !== userId,
  );
  const userIndex = roomMateIndex === 0 ? 1 : 0;
  return {
    roomId: room._id,
    roomMateName: room.participants[roomMateIndex].userName,
    roomMateId: room.participants[roomMateIndex].userId.toHexString(),
    roomMateInterests: room.participants[userIndex].interests,
    userInterests: room.participants[roomMateIndex].interests,
  };
};
