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

export const fetchProfileSuccess = (
  profileName: string,
  numberOfbooksAvailable: number,
  booksSwapped: number,
) => {
  return {
    type: FETCH_PROFILE_SUCCESS,
    profileName,
    numberOfbooksAvailable,
    booksSwapped,
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
      .get(`/user/profile`, { params: { userId } })
      .then(response => {
        const { userName, numberOfbooksAvailable, booksSwapped } = response.data;
        dispatch(
          fetchProfileSuccess(userName, numberOfbooksAvailable, booksSwapped),
        );
      })
      .catch(error => {
        // TODO: ERROR HANDLING
        dispatch(fetchProfileFail(error));
      });
  };
};
