import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  FETCH_ACTIVE_ROOMS_START,
  FETCH_ACTIVE_ROOMS_SUCCESS,
  FETCH_ACTIVE_ROOMS_FAIL,
  FETCH_COVERSATION_MESSAGE_START,
  FETCH_COVERSATION_MESSAGE_SUCCESS,
  FETCH_COVERSATION_MESSAGE_FAIL,
} from '../../actions/actionTypes';

export interface MessageResponseProps {
  msg: string;
  fromId: string;
  toId: string;
  timestamp: string;
}

export interface ActiveRoomsResponse {
  roomId: string;
  roomMateName: string;
  roomMateId: string;
}

export interface MessageProps {
  roomId?: string | null; // a single active conversation (roomId in the backend)
  roomMate?: { userName: string; userId: string; roomId: string } | null; //
  messages: MessageResponseProps[] | null;
  messageLoading: boolean;
  messageError: Error | null;
  activeRooms: ActiveRoomsResponse[] | null;
  activeRoomsLoading: boolean;
  activeRoomsError: Error | null;
}

export const initialState: MessageProps = {
  roomId: null,
  roomMate: null,
  messages: null,
  messageLoading: false,
  messageError: null,
  activeRooms: null,
  activeRoomsLoading: false,
  activeRoomsError: null,
};

const reducer = (state = initialState, action: AnyAction): MessageProps => {
  const { activeRooms, activeRoomsError, messageError, messages } = action;
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
    case FETCH_COVERSATION_MESSAGE_START:
      return {
        ...state,
        messageLoading: true,
      };
    case FETCH_COVERSATION_MESSAGE_SUCCESS:
      return {
        ...state,
        messages,
      };
    case FETCH_COVERSATION_MESSAGE_FAIL:
      return {
        ...state,
        messageLoading: false,
        messageError,
      };
    default:
      return state;
  }
};

export default reducer;
