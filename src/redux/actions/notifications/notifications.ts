import { NotificationResponseShape } from 'redux/reducers/notifications';
import { Dispatch } from 'redux';
import axios from 'axiosInstance';
import { SOCKET_SWAP_CONSENT } from 'socketTypes';
import { Socket } from 'socket.io-client';
import { makeUnavailableSuccess } from 'redux/actions/book';

import {
  GET_NOTIFICATIONS_FAIL,
  GET_NOTIFICATIONS_START,
  GET_INITIAL_NOTIFICATIONS_SUCCESS,
  SET_NOTIFICATION_AS_SEEN,
  ADD_LIVE_NOTIFICATION,
  GET_MORE_NOTIFICATIONS_SUCCESS,
  SWAP_CONSENT_REQUEST_START,
  SWAP_CONSENT_REQUEST_SUCCESS,
  SWAP_CONSENT_REQUEST_FAIL,
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

const swapConsentStart = (
  notificationIdForSwapConsent: string,
  swapConsentForBookId: string,
) => {
  return {
    type: SWAP_CONSENT_REQUEST_START,
    notificationIdForSwapConsent,
    swapConsentForBookId,
  };
};

const swapConsentSuccess = (
  notificationIdForSwapConsent: string,
  statusOfSwapConsent: 'approved' | 'pending' | 'rejected',
) => {
  return {
    type: SWAP_CONSENT_REQUEST_SUCCESS,
    notificationIdForSwapConsent,
    statusOfSwapConsent,
  };
};

const swapConsentFail = (
  notificationIdForSwapConsent: string,
  errorForSwapConsent: { message: string; status: number },
) => {
  return {
    type: SWAP_CONSENT_REQUEST_FAIL,
    notificationIdForSwapConsent,
    errorForSwapConsent,
  };
};

export const swapConsentRequest = (
  socket: Socket,
  notificationId: string,
  bookId: string,
  hasAccepted: boolean,
) => {
  return (dispatch: Dispatch) => {
    dispatch(swapConsentStart(notificationId, bookId));
    socket.emit(
      SOCKET_SWAP_CONSENT,
      notificationId,
      bookId,
      hasAccepted,
      (isSuccess: boolean) => {
        const status = hasAccepted ? 'approved' : 'rejected';
        if (isSuccess) {
          dispatch(swapConsentSuccess(notificationId, status));
          if (hasAccepted) dispatch(makeUnavailableSuccess(bookId));
        } else {
          dispatch(
            swapConsentFail(notificationId, {
              message: 'Failed. Try again later.',
              status: 401,
            }),
          );
        }
      },
    );
  };
};
