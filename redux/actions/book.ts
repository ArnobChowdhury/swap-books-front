import axios from 'axiosInstance';

import {
  ADD_A_BOOK_START,
  ADD_A_BOOK_SUCCESS,
  ADD_A_BOOK_FAIL,
} from './actionTypes';

export const addABookStart = () => {
  return {
    type: ADD_A_BOOK_START,
  };
};

export const addABookSuccess = () => {
  return {
    type: ADD_A_BOOK_SUCCESS,
  };
};

// todo take care of the parameter type later
export const addABookFail = (error: any) => {
  return {
    type: ADD_A_BOOK_FAIL,
    error: error,
  };
};

export const addABookRequest = (
  bookName: string,
  bookAuthor: string,
  bookPicture: any,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  // @ts-ignore
  return dispatch => {
    dispatch(addABookStart());
    const fd = new FormData();
    fd.append('bookName', bookName);
    fd.append('bookAuthor', bookAuthor);
    fd.append('bookPicture', bookPicture);
    // const path = 'http://localhost:4000/books/add-a-book';
    const path = '/books/add-a-book';
    axios
      .put(path, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        formikSetSubmitting(false);
        // todo how should we handle the message???
        const { message, bookId } = response.data;
        console.log(message, bookId);
        dispatch(addABookSuccess());
      })
      .catch(err => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        dispatch(addABookFail(err));
      });
  };
};
