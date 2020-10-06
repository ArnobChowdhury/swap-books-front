import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  FETCH_ACTIVE_ROOMS_START,
  FETCH_ACTIVE_ROOMS_SUCCESS,
  FETCH_ACTIVE_ROOMS_FAIL,
  FETCH_ROOM_MESSAGE_START,
  FETCH_ROOM_MESSAGE_SUCCESS,
  FETCH_ROOM_MESSAGE_FAIL,
  OPEN_MESSAGE_BOX,
  CLOSE_MESSAGE_BOX,
  SET_MESSAGE_BOX,
} from '../../actions/actionTypes';

export interface MessageResponseProps {
  _id: string;
  msg: string;
  fromId: string;
  toId: string;
  timestamp: string;
  seen: boolean;
}

export interface ActiveRoomsResponse {
  roomId: string;
  roomMateName: string;
  roomMateId: string;
}

export interface MessageProps {
  roomId?: string | null; // a single active conversation (roomId in the backend)
  roomMateName: string | null;
  roomMateId: string | null;
  messages: MessageResponseProps[] | null;
  messageLoading: boolean;
  messageError: Error | null;
  activeRooms: ActiveRoomsResponse[] | null;
  activeRoomsLoading: boolean;
  activeRoomsError: Error | null;
  messageBoxIsOpen: boolean;
}

export const initialState: MessageProps = {
  roomId: null,
  roomMateName: null,
  roomMateId: null,
  messages: null,
  messageLoading: false,
  messageError: null,
  activeRooms: null,
  activeRoomsLoading: false,
  activeRoomsError: null,
  messageBoxIsOpen: false,
};

const reducer = (state = initialState, action: AnyAction): MessageProps => {
  const {
    activeRooms,
    activeRoomsError,
    messageError,
    messages,
    roomId,
    roomMateName,
    roomMateId,
  } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case FETCH_ACTIVE_ROOMS_START:
      return { ...state, activeRoomsLoading: true };
    case FETCH_ACTIVE_ROOMS_SUCCESS:
      return { ...state, activeRoomsLoading: false, activeRooms };
    case FETCH_ACTIVE_ROOMS_FAIL:
      return {
        ...state,
        activeRoomsLoading: false,
        activeRoomsError,
      };
    case FETCH_ROOM_MESSAGE_START:
      return {
        ...state,
        messageLoading: true,
      };
    case FETCH_ROOM_MESSAGE_SUCCESS:
      return {
        ...state,
        messages,
      };
    case FETCH_ROOM_MESSAGE_FAIL:
      return {
        ...state,
        messageLoading: false,
        messageError,
      };
    case SET_MESSAGE_BOX:
      return {
        ...state,
        roomId,
        roomMateName,
        roomMateId,
      };
    case OPEN_MESSAGE_BOX:
      return {
        ...state,
        messageBoxIsOpen: true,
      };
    case CLOSE_MESSAGE_BOX:
      return {
        ...state,
        messageBoxIsOpen: false,
      };
    default:
      return state;
  }
};

export default reducer;
