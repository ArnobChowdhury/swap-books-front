import {
  NotificationResponseShape,
  NotificationShape,
  NotificationShapeOnTheServer,
} from 'redux/reducers/notifications';
import { Dispatch } from 'redux';
import axios from 'axiosInstance';

import {
  GET_NOTIFICATIONS_FAIL,
  GET_NOTIFICATIONS_START,
  GET_INITIAL_NOTIFICATIONS_SUCCESS,
  SET_NOTIFICATION_AS_SEEN,
  ADD_LIVE_NOTIFICATION,
  GET_MORE_NOTIFICATIONS_SUCCESS,
} from './../actionTypes';

export const getNotificationStart = () => {
  return {
    type: GET_NOTIFICATIONS_START,
  };
};

export const getNotificationSuccess = (
  response: NotificationResponseShape,
  type: string,
) => {
  const { notifications, unseen } = response;

  const hasMoreNotifications = notifications.length < 5 ? false : true;

  return {
    type,
    notifications,
    totalUnseen: unseen,
    hasMoreNotifications,
  };
};

export const getNotificationFail = (error: Error) => {
  return {
    type: GET_NOTIFICATIONS_FAIL,
    error: error,
  };
};

export const getNotificationsRequest = (skip = 0) => (dispatch: Dispatch) => {
  if (skip === 0) dispatch(getNotificationStart());
  return axios
    .get('/user/notifications', { params: { skip } })
    .then(res => {
      const notificationResponse = res.data;
      const type =
        skip === 0
          ? GET_INITIAL_NOTIFICATIONS_SUCCESS
          : GET_MORE_NOTIFICATIONS_SUCCESS;
      dispatch(getNotificationSuccess(notificationResponse, type));
    })
    .catch(err => {
      dispatch(getNotificationFail(err));
    });
};

export const setNotificationAsSeenRequest = (notificationId: string) => (
  dispatch: Dispatch,
) => {
  return axios
    .put('/user/notifications', { notificationId })
    .then(res => {
      const { message } = res.data;
      dispatch({
        type: SET_NOTIFICATION_AS_SEEN,
        seenNotificationId: notificationId,
      });
    })
    .catch(err => {
      // TODO: ERROR HANDLING
      console.log(err);
    });
};

export const addLatestNotification = (
  latestNotification: NotificationResponseShape,
) => {
  const { notifications, unseen: totalUnseen } = latestNotification;
  const [notification] = notifications;

  return {
    type: ADD_LIVE_NOTIFICATION,
    latestNotification: notification,
    totalUnseen,
  };
};
