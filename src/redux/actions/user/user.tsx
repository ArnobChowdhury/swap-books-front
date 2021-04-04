import axios from '../../../axiosInstance';
import { AxiosError } from 'axios';
import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  UPDATE_USER_LOC_START,
  UPDATE_USER_LOC_SUCCESS,
  UPDATE_USER_LOC_FAIL,
  CREATE_USER_REFRESH,
  VERIFY_EMAIL_START,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAIL,
} from '../actionTypes';
import { Dispatch } from 'redux';

export const createUserStart = () => {
  return {
    type: CREATE_USER_START,
  };
};

export const createUserSuccess = (userCreationSuccessfulMsg: string) => {
  return {
    type: CREATE_USER_SUCCESS,
    userCreationSuccessfulMsg,
  };
};

export const createUserFail = (userCreationError: {
  message: string;
  status: number;
}) => {
  return {
    type: CREATE_USER_FAIL,
    userCreationError,
  };
};

export const createUserReq = (
  name: string,
  email: string,
  password: string,
  ageConfirmation: boolean,
  termsConfirmation: boolean,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  return (dispatch: Dispatch) => {
    dispatch(createUserStart());
    const userData = {
      name,
      email,
      password,
      ageConfirmation,
      termsConfirmation,
    };

    return axios
      .post('/auth/signup', userData)
      .then(response => {
        formikSetSubmitting(false);
        const { message } = response.data;
        dispatch(createUserSuccess(message));
      })
      .catch((error: AxiosError<{ message: string }>) => {
        // TODO need to parse status and message here
        if (error.response) {
          const { data, status } = error.response;
          const { message } = data;
          if (status === 401) {
            dispatch(createUserFail({ message, status }));
          } else {
            dispatch(
              createUserFail({
                message: 'Something went wrong! Please try again in a bit!',
                status,
              }),
            );
          }
        }
      });
  };
};

export const createUserRefresh = () => {
  return {
    type: CREATE_USER_REFRESH,
  };
};

export const verifyEmailStart = () => {
  return {
    type: VERIFY_EMAIL_START,
  };
};

export const verifyEmailSuccess = (verifyEmailSuccessMsg: string) => {
  return {
    type: VERIFY_EMAIL_SUCCESS,
    verifyEmailSuccessMsg,
  };
};

export const verifyEmailFail = (verifyEmailErr: {
  message: string;
  status: number;
}) => {
  return {
    type: VERIFY_EMAIL_FAIL,
    verifyEmailErr,
  };
};

export const verifyEmailReq = (token: string) => {
  return (dispatch: Dispatch) => {
    dispatch(verifyEmailStart());
    return axios
      .post('/auth//mail-verify', { token })
      .then(res => {
        const { message } = res.data;
        dispatch(verifyEmailSuccess(message));
      })
      .catch((err: AxiosError<{ message: string }>) => {
        if (err.response) {
          const { data, status } = err.response;
          const { message } = data;
          if (status === 401) {
            dispatch(verifyEmailFail({ message, status }));
          } else {
            dispatch(verifyEmailFail({ message: 'Something went wrong!', status }));
          }
        }
      });
  };
};

const updateUserLocationStart = () => {
  return {
    type: UPDATE_USER_LOC_START,
  };
};

export const updateUserLocationSuccess = (userLon: number, userLat: number) => {
  return {
    type: UPDATE_USER_LOC_SUCCESS,
    userLon,
    userLat,
  };
};

const updateUserLocationFail = (locationUpdatetError: {
  message: string;
  status: number;
}) => {
  return {
    type: UPDATE_USER_LOC_FAIL,
    locationUpdatetError,
  };
};

export const updateUserLocationReq = (
  userLon: number,
  userLat: number,
  showModalFunc?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  return (dispatch: Dispatch) => {
    dispatch(updateUserLocationStart());
    const path = '/user/loc';
    const locData = { userLon, userLat };
    return axios
      .put(path, locData)
      .then(res => {
        const { userLon, userLat } = res.data;
        dispatch(updateUserLocationSuccess(userLon, userLat));
        if (showModalFunc) {
          showModalFunc(false);
        }
      })
      .catch(err => {
        // TODO need to parse message and status separately
        dispatch(updateUserLocationFail(err));
      });
  };
};
