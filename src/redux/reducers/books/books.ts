import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
// import { action } from '@storybook/addon-actions';
import {
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  FETCH_MORE_BOOKS_SUCCESS,
  FETCH_BOOKS_FAIL,
  EXPRESS_INTEREST_START,
  EXPRESS_INTEREST_SUCCESS,
  EXPRESS_INTEREST_FAIL,
  MAKE_UNAVAILABLE_START,
  MAKE_UNAVAILABLE_SUCCESS,
  MAKE_UNAVAILABLE_FAIL,
} from '../../actions/actionTypes';

export interface BookShape {
  bookId: string;
  bookName: string;
  bookAuthor: string;
  bookPicturePath: string;
  bookOwnerId: string;
  bookOwnerName: string;
  userIsInterested: boolean;
  reqOnGoing: boolean;
  reqError: string | null | Error;
}

export interface BooksState {
  books: BookShape[];
  error: string | null | Error;
  loading: boolean;
  page: number;
  hasMorePages: boolean;
}

export const initialState: BooksState = {
  // todo need to check what kind of json is returned, (possibly array)
  books: [],
  error: null,
  loading: false,
  page: 0,
  hasMorePages: true,
};

// todo write tests for expressInterest related functions
const reducer = (state = initialState, action: AnyAction) => {
  const {
    books,
    error,
    interestActivity,
    page,
    hasMorePages,
    unavilableBookId,
    unavilableErr,
  } = action;
  switch (action.type) {
    case HYDRATE:
      // our action do not return a property named payload
      return { ...state };
    case FETCH_BOOKS_START:
      return { ...state, loading: true };
    case FETCH_BOOKS_SUCCESS:
      return { ...state, loading: false, books, page, hasMorePages };
    case FETCH_MORE_BOOKS_SUCCESS:
      const prevBooks = state.books;
      const newBooks = [...prevBooks, ...books];
      return { ...state, loading: false, books: newBooks, page, hasMorePages };
    case FETCH_BOOKS_FAIL:
      return { ...state, loading: false, error };
    case EXPRESS_INTEREST_START:
      const allBooks = [...state.books];
      const interestStartedOn = allBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestStartedOn !== undefined) {
        interestStartedOn.reqOnGoing = true;
      }
      return { ...state, books: allBooks };
    case EXPRESS_INTEREST_SUCCESS:
      const existingBooks = [...state.books];
      const interestSucceedOn = existingBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestSucceedOn !== undefined) {
        interestSucceedOn.userIsInterested = interestActivity.isInterested;
        interestSucceedOn.reqOnGoing = false;
      }
      return { ...state, books: existingBooks };
    case EXPRESS_INTEREST_FAIL:
      const currentBooks = [...state.books];
      const interestFailedOn = currentBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestFailedOn !== undefined) {
        interestFailedOn.reqOnGoing = false;
        interestFailedOn.reqError = interestActivity.err;
      }
      return { ...state, books: currentBooks };

    case MAKE_UNAVAILABLE_START: {
      const { books } = state;
      const currentBooks = [...books];
      const bookMakingUnavailable = currentBooks.find(
        book => book.bookId === unavilableBookId,
      );
      if (bookMakingUnavailable) {
        bookMakingUnavailable.reqOnGoing = true;
      }
      return { ...state, books: currentBooks };
    }

    case MAKE_UNAVAILABLE_SUCCESS: {
      const { books } = state;
      const currentBooks = [...books];
      const newBooks = currentBooks.filter(book => book.bookId !== unavilableBookId);
      return { ...state, books: newBooks };
    }

    case MAKE_UNAVAILABLE_FAIL: {
      const { books } = state;
      const currentBooks = [...books];
      const bookMakingUnavailable = currentBooks.find(
        book => book.bookId === unavilableBookId,
      );
      if (bookMakingUnavailable) {
        bookMakingUnavailable.reqOnGoing = false;
        bookMakingUnavailable.reqError = unavilableErr;
      }
      return { ...state, books: currentBooks };
    }

    default:
      return state;
  }
};

export default reducer;
