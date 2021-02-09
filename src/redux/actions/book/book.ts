import axios from '../../../axiosInstance';
import { SOCKET_EXPRESS_INTEREST } from '../../../socketTypes';
import { BookShape } from '../../reducers/books';
import { Dispatch } from 'redux';

import {
  ADD_A_BOOK_START,
  ADD_A_BOOK_SUCCESS,
  ADD_A_BOOK_FAIL,
  FETCH_BOOKS_FAIL,
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  FETCH_MORE_BOOKS_SUCCESS,
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
  bookname: string,
  bookauthor: string,
  bookimage: any,
  formikSetSubmitting: (submissionResolved: boolean) => void,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(addABookStart());
    const fd = new FormData();
    fd.append('bookName', bookname);
    fd.append('bookAuthor', bookauthor);
    fd.append('bookImage', bookimage);
    const path = '/books/add';
    // todo below put method should be changed to post method.
    return axios
      .post(path, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        // todo how should we handle the message???
        const { message, bookId } = response.data;
        dispatch(addABookSuccess());
        formikSetSubmitting(false);
        setShowModal(false);
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

export const fetchBooksSuccess = (
  books: BookShape[],
  type: typeof FETCH_BOOKS_SUCCESS | typeof FETCH_MORE_BOOKS_SUCCESS,
  page: number,
) => {
  const hasMorePages = books.length < 6 ? false : true;
  return { type, books, page, hasMorePages };
};

export const fetchBooksFail = (error: any) => {
  return { type: FETCH_BOOKS_FAIL, error: error };
};

export const fetchBooksRequest = (
  userLon: number,
  userLat: number,
  page: number,
) => {
  return async (dispatch: Dispatch) => {
    // todo need to have state that the request has started. skipped for now
    dispatch(fetchBooksStart());

    const userId = localStorage.getItem('userId');

    const path = '/books';
    return axios
      .get(path, { params: { userLon, userLat, userId, page } })
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
            bookOwnerName: book.bookOwnerName,
            userIsInterested: book.isInterested,
            interestOnGoing: false,
            interestReqError: null,
          };
        });
        const type = page === 1 ? FETCH_BOOKS_SUCCESS : FETCH_MORE_BOOKS_SUCCESS;
        dispatch(fetchBooksSuccess(booksStructured, type, page));
      })
      .catch(err => {
        // todo need to check what kind of possible errors we can get???
        dispatch(fetchBooksFail(err));
      });
  };
};
// TODO Fix this when we fix USER page
export const fetchProfileBooksRequest = (profileId: string) => {
  return async (dispatch: Dispatch) => {
    // todo need to have state that the request has started. skipped for now
    dispatch(fetchBooksStart());

    const userId = localStorage.getItem('userId');

    const path = `/books/${profileId}`;
    return axios
      .get(path, { params: { userId } })
      .then(response => {
        const { books } = response.data;
        const booksStructured: BookShape[] = books.map((book: any) => {
          // todo - missing properties in below object
          // todo make an utility function for below code since this is getting re-used
          return {
            bookId: book._id,
            bookName: book.bookName,
            bookAuthor: book.bookAuthor,
            bookPicturePath: book.bookPicturePath,
            bookOwnerId: book.userId,
            bookOwnerName: book.bookOwnerName,
            userIsInterested: book.isInterested,
            interestOnGoing: false,
            interestReqError: null,
          };
        });
        // TODO This should be changed when I fix the user page
        //dispatch(fetchBooksSuccess(booksStructured));
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
  userName: string,
  bookId: string,
  bookName: string,
  bookOwnerId: string,
  bookOwnerName: string,
  isInterested: boolean,
) => {
  const userId = localStorage.getItem('userId');
  socket.emit(SOCKET_EXPRESS_INTEREST, {
    userId,
    userName,
    bookId,
    bookName,
    bookOwnerId,
    bookOwnerName,
    isInterested,
  });
  // TODO: can be a callback like notification
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
