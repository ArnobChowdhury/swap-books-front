import moxios from 'moxios';
import {
  addABookRequest,
  addABookSuccess,
  addABookStart,
  addABookFail,
  fetchBooksRequest,
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFail,
} from './book';
import axiosInstance from '../../../axiosInstance';
import {
  ADD_A_BOOK_FAIL,
  ADD_A_BOOK_START,
  ADD_A_BOOK_SUCCESS,
  FETCH_BOOKS_FAIL,
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
} from '../actionTypes';
import { mockStore } from '../../_testutils';

/**
 * todo
 * Future improvements:
 * We could write an util function to login rather than loggin in everytime we need to login
 */

describe('Book Action tests', () => {
  beforeEach(() => {
    moxios.install(axiosInstance);
  });

  afterEach(() => {
    moxios.uninstall(axiosInstance);
  });

  test('Dispatching bookRequest creates correct actions on success', () => {
    const mockedResponse = [
      {
        message: 'Book has been added',
        bookId: 'testuserid',
      },
    ];

    const store = mockStore();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockedResponse,
      });
    });

    const mockFunc = jest.fn();

    const expectedActions = [
      { type: ADD_A_BOOK_START },
      { type: ADD_A_BOOK_SUCCESS },
    ];
    return store
      .dispatch(
        // @ts-ignore
        addABookRequest(
          'Badshah Namdar',
          'Humayun Ahmed',
          'someurl/images/badshah.jpg',
          mockFunc,
        ),
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('Dispatching bookRequest creates correct actions on failure', () => {
    const store = mockStore();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
      });
    });

    const mockFunc = jest.fn();

    const expectedActions = [
      { type: ADD_A_BOOK_START },
      {
        type: ADD_A_BOOK_FAIL,
        error: new Error('Request failed with status code 401'),
      },
    ];
    return store
      .dispatch(
        // @ts-ignore
        addABookRequest(
          'Badshah Namdar',
          'Humayun Ahmed',
          'someurl/images/badshah.jpg',
          mockFunc,
        ),
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('addABookStart should dispatch with type ADD_A_BOOK_START', () => {
    const actualResult = addABookStart();
    const expectedResult = {
      type: ADD_A_BOOK_START,
    };
    expect(actualResult).toEqual(expectedResult);
  });

  test('addABookSuccess should dispatch with type ADD_A_BOOK_SUCCESS', () => {
    const actualResult = addABookSuccess();
    const expectedResult = {
      type: ADD_A_BOOK_SUCCESS,
    };
    expect(actualResult).toEqual(expectedResult);
  });

  test('addABookFail should dispatch with type ADD_A_BOOK_FAIL and error', () => {
    const error = new Error('Book could not be added');
    const actualResult = addABookFail(error);
    const expectedResult = {
      type: ADD_A_BOOK_FAIL,
      error,
    };
    expect(actualResult).toEqual(expectedResult);
  });

  // fetching books
  test('fetchBooksRequest should dispatch with correct actions on success', () => {
    const store = mockStore();

    const books = [
      {
        bookName: 'Badshah Namdar',
        bookAuthor: 'Humayun Ahmed',
        bookPicturePath: 'someurl/images/badshahnamdar.jpg',
        _id: '1',
        userId: '1',
        isInterested: false,
      },
      {
        bookName: 'Alchemist',
        bookAuthor: 'Paulo Coelho',
        bookPicturePath: 'someurl/images/alchemist.jpg',
        _id: '2',
        userId: '2',
        isInterested: false,
      },
    ];

    const mockedResponse = {
      message: 'All books are here',
      books,
    };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockedResponse,
      });
    });

    const expectedActions = [
      { type: FETCH_BOOKS_START },
      {
        type: FETCH_BOOKS_SUCCESS,
        books: [
          {
            bookName: 'Badshah Namdar',
            bookAuthor: 'Humayun Ahmed',
            bookPicturePath: 'someurl/images/badshahnamdar.jpg',
            bookId: '1',
            bookOwnerId: '1',
            userIsInterested: false,
            interestOnGoing: false,
            interestFailed: null,
          },
          {
            bookName: 'Alchemist',
            bookAuthor: 'Paulo Coelho',
            bookPicturePath: 'someurl/images/alchemist.jpg',
            bookId: '2',
            bookOwnerId: '2',
            userIsInterested: false,
            interestOnGoing: false,
            interestFailed: null,
          },
        ],
      },
    ];

    // @ts-ignore
    return store.dispatch(fetchBooksRequest()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test('fetchBooksRequest should dispatch with correct actions on failure', () => {
    const store = mockStore();

    const error = new Error('Request failed with status code 401');

    const mockedResponse = {
      message: 'All books are here',
      error,
    };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
        response: mockedResponse,
      });
    });

    const expectedActions = [
      { type: FETCH_BOOKS_START },
      { type: FETCH_BOOKS_FAIL, error },
    ];

    // @ts-ignore
    return store.dispatch(fetchBooksRequest()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test('fetchBooksStart should dispatch with type FETCH_BOOKS_START', () => {
    const actualResult = fetchBooksStart();
    const expectedResult = {
      type: FETCH_BOOKS_START,
    };
    expect(actualResult).toEqual(expectedResult);
  });

  test('fetchBooksSuccess should dispatch with type FETCH_BOOKS_SUCCESS', () => {
    const books = [
      {
        bookName: 'Badshah Namdar',
        bookAuthor: 'Humayun Ahmed',
        bookPicture: 'someurl/images/badshahnamdar.jpg',
      },
      {
        bookName: 'Alchemist',
        bookAuthor: 'Paulo Coelho',
        bookPicture: 'someurl/images/alchemist.jpg',
      },
    ];
    const actualResult = fetchBooksSuccess(books);
    const expectedResult = {
      type: FETCH_BOOKS_SUCCESS,
      books,
    };
    expect(actualResult).toEqual(expectedResult);
  });

  test('fetchBooksFail should dispatch with type FETCH_BOOKS_SUCCESS', () => {
    const error = new Error('Something went wrong');
    const actualResult = fetchBooksFail(error);
    const expectedResult = {
      type: FETCH_BOOKS_FAIL,
      error,
    };
    expect(actualResult).toEqual(expectedResult);
  });
});
