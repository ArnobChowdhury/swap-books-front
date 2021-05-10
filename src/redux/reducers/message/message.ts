import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  FETCH_ACTIVE_ROOMS_START,
  FETCH_ACTIVE_ROOMS_SUCCESS,
  FETCH_ACTIVE_ROOMS_FAIL,
  FETCH_ROOM_MESSAGE_START,
  FETCH_ROOM_MESSAGE_SUCCESS,
  FETCH_ROOM_PREVIOUS_MESSAGE_SUCCESS,
  FETCH_ROOM_MESSAGE_FAIL,
  OPEN_MESSAGE_BOX,
  CLOSE_MESSAGE_BOX,
  SET_MESSAGE_BOX,
  JOIN_SINGLE_ROOM,
  LEAVE_SINGLE_ROOM,
  ADD_ROOM_MESSAGE_SUCCESS,
  REGISTER_SENT_MESSAGE_SUCCESS,
  SET_MESSAGE_AS_SEEN_SUCCESS,
  ADD_NONACTIVE_ROOM_UNREAD_MSG_NOTIFICATION,
  FETCH_ROOM_INTERESTS_START,
  FETCH_ROOM_INTERESTS_SUCCESS,
  FETCH_ROOM_INTERESTS_FAIL,
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
  unreadMsgs: boolean;
}

export interface MessageProps {
  roomId?: string | null; // a single active conversation (roomId in the backend)
  roomMateName: string | null;
  roomMateId: string | null;
  roomMateInterests: string[];
  userInterests: string[];
  messages: MessageResponseProps[];
  messageLoading: boolean;
  messageError: Error | null;
  activeRooms: ActiveRoomsResponse[];
  activeRoomsLoading: boolean;
  activeRoomsError: Error | null;
  messageBoxIsOpen: boolean;
  fetchRoomMateInterestReqOnGoing: boolean;
  fetchRoomMateInterestErr: { message: string; status: number } | null;
  hasMoreMsgs: boolean;
  initialMsgsSet: boolean;
}

export const initialState: MessageProps = {
  roomId: null,
  roomMateName: null,
  roomMateId: null,
  roomMateInterests: [],
  userInterests: [],
  messages: [],
  messageLoading: false,
  messageError: null,
  activeRooms: [],
  activeRoomsLoading: false,
  activeRoomsError: null,
  messageBoxIsOpen: false,
  fetchRoomMateInterestReqOnGoing: false,
  fetchRoomMateInterestErr: null,
  hasMoreMsgs: false,
  initialMsgsSet: false,
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
    unreadMsgInRoom,
    fetchRoomMateInterestErr,
    hasMoreMsgs,
    fetchedMsgsForRoomId,
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

    case FETCH_ROOM_MESSAGE_SUCCESS: {
      const { roomId } = state;
      if (roomId === fetchedMsgsForRoomId) {
        return {
          ...state,
          messageLoading: false,
          messages,
          hasMoreMsgs,
          initialMsgsSet: true,
        };
      }
      return { ...state };
    }

    case FETCH_ROOM_MESSAGE_FAIL: {
      return {
        ...state,
        messageLoading: false,
        messageError,
      };
    }

    case FETCH_ROOM_PREVIOUS_MESSAGE_SUCCESS: {
      const { roomId, initialMsgsSet } = state;
      if (roomId === fetchedMsgsForRoomId && initialMsgsSet) {
        const newMessages = [...messages, ...state.messages];
        return { ...state, messages: newMessages, hasMoreMsgs };
      }
      return { ...state };
    }

    case SET_MESSAGE_BOX: {
      return {
        ...state,
        roomId,
        roomMateName,
        roomMateId,
        hasMoreMsgs: false,
        messages: [],
        initialMsgsSet: false,
      };
    }

    case OPEN_MESSAGE_BOX:
      return {
        ...state,
        messageBoxIsOpen: true,
      };

    case CLOSE_MESSAGE_BOX:
      return {
        ...state,
        messageBoxIsOpen: false,
        roomId: null,
        roomMateId: null,
        roomMateName: null,
        roomMateInterests: [],
        userInterests: [],
        messages: [],
      };

    case JOIN_SINGLE_ROOM: {
      let newActiveRooms: ActiveRoomsResponse[] = [singleRoom];
      if (state.activeRooms) {
        newActiveRooms = newActiveRooms.concat(state.activeRooms);
      }

      return {
        ...state,
        activeRooms: newActiveRooms,
      };
    }

    case LEAVE_SINGLE_ROOM: {
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
    }

    case ADD_ROOM_MESSAGE_SUCCESS: {
      const { roomId: activeRoomId, messages: existingMessages } = state;
      if (activeRoomId === newMsg.roomId) {
        const newMessages = existingMessages === null ? [] : [...existingMessages];
        newMessages.push(newMsg);
        return { ...state, messages: newMessages };
      }
    }

    case REGISTER_SENT_MESSAGE_SUCCESS: {
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
    }

    case SET_MESSAGE_AS_SEEN_SUCCESS: {
      const {
        roomId: msgOfTheRoomToBeSeen,
        messages: allMessages,
        activeRooms: allActiveRooms,
      } = state;

      let transFormedMessages = allMessages !== null ? [...allMessages] : [];
      if (msgOfTheRoomToBeSeen === seenMsgRoomId) {
        transFormedMessages = transFormedMessages.map(msg => {
          if (msg._id === seenMsgId) {
            msg.seen = true;
          }
          return msg;
        });
      }

      let activeRoomsAfterMarkingRead: ActiveRoomsResponse[] = [];
      if (allActiveRooms) {
        activeRoomsAfterMarkingRead = allActiveRooms.map(room => {
          if (room.roomId === seenMsgRoomId && room.unreadMsgs) {
            room.unreadMsgs = false;
          }
          return room;
        });
      }

      return {
        ...state,
        messages: transFormedMessages,
        activeRooms: activeRoomsAfterMarkingRead,
      };
    }

    case ADD_NONACTIVE_ROOM_UNREAD_MSG_NOTIFICATION: {
      const { activeRooms } = state;

      const newActiveRooms = activeRooms.map(room => {
        if (room.roomId === unreadMsgInRoom && !room.unreadMsgs) {
          room.unreadMsgs = true;
        }
        return room;
      });

      return {
        ...state,
        activeRooms: newActiveRooms,
      };
    }

    case FETCH_ROOM_INTERESTS_START: {
      return {
        ...state,
        roomMateInterests: [],
        userInterests: [],
        fetchRoomMateInterestReqOnGoing: true,
      };
    }

    case FETCH_ROOM_INTERESTS_SUCCESS: {
      return {
        ...state,
        roomMateInterests,
        userInterests,
        fetchRoomMateInterestReqOnGoing: false,
      };
    }

    case FETCH_ROOM_INTERESTS_FAIL: {
      return {
        ...state,
        fetchRoomMateInterestReqOnGoing: false,
        fetchRoomMateInterestErr,
      };
    }

    default:
      return state;
  }
};

export default reducer;
