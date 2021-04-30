import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  GET_NOTIFICATIONS_START,
  GET_INITIAL_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
  SET_NOTIFICATION_AS_SEEN,
  ADD_LIVE_NOTIFICATION,
  GET_MORE_NOTIFICATIONS_SUCCESS,
  SWAP_CONSENT_REQUEST_START,
  SWAP_CONSENT_REQUEST_SUCCESS,
  SWAP_CONSENT_REQUEST_FAIL,
} from '../../actions/actionTypes';

export interface NotificationParticipantShape {
  userId: string;
  userName: string;
  interests?: NotificationBookShape[];
  interestSeen: boolean;
}

export interface NotificationBookShape {
  bookName: string;
  bookId: string;
}

// TODO GET RID OF THIS SINCE THIS IS NOT THE RIGHT STRUCTURE ANYMORE
export interface NotificationShapeOnTheServer {
  _id: string;
  notificationFromId: string;
  notificationFromName: string;
  notificationType:
    | 'interest'
    | 'match'
    | 'swapReq'
    | 'swapApprove'
    | 'swapReject'
    | 'announcement';
  notificationForBooks?: NotificationBookShape[];
  usersBookInterests?: NotificationBookShape[];
  seen: boolean;
  lastModified: string;
  chatRoomId?: string;
  swapStatus?: 'approved' | 'pending' | 'rejected';
}
export interface NotificationResponseShape {
  notifications: NotificationShapeOnTheServer[];
  unseen: number;
}

export interface NotificationShape extends NotificationShapeOnTheServer {
  swapConsentOnGoing?: boolean;
  swapConsentErr?: { message: string; status: number } | null;
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
    notificationIdForSwapConsent,
    statusOfSwapConsent,
    errorForSwapConsent,
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

    case SWAP_CONSENT_REQUEST_START: {
      const { notifications } = state;
      const newNotifications = notifications.map(notification => {
        const copiedNotification = { ...notification };
        if (notification._id === notificationIdForSwapConsent) {
          copiedNotification.swapConsentOnGoing = true;
        }
        return copiedNotification;
      });
      return { ...state, notifications: newNotifications };
    }

    case SWAP_CONSENT_REQUEST_SUCCESS: {
      const { notifications } = state;
      const newNotifications = notifications.map(notification => {
        const copiedNotification = { ...notification };
        if (notification._id === notificationIdForSwapConsent) {
          copiedNotification.swapConsentOnGoing = false;
          copiedNotification.swapStatus = statusOfSwapConsent;
        }
        return copiedNotification;
      });
      return { ...state, notifications: newNotifications };
    }

    case SWAP_CONSENT_REQUEST_FAIL: {
      const { notifications } = state;
      const newNotifications = notifications.map(notification => {
        const copiedNotification = { ...notification };
        if (notification._id === notificationIdForSwapConsent) {
          copiedNotification.swapConsentOnGoing = false;
          copiedNotification.swapConsentErr = errorForSwapConsent;
        }
        return copiedNotification;
      });
      return { ...state, notifications: newNotifications };
    }

    default:
      return state;
  }
};

export default reducer;
