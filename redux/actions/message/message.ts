import { ActiveRoomsResponse } from 'redux/reducers/message';
import {
  SOCKET_JOIN_ALL_ROOMS,
  SOCKET_SEND_MSG,
  SOCKET_INIT_MSGS,
} from '../../../socketTypes';
import { Dispatch } from 'redux';
import { MessageResponseProps } from '../../reducers/message';

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
) => {
  return {
    type: SET_MESSAGE_BOX,
    roomId,
    roomMateName,
    roomMateId,
  };
};

export const fetchActiveRoomsReq = (
  socket: SocketIOClient.Socket,
  userId: string,
) => (dispatch: Dispatch) => {
  dispatch(fetchActiveRoomsStart());
  return socket.emit(
    SOCKET_JOIN_ALL_ROOMS,
    userId,
    (activeRooms: ActiveRoomsResponse[]) => {
      dispatch(fetchActiveRoomsSuccess(activeRooms));
      if (activeRooms.length) {
        const {
          roomId: mostCurrentRoomId,
          roomMateName: mostCurrentRoomMateName,
          roomMateId: mostCurrentRoomMateId,
        } = activeRooms[0];
        dispatch(
          setCurrentRoom(
            mostCurrentRoomId,
            mostCurrentRoomMateName,
            mostCurrentRoomMateId,
          ),
        );
      }
    },
  );
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

export const fetchCurrentRoomMsgsReq = (
  socket: SocketIOClient.Socket,
  roomId: string,
) => {
  return (dispatch: Dispatch) => {
    socket.emit(SOCKET_INIT_MSGS, roomId, (messages: MessageResponseProps[]) => {
      dispatch(fetchCurrentRoomMsgsSuccess(messages));
    });
  };
};

// sendMsg Start, success, failure this are not here

export const sendMsgToRoom = (
  socket: SocketIOClient.Socket,
  room: string,
  msg: string,
  userId: string,
  roomMateId: string,
) => {
  return (dispatch: Dispatch) => {
    // TODO how to use dispatch we can do loading state that a msg is being sent
    socket.emit(
      SOCKET_SEND_MSG,
      { room, msg, userId, roomMateId },
      (messages: MessageResponseProps[]) => {
        dispatch(fetchCurrentRoomMsgsSuccess(messages));
      },
    );
  };
};
