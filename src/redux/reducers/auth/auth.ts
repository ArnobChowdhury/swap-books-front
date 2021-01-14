import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import {
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_FAIL,
} from '../../actions/actionTypes';

export interface AuthState {
  accessToken: string | null;
  userId: string | null;
  error: string | null | Error;
  loading: boolean;
  authRedirectPath: string;
}

export const initialState: AuthState = {
  accessToken: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/',
};

const reducer = (state = initialState, action: AnyAction) => {
  const { accessToken, userId, error } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case AUTH_START:
      return { ...state, loading: true };
    case AUTH_SUCCESS:
      return {
        ...state,
        accessToken,
        userId,
        loading: false,
        error: null,
      };
    case AUTH_FAIL:
      return { ...state, error };
    case AUTH_LOGOUT:
      return { ...state, userId: null, accessToken: null };
    // todo not all actions of the original implementation of maximilan is handled here
    default:
      return state;
  }
};

export default reducer;
