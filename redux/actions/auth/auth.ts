import axios from '../../../axiosInstance';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'redux/reducers';

import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_START,
  AUTH_LOGOUT,
  UPDATE_USER_INFO,
} from './../actionTypes';

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authSuccess = (accessToken: string, userId: string) => {
  return {
    type: AUTH_SUCCESS,
    accessToken,
    userId,
  };
};

export const updateUserInfo = (
  name: string | null,
  dob: string | null,
  sex: string | null,
  userCreationSuccessful: boolean,
  userLon: number | null,
  userLat: number | null,
) => {
  return {
    type: UPDATE_USER_INFO,
    name,
    dob,
    sex,
    userCreationSuccessful,
    userLon,
    userLat,
  };
};

export const authFail = (error: Error) => {
  return {
    type: AUTH_FAIL,
    error: error,
  };
};

export const authLogout = () => {
  // TODO need to send a request to back end in order to blacklist the refreshToken
  return async (dispatch: Dispatch) => {
    const userId = localStorage.getItem('userId');
    return axios
      .post('/auth/logout', { userId })
      .then(res => {
        dispatch(updateUserInfo(null, null, null, false, null, null));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationDate');
        return dispatch({ type: AUTH_LOGOUT });
      })
      .catch(err => {
        // TODO Should we handle authLogout faile seperately
        dispatch(authFail(err));
      });
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      // @ts-ignore
      dispatch(authLogout());
    }, expirationTime * 1000);
  };
};

export const authRequest = (
  email: string,
  password: string,
  formikSetSubmitting: (submissionResolved: boolean) => void,
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch: Dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
    };
    const url = '/auth/login';
    return axios
      .post(url, authData)
      .then(response => {
        formikSetSubmitting(false);
        // todo how should we handle the message???
        const {
          name,
          dob,
          sex,
          userId,
          accessToken,
          refreshToken,
          expiresIn,
          userLon,
          userLat,
        } = response.data;

        const expirationDate = new Date().getTime() + expiresIn * 1000;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationDate', `${expirationDate}`);
        dispatch(authSuccess(accessToken, userId));
        dispatch(updateUserInfo(name, dob, sex, true, userLon, userLat));

        // @ts-ignore
        dispatch(checkAuthTimeout(expiresIn)); // todo what is this and why should we implement this??? answer: we do not need to implement this. Get rid of this.
      })
      .catch(err => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch: Dispatch) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // @ts-ignore
      return dispatch(authLogout());
    } else {
      const expirationDate = new Date(
        Number(localStorage.getItem('expirationDate')),
      );
      if (expirationDate <= new Date()) {
        // @ts-ignore
        return dispatch(authLogout());
      } else {
        //                                     below "|| ''" code is just for type assertion
        const userId = localStorage.getItem('userId') || '';
        return dispatch(authSuccess(accessToken, userId));
      }
    }
  };
};
