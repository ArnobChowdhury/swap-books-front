import { NotificationResponseShape } from 'redux/reducers/notifications';
import { SOCKET_GET_NOTIFICATION } from 'socketTypes';
import { Dispatch } from 'redux';

import {
  GET_NOTIFICATIONS_FAIL,
  GET_NOTIFICATIONS_START,
  GET_NOTIFICATIONS_SUCCESS,
} from './../actionTypes';

export const getNotificationStart = () => {
  return {
    type: GET_NOTIFICATIONS_START,
  };
};

export const getNotificationSuccess = (
  notifications: NotificationResponseShape[],
) => {
  return {
    type: GET_NOTIFICATIONS_SUCCESS,
    notifications,
  };
};

export const getNotificationFail = (error: Error) => {
  return {
    type: GET_NOTIFICATIONS_FAIL,
    error: error,
  };
};

export const getNotificationsRequest = (
  socket: SocketIOClient.Socket,
  userId: string,
) => (dispatch: Dispatch) => {
  dispatch(getNotificationStart());
  socket.emit(
    SOCKET_GET_NOTIFICATION,
    userId,
    (notifications: NotificationResponseShape[]) => {
      dispatch(getNotificationSuccess(notifications));
    },
  );
};
