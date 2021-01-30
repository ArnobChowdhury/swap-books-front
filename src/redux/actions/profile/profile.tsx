import axios from '../../../axiosInstance';
import {
  FETCH_PROFILE_START,
  FETCH_PROFILE_FAIL,
  FETCH_PROFILE_SUCCESS,
} from '../actionTypes';
import { Dispatch } from 'redux';

export const fetchProfileStart = () => {
  return {
    type: FETCH_PROFILE_START,
  };
};

export const fetchProfileSuccess = (userInfo: any) => {
  return {
    type: FETCH_PROFILE_SUCCESS,
    userInfo,
  };
};

export const fetchProfileFail = (error: Error) => {
  return {
    type: FETCH_PROFILE_FAIL,
    error,
  };
};

export const fetchProfileReq = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProfileStart());

    return axios
      .get(`/user/${userId}`, { params: { userId } })
      .then(response => {
        const { userInfo } = response.data;
        dispatch(fetchProfileSuccess(userInfo));
      })
      .catch(error => {
        dispatch(fetchProfileFail(error));
      });
  };
};
