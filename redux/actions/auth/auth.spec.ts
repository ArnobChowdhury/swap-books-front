import moxios from 'moxios';
import { authRequest, authStart } from './auth';
import axiosInstance from '../../../axiosInstance';
import { AUTH_START, AUTH_SUCCESS } from '../actionTypes';
import { mockStore } from '../../_testutils';

describe('Action integration', () => {
  beforeEach(() => {
    moxios.install(axiosInstance);
  });

  afterEach(() => {
    moxios.uninstall(axiosInstance);
  });

  it('Dispatching authRequest creates correct actions', () => {
    const mockedResponse = {
      token: 'testToken',
      userId: 'testId',
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

  it('Should create an action to start authentication', () => {
    const expectedAction = {
      type: AUTH_START,
    };
    expect(authStart()).toEqual(expectedAction);
  });
});
