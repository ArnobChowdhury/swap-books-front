import { createUserReq, createUserStart, createUserFail } from './user';
import { mockStore } from '../../_testutils';
import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
} from '../actionTypes';
import moxios from 'moxios';
import axios from '../../../axiosInstance';

describe('User Actions', () => {
  beforeEach(() => {
    moxios.install(axios);
  });

  afterAll(() => {
    moxios.uninstall(axios);
  });

  test('createUserReq should create correction actions on success', () => {
    const mockedResponse = {
      userName: 'testusername',
      userDOB: '2005-5-5',
      userSex: 'Male',
    };

    const expectedActions = [
      { type: CREATE_USER_START },
      {
        type: CREATE_USER_SUCCESS,
        name: 'testusername',
        dob: '2005-5-5',
        sex: 'Male',
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

    return store
      .dispatch(
        //@ts-ignore
        createUserReq(
          mockedResponse.userName,
          mockedResponse.userDOB,
          mockedResponse.userSex,
          // @ts-ignore
          {},
          mockFunc,
        ),
      )
      .then(() => {
        expect(store.getActions()).toStrictEqual(expectedActions);
      });
  });

  test('createUserReq should create correction actions on failure', () => {
    const expectedActions = [
      { type: CREATE_USER_START },
      {
        type: CREATE_USER_FAIL,
        error: new Error('Request failed with status code 401'),
      },
    ];

    const store = mockStore();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
      });
    });

    const mockFunc = jest.fn();

    return store
      .dispatch(
        //@ts-ignore
        createUserReq(
          'testusername',
          '2005-12-12',
          'male',
          // @ts-ignore
          {},
          mockFunc,
        ),
      )
      .then(() => {
        expect(store.getActions()).toStrictEqual(expectedActions);
      });
  });

  test('createUserStart should return right action', () => {
    const expectedAction = {
      type: CREATE_USER_START,
    };
    expect(createUserStart()).toStrictEqual(expectedAction);
  });

  test('createUserFail should return right action', () => {
    const mockError = new Error('Something went wrong!');
    const expectedAction = {
      type: CREATE_USER_FAIL,
      error: mockError,
    };
    expect(createUserFail(mockError)).toStrictEqual(expectedAction);
  });
});
