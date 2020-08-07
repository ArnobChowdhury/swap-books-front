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

export const authSuccess = (token: string, userId: string) => {
  return {
    type: AUTH_SUCCESS,
    token,
    userId,
  };
};

export const updateUserInfo = (
  name: string | null,
  dob: string | null,
  sex: string | null,
) => {
  return {
    type: UPDATE_USER_INFO,
    name,
    dob,
    sex,
  };
};

export const authFail = (error: any) => {
  return {
    type: AUTH_FAIL,
    error: error,
  };
};

export const authLogout = () => {
  return (dispatch: Dispatch) => {
    dispatch(updateUserInfo(null, null, null));
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    return dispatch({ type: AUTH_LOGOUT });
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
  return (dispatch: Dispatch) => {
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
        const { name, dob, sex, userId, token, expiresIn } = response.data;

        const expirationDate = new Date().getTime() + expiresIn * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationDate', `${expirationDate}`);
        dispatch(authSuccess(token, userId));
        dispatch(updateUserInfo(name, dob, sex));

        // @ts-ignore
        dispatch(checkAuthTimeout(expiresIn)); // todo what is this and why should we implement this???
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
    const token = localStorage.getItem('token');
    if (!token) {
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
        return dispatch(authSuccess(token, userId));
      }
    }
  };
};
