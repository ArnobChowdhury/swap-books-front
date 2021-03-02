import axios from '../../../axiosInstance';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'redux/reducers';

import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_START,
  AUTH_LOGOUT,
  AUTH_TOKEN_REFRESH,
  AUTH_REDIRECT_SUCCESS,
  UPDATE_USER_INFO,
} from './../actionTypes';

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authTokenRefresh = (
  accessToken: string,
  refreshToken: string,
  expirationDate: number,
) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('expirationDate', String(expirationDate));

  return {
    type: AUTH_TOKEN_REFRESH,
    accessToken,
    expirationDate,
  };
};

export const authSuccess = (
  accessToken: string,
  userId: string,
  expirationDate: number,
) => {
  return {
    type: AUTH_SUCCESS,
    accessToken,
    userId,
    expirationDate,
  };
};

export const updateUserInfo = (
  name: string | null,
  userCreationSuccessful: boolean,
  userLon: number | null,
  userLat: number | null,
) => {
  return {
    type: UPDATE_USER_INFO,
    name,
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
  return async (dispatch: Dispatch) => {
    const userId = localStorage.getItem('userId');
    return axios
      .post('/auth/logout', { userId })
      .then(() => {
        dispatch(updateUserInfo(null, false, null, null));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationDate');
        return dispatch({ type: AUTH_LOGOUT });
      })
      .catch(err => {
        // TODO Should we handle authLogout failed seperately from authLogin
        dispatch(authFail(err));
      });
  };
};

export const authRequest = (
  email: string,
  password: string,
  formikSetSubmitting: (submissionResolved: boolean) => void,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
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
        setShowModal(false);
        // todo how should we handle the message???
        const {
          name,
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
        dispatch(authSuccess(accessToken, userId, expirationDate));
        dispatch(updateUserInfo(name, true, userLon, userLat));
      })
      .catch(err => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        dispatch(authFail(err));
      });
  };
};

export const authRedirectSuccess = () => {
  return {
    type: AUTH_REDIRECT_SUCCESS,
  };
};

export const authCheckState = () => {
  return (dispatch: Dispatch) => {
    const accessToken = localStorage.getItem('accessToken');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId') || '';
    const today = new Date().getTime();
    if (accessToken && expirationDate && today < Number(expirationDate) && userId) {
      dispatch(authSuccess(accessToken, userId, Number(expirationDate)));
      const path = '/user';
      return axios
        .get(path)
        .then(res => {
          const { name, userLon, userLat } = res.data;
          dispatch(updateUserInfo(name, true, userLon, userLat));
        })
        .catch(err => {
          // @ts-ignore
          dispatch(authLogout());
        });
    }
  };
};
