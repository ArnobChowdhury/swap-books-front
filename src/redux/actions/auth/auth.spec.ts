import moxios from 'moxios';
import {
  authRequest,
  authStart,
  authFail,
  authSuccess,
  authLogout,
  authCheckState,
  checkAuthTimeout,
} from './auth';
import axiosInstance from '../../../axiosInstance';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  UPDATE_USER_INFO,
} from '../actionTypes';
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

  test('Dispatching authRequest creates correct actions on success', () => {
    const mockedResponse = {
      accessToken: 'testToken',
      refreshToken: 'refreshToken',
      userId: 'testId',
      expiresIn: 3600,
      name: 'testname',
      sex: 'mail',
      dob: '2010-12-12',
      userLat: 23.13,
      userLon: 90.23,
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
      { type: AUTH_SUCCESS, accessToken: 'testToken', userId: 'testId' },
      {
        type: UPDATE_USER_INFO,
        name: 'testname',
        sex: 'mail',
        dob: '2010-12-12',
        userCreationSuccessful: true,
        userLat: 23.13,
        userLon: 90.23,
      },
    ];
    return store
      .dispatch(
        // @ts-ignore
        authRequest('testemail@gmail.com', 'testpassword', mockFunc),
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(mockFunc).toBeCalledWith(false);
      });
  });

  test('Dispatching authRequest creates correct actions on failure', () => {
    const store = mockStore();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
      });
    });

    const error = new Error('Request failed with status code 401');

    const mockFunc = jest.fn();
    const expectedActions = [{ type: AUTH_START }, { type: AUTH_FAIL, error }];
    return store
      .dispatch(
        // @ts-ignore
        authRequest('testemail@gmail.com', 'testpassword', mockFunc),
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
      { type: AUTH_SUCCESS, accessToken: testToken, userId: testUserId },
    ];
    // @ts-ignore
    store.dispatch(authCheckState());
    expect(store.getActions()).toEqual(expectedAction);
  });

  //test('authCheckState action creator should dispatch authLogout upon finding the expirationDate has expired', () => {
  //const store = mockStore();

  //const mockedResponse = {
  //accessToken: 'testToken',
  //userId: 'testId',
  //expiresIn: -3600,
  //name: 'testname',
  //dob: '2010-12-12',
  //sex: 'male',
  //userLon: 23.34,
  //userLat: 90.24,
  //};

  //moxios.wait(() => {
  //const request = moxios.requests.mostRecent();
  //request.respondWith({
  //status: 200,
  //response: mockedResponse,
  //});
  //});

  //const mockFunc = jest.fn();
  //const expectedActions = [
  //{ type: AUTH_START },
  //{ type: AUTH_SUCCESS, accessToken: 'testToken', userId: 'testId' },
  //{
  //type: UPDATE_USER_INFO,
  //name: 'testname',
  //dob: '2010-12-12',
  //sex: 'male',
  //userCreationSuccessful: true,
  //userLon: 23.34,
  //userLat: 90.24,
  //},
  //{
  //type: UPDATE_USER_INFO,
  //name: null,
  //dob: null,
  //sex: null,
  //userCreationSuccessful: false,
  //userLon: null,
  //userLat: null,
  //},
  //{ type: AUTH_LOGOUT },
  //];

  //return store
  //.dispatch(
  //// @ts-ignore
  //authRequest('testemail@gmail.com', 'testpassword', mockFunc),
  //)
  //.then(() => {
  //// @ts-ignore
  //store.dispatch(authCheckState());
  //expect(store.getActions()).toEqual(expectedActions);
  //});
  //});

  //test('authCheckState action creator should dispatch authLogout when expirationDate is not found', () => {
  //expect(localStorage.getItem('expirationDate')).toBeNull();
  //const store = mockStore();
  //const expectedActions = [
  //{
  //type: UPDATE_USER_INFO,
  //name: null,
  //dob: null,
  //sex: null,
  //userCreationSuccessful: false,
  //userLat: null,
  //userLon: null,
  //},
  //{ type: 'AUTH_LOGOUT' },
  //];
  //// @ts-ignore
  //store.dispatch(authCheckState());
  //expect(store.getActions()).toEqual(expectedActions);
  //});

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
      accessToken: testToken,
      userId: testUserId,
    };
    expect(authSuccess(testToken, testUserId)).toEqual(expectedAction);
  });

  //test('authLogout dispatches correct actions and removes localStorage items', () => {
  //const store = mockStore();

  //const mockedResponse = {
  //accessToken: 'testToken',
  //userId: 'testId',
  //expiresIn: 3600,
  //name: 'testname',
  //dob: '2010-12-12',
  //sex: 'male',
  //userLon: 23.32,
  //userLat: 90.14,
  //};

  //moxios.wait(() => {
  //const request = moxios.requests.mostRecent();
  //request.respondWith({
  //status: 200,
  //response: mockedResponse,
  //});
  //});

  //const mockFunc = jest.fn();

  //const expectedActions = [
  //{ type: AUTH_START },
  //{
  //type: AUTH_SUCCESS,
  //accessToken: 'testToken',
  //userId: 'testId',
  //},
  //{
  //type: UPDATE_USER_INFO,
  //name: 'testname',
  //dob: '2010-12-12',
  //sex: 'male',
  //userCreationSuccessful: true,
  //userLon: 23.32,
  //userLat: 90.14,
  //},
  //{
  //type: UPDATE_USER_INFO,
  //name: null,
  //dob: null,
  //sex: null,
  //userCreationSuccessful: false,
  //userLat: null,
  //userLon: null,
  //},
  //{ type: AUTH_LOGOUT },
  //];

  //return store
  //.dispatch(
  //// @ts-ignore
  //authRequest('testemail@gmail.com', 'testpassword', mockFunc),
  //)
  //.then(() => {
  //expect(localStorage.getItem('accessToken')).toBeTruthy();
  //expect(localStorage.getItem('userId')).toBeTruthy();
  //expect(localStorage.getItem('expirationDate')).toBeTruthy();
  ////@ts-ignore
  //store.dispatch(authLogout());
  //expect(store.getActions()).toEqual(expectedActions);
  //expect(localStorage.getItem('userId')).toBeNull();
  //expect(localStorage.getItem('accessToken')).toBeNull();
  //});
  //});

  //test('authTimeout should dispatch authLogout after specified time', () => {
  //const store = mockStore();
  //const expectedAction = [
  //{
  //type: UPDATE_USER_INFO,
  //name: null,
  //sex: null,
  //dob: null,
  //userCreationSuccessful: false,
  //userLat: null,
  //userLon: null,
  //},
  //{ type: AUTH_LOGOUT },
  //];
  //// @ts-ignore
  //store.dispatch(checkAuthTimeout(1));
  //return new Promise(resolve => {
  //setTimeout(() => {
  //expect(store.getActions()).toEqual(expectedAction);
  //resolve();
  //}, 2000);
  //});
  //});
});
