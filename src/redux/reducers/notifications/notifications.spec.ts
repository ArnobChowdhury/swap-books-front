import notificationReducer from '.';
import {
  initialState,
  NotificationShape,
  NotificationState,
  NotificationResponseShape,
} from './notifications';
import {
  GET_NOTIFICATIONS_START,
  GET_NOTIFICATIONS_FAIL,
  GET_INITIAL_NOTIFICATIONS_SUCCESS,
  GET_MORE_NOTIFICATIONS_SUCCESS,
} from '../../actions/actionTypes';

describe('Notification reducer', () => {
  it('Should return a default state when empty string is passed as default string', () => {
    const expectedState: NotificationState = { ...initialState };
    const newState = notificationReducer(initialState, { type: '' });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should change loading state to "true" when action type is GET_NOTIFICATIONS_START', () => {
    const expectedState: NotificationState = { ...initialState, loading: true };
    const newState = notificationReducer(initialState, {
      type: GET_NOTIFICATIONS_START,
    });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have notifications state updated when notifications are passed with action and action type is GET_NOTIFICATIONS_SUCCESS', () => {
    const notifications: NotificationShape[] = [
      {
        notificationId: '5f521a776b9cf4ce0a0f6cd2',
        fromId: '1f4d2426527e3488978901d2',
        fromName: 'Adeeb',
        bookId: '2f2d161d20897663289f0359',
        bookName: 'Diaper',
        type: 'interest',
        seen: false,
        timestamp: 5,
      },
      {
        notificationId: '5f521a776b9cf4ce0a0f6cd1',
        fromId: '8f4df426c2ae3486976901d2',
        fromName: 'Ahsan',
        type: 'interest',
        bookId: '5f2d169d20895662289f0354',
        bookName: 'Baby Zinc',
        seen: false,
        timestamp: 4,
      },
      {
        notificationId: '5f521a776b9cf4ce0a0f6cd0',
        fromId: '5f4d1426c2fe3486976901d5',
        fromName: 'Ahsan',
        type: 'interest',
        bookId: '5f2d969d20895682289f0354',
        bookName: 'Tring Tring',
        seen: false,
        timestamp: 3,
      },
      {
        notificationId: '5f521a776b9cf4ce0a0f6ccf',
        fromId: '5f4d1486c2fe32866769f1d5',
        fromName: 'Romeo',
        type: 'interest',
        bookId: '5f2d369d30f95632229f0354',
        bookName: 'Magic',
        seen: false,
        timestamp: 2,
      },
      {
        notificationId: '5f515f79d18fed82f7cdf334',
        fromId: '5f4d1486c4fe82826769f1d5',
        fromName: "ma'name",
        type: 'interest',
        bookId: '5f2d36fd34f95632229f0354',
        bookName: 'Inferno',
        seen: false,
        timestamp: 1,
      },
    ];

    const notificationsResponose: NotificationResponseShape[] = [
      {
        _id: '5f515f79d18fed82f7cdf334',
        fromId: '5f4d1486c4fe82826769f1d5',
        fromName: "ma'name",
        notificationType: 'interest',
        bookId: '5f2d36fd34f95632229f0354',
        bookName: 'Inferno',
        seen: false,
        timestamp: 1,
        toId: '5f2cf359d581ac22e4626a8a',
      },
      {
        _id: '5f521a776b9cf4ce0a0f6ccf',
        fromId: '5f4d1486c2fe32866769f1d5',
        fromName: 'Romeo',
        notificationType: 'interest',
        bookId: '5f2d369d30f95632229f0354',
        bookName: 'Magic',
        seen: false,
        timestamp: 2,
        toId: '5f2cf359d581ac22e4626a8a',
      },
      {
        _id: '5f521a776b9cf4ce0a0f6cd0',
        fromId: '5f4d1426c2fe3486976901d5',
        fromName: 'Ahsan',
        notificationType: 'interest',
        bookId: '5f2d969d20895682289f0354',
        bookName: 'Tring Tring',
        seen: false,
        timestamp: 3,
        toId: '5f2cf359d581ac22e4626a8a',
      },
      {
        _id: '5f521a776b9cf4ce0a0f6cd1',
        fromId: '8f4df426c2ae3486976901d2',
        fromName: 'Ahsan',
        notificationType: 'interest',
        bookId: '5f2d169d20895662289f0354',
        bookName: 'Baby Zinc',
        seen: false,
        timestamp: 4,
        toId: '5f2cf359d581ac22e4626a8a',
      },
      {
        _id: '5f521a776b9cf4ce0a0f6cd2',
        fromId: '1f4d2426527e3488978901d2',
        fromName: 'Adeeb',
        notificationType: 'interest',
        bookId: '2f2d161d20897663289f0359',
        bookName: 'Diaper',
        seen: false,
        timestamp: 5,
        toId: '5f2cf359d581ac22e4626a8a',
      },
    ];

    const expectedState: NotificationState = { ...initialState, notifications };
    const newState = notificationReducer(initialState, {
      type: GET_INITIAL_NOTIFICATIONS_SUCCESS,
      notifications: notificationsResponose,
    });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have error state updated when an error is passed and action type is GET_NOTIFICATIONS_FAIL', () => {
    const fetchError = new Error('Notifications could not be updated');
    const expectedState: NotificationState = { ...initialState, error: fetchError };
    const newState = notificationReducer(initialState, {
      type: GET_NOTIFICATIONS_FAIL,
      error: fetchError,
    });
    expect(newState).toStrictEqual(expectedState);
  });
});
