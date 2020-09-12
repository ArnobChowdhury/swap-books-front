import axios from '../../../axiosInstance';
import {
  FETCH_BOOKS_VISITING_PROFILE_START,
  FETCH_BOOKS_VISITING_PROFILE_FAIL,
  FETCH_BOOKS_VISITING_PROFILE_SUCCESS,
  FETCH_USER_VISITING_PROFILE_START,
  FETCH_USER_VISITING_PROFILE_FAIL,
  FETCH_USER_VISITING_PROFILE_SUCCESS,
} from '../actionTypes';
import { Dispatch } from 'redux';

export const fetchBooksVisitingProfileStart = () => {
  return {
    type: FETCH_BOOKS_VISITING_PROFILE_START,
  };
};

export const fetchBooksOfVisitingProfileSuccess = (userBooks: any) => {
  return {
    type: FETCH_BOOKS_VISITING_PROFILE_SUCCESS,
    userBooks,
  };
};

export const fetchBooksOfVisitingProfileFail = (error: Error) => {
  return {
    type: FETCH_BOOKS_VISITING_PROFILE_FAIL,
    error,
  };
};

export const fetchBooksOfVisitingProfileReq = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchBooksVisitingProfileStart());

    return axios
      .get(`/books/${userId}`)
      .then(response => {
        const { books } = response.data;
        console.log(books);
        dispatch(fetchBooksOfVisitingProfileSuccess(books));
      })
      .catch(error => {
        dispatch(fetchBooksOfVisitingProfileFail(error));
      });
  };
};

export const fetchUserOfVisitingProfileStart = () => {
  return {
    type: FETCH_USER_VISITING_PROFILE_START,
  };
};

export const fetchUserOfVisitingProfileSuccess = (userInfo: any) => {
  return {
    type: FETCH_USER_VISITING_PROFILE_SUCCESS,
    userInfo,
  };
};

export const fetchUserOfVisitingProfileFail = (error: Error) => {
  return {
    type: FETCH_USER_VISITING_PROFILE_FAIL,
    error,
  };
};

export const fetchUserOfVisitingProfileReq = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchBooksVisitingProfileStart());

    return axios
      .get(`/user/${userId}`)
      .then(response => {
        const { userInfo } = response.data;
        dispatch(fetchUserOfVisitingProfileSuccess(userInfo));
      })
      .catch(error => {
        dispatch(fetchUserOfVisitingProfileFail(error));
      });
  };
};
