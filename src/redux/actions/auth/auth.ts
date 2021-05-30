import { Dispatch as ReactDispatch, SetStateAction } from 'react';
import axios from '../../../axiosInstance';
import { AxiosError } from 'axios';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'redux/reducers';
import {
  HOME_ROUTE,
  MESSAGES_ROUTE,
  NOTIFICATIONS_ROUTE,
  USER_ROUTE,
} from 'frontEndRoutes';

import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_START,
  AUTH_LOGOUT,
  AUTH_TOKEN_REFRESH,
  AUTH_REDIRECT_SUCCESS,
  AUTH_REDIRECT_START,
  AUTH_ERROR_REFRESH,
  UPDATE_USER_INFO,
  FORGOT_PASS_START,
  FORGOT_PASS_FAIL,
  FORGOT_PASS_SUCCESS,
  RESET_PASS_START,
  RESET_PASS_SUCCESS,
  RESET_PASS_FAIL,
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
  booksAvailableToSwap: number,
  booksSwapped: number,
) => {
  return {
    type: UPDATE_USER_INFO,
    name,
    userCreationSuccessful,
    userLon,
    userLat,
    booksAvailableToSwap,
    booksSwapped,
  };
};

export const authFail = (error: { message: string; status: number }) => {
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
        dispatch(updateUserInfo(null, false, null, null, 0, 0));
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

export const authLogoutForOtherTabs = () => {
  return { type: AUTH_LOGOUT };
};

export const authRedirectSuccess = () => {
  return {
    type: AUTH_REDIRECT_SUCCESS,
  };
};

export const authRedirectStart = (authRedirectPath: string) => {
  return {
    type: AUTH_REDIRECT_START,
    authRedirectPath,
  };
};

export const authRequest = (
  email: string,
  password: string,
  formikSetSubmitting: (submissionResolved: boolean) => void,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  currentPath: string,
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
          booksAvailableToSwap,
          booksSwapped,
        } = response.data;

        const expirationDate = new Date().getTime() + expiresIn * 1000;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationDate', `${expirationDate}`);
        dispatch(authSuccess(accessToken, userId, expirationDate));
        dispatch(
          updateUserInfo(
            name,
            true,
            !userLon ? null : userLon,
            !userLat ? null : userLat,
            booksAvailableToSwap,
            booksSwapped,
          ),
        );
        const noRedirectRoutes = [
          HOME_ROUTE,
          MESSAGES_ROUTE,
          NOTIFICATIONS_ROUTE,
          USER_ROUTE,
        ];
        if (!noRedirectRoutes.includes(currentPath)) {
          dispatch(authRedirectStart('/'));
        }
      })
      .catch((err: AxiosError<{ message: string }>) => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        if (err.response) {
          const { data, status } = err.response;
          const { message } = data;
          if (status === 401) {
            dispatch(authFail({ message, status }));
          } else {
            dispatch(
              authFail({
                message: 'Something went wrong! Please try again!',
                status,
              }),
            );
          }
        }
      });
  };
};

export const authCheckState = () => {
  return (dispatch: Dispatch) => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId') || '';
    if (accessToken && userId) {
      const path = '/user';
      return axios
        .get(path)
        .then(res => {
          const {
            name,
            userLon,
            userLat,
            booksAvailableToSwap,
            booksSwapped,
          } = res.data;
          const expirationDate = localStorage.getItem('expirationDate');
          dispatch(authSuccess(accessToken, userId, Number(expirationDate)));
          dispatch(
            updateUserInfo(
              name,
              true,
              !userLon ? null : userLon,
              !userLat ? null : userLat,
              booksAvailableToSwap,
              booksSwapped,
            ),
          );
        })
        .catch(err => {
          // @ts-ignore
          dispatch(authLogout());
        });
    }
  };
};

export const authErrorRefresh = () => {
  return { type: AUTH_ERROR_REFRESH };
};

const forgotPasswordStart = () => {
  return {
    type: FORGOT_PASS_START,
  };
};

const forgotPasswordSuccess = (message: string) => {
  return {
    type: FORGOT_PASS_SUCCESS,
    forgotPassMsg: message,
  };
};

const forgotPasswordFail = (err: { message: string; status: number }) => {
  return {
    type: FORGOT_PASS_FAIL,
    forgotPassErr: err,
  };
};

export const forgotPasswordReq = (
  email: string,
  formikSetSubmitting: (submissionResolved: boolean) => void,
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch: Dispatch) => {
    dispatch(forgotPasswordStart());

    const url = '/auth/forgot-password';
    return axios
      .post(url, { email })
      .then(response => {
        formikSetSubmitting(false);
        const { message } = response.data;

        dispatch(forgotPasswordSuccess(message));
      })
      .catch((err: AxiosError<{ message: string }>) => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        if (err.response) {
          const { data, status } = err.response;
          const { message } = data;
          if (status === 401) {
            dispatch(forgotPasswordFail({ message, status }));
          } else {
            dispatch(
              forgotPasswordFail({
                message: 'Something went wrong! Please try again!',
                status,
              }),
            );
          }
        }
      });
  };
};

const resetPasswordStart = () => {
  return {
    type: RESET_PASS_START,
  };
};

const resetPasswordSuccess = (message: string) => {
  return {
    type: RESET_PASS_SUCCESS,
    resetPassMsg: message,
  };
};

const resetPasswordFail = (err: { message: string; status: number }) => {
  return {
    type: RESET_PASS_FAIL,
    resetPassErr: err,
  };
};

export const resetPasswordReq = (
  id: string,
  password: string,
  token: string,
  formikSetSubmitting: (submissionResolved: boolean) => void,
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch: Dispatch) => {
    dispatch(resetPasswordStart());

    const url = '/auth/reset-password';
    return axios
      .post(url, { id, password, token })
      .then(response => {
        formikSetSubmitting(false);
        const { message } = response.data;

        dispatch(resetPasswordSuccess(message));
      })
      .catch((err: AxiosError<{ message: string }>) => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        if (err.response) {
          const { data, status } = err.response;
          const { message } = data;
          if (status === 401) {
            dispatch(resetPasswordFail({ message, status }));
          } else {
            dispatch(
              resetPasswordFail({
                message: 'Something went wrong! Please try again!',
                status,
              }),
            );
          }
        }
      });
  };
};

export const checkResetPasswordLinkReq = (
  id: string,
  token: string,
  setIsValidLink: ReactDispatch<SetStateAction<boolean>>,
  setLinkCheckOngoing: ReactDispatch<SetStateAction<boolean>>,
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch: Dispatch) => {
    const url = '/auth/check-reset-password-link';
    return axios
      .post(url, { id, token })
      .then(response => {
        console.log(response);
        setIsValidLink(true);
        setLinkCheckOngoing(false);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        setIsValidLink(false);
        setLinkCheckOngoing(false);
        if (err.response) {
          const { data, status } = err.response;
          const { message } = data;
          if (status === 401) {
            dispatch(resetPasswordFail({ message, status }));
          } else {
            dispatch(
              resetPasswordFail({
                message: 'Something went wrong! Please try again!',
                status,
              }),
            );
          }
        }
      });
  };
};
