import axios from '../../../axiosInstance';
import { BookShape } from '../../reducers/books';

import {
  ADD_A_BOOK_START,
  ADD_A_BOOK_SUCCESS,
  ADD_A_BOOK_FAIL,
  FETCH_BOOKS_FAIL,
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  EXPRESS_INTEREST_START,
  EXPRESS_INTEREST_SUCCESS,
  EXPRESS_INTEREST_FAIL,
} from './../actionTypes';

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
    const userId = localStorage.getItem('userId');
    const fd = new FormData();
    fd.append('bookName', bookName);
    fd.append('bookAuthor', bookAuthor);
    fd.append('bookPicture', bookPicture);
    // what if the user is not signed in???
    if (userId) {
      fd.append('userId', userId);
    }
    // const path = 'http://localhost:4000/books/add-a-book';
    const path = '/books/add-a-book';
    // todo below put method should be changed to post method.
    return axios
      .post(path, fd, {
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

    const userId = localStorage.getItem('userId');

    const path = '/books';
    return axios
      .get(path, { params: { userId } })
      .then(response => {
        const { message, books } = response.data;
        const booksStructured: BookShape[] = books.map((book: any) => {
          // todo - missing properties in below object
          return {
            bookId: book._id,
            bookName: book.bookName,
            bookAuthor: book.bookAuthor,
            bookPicturePath: book.bookPicturePath,
            bookOwnerId: book.userId,
            userIsInterested: book.isInterested,
            interestOnGoing: false,
            interestReqError: null,
          };
        });
        dispatch(fetchBooksSuccess(booksStructured));
      })
      .catch(err => {
        // todo need to check what kind of possible errors we can get???
        dispatch(fetchBooksFail(err));
      });
  };
};

// todo write tests for expressInterest related functions

export const expressInterestStart = (
  socket: SocketIOClient.Socket,
  bookId: string,
) => {
  const userId = localStorage.getItem('userId');
  socket.emit('express interest', { userId, bookId });

  return { type: EXPRESS_INTEREST_START, interestActivity: { bookId } };
};

export const expressInterestFail = (bookId: string, err: any) => {
  return { type: EXPRESS_INTEREST_FAIL, interestActivity: { bookId, err } };
};

export const expressInterestSuccess = (bookId: string, isInterested: boolean) => {
  return {
    type: EXPRESS_INTEREST_SUCCESS,
    interestActivity: { bookId, isInterested },
  };
};
