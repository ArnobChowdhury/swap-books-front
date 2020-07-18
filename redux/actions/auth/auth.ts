import axios from '../../../axiosInstance';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'redux/reducers';

import { AUTH_SUCCESS, AUTH_FAIL, AUTH_START, AUTH_LOGOUT } from './../actionTypes';

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

// todo take care of the types
export const authSuccess = (token: string, userId: string) => {
  return {
    type: AUTH_SUCCESS,
    token,
    userId,
  };
};

// todo take care of the parameter type later
export const authFail = (error: any) => {
  return {
    type: AUTH_FAIL,
    error: error,
  };
};

export const authLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('expirationDate');
  return {
    type: AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime * 1000);
  };
};

export const authRequest = (
  email: string,
  password: string,
  isSignup: boolean,
  formikSetSubmitting: (submissionResolved: boolean) => void,
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return (dispatch: Dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      // todo do I really need returnSecureToken just to copy google??? BTW, I am not doing anything in the backend with this
      returnSecureToken: true,
    };
    const url = `/auth/${isSignup ? 'signup' : 'login'}`;
    return axios
      .post(url, authData)
      .then(response => {
        formikSetSubmitting(false);
        // todo how should we handle the message???
        const { userId, token, expiresIn } = response.data;
        const expirationDate = new Date().getTime() + expiresIn * 1000;
        // todo I am certain that I do not want to save token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationDate', `${expirationDate}`);
        dispatch(authSuccess(token, userId));
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
      return dispatch(authLogout());
    } else {
      const expirationDate = new Date(
        Number(localStorage.getItem('expirationDate')),
      );
      if (expirationDate <= new Date()) {
        return dispatch(authLogout());
      } else {
        //                                     below "|| ''" code is just for type assertion
        const userId = localStorage.getItem('userId') || '';
        return dispatch(authSuccess(token, userId));
      }
    }
  };
};
