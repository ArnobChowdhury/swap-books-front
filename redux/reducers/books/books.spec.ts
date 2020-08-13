import bookReducer from '.';
import { BooksState, BookShape, initialState } from './books';
import {
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  FETCH_BOOKS_FAIL,
} from '../../actions/actionTypes';

describe('Book reducer', () => {
  it('Should return a default state when empty string is passed as default string', () => {
    const expectedState: BooksState = { ...initialState };
    const newState = bookReducer(initialState, { type: '' });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should change loading state to "true" when action type is FETCH_BOOKS_START', () => {
    const expectedState: BooksState = { ...initialState, loading: true };
    const newState = bookReducer(initialState, { type: FETCH_BOOKS_START });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have books state updated when books are passed with action and action type is FETCH_BOOKS_SUCCESS', () => {
    const books: BookShape[] = [
      {
        bookName: 'Books One',
        bookAuthor: 'Book Author One',
        bookPicturePath: '/',
        bookId: '1',
        bookOwnerId: '1',
        userIsInterested: false,
        interestOnGoing: false,
        interestReqError: null,
      },
      {
        bookName: 'Books Two',
        bookAuthor: 'Book Author Two',
        bookPicturePath: '/',
        bookId: '2',
        bookOwnerId: '2',
        userIsInterested: false,
        interestOnGoing: false,
        interestReqError: null,
      },
      {
        bookName: 'Books Three',
        bookAuthor: 'Book Author Three',
        bookPicturePath: '/',
        bookId: '3',
        bookOwnerId: '3',
        userIsInterested: false,
        interestOnGoing: false,
        interestReqError: null,
      },
    ];
    const expectedState: BooksState = { ...initialState, books };
    const newState = bookReducer(initialState, { type: FETCH_BOOKS_SUCCESS, books });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have books state updated when books are passed with action and action type is FETCH_BOOKS_SUCCESS', () => {
    const books: BookShape[] = [
      {
        bookName: 'Books One',
        bookAuthor: 'Book Author One',
        bookPicturePath: '/',
        bookOwnerId: '1',
        bookId: '1',
        userIsInterested: false,
        interestOnGoing: false,
        interestReqError: null,
      },
      {
        bookName: 'Books Two',
        bookAuthor: 'Book Author Two',
        bookPicturePath: '/',
        bookId: '2',
        bookOwnerId: '2',
        userIsInterested: false,
        interestOnGoing: false,
        interestReqError: null,
      },
      {
        bookName: 'Books Three',
        bookAuthor: 'Book Author Three',
        bookId: '3',
        bookPicturePath: '3',
        bookOwnerId: '3',
        userIsInterested: false,
        interestOnGoing: false,
        interestReqError: null,
      },
    ];
    const expectedState: BooksState = { ...initialState, books };
    const newState = bookReducer(initialState, { type: FETCH_BOOKS_SUCCESS, books });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have error state updated when an error is passed and action type is FETCH_BOOKS_FAIL', () => {
    const fetchError = new Error('Error fetching the books');
    const expectedState: BooksState = { ...initialState, error: fetchError };
    const newState = bookReducer(initialState, {
      type: FETCH_BOOKS_FAIL,
      error: fetchError,
    });
    expect(newState).toStrictEqual(expectedState);
  });
});
