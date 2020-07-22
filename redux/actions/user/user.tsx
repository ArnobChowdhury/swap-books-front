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
  name: string,
  email: string,
  password: string,
  dob: string,
  sex: string,
  locationObj: Position,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  console.log(locationObj);
  return (dispatch: Dispatch) => {
    dispatch(createUserStart());
    const userData = {
      name,
      email,
      password,
      dob,
      sex,
      locationObj: {
        latitude: locationObj.coords.latitude,
        longitude: locationObj.coords.longitude,
      },
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
