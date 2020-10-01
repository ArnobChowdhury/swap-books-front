import { ActiveRoomsResponse } from 'redux/reducers/message';
import { SOCKET_JOIN_ALL_ROOMS } from '../../../socketTypes';
import { Dispatch } from 'redux';

import {
  FETCH_ACTIVE_ROOMS_START,
  FETCH_ACTIVE_ROOMS_SUCCESS,
  FETCH_ACTIVE_ROOMS_FAIL,
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
