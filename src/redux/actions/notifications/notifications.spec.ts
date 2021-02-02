import {
  getNotificationStart,
  getNotificationSuccess,
  getNotificationFail,
  getNotificationsRequest,
} from './notifications';
import {
  GET_NOTIFICATIONS_START,
  GET_INITIAL_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
} from '../actionTypes';
import { mockStore } from '../../_testutils';
import { MockStoreEnhanced } from 'redux-mock-store';
import { SOCKET_GET_NOTIFICATION } from '../../../socketTypes';
import { NotificationResponseShape } from '../../reducers/notifications';

describe('Book Action tests', () => {
  let socket: { emit: jest.Mock<any, any>; on: jest.Mock<any, any> };
  let store: MockStoreEnhanced<unknown, {}>;
  beforeEach(() => {
    store = mockStore();
    socket = {
      emit: jest.fn(),
      on: jest.fn(),
    };
  });

  afterEach(() => {
    store.clearActions();
    socket.emit.mockClear();
    socket.on.mockClear();
  });

  test('Dispatching bookRequest creates correct actions on success', () => {
    const expectedActions = [{ type: GET_NOTIFICATIONS_START }];
    const testUserId = '1234adf1231231242';

    store.dispatch(
      // @ts-ignore
      getNotificationsRequest(socket, testUserId),
    );

    expect(store.getActions()).toEqual(expectedActions);
    expect(socket.emit).toBeCalledTimes(1);
    // @ts-ignore
    expect(socket.emit.mock.calls[0][0]).toBe(SOCKET_GET_NOTIFICATION);
    // @ts-ignore
    expect(socket.emit.mock.calls[0][1]).toEqual(testUserId);
  });

  test('getNotificationStart should return correct type', () => {
    const expectedActions = [{ type: GET_NOTIFICATIONS_START }];
    store.dispatch(getNotificationStart());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('getNotificationSuccess should dispatch with type GET_NOTIFICATIONS_SUCCESS', () => {
    const notifications: NotificationResponseShape[] = [
      {
        _id: '1234adf1231231242',
        fromId: '123923a1239873',
        fromName: 'testname',
        notificationType: 'interest',
        bookId: '123309809abcfda',
        bookName: 'test book name',
        seen: false,
        timestamp: 123120902348,
        toId: '12321098098098',
      },
    ];
    const expectedActions = [
      { type: GET_INITIAL_NOTIFICATIONS_SUCCESS, notifications },
    ];

    store.dispatch(getNotificationSuccess(notifications));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('getNotificationFail should dispatch with type GET_NOTIFICATIONS_FAIL', () => {
    const error = new Error('An error occurred');
    const expectedActions = [{ type: GET_NOTIFICATIONS_FAIL, error }];

    store.dispatch(getNotificationFail(error));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
