import axios from 'axios';

import { AUTH_SUCCESS, AUTH_FAIL, AUTH_START, AUTH_LOGOUT } from './actionTypes';

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
  // things I want to do with logout like remove token from localStorage
  return {
    type: AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  // @ts-ignore
  return dispatch => {
    setTimeout(() => {
      dispatch(authLogout);
    }, expirationTime * 1000);
  };
};

export const authRequest = (
  email: string,
  password: string,
  isSignup: boolean,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  console.log('called this');
  // @ts-ignore
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      // todo do I really need returnSecureToken just to copy google??? BTW, I am not doing anything in the backend with this
      returnSecureToken: true,
    };
    const url = `http://localhost:4000/auth/${isSignup ? 'signup' : 'login'}`;
    const requestMethod = isSignup ? 'put' : 'post';
    axios[requestMethod](url, authData)
      .then(response => {
        formikSetSubmitting(false);
        // todo how should we handle the message???
        const { message, userId, token, expiresIn } = response.data;
        const expirationDate = new Date().getTime() + expiresIn * 1000;
        // todo I am certain that I do not want to save token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationDate', `${expirationDate}`);
        dispatch(authSuccess(token, userId));
        // dispatch(checkAuthTimeout) // todo what is this and why should we implement this???
      })
      .catch(err => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        dispatch(authFail(err));
      });
  };
};
