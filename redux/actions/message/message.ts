import { ActiveRoomsResponse } from 'redux/reducers/message';
import { SOCKET_JOIN_ALL_ROOMS } from '../../../socketTypes';
import { Dispatch } from 'redux';
import { MessageResponseProps } from '../../reducers/message';
import axios from 'axiosInstance';

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
  roomId: string,
  roomMateName: string,
  roomMateId: string,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(setCurrentRoom(roomId, roomMateName, roomMateId));
    const path = '/message/roomId';
    return axios
      .get(path)
      .then(response => {
        const { messages } = response.data;
        dispatch(fetchCurrentRoomMsgsSuccess(messages));
      })
      .catch(err => {
        dispatch(fetchCurrentRoomMsgsFail(err));
      });
  };
};
