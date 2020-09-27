import userReducer from '.';
import { ProfileState, initialState } from './profile';
import {
  FETCH_PROFILE_START,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
} from '../../actions/actionTypes';

describe('Profile reducer', () => {
  it('Should return a default state when empty string is passed as default string', () => {
    const expectedState: ProfileState = { ...initialState };
    const newState = userReducer(initialState, { type: '' });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should change profileLoading state to "true" when action type is FETCH_PROFILE_START', () => {
    const expectedState: ProfileState = {
      ...initialState,
      profileLoading: true,
    };
    const newState = userReducer(initialState, { type: FETCH_PROFILE_START });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should update profile details when profile info is passed with action and action type is FETCH_PROFILE_SUCCESS', () => {
    const expectedState: ProfileState = {
      ...initialState,
      profileLoading: false,
      profileName: 'Sam',
    };
    const newState = userReducer(initialState, {
      type: FETCH_PROFILE_SUCCESS,
      userInfo: { name: 'Sam' },
    });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have error state updated when an error is passed and action type is FETCH_PROFILE_FAIL', () => {
    const fetchError = new Error('Failed to fetch profile info');
    const expectedState: ProfileState = {
      ...initialState,
      profileLoading: false,
      profileError: fetchError,
    };
    const previousState = { ...initialState, profileLoading: true };
    const newState = userReducer(previousState, {
      type: FETCH_PROFILE_FAIL,
      error: fetchError,
    });
    expect(newState).toStrictEqual(expectedState);
  });
});
