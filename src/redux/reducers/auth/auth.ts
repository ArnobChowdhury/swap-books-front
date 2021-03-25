import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import {
  AUTH_SUCCESS,
  AUTH_TOKEN_REFRESH,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_FAIL,
  AUTH_REDIRECT_SUCCESS,
} from '../../actions/actionTypes';

export interface AuthState {
  accessToken: string | null;
  userId: string | null;
  expirationDate: number;
  error: { message: string; status: number } | null;
  loading: boolean;
  authRedirectPath: string | null;
}

export const initialState: AuthState = {
  accessToken: null,
  userId: null,
  expirationDate: 0,
  error: null,
  loading: false,
  authRedirectPath: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  const { accessToken, userId, expirationDate, error } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case AUTH_START:
      return { ...state, loading: true, error: null };
    case AUTH_SUCCESS:
      return {
        ...state,
        accessToken,
        userId,
        expirationDate,
        loading: false,
        error: null,
      };
    case AUTH_TOKEN_REFRESH:
      return { ...state, accessToken, expirationDate };
    case AUTH_FAIL:
      return { ...state, loading: false, error };
    case AUTH_REDIRECT_SUCCESS:
      return { ...state, authRedirectPath: null };
    case AUTH_LOGOUT:
      return { ...state, userId: null, accessToken: null, authRedirectPath: '/' };
    // todo not all actions of the original implementation of maximilan is handled here
    default:
      return state;
  }
};

export default reducer;
