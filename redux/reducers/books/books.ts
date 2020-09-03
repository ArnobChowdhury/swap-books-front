import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
// import { action } from '@storybook/addon-actions';
import {
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  FETCH_BOOKS_FAIL,
  EXPRESS_INTEREST_START,
  EXPRESS_INTEREST_SUCCESS,
  EXPRESS_INTEREST_FAIL,
} from '../../actions/actionTypes';

export interface BookShape {
  bookId: string;
  bookName: string;
  bookAuthor: string;
  bookPicturePath: string;
  bookOwnerId: string;
  bookOwnerName: string;
  userIsInterested: boolean;
  interestOnGoing: boolean;
  interestReqError: string | null | Error;
}

export interface BooksState {
  books: BookShape[];
  error: string | null | Error;
  loading: boolean;
}

export const initialState: BooksState = {
  // todo need to check what kind of json is returned, (possibly array)
  books: [],
  error: null,
  loading: false,
};

// todo write tests for expressInterest related functions
const reducer = (state = initialState, action: AnyAction) => {
  const { books, error, interestActivity } = action;
  switch (action.type) {
    case HYDRATE:
      // our action do not return a property named payload
      return { ...state };
    case FETCH_BOOKS_START:
      return { ...state, loading: true };
    case FETCH_BOOKS_SUCCESS:
      return { ...state, loading: false, books };
    case FETCH_BOOKS_FAIL:
      return { ...state, loading: false, error };
    case EXPRESS_INTEREST_START:
      const allBooks = [...state.books];
      const interestStartedOn = allBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestStartedOn !== undefined) {
        interestStartedOn.interestOnGoing = true;
      }
      return { ...state, books: allBooks };
    case EXPRESS_INTEREST_SUCCESS:
      const existingBooks = [...state.books];
      const interestSucceedOn = existingBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestSucceedOn !== undefined) {
        interestSucceedOn.userIsInterested = interestActivity.isInterested;
        interestSucceedOn.interestOnGoing = false;
      }
      return { ...state, books: existingBooks };
    case EXPRESS_INTEREST_FAIL:
      const currentBooks = [...state.books];
      const interestFailedOn = currentBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestFailedOn !== undefined) {
        interestFailedOn.interestOnGoing = false;
        interestFailedOn.interestReqError = interestActivity.err;
      }
      return { ...state, books: currentBooks };
    default:
      return state;
  }
};

export default reducer;
