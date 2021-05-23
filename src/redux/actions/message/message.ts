import axios from '../../../axiosInstance';
import { ActiveRoomsResponse, MessageProps } from 'redux/reducers/message';
import ObjectId from 'bson-objectid';
import {
  SOCKET_JOIN_ALL_ROOMS,
  SOCKET_SEND_MSG,
  SOCKET_SET_MSG_AS_SEEN,
} from '../../../socketTypes';
import { Dispatch } from 'redux';
import { MessageResponseProps } from '../../reducers/message';
import { Socket } from 'socket.io-client';

import {
  FETCH_ROOM_MESSAGE_START,
  FETCH_ROOM_MESSAGE_SUCCESS,
  FETCH_ROOM_PREVIOUS_MESSAGE_SUCCESS,
  FETCH_ROOM_MESSAGE_FAIL,
  FETCH_ACTIVE_ROOMS_START,
  FETCH_ACTIVE_ROOMS_SUCCESS,
  FETCH_ACTIVE_ROOMS_FAIL,
  OPEN_MESSAGE_BOX,
  CLOSE_MESSAGE_BOX,
  SET_MESSAGE_BOX,
  JOIN_SINGLE_ROOM,
  LEAVE_SINGLE_ROOM,
  ADD_ROOM_MESSAGE_SUCCESS,
  REGISTER_SENT_MESSAGE_SUCCESS,
  ADD_NONACTIVE_ROOM_UNREAD_MSG_NOTIFICATION,
  SET_MESSAGE_AS_SEEN_SUCCESS,
  FETCH_ROOM_INTERESTS_START,
  FETCH_ROOM_INTERESTS_SUCCESS,
  FETCH_ROOM_INTERESTS_FAIL,
  SET_USER_OFFLINE,
  SET_USER_ONLINE,
  SET_USER_TYPING,
} from './../actionTypes';

export const fetchActiveRoomsStart = () => {
  return {
    type: FETCH_ACTIVE_ROOMS_START,
  };
};

export const fetchActiveRoomsSuccess = (activeRooms: ActiveRoomsResponse[]) => {
  return {
    type: FETCH_ACTIVE_ROOMS_SUCCESS,
    activeRooms,
  };
};

export const fetchActiveRoomsFail = (activeRoomsError: Error) => {
  return {
    type: FETCH_ACTIVE_ROOMS_FAIL,
    activeRoomsError,
  };
};

export const setCurrentRoom = ({
  roomId,
  roomMateId,
  roomMateName,
}: {
  roomId: string;
  roomMateName: string;
  roomMateId: string;
}) => {
  return {
    type: SET_MESSAGE_BOX,
    roomId,
    roomMateName,
    roomMateId,
  };
};

export const fetchActiveRoomsReq = (socket: Socket) => (dispatch: Dispatch) => {
  dispatch(fetchActiveRoomsStart());
  return socket.emit(SOCKET_JOIN_ALL_ROOMS, (activeRooms: ActiveRoomsResponse[]) => {
    dispatch(fetchActiveRoomsSuccess(activeRooms));
  });
};

export const openMessageBox = () => {
  return {
    type: OPEN_MESSAGE_BOX,
  };
};

export const closeMessageBox = () => {
  return {
    type: CLOSE_MESSAGE_BOX,
  };
};

export const fetchCurrentRoomMsgsStart = () => {
  return {
    type: FETCH_ROOM_MESSAGE_START,
  };
};

export const fetchCurrentRoomMsgsFail = (messageError: {
  message: string;
  status: number;
}) => {
  return {
    type: FETCH_ROOM_MESSAGE_FAIL,
    messageError,
  };
};

export const fetchCurrentRoomMsgsSuccess = (
  type: string,
  messages: MessageResponseProps[],
  fetchedMsgsForRoomId: string,
) => {
  const hasMoreMsgs = messages.length < 20 ? false : true;

  return {
    type,
    messages,
    hasMoreMsgs,
    fetchedMsgsForRoomId,
  };
};

export const fetchCurrentRoomMsgsReq = (roomId: string, skip: number) => {
  return async (dispatch: Dispatch) => {
    if (skip === 0) dispatch(fetchCurrentRoomMsgsStart());

    const path = '/interactions/msgs';
    const params = { roomId, skip };
    try {
      const res = await axios.get(path, { params });
      const { latestMsgsFromDb: messages } = res.data;

      const type =
        skip === 0
          ? FETCH_ROOM_MESSAGE_SUCCESS
          : FETCH_ROOM_PREVIOUS_MESSAGE_SUCCESS;
      dispatch(fetchCurrentRoomMsgsSuccess(type, messages, roomId));
    } catch (err) {
      // TODO WE ARE NOT SHOWING ANY ERRORS YET!
      if (err.response) {
        const { status } = err.response;
        dispatch(
          fetchCurrentRoomMsgsFail({
            message: "Something went wrong! Couldn't fetch messages this time!",
            status,
          }),
        );
      }
    }
  };
};

export const addUnreadMsgsNotification = (unreadMsgInRoom: string) => {
  return {
    type: ADD_NONACTIVE_ROOM_UNREAD_MSG_NOTIFICATION,
    unreadMsgInRoom,
  };
};

// sendMsg Start, success, failure this are not here
export const addNewMsgToRoom = (newMsg: MessageResponseProps) => {
  return {
    type: ADD_ROOM_MESSAGE_SUCCESS,
    newMsg,
  };
};

export const registerNewMsgToRoomSuccess = (
  registeredMsgRoomId: string,
  registeredMsgId: string,
  registeredMsgTimestamp: string,
) => {
  return {
    type: REGISTER_SENT_MESSAGE_SUCCESS,
    registeredMsgRoomId,
    registeredMsgId,
    registeredMsgTimestamp,
  };
};

export const sendMsgToRoom = (
  socket: Socket,
  room: string,
  msg: string,
  userId: string,
  roomMateId: string,
) => {
  return (dispatch: Dispatch) => {
    // TODO how to use dispatch we can do loading state that a msg is being sent
    const msgObjectId = new ObjectId();
    const msgId = msgObjectId.str;
    dispatch(
      addNewMsgToRoom({
        _id: msgId,
        msg,
        fromId: userId,
        toId: roomMateId,
        timestamp: new Date().getTime(),
        registered: false,
        seen: false,
        roomId: room,
      }),
    );
    socket.emit(
      SOCKET_SEND_MSG,
      { room, msg, userId, roomMateId, msgId },
      (registeredMsg: { _id: string; timestamp: string }) => {
        const { _id, timestamp } = registeredMsg;
        dispatch(registerNewMsgToRoomSuccess(room, _id, timestamp));
      },
    );
  };
};

export const joinSingleRoom = (singleRoom: ActiveRoomsResponse) => {
  return {
    type: JOIN_SINGLE_ROOM,
    singleRoom,
  };
};

export const leaveSingleRoom = (leaveRoomId: string) => {
  return {
    type: LEAVE_SINGLE_ROOM,
    leaveRoomId,
  };
};

export const setAsSeenSuccess = (seenMsgRoomId: string, seenMsgId: string) => {
  return {
    type: SET_MESSAGE_AS_SEEN_SUCCESS,
    seenMsgRoomId,
    seenMsgId,
  };
};

export const setAsSeenRequest = (socket: Socket, roomId: string, msgId: string) => (
  dispatch: Dispatch,
) => {
  socket.emit(SOCKET_SET_MSG_AS_SEEN, roomId, msgId, () => {
    dispatch(setAsSeenSuccess(roomId, msgId));
  });
};

const fetchRoomInterestStart = () => {
  return {
    type: FETCH_ROOM_INTERESTS_START,
  };
};

const fetchRoomInterestSuccess = (
  roomMateInterests: string[],
  userInterests: string[],
) => {
  return {
    type: FETCH_ROOM_INTERESTS_SUCCESS,
    roomMateInterests,
    userInterests,
  };
};

const fetchRoomInterestFail = (fetchRoomMateInterestErr: {
  message: string;
  status: number;
}) => {
  return {
    type: FETCH_ROOM_INTERESTS_FAIL,
    fetchRoomMateInterestErr,
  };
};

export const fetchRoomInterestReq = (roomId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchRoomInterestStart());

    const path = '/books/books-of-room';
    const params = { roomId };
    return axios
      .get(path, { params })
      .then(res => {
        const { roomMateInterests, userInterests } = res.data;
        dispatch(fetchRoomInterestSuccess(roomMateInterests, userInterests));
      })
      .catch(err => {
        const { status } = err.response;
        dispatch(
          fetchRoomInterestFail({
            message: 'Something went wrong! Try again.',
            status,
          }),
        );
      });
  };
};

export const userIsOffline = (roomMateId: string) => {
  return {
    type: SET_USER_OFFLINE,
    roomMateId,
  };
};

export const userIsOnline = (roomMateId: string) => {
  return {
    type: SET_USER_ONLINE,
    roomMateId,
  };
};

export const isUserTyping = (roomId: string, isTyping: boolean) => {
  return {
    type: SET_USER_TYPING,
    roomId,
    isTyping,
  };
};
