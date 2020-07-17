import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { action } from '@storybook/addon-actions';
import {
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_FAIL,
} from '../../actions/actionTypes';

export interface AuthState {
  token: string | null;
  userId: string | null;
  error: string | null | Error;
  loading: boolean;
  authRedirectPath: string;
}

export const initialState: AuthState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/',
};

const authStart = (state: AuthState) => {
  return { ...state, error: null, loading: true };
};

const authSuccess = (state: AuthState, acton: any) => {
  // @ts-ignore
  const { token, userId } = action;
  return {
    ...state,
    token,
    userId,
    loading: false,
    error: null,
  };
};

const authFail = (state: AuthState, acton: AnyAction) => {
  return {
    ...state,
    // @ts-ignore
    error: action.error,
    loading: false,
  };
};

const authLogout = (state: AuthState, acton: AnyAction) => {
  return {
    ...state,
    token: null,
    userId: null,
  };
};

// todo do we really need to separate the functions from the reducer? Can't we just return the objects from here
const reducer = (state = initialState, action: AnyAction) => {
  const { token, userId, error } = action;
  switch (action.type) {
    case HYDRATE:
      // our action do not return a property named payload
      return { ...state };
    case AUTH_START:
      return authStart(state);
    case AUTH_SUCCESS:
      return {
        ...state,
        token,
        userId,
        loading: false,
        error: null,
      };
    case AUTH_FAIL:
      return { ...state, error };
    case AUTH_LOGOUT:
      return { ...state, userId: null, token: null };
    // todo not all actions of the original implementation of maximilan is handled here
    default:
      return state;
  }
};

export default reducer;
