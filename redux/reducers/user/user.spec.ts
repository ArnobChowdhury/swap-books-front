import userReducer from '.';
import { UserState, initialState } from './user';
import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
} from '../../actions/actionTypes';

describe('Book reducer', () => {
  it('Should return a default state when empty string is passed as default string', () => {
    const expectedState: UserState = { ...initialState };
    const newState = userReducer(initialState, { type: '' });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should change loading state to "true" when action type is CREATE_USER_START', () => {
    const expectedState: UserState = { ...initialState, userCreationOnGoing: true };
    const newState = userReducer(initialState, { type: CREATE_USER_START });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should update user details when user info is passed with action and action type is CREATE_USER_SUCCESS', () => {
    const expectedState: UserState = {
      ...initialState,
      userCreationOnGoing: false,
      userCreationSuccessful: true,
    };
    const newState = userReducer(initialState, { type: CREATE_USER_SUCCESS });
    expect(newState).toStrictEqual(expectedState);
  });

  it('Should have error state updated when an error is passed and action type is CREATE_USER_FAIL', () => {
    const fetchError = new Error('Failed to create the user');
    const expectedState: UserState = {
      ...initialState,
      userCreationOnGoing: false,
      userCreationSuccessful: false,
      error: fetchError,
    };
    const previousState = { ...initialState, userCreationOnGoing: true };
    const newState = userReducer(previousState, {
      type: CREATE_USER_FAIL,
      error: fetchError,
    });
    expect(newState).toStrictEqual(expectedState);
  });
});
