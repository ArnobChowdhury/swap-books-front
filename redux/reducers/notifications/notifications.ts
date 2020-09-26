import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  GET_NOTIFICATIONS_START,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
} from '../../actions/actionTypes';

export interface NotificationResponseShape {
  _id: string;
  fromId: string;
  fromName: string;
  notificationType: 'interest' | 'match' | 'notice';
  bookId?: string;
  bookName?: string;
  seen: boolean;
  timestamp: number;
  toId: string;
}

export interface NotificationShape {
  notificationId: string;
  fromId: string;
  fromName: string;
  type: 'interest' | 'match' | 'notice';
  bookId?: string;
  bookName?: string;
  seen: boolean;
  noticeText?: string;
  matchLink?: string;
  timestamp: number;
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
      const notificationsReshaped = notifications
        .sort(
          (a: NotificationResponseShape, b: NotificationResponseShape) =>
            b.timestamp - a.timestamp,
        )
        .map((notification: NotificationResponseShape) => {
          const notificationId = notification._id;
          const type = notification.notificationType;
          delete notification._id;
          delete notification.notificationType;
          delete notification.toId;
          return { ...notification, notificationId, type };
        });
      return { ...state, loading: false, notifications: notificationsReshaped };
    case GET_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error };
    default:
      return state;
  }
};

export default reducer;
