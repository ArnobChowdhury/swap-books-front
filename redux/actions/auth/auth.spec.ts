import moxios from 'moxios';
import {
  authRequest,
  authStart,
  authFail,
  authSuccess,
  authLogout,
  authCheckState,
} from './auth';
import axiosInstance from '../../../axiosInstance';
import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL, AUTH_LOGOUT } from '../actionTypes';
import { mockStore } from '../../_testutils';

/**
 * todo
 * Future improvements:
 * We could write an util function to login rather than loggin in everytime we need to login
 */

describe('Auth Action tests', () => {
  beforeEach(() => {
    moxios.install(axiosInstance);
  });

  afterEach(() => {
    moxios.uninstall(axiosInstance);
  });

  test('Dispatching authRequest creates correct actions', () => {
    const mockedResponse = {
      token: 'testToken',
      userId: 'testId',
      expiresIn: 3600,
    };

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
      { type: AUTH_START },
      { type: AUTH_SUCCESS, token: 'testToken', userId: 'testId' },
    ];
    return store
      .dispatch(
        // @ts-ignore
        authRequest('testemail@gmail.com', 'testpassword', false, mockFunc),
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(mockFunc).toBeCalledWith(false);
      });
  });

  test('authCheckState action creator should dispatch authSuccess upon finding the expirationDate that has not expired yet', () => {
    const store = mockStore();
    const testToken = 'testToken';
    const testUserId = 'testId';
    const expectedAction = [
      { type: AUTH_SUCCESS, token: testToken, userId: testUserId },
    ];
    // @ts-ignore
    store.dispatch(authCheckState());
    expect(store.getActions()).toEqual(expectedAction);
  });

  test('authCheckState action creator should dispatch authLogout upon finding the expirationDate has expired', () => {
    const store = mockStore();

    const mockedResponse = {
      token: 'testToken',
      userId: 'testId',
      expiresIn: -3600,
    };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockedResponse,
      });
    });

    const mockFunc = jest.fn();
    const expectedActions = [
      { type: 'AUTH_START' },
      { type: 'AUTH_SUCCESS', token: 'testToken', userId: 'testId' },
      { type: 'AUTH_LOGOUT' },
    ];

    return store
      .dispatch(
        // @ts-ignore
        authRequest('testemail@gmail.com', 'testpassword', false, mockFunc),
      )
      .then(() => {
        // @ts-ignore
        store.dispatch(authCheckState());
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('authCheckState action creator should dispatch authLogout when expirationDate is not found', () => {
    expect(localStorage.getItem('expirationDate')).toBeNull();
    const store = mockStore();
    const expectedActions = [{ type: 'AUTH_LOGOUT' }];
    // @ts-ignore
    store.dispatch(authCheckState());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('Should create an action to start authentication', () => {
    const expectedAction = {
      type: AUTH_START,
    };
    expect(authStart()).toEqual(expectedAction);
  });

  test('Should create an action for failing authentication', () => {
    const mockError = new Error('Something went wrong;');
    const expectedAction = {
      type: AUTH_FAIL,
      error: mockError,
    };
    expect(authFail(mockError)).toEqual(expectedAction);
  });

  test('Should create an action for successful authentication', () => {
    const testToken = 'testToken';
    const testUserId = 'userId';

    const expectedAction = {
      type: AUTH_SUCCESS,
      token: testToken,
      userId: testUserId,
    };
    expect(authSuccess(testToken, testUserId)).toEqual(expectedAction);
  });

  test('authLogout dispatches correct actions and removes localStorage items', () => {
    const store = mockStore();

    const mockedResponse = {
      token: 'testToken',
      userId: 'testId',
      expiresIn: 3600,
    };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockedResponse,
      });
    });

    const mockFunc = jest.fn();

    const expectedActions = [
      { type: 'AUTH_START' },
      { type: 'AUTH_SUCCESS', token: 'testToken', userId: 'testId' },
      { type: 'AUTH_LOGOUT' },
    ];

    return store
      .dispatch(
        // @ts-ignore
        authRequest('testemail@gmail.com', 'testpassword', false, mockFunc),
      )
      .then(() => {
        expect(localStorage.getItem('token')).toBeTruthy();
        expect(localStorage.getItem('userId')).toBeTruthy();
        expect(localStorage.getItem('expirationDate')).toBeTruthy();
        store.dispatch(authLogout());
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem('userId')).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
      });
  });
});
