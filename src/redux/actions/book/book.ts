import axios from '../../../axiosInstance';
import { SOCKET_EXPRESS_INTEREST, SOCKET_SWAP_REQUEST } from '../../../socketTypes';
import { BookShape } from '../../reducers/books';
import { Dispatch } from 'redux';
import { Socket } from 'socket.io-client';
import {
  ADD_A_BOOK_START,
  ADD_A_BOOK_SUCCESS,
  ADD_A_BOOK_FAIL,
  ADD_A_BOOK_REFRESH,
  FETCH_BOOKS_FAIL,
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  FETCH_BOOKS_RESET,
  FETCH_MORE_BOOKS_SUCCESS,
  EXPRESS_INTEREST_START,
  EXPRESS_INTEREST_SUCCESS,
  EXPRESS_INTEREST_FAIL,
  MAKE_UNAVAILABLE_START,
  MAKE_UNAVAILABLE_SUCCESS,
  MAKE_UNAVAILABLE_FAIL,
  AVAILABLE_TEN_MORE_DAYS_START,
  AVAILABLE_TEN_MORE_DAYS_SUCCESS,
  AVAILABLE_TEN_MORE_DAYS_FAIL,
  AVAILABLE_TEN_MORE_DAYS_REFRESH,
  EDIT_BOOK_SET,
  EDIT_BOOK_START,
  EDIT_BOOK_SUCCESS,
  EDIT_BOOK_FAIL,
  EDIT_BOOK_REFRESH,
  FETCH_MATCHES_FOR_A_BOOK_SET,
  FETCH_MATCHES_FOR_A_BOOK_START,
  FETCH_MATCHES_FOR_A_BOOK_SUCCESS,
  FETCH_MATCHES_FOR_A_BOOK_FAIL,
  FETCH_MATCHES_FOR_A_BOOK_RESET,
  FETCH_MATCHED_BOOKS_START,
  FETCH_MATCHED_BOOKS_SUCCESS,
  FETCH_MATCHED_BOOKS_FAIL,
  FETCH_MATCHED_BOOKS_RESET,
  SENDING_SWAP_REQUEST_START,
  SENDING_SWAP_REQUEST_SUCCESS,
  SENDING_SWAP_REQUEST_FAIL,
  SENDING_SWAP_REQUEST_RESET,
  SWAP_REQUEST_GOT_ACCEPTED,
} from './../actionTypes';
import { AxiosError } from 'axios';

export const addABookStart = () => {
  return {
    type: ADD_A_BOOK_START,
  };
};

export const addABookSuccess = (
  addBookReqSuccessMsg: string,
  addedBook: BookShape | undefined,
) => {
  return {
    type: ADD_A_BOOK_SUCCESS,
    addedBook,
    addBookReqSuccessMsg,
  };
};

// todo take care of the parameter type later
export const addABookFail = (addBookReqErr: { message: string; status: number }) => {
  return {
    type: ADD_A_BOOK_FAIL,
    addBookReqErr,
  };
};

// todo store needs to update after request success and failure
export const addABookRequest = (
  bookname: string,
  bookauthor: string,
  bookimage: any,
  isHomePage: boolean,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(addABookStart());

    const fd = new FormData();
    const createdAt = String(new Date().getTime());

    fd.append('bookName', bookname);
    fd.append('bookAuthor', bookauthor);
    fd.append('bookImage', bookimage);
    fd.append('createdAt', createdAt);

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
        const { message, book } = response.data;
        const { bookId, validTill } = book;
        const bookProcessed = processBooks(book);
        dispatch(addABookSuccess(message, isHomePage ? bookProcessed : undefined));
        // @ts-ignore
        dispatch(makeBookStale(bookId, validTill));
        // TODO MAKE A NEW EVENT ADD_NEW_BOOK_TO_FEED
        formikSetSubmitting(false);
      })
      .catch((err: AxiosError<AxiosError<{ message: string }>>) => {
        formikSetSubmitting(false);
        // todo need to check what kind of possible errors we can get???
        if (err.response) {
          const { status, data } = err.response;
          const { message } = data;
          if (status === 403) {
            dispatch(addABookFail({ message, status }));
          } else {
            dispatch(
              addABookFail({
                message: 'Something went wrong! Please try again!',
                status,
              }),
            );
          }
        }
      });
  };
};

export const addABookRefresh = () => {
  return { type: ADD_A_BOOK_REFRESH };
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

export const fetchBooksReset = () => {
  return { type: FETCH_BOOKS_RESET };
};

const makeBookStale = (unavilableBookId: string, expiryDate: string) => {
  return async (dispath: Dispatch) => {
    const timeLeft = new Date(expiryDate).getTime() - new Date().getTime();
    setTimeout(() => {
      dispath({
        type: MAKE_UNAVAILABLE_SUCCESS,
        unavilableBookId,
      });
    }, timeLeft);
  };
};

/**
 * TODO: For later
 * This Book interface can be combined with the interface of the backend
 * when we are sending the data
 */
const processBooks = ({
  _id,
  bookName,
  bookAuthor,
  bookPicturePath,
  userId,
  bookOwnerName,
  isInterested,
  validTill,
  swapRequested,
}: {
  _id: string;
  bookName: string;
  bookAuthor: string;
  bookPicturePath: string;
  userId: string;
  bookOwnerName: string;
  isInterested: boolean;
  validTill: string;
  swapRequested: boolean;
}) => {
  return {
    bookId: _id,
    bookName,
    bookAuthor,
    bookPicturePath,
    bookOwnerId: userId,
    bookOwnerName,
    userIsInterested: isInterested,
    reqOnGoing: false,
    reqError: null,
    validTill,
    availableTenMoreDaysReqOnGoing: false,
    availableTenMoreDaysSuccessMsg: null,
    availableTenMoreDaysErr: null,
    swapRequested,
  };
};

interface FetchBookProps {
  page: number;
  location?: { userLat: number; userLon: number };
  profileId?: string;
  swapRequested?: boolean;
}

export const fetchBooksRequest = ({
  page,
  location,
  profileId,
  swapRequested,
}: FetchBookProps) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchBooksStart());

    const userId = localStorage.getItem('userId');

    let path, params;
    if (location) {
      const { userLat, userLon } = location;
      path = '/books';
      params = {
        userLon,
        userLat,
        userId,
        page,
      };
    } else {
      path = `/books/${profileId}`;
      params = { userId, page, swapRequested };
    }

    return axios
      .get(path, { params })
      .then(response => {
        const { books } = response.data;
        const booksStructured: BookShape[] = books.map(processBooks);
        const booksFiltered = booksStructured.filter(book => {
          const { validTill } = book;
          const timeNow = new Date().getTime();
          const expiry = new Date(validTill).getTime();
          return timeNow < expiry;
        });
        booksFiltered.forEach(book => {
          const { bookId, validTill } = book;
          // @ts-ignore
          dispatch(makeBookStale(bookId, validTill));
        });
        const type = page === 1 ? FETCH_BOOKS_SUCCESS : FETCH_MORE_BOOKS_SUCCESS;
        dispatch(fetchBooksSuccess(booksFiltered, type, page));
      })
      .catch(err => {
        // todo need to check what kind of possible errors we can get???
        dispatch(fetchBooksFail(err));
      });
  };
};

// todo write tests for expressInterest related functions
export const expressInterestStart = (
  socket: Socket,
  bookId: string,
  bookOwnerId: string,
  isInterested: boolean,
) => {
  // TODO Stop retrieving userId from localStorage // Since Our backend should already know from socket
  const userId = localStorage.getItem('userId');
  socket.emit(SOCKET_EXPRESS_INTEREST, isInterested, {
    userId,
    bookId,
    bookOwnerId,
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

const makeUnavailableStart = (bookId: string) => {
  return {
    type: MAKE_UNAVAILABLE_START,
    unavilableBookId: bookId,
  };
};

export const makeUnavailableSuccess = (bookId: string) => {
  return {
    type: MAKE_UNAVAILABLE_SUCCESS,
    unavilableBookId: bookId,
  };
};

const makeUnavailableFail = (bookId: string, err: Error) => {
  return {
    type: MAKE_UNAVAILABLE_FAIL,
    unavilableBookId: bookId,
    unavilableErr: err,
  };
};

export const makeUnavailableRequest = (bookId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(makeUnavailableStart(bookId));
    const path = '/books/del';
    return axios
      .delete(path, { data: { bookId } })
      .then(res => {
        dispatch(makeUnavailableSuccess(bookId));
      })
      .catch(err => {
        dispatch(makeUnavailableFail(bookId, err));
      });
  };
};

const availableTenMoreDaysStart = (availableTenDaysBookId: string) => {
  return {
    type: AVAILABLE_TEN_MORE_DAYS_START,
    availableTenDaysBookId,
  };
};

const availableTenMoreDaysSuccess = (
  availableTenDaysBookId: string,
  availableTenDaysExpiry: string,
  availableTenMoreDaysSuccessMsg: string,
) => {
  return {
    type: AVAILABLE_TEN_MORE_DAYS_SUCCESS,
    availableTenDaysBookId,
    availableTenDaysExpiry,
    availableTenMoreDaysSuccessMsg,
  };
};

const availableTenMoreDaysFail = (
  availableTenDaysBookId: string,
  availableTenMoreDaysErr: { message: string; status: number },
) => {
  return {
    type: AVAILABLE_TEN_MORE_DAYS_FAIL,
    availableTenDaysBookId,
    availableTenMoreDaysErr,
  };
};

const availableTenMoreDaysRefresh = (availableTenDaysBookId: string) => {
  return async (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch({
        type: AVAILABLE_TEN_MORE_DAYS_REFRESH,
        availableTenDaysBookId,
      });
    }, 2000);
  };
};

export const availableTenMoreDaysReq = (bookId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(availableTenMoreDaysStart(bookId));

    const path = '/books/extend-book-validity';
    const requestedAt = new Date().getTime();

    return axios
      .put(path, { bookId, requestedAt })
      .then(res => {
        const { message, bookId, validTill } = res.data;
        dispatch(availableTenMoreDaysSuccess(bookId, validTill, message));
        // @ts-ignore
        dispatch(availableTenMoreDaysRefresh(bookId));
      })
      .catch(err => {
        const { status, data } = err.response;
        const { message } = data;

        if (status === 403) {
          dispatch(availableTenMoreDaysFail(bookId, { message, status }));
        } else {
          dispatch(
            availableTenMoreDaysFail(bookId, {
              message: 'Something went wrong! Please try again later!',
              status,
            }),
          );
        }
        // @ts-ignore
        dispatch(availableTenMoreDaysRefresh(bookId));
      });
  };
};

export const editBookSetId = (editBookId: string) => {
  return {
    type: EDIT_BOOK_SET,
    editBookId,
  };
};

const editBookStart = (editBookId: string) => {
  return {
    type: EDIT_BOOK_START,
    editBookId,
  };
};

const editBookSuccess = (
  editBookId: string,
  editedBook: BookShape,
  editBookSuccessMsg: string,
) => {
  return {
    type: EDIT_BOOK_SUCCESS,
    editBookId,
    editedBook,
    editBookSuccessMsg,
  };
};

const editBookFail = (editBookErr: { message: string; status: number }) => {
  return {
    type: EDIT_BOOK_FAIL,
    editBookErr,
  };
};

export const editBookRefresh = () => {
  return {
    type: EDIT_BOOK_REFRESH,
  };
};

export const editBookReq = (
  bookId: string,
  bookname: string,
  bookauthor: string,
  bookimage: any,
  formikSetSubmitting: (submissionResolved: boolean) => void,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(editBookStart(bookId));

    const fd = new FormData();

    fd.append('bookId', bookId);
    fd.append('bookName', bookname);
    fd.append('bookAuthor', bookauthor);
    fd.append('bookImage', bookimage);

    const path = 'books/edit';

    return axios
      .put(path, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        const { book, message } = res.data;
        const bookStructured = processBooks(book);
        dispatch(editBookSuccess(bookId, bookStructured, message));

        formikSetSubmitting(false);
      })
      .catch(err => {
        formikSetSubmitting(false);
        const { status } = err.response;
        dispatch(editBookFail({ status, message: 'Something went wrong!' }));
      });
  };
};

export const fetchMatchesForBookSetId = (fetchMatchesForBookId: string) => {
  return {
    type: FETCH_MATCHES_FOR_A_BOOK_SET,
    fetchMatchesForBookId,
  };
};

const fetchMatchesForBookStart = (fetchMatchesForBookId: string) => {
  return {
    type: FETCH_MATCHES_FOR_A_BOOK_START,
  };
};

const fetchMatchesForBookSuccess = (
  matchesForBook: {
    name: string;
    userId: string;
  }[],
  pendingSwapRequestTo: { name: string; bookName: string; matchId: string },
  pendingSwapRequestFrom: { name: string; bookName: string; notificationId: string },
) => {
  return {
    type: FETCH_MATCHES_FOR_A_BOOK_SUCCESS,
    matchesForBook,
    pendingSwapRequestTo,
    pendingSwapRequestFrom,
  };
};

const fetchMatchesForBookFail = (fetchMatchesForBookErr: {
  message: string;
  status: string;
}) => {
  return {
    type: FETCH_MATCHES_FOR_A_BOOK_FAIL,
    fetchMatchesForBookErr,
  };
};

export const fetchMatchesForBookReset = () => {
  return {
    type: FETCH_MATCHES_FOR_A_BOOK_RESET,
  };
};

export const fetchMatchesForBookReq = (fetchMatchesForBookId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchMatchesForBookStart(fetchMatchesForBookId));
    const path = '/books/matches';
    const params = { bookId: fetchMatchesForBookId };

    return axios
      .get(path, { params })
      .then(res => {
        const {
          matchesForBook,
          pendingSwapRequestTo,
          pendingSwapRequestFrom,
        } = res.data;
        dispatch(
          fetchMatchesForBookSuccess(
            matchesForBook,
            pendingSwapRequestTo,
            pendingSwapRequestFrom,
          ),
        );
      })
      .catch(err => {
        const { status } = err.response;
        dispatch(
          fetchMatchesForBookFail({
            message: 'Something went wrong! Could not fetch matches for this book.',
            status,
          }),
        );
      });
  };
};

const fetchBooksForMatchStart = (fetchBooksOfTheMatchId: string) => {
  return {
    type: FETCH_MATCHED_BOOKS_START,
    fetchBooksOfTheMatchId,
  };
};

const fetchBooksForMatchSuccess = (
  booksOfTheMatch: { bookName: string; bookId: string }[],
) => {
  return {
    type: FETCH_MATCHED_BOOKS_SUCCESS,
    booksOfTheMatch,
  };
};

const fetchBooksForMatchFail = (fetchBooksOfTheMatchErr: {
  message: string;
  status: number;
}) => {
  return {
    type: FETCH_MATCHED_BOOKS_FAIL,
    fetchBooksOfTheMatchErr,
  };
};

export const fetchBooksForMatchReset = () => {
  return {
    type: FETCH_MATCHED_BOOKS_RESET,
  };
};

export const fetchBooksForMatchReq = (matchId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchBooksForMatchStart(matchId));
    const path = '/books/books-of-match';
    const params = { matchId };

    return axios
      .get(path, { params })
      .then(res => {
        const { booksOfTheMatch } = res.data;
        dispatch(fetchBooksForMatchSuccess(booksOfTheMatch));
      })
      .catch(err => {
        const { status } = err.response;
        dispatch(
          fetchBooksForMatchFail({
            message: 'Something went wrong! Could not get swappable books.',
            status,
          }),
        );
      });
  };
};

const sendingSwapRequestStart = () => {
  return {
    type: SENDING_SWAP_REQUEST_START,
  };
};

const sendingSwapRequestSuccess = (sendingSwapReqSuccessMsg: string) => {
  return {
    type: SENDING_SWAP_REQUEST_SUCCESS,
    sendingSwapReqSuccessMsg,
  };
};

const sendingSwapRequestFail = (sendingSwapReqErr: {
  message: string;
  status: number;
}) => {
  return {
    type: SENDING_SWAP_REQUEST_FAIL,
    sendingSwapReqErr,
  };
};

export const sendingSwapRequestReset = () => {
  return {
    type: SENDING_SWAP_REQUEST_RESET,
  };
};

export const sendingSwapRequest = (
  socket: Socket,
  matchId: string,
  swapWithBook: string,
  swapBook: string,
) => {
  return (dispatch: Dispatch) => {
    dispatch(sendingSwapRequestStart());
    socket.emit(
      SOCKET_SWAP_REQUEST,
      matchId,
      swapWithBook,
      swapBook,
      (isSuccess: boolean) => {
        if (isSuccess) {
          dispatch(sendingSwapRequestSuccess('Swap Request sent.'));
          dispatch(makeUnavailableSuccess(swapBook));
        } else {
          dispatch(
            sendingSwapRequestFail({
              message: 'Something went wrong! Could not send the swap request.',
              status: 401,
            }),
          );
        }
      },
    );
  };
};

export const swapRequestGotAccepted = (swapAcceptedForBook: string) => {
  return {
    type: SWAP_REQUEST_GOT_ACCEPTED,
    swapAcceptedForBook,
  };
};
