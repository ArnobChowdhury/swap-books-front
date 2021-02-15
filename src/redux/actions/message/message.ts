import { ActiveRoomsResponse, MessageProps } from 'redux/reducers/message';
import ObjectId from 'bson-objectid';
import {
  SOCKET_JOIN_ALL_ROOMS,
  SOCKET_SEND_MSG,
  SOCKET_INIT_MSGS,
  SOCKET_SET_MSG_AS_SEEN,
} from '../../../socketTypes';
import { Dispatch } from 'redux';
import { MessageResponseProps } from '../../reducers/message';
import { NotificationBookShape } from 'redux/reducers/notifications';
import { Socket } from 'socket.io-client';

import {
  FETCH_ROOM_MESSAGE_START,
  FETCH_ROOM_MESSAGE_SUCCESS,
  FETCH_ROOM_MESSAGE_FAIL,
  FETCH_ACTIVE_ROOMS_START,
  FETCH_ACTIVE_ROOMS_SUCCESS,
  FETCH_ACTIVE_ROOMS_FAIL,
  OPEN_MESSAGE_BOX,
  CLOSE_MESSAGE_BOX,
  SET_MESSAGE_BOX,
  JOIN_SINGLE_ROOM,
  LEAVE_SINGLE_ROOM,
  ADD_ROOM_MESSAGE_PENDING,
  ADD_ROOM_MESSAGE_SUCCESS,
  SET_MESSAGE_AS_SEEN_SUCCESS,
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

export const setCurrentRoom = (
  roomId: string,
  roomMateName: string,
  roomMateId: string,
  roomMateInterests: NotificationBookShape[],
  userInterests: NotificationBookShape[],
) => {
  return {
    type: SET_MESSAGE_BOX,
    roomId,
    roomMateName,
    roomMateId,
    roomMateInterests,
    userInterests,
  };
};

export const fetchActiveRoomsReq = (socket: Socket) => (dispatch: Dispatch) => {
  dispatch(fetchActiveRoomsStart());
  return socket.emit(SOCKET_JOIN_ALL_ROOMS, (activeRooms: ActiveRoomsResponse[]) => {
    dispatch(fetchActiveRoomsSuccess(activeRooms));
    if (activeRooms.length) {
      const {
        roomId: mostCurrentRoomId,
        roomMateName: mostCurrentRoomMateName,
        roomMateId: mostCurrentRoomMateId,
        roomMateInterests: mostCurrentRoomMateInterests,
        userInterests: userInterestsAgainstRoomMate,
      } = activeRooms[0];
      dispatch(
        setCurrentRoom(
          mostCurrentRoomId,
          mostCurrentRoomMateName,
          mostCurrentRoomMateId,
          mostCurrentRoomMateInterests,
          userInterestsAgainstRoomMate,
        ),
      );
    }
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

export const fetchCurrentRoomMsgsFail = (messageError: Error) => {
  return {
    type: FETCH_ROOM_MESSAGE_FAIL,
    messageError,
  };
};

export const fetchCurrentRoomMsgsSuccess = (messages: MessageResponseProps[]) => {
  return {
    type: FETCH_ROOM_MESSAGE_SUCCESS,
    messages,
  };
};

export const fetchCurrentRoomMsgsReq = (socket: Socket, roomId: string) => {
  return (dispatch: Dispatch) => {
    socket.emit(SOCKET_INIT_MSGS, roomId, (messages: MessageResponseProps[]) => {
      dispatch(fetchCurrentRoomMsgsSuccess(messages));
    });
  };
};

// sendMsg Start, success, failure this are not here
export const addNewMsgToRoom = (newMsg: MessageResponseProps) => {
  return {
    type: ADD_ROOM_MESSAGE_PENDING,
    newMsg,
  };
};

export const addNewMsgToRoomSuccess = (
  registeredMsgRoomId: string,
  registeredMsgId: string,
  registeredMsgTimestamp: number,
) => {
  return {
    type: ADD_ROOM_MESSAGE_SUCCESS,
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
      (registeredMsg: { _id: string; timestamp: number }) => {
        const { _id, timestamp } = registeredMsg;
        dispatch(addNewMsgToRoomSuccess(room, _id, timestamp));
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
