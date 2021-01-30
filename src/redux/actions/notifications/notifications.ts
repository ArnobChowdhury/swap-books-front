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
  GET_NOTIFICATIONS_SUCCESS,
  SET_NOTIFICATION_AS_SEEN,
  ADD_LATEST_NOTIFICATION,
} from './../actionTypes';

export const getNotificationStart = () => {
  return {
    type: GET_NOTIFICATIONS_START,
  };
};

const processNotificationForState = (notification: NotificationShapeOnTheServer) => {
  const { _id, participants, lastModified } = notification;
  const userId = localStorage.getItem('userId');
  const userIndex = notification.participants.findIndex(user => {
    return user.userId === userId;
  });
  const interestedUserIndex = userIndex === 0 ? 1 : 0;

  const interestsOfThisUser = participants[interestedUserIndex].interests;
  const interestsOfInterestedUser = participants[userIndex].interests;

  let notificationType: NotificationShape['notificationType'];
  if (
    interestsOfThisUser &&
    interestsOfInterestedUser &&
    interestsOfThisUser.length > 0 &&
    interestsOfInterestedUser.length > 0
  ) {
    notificationType = 'match';
  } else {
    notificationType = 'interest';
  }

  return {
    _id,
    interestedUserId: participants[interestedUserIndex].userId,
    interestedUserName: participants[interestedUserIndex].userName,
    notificationType,
    interestsOfInterestedUser,
    interestsOfThisUser,
    seen: participants[userIndex].interestSeen,
    lastModified,
  };
};

export const getNotificationSuccess = (response: NotificationResponseShape) => {
  const { notifications: notificationsFromServer, unseen } = response;
  const notifications: NotificationShape[] = notificationsFromServer.map(
    processNotificationForState,
  );

  const hasMoreNotifications = notifications.length < 5 ? false : true;

  return {
    type: GET_NOTIFICATIONS_SUCCESS,
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
      dispatch(getNotificationSuccess(notificationResponse));
    })
    .catch(err => {
      dispatch(getNotificationFail(err));
    });
};

export const setNotificationAsSeenRequest = (roomId: string) => (
  dispatch: Dispatch,
) => {
  return axios.put('user/notifications', { roomId }).then(res => {
    const { message } = res.data;
    dispatch({ type: SET_NOTIFICATION_AS_SEEN, seenNotificationId: roomId });
  });
};

export const addLatestNotification = (notification: NotificationResponseShape) => {
  const { notifications, unseen: totalUnseen } = notification;
  const notificationProcessedForState = processNotificationForState(
    notifications[0],
  );

  return {
    type: ADD_LATEST_NOTIFICATION,
    latestNotification: notificationProcessedForState,
    totalUnseen,
  };
};
