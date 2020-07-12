import axios from 'axiosInstance';

import {
  ADD_A_BOOK_START,
  ADD_A_BOOK_SUCCESS,
  ADD_A_BOOK_FAIL,
  FETCH_BOOKS_FAIL,
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
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

// todo store needs to update after request success and failure
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
        dispatch(addABookSuccess());
      })
      .catch(err => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        dispatch(addABookFail(err));
      });
  };
};

export const fetchBooksStart = () => {
  return { type: FETCH_BOOKS_START };
};

export const fetchBooksSuccess = (books: any) => {
  return { type: FETCH_BOOKS_SUCCESS, books: books };
};

export const fetchBooksFail = (error: any) => {
  return { type: FETCH_BOOKS_FAIL, error: error };
};

export const fetchBooksRequest = () => {
  // @ts-ignore
  return dispatch => {
    // todo need to have state that the request has started. skipped for now
    dispatch(fetchBooksStart());

    const path = '/books';
    axios
      .get(path)
      .then(response => {
        const { message, books } = response.data;
        dispatch(fetchBooksSuccess(books));
      })
      .catch(err => {
        // todo need to check what kind of possible errors we can get???
        dispatch(fetchBooksFail(err));
      });
  };
};
