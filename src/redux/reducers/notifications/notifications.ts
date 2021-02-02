import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  GET_NOTIFICATIONS_START,
  GET_INITIAL_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
  SET_NOTIFICATION_AS_SEEN,
  ADD_LIVE_NOTIFICATION,
  GET_MORE_NOTIFICATIONS_SUCCESS,
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

export interface NotificationShapeOnTheServer {
  _id: string;
  participants: NotificationParticipantShape[];
  lastModified: string;
}
export interface NotificationResponseShape {
  notifications: NotificationShapeOnTheServer[];
  unseen: number;
}

export interface NotificationShape {
  _id: string;
  interestedUserId: string;
  interestedUserName: string;
  notificationType: 'interest' | 'match' | 'notice';
  interestsOfInterestedUser?: NotificationBookShape[];
  interestsOfThisUser?: NotificationBookShape[];
  seen: boolean;
  lastModified: string;
}

export interface NotificationState {
  notifications: NotificationShape[];
  totalUnseen: number | null;
  error: string | null | Error;
  loading: boolean;
  hasMoreNotifications: boolean;
}

export const initialState: NotificationState = {
  notifications: [],
  error: null,
  loading: false,
  totalUnseen: null,
  hasMoreNotifications: true,
};

// todo write tests for expressInterest related functions
const reducer = (state = initialState, action: AnyAction) => {
  const {
    notifications,
    totalUnseen,
    error,
    seenNotificationId,
    hasMoreNotifications,
    latestNotification,
  } = action;

  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case GET_NOTIFICATIONS_START:
      // return { ...state, notifications: [], loading: true };
      return { ...state, loading: true };
    case GET_INITIAL_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications,
        totalUnseen,
        hasMoreNotifications,
      };

    case GET_MORE_NOTIFICATIONS_SUCCESS:
      const newNotifications = [...state.notifications, ...notifications];
      return {
        ...state,
        loading: false,
        notifications: newNotifications,
        totalUnseen,
        hasMoreNotifications,
      };

    case ADD_LIVE_NOTIFICATION:
      const previousNotifications = state.notifications.filter(
        notification => notification._id !== latestNotification._id,
      );
      const latestNotifications = [latestNotification, ...previousNotifications];
      return { ...state, notifications: latestNotifications, totalUnseen };

    case GET_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error };
    case SET_NOTIFICATION_AS_SEEN:
      const newState = { ...state };
      const {
        notifications: allNotification,
        totalUnseen: currentTotalUnseen,
      } = newState;
      const seenNotificationIndex = allNotification.findIndex(
        notification => notification._id === seenNotificationId,
      );
      allNotification[seenNotificationIndex].seen = true;

      return {
        ...newState,
        totalUnseen: currentTotalUnseen
          ? currentTotalUnseen - 1
          : currentTotalUnseen,
      };
    default:
      return state;
  }
};

export default reducer;
