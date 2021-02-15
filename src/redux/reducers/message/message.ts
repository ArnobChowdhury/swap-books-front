import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { NotificationBookShape } from 'redux/reducers/notifications';

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
  JOIN_SINGLE_ROOM,
  LEAVE_SINGLE_ROOM,
  ADD_ROOM_MESSAGE_PENDING,
  ADD_ROOM_MESSAGE_SUCCESS,
  SET_MESSAGE_AS_SEEN_SUCCESS,
} from '../../actions/actionTypes';

export interface MessageResponseProps {
  _id: string;
  roomId: string;
  msg: string;
  fromId: string;
  toId: string;
  timestamp: number;
  registered: boolean;
  seen: boolean;
}

export interface ActiveRoomsResponse {
  roomId: string;
  roomMateName: string;
  roomMateId: string;
  roomMateInterests: NotificationBookShape[];
  userInterests: NotificationBookShape[];
}

export interface MessageProps {
  roomId?: string | null; // a single active conversation (roomId in the backend)
  roomMateName: string | null;
  roomMateId: string | null;
  roomMateInterests: NotificationBookShape[];
  userInterests: NotificationBookShape[];
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
  roomMateInterests: [],
  userInterests: [],
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
    roomMateInterests,
    userInterests,
    singleRoom,
    leaveRoomId,
    newMsg,
    registeredMsgRoomId,
    registeredMsgId,
    registeredMsgTimestamp,
    seenMsgRoomId,
    seenMsgId,
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
        roomMateInterests,
        userInterests,
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

    case JOIN_SINGLE_ROOM:
      let newActiveRooms: ActiveRoomsResponse[] = [singleRoom];
      if (state.activeRooms) {
        newActiveRooms = newActiveRooms.concat(state.activeRooms);
      }

      return {
        ...state,
        activeRooms: newActiveRooms,
      };

    case LEAVE_SINGLE_ROOM:
      const { activeRooms: actRooms } = state;
      let newRooms: ActiveRoomsResponse[] = [];
      if (actRooms) {
        const existingRooms = [...actRooms];
        newRooms = existingRooms.filter(room => room.roomId !== leaveRoomId);
      }

      return {
        ...state,
        activeRooms: newRooms,
      };

    case ADD_ROOM_MESSAGE_PENDING:
      const { roomId: activeRoomId, messages: existingMessages } = state;
      if (activeRoomId === newMsg.roomId) {
        const newMessages = existingMessages === null ? [] : [...existingMessages];
        newMessages.push(newMsg);
        return { ...state, messages: newMessages };
      }

    case ADD_ROOM_MESSAGE_SUCCESS:
      const {
        roomId: currentActiveRoomId,
        messages: currentExistingMessages,
      } = state;
      if (currentActiveRoomId === registeredMsgRoomId) {
        const newMessages =
          currentExistingMessages === null ? [] : [...currentExistingMessages];
        const l = newMessages.length;
        for (let i = l - 1; i >= 0; i--) {
          if (newMessages[i]._id === registeredMsgId) {
            newMessages[i].registered = true;
            newMessages[i].timestamp = registeredMsgTimestamp;
            break;
          }
        }
        return { ...state, messages: newMessages };
      }

    case SET_MESSAGE_AS_SEEN_SUCCESS:
      const { roomId: msgOfTheRoomToBeSeen, messages: allMessages } = state;
      if (msgOfTheRoomToBeSeen === seenMsgRoomId && allMessages) {
        const transFormedMessages = allMessages.map(msg => {
          if (msg._id === seenMsgId) {
            msg.seen = true;
          }
          return msg;
        });
        return { ...state, messages: transFormedMessages };
      }

    default:
      return state;
  }
};

export default reducer;
