import {
  fetchProfileReq,
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFail,
} from './profile';
import { mockStore } from '../../_testutils';
import {
  FETCH_PROFILE_START,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
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

  test('fetchProfileReq should create correct actions on success', () => {
    const mockedResponse = {
      userInfo: { name: 'sam' },
    };

    const expectedActions = [
      { type: FETCH_PROFILE_START },
      { type: FETCH_PROFILE_SUCCESS, userInfo: { name: 'sam' } },
    ];

    const store = mockStore();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockedResponse,
      });
    });

    return store
      .dispatch(
        //@ts-ignore
        fetchProfileReq('123sfadakasdlfakj'),
      )
      .then(() => {
        expect(store.getActions()).toStrictEqual(expectedActions);
      });
  });

  test('fetchProfileReq should create correction actions on failure', () => {
    const expectedActions = [
      { type: FETCH_PROFILE_START },
      {
        type: FETCH_PROFILE_FAIL,
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

    return store
      .dispatch(
        //@ts-ignore
        fetchProfileReq('12asdfa123asd5345'),
      )
      .then(() => {
        expect(store.getActions()).toStrictEqual(expectedActions);
      });
  });

  test('fetchProfileStart should return right action', () => {
    const expectedAction = {
      type: FETCH_PROFILE_START,
    };
    expect(fetchProfileStart()).toStrictEqual(expectedAction);
  });

  test('fetchProfileSuccess should return right action', () => {
    const expectedAction = {
      type: FETCH_PROFILE_SUCCESS,
      userInfo: { name: 'sam' },
    };
    expect(fetchProfileSuccess({ name: 'sam' })).toStrictEqual(expectedAction);
  });

  test('fetchProfileFail should return right action', () => {
    const mockError = new Error('Something went wrong!');
    const expectedAction = {
      type: FETCH_PROFILE_FAIL,
      error: mockError,
    };
    expect(fetchProfileFail(mockError)).toStrictEqual(expectedAction);
  });
});
