import mongo, { ObjectId } from 'mongodb';
import { RoomWithId } from '../models/room';
import { BookWithoutLocationProp } from '../models/book';
import User from '../models/user';
import { SwapWithId } from '../models/swap';
import { NotificationWithId } from '../models/notification';

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

export const processRoomForUser = (
  room: RoomWithId,
  userId: string,
  roomMateName: string,
  isOnline: boolean,
) => {
  const roomMateIndex = room.participants.findIndex(
    participant => participant.userId.toHexString() !== userId,
  );
  const userIndex = roomMateIndex === 0 ? 1 : 0;
  return {
    roomId: room._id,
    roomMateName: roomMateName,
    roomMateId: room.participants[roomMateIndex].userId.toHexString(),
    unreadMsgs: room.participants[userIndex].unreadMsgs,
    isOnline,
    lastModified: room.lastModified,
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

export const extractRoomMateIdFromRoom = (userId: string, room: RoomWithId) => {
  const roomMate = room.participants.find(
    participant => participant.userId.toHexString() !== userId,
  );
  // @ts-ignore
  return roomMate.userId;
};

export interface ObjWithId {
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

interface RoomWithBookAsObject {
  participants: {
    interests: {
      [key: string]: any;
      _id: ObjectId;
    }[];
    userId: ObjectId;
    unreadMsgs: boolean;
  }[];
  _id: ObjectId;
}

export const processRoomNotification = (
  notification: NotificationWithId,
  room: RoomWithBookAsObject,
  notificationFromId: string,
  notificationFromName: string,
) => {
  const {
    _id: notificationId,
    lastModified,
    seen,
    type: notificationType,
  } = notification;
  const _id = notificationId.toHexString();

  const { participants, _id: roomId } = room;
  const chatRoomId = roomId.toHexString();

  const userIndex = participants.findIndex(user => {
    return user.userId.toHexString() !== notificationFromId;
  });

  const notificationFromUserIndex = userIndex === 0 ? 1 : 0;

  const { interests: usersBookInterests } = participants[notificationFromUserIndex];

  const { interests: notificationForBooks } = participants[userIndex];

  return {
    _id,
    notificationFromId,
    notificationFromName,
    notificationType,
    notificationForBooks,
    usersBookInterests,
    seen,
    lastModified,
    chatRoomId: notificationType === 'match' ? chatRoomId : undefined,
  };
};

export const processSwapNotification = (
  notification: NotificationWithId,
  swap: SwapWithId,
  fromIdName: string,
) => {
  const {
    _id,
    lastModified,
    seen,
    type: notificationType,
    fromId: notificationFromId,
  } = notification;
  const { swapBook, swapWithBook, status } = swap;

  const shouldReverseBooks =
    notificationType === 'swapReject' || notificationType === 'swapApprove';

  return {
    _id,
    notificationFromId,
    notificationFromName: fromIdName,
    notificationType,
    notificationForBooks: shouldReverseBooks ? [swapBook] : [swapWithBook],
    usersBookInterests: shouldReverseBooks ? [swapWithBook] : [swapBook],
    seen,
    swapStatus: status,
    lastModified,
  };
};

export const transformRoomWithBookNameAndId = (
  room: RoomWithId,
  allBooks: { _id: ObjectId; bookName: string }[],
) => {
  const { participants } = room;
  const transformedParticipants = participants.map(participant => {
    const { interests } = participant;
    const transformedInterests = interests.map(interestId => {
      const book = allBooks.find(book => book._id.toHexString() === interestId);
      return book;
    });
    const transformedInterestsWithBookId = transformedInterests.map(interest =>
      _idToRequiredProp(interest as ObjWithId, 'bookId'),
    );
    return { ...participant, interests: transformedInterestsWithBookId };
  });

  return { ...room, participants: transformedParticipants };
};

export const isEmptyRoom = (room: RoomWithId) => {
  return (
    room.participants[0].interests.length === 0 &&
    room.participants[1].interests.length === 0
  );
};

export const oneWayInterestOfRoomMate = (room: RoomWithId, userId: string) => {
  const userIndex = room.participants[0].userId.toHexString() === userId ? 0 : 1;
  const roomMateIndex = userIndex === 0 ? 1 : 0;
  return (
    room.participants[roomMateIndex].interests.length === 0 &&
    room.participants[userIndex].interests.length > 0
  );
};
