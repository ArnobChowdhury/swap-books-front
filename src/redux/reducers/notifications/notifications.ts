import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  GET_NOTIFICATIONS_START,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
} from '../../actions/actionTypes';

export interface NotificationParticipantShape {
  userId: string;
  userName: string;
  interests?: NotificationBookShape[];
  interestSeen: boolean;
}

interface NotificationBookShape {
  bookName: string;
  bookId: string;
}
export interface NotificationResponseShape {
  _id: string;
  participants: NotificationParticipantShape[];
}

export interface NotificationShape {
  _id: string;
  interestedUserId: string;
  interestedUserName: string;
  notificationType: 'interest' | 'match' | 'notice';
  interestsOfInterestedUser?: NotificationBookShape[];
  interestsOfThisUser?: NotificationBookShape[];
  seen: boolean;
}

export interface NotificationState {
  notifications: NotificationShape[];
  error: string | null | Error;
  loading: boolean;
}

export const initialState: NotificationState = {
  notifications: [],
  error: null,
  loading: false,
};

// todo write tests for expressInterest related functions
const reducer = (state = initialState, action: AnyAction) => {
  const { notifications, error } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case GET_NOTIFICATIONS_START:
      return { ...state, loading: true };
    case GET_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, notifications };
    case GET_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error };
    default:
      return state;
  }
};

export default reducer;
