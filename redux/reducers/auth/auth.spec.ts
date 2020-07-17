import authReducer, { initialState, AuthState } from './auth';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_FAIL,
} from '../../actions/actionTypes';

describe('Auth reducer', () => {
  it('Should return default state', () => {
    const newState = authReducer(initialState, { type: '' });
    expect(newState).toBe(initialState);
  });

  it('Should change state to loading when type is AUTH_START', () => {
    const expectedState: AuthState = { ...initialState, loading: true };
    const newState = authReducer(initialState, { type: AUTH_START });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have correct state when dispatched with type - AUTH_SUCCESS and userId and token', () => {
    const expectedState: AuthState = {
      ...initialState,
      loading: false,
      token: 'testtoken',
      userId: 'textuserid',
    };
    const newState = authReducer(initialState, {
      type: AUTH_SUCCESS,
      token: 'testtoken',
      userId: 'textuserid',
    });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should update error field when dispatched with type - AUTH_FAIL and error', () => {
    const expectedState: AuthState = {
      ...initialState,
      error: new Error('Sorry could not authenticate'),
    };
    const newState = authReducer(initialState, {
      type: AUTH_FAIL,
      error: new Error('Sorry could not authenticate'),
    });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should update token and userId fields when dispatched with type - AUTH_LOGOUT', () => {
    const expectedState: AuthState = {
      ...initialState,
    };
    const newState = authReducer(initialState, {
      type: AUTH_LOGOUT,
    });
    expect(newState).toStrictEqual(expectedState);
  });
});
