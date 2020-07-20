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

export const createUserSuccess = (name: string, dob: string, sex: string) => {
  return {
    type: CREATE_USER_SUCCESS,
    name,
    dob,
    sex,
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
  userDOB: string,
  userSex: string,
  locationObj: Position,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  return (dispatch: Dispatch) => {
    dispatch(createUserStart());
    const userData = {
      userName,
      userDOB,
      userSex,
      locationObj,
    };

    return axios
      .post('/user-details', userData)
      .then(response => {
        formikSetSubmitting(false);
        const { userName: name, userDOB: dob, userSex: sex } = response.data;
        dispatch(createUserSuccess(name, dob, sex));
      })
      .catch(error => {
        dispatch(createUserFail(error));
      });
  };
};
