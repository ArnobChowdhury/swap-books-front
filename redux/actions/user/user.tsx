import axios from '../../../axiosInstance';
import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  UPDATE_USER_LOC_START,
  UPDATE_USER_LOC_SUCCESS,
  UPDATE_USER_LOC_FAIL,
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
  name: string,
  email: string,
  password: string,
  dob: string,
  sex: string,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  return (dispatch: Dispatch) => {
    dispatch(createUserStart());
    const userData = {
      name,
      email,
      password,
      dob,
      sex,
    };

    return axios
      .post('/auth/signup', userData)
      .then(response => {
        formikSetSubmitting(false);
        const { message, userId } = response.data;
        dispatch(createUserSuccess());
      })
      .catch(error => {
        dispatch(createUserFail(error));
      });
  };
};

const updateUserLocationStart = () => {
  return {
    type: UPDATE_USER_LOC_START,
  };
};

const updateUserLocationSuccess = (userLon: number, userLat: number) => {
  return {
    type: UPDATE_USER_LOC_SUCCESS,
    userLon,
    userLat,
  };
};

const updateUserLocationFail = (err: Error) => {
  return {
    type: UPDATE_USER_LOC_FAIL,
    error: err,
  };
};

export const updateUserLocationReq = (userLon: number, userLat: number) => {
  return (dispatch: Dispatch) => {
    dispatch(updateUserLocationStart());
    const path = '/user/loc';
    const locData = { userLon, userLat };
    return axios
      .put(path, locData)
      .then(res => {
        const { userLon, userLat } = res.data;
        dispatch(updateUserLocationSuccess(userLon, userLat));
      })
      .catch(err => {
        dispatch(updateUserLocationFail(err));
      });
  };
};
