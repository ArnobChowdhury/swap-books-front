import axios from '../../../axiosInstance';
import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
} from '../actionTypes';
import { Dispatch } from 'redux';

export const createUserStart = () => {
  return {
    type: CREATE_USER_START,
  };
};

export const createUserSuccess = () => {
  return {
    type: CREATE_USER_SUCCESS,
  };
};

export const createUserFail = (error: unknown) => {
  return {
    type: CREATE_USER_FAIL,
    error,
  };
};

export const createUserReq = (
  userName: string,
  email: string,
  password: string,
  userDOB: string,
  userSex: string,
  locationObj: Position,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  return (dispatch: Dispatch) => {
    dispatch(createUserStart());
    const userData = {
      userName,
      email,
      password,
      userDOB,
      userSex,
      locationObj,
    };

    return axios
      .post('/auth/signup', userData)
      .then(response => {
        formikSetSubmitting(false);
        const { message } = response.data;
        dispatch(createUserSuccess());
      })
      .catch(error => {
        dispatch(createUserFail(error));
      });
  };
};
