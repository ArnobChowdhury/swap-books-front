import {
  NotificationResponseShape,
  NotificationShape,
} from 'redux/reducers/notifications';
import { SOCKET_GET_NOTIFICATION } from '../../../socketTypes';
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
  notificationsFromServer: NotificationResponseShape[],
) => {
  // console.log(notifications);
  const userId = localStorage.getItem('userId');
  const notifications: NotificationShape[] = notificationsFromServer.map(
    notification => {
      const { _id, participants } = notification;
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
      };
    },
  );

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
  page: number,
) => (dispatch: Dispatch) => {
  dispatch(getNotificationStart());
  return socket.emit(
    SOCKET_GET_NOTIFICATION,
    { userId, page },
    (notifications: NotificationResponseShape[]) => {
      dispatch(getNotificationSuccess(notifications));
    },
  );
};
