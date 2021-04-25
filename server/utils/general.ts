import mongo, { ObjectId } from 'mongodb';
import { RoomWithId } from '../models/room';
import { BookWithoutLocationProp } from '../models/book';
import User from '../models/user';
import { SwapWithId } from '../models/swap';
import { NotificationWithId } from '../models/notification/notification.model';

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

export const isAMatchedRoom = (room: RoomWithId): boolean => {
  if (
    room.participants[0].interests.length > 0 &&
    room.participants[1].interests.length > 0
  ) {
    return true;
  }
  return false;
};

export const processRoomForUser = (room: RoomWithId, userId: string) => {
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
    unreadMsgs: room.participants[userIndex].unreadMsgs,
  };
};

export const processBookForUser = (
  book: BookWithoutLocationProp,
  userId: string,
) => {
  const ind = book.interestedUsers.find(el => el.toString() === userId);
  const bookWithInterestedField = { ...book, isInterested: ind !== undefined };
  delete bookWithInterestedField.interestedUsers;
  return bookWithInterestedField;
};

export const processUserInfo = ({
  name,
  locationObj,
}: {
  name: string;
  locationObj: User['locationObj'];
}) => {
  let userLon: number | undefined;
  let userLat: number | undefined;
  if (locationObj) {
    const { coordinates } = locationObj;
    userLon = coordinates[0];
    userLat = coordinates[1];
  }
  return { name, userLon, userLat };
};

type ExcludeSaveFromRoom = Omit<RoomWithId, 'save'>;
interface RoomWithLastModified extends ExcludeSaveFromRoom {
  lastModified: Date;
}

interface SwapWithLastModified extends SwapWithId {
  lastModified: Date;
}

type NotificationInputType = RoomWithId | SwapWithId;

export const addLastModifiedFieldToNotification = (
  roomsOrSwaps: NotificationInputType[],
  notifications: NotificationWithId[],
  type: 'roomId' | 'swapId',
) => {
  const notificationWithLastModified = roomsOrSwaps.map(roomOrSwap => {
    const notification = notifications.find(
      notification =>
        roomOrSwap._id.toHexString() === notification[type]?.toHexString(),
    );
    let lastModified;

    if (notification) {
      lastModified = notification.lastModified;
    }

    const newRoomORSwap = { ...roomOrSwap, lastModified };
    return newRoomORSwap;
  });

  return notificationWithLastModified;
};

export const extractRoomMateIdFromRoom = (userId: string, room: RoomWithId) => {
  const roomMate = room.participants.find(
    participant => participant.userId.toHexString() !== userId,
  );
  // @ts-ignore
  return roomMate.userId;
};

interface ObjWithId {
  _id: ObjectId;
  [key: string]: any;
}

export const _idToRequiredProp = (obj: ObjWithId, requiredProp: string) => {
  const { _id } = obj;
  const newObj = { ...obj, [requiredProp]: _id.toHexString() };
  delete newObj._id;

  return newObj;
};

export const extractInterestsOfUserFromRoom = (userId: string, room: RoomWithId) => {
  const roomMate = room.participants.find(
    participant => participant.userId.toHexString() !== userId,
  );
  // @ts-ignore
  return roomMate.interests;
};
