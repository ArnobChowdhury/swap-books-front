import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import {
  AUTH_SUCCESS,
  AUTH_TOKEN_REFRESH,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_FAIL,
  AUTH_REDIRECT_SUCCESS,
  AUTH_REDIRECT_START,
  AUTH_ERROR_REFRESH,
  AUTH_CHECKING_STATE_END,
  FORGOT_PASS_START,
  FORGOT_PASS_SUCCESS,
  FORGOT_PASS_FAIL,
  RESET_PASS_START,
  RESET_PASS_SUCCESS,
  RESET_PASS_FAIL,
} from '../../actions/actionTypes';

export interface AuthState {
  accessToken: string | null;
  userId: string | null;
  expirationDate: number;
  error: { message: string; status: number } | null;
  loading: boolean;
  authRedirectPath: string | null;
  authCheckingState: boolean;
  forgotPassMsg: string | null;
  forgotPassLoading: boolean;
  forgotPassErr: { message: string; status: number } | null;
  resetPassMsg: string | null;
  resetPassLoading: boolean;
  resetPassErr: { message: string; status: number } | null;
}

export const initialState: AuthState = {
  accessToken: null,
  userId: null,
  expirationDate: 0,
  error: null,
  loading: false,
  authCheckingState: true,
  authRedirectPath: null,
  forgotPassLoading: false,
  forgotPassMsg: null,
  forgotPassErr: null,
  resetPassLoading: false,
  resetPassMsg: null,
  resetPassErr: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  const {
    accessToken,
    userId,
    expirationDate,
    error,
    authRedirectPath,
    forgotPassMsg,
    forgotPassErr,
    resetPassMsg,
    resetPassErr,
  } = action;

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
    case AUTH_REDIRECT_START:
      return { ...state, authRedirectPath };
    case AUTH_REDIRECT_SUCCESS:
      return { ...state, authRedirectPath: null };
    case AUTH_LOGOUT:
      return {
        ...state,
        authRedirectPath: '/',
        authCheckingState: false,
      };
    case AUTH_ERROR_REFRESH:
      return { ...state, error: null };
    case FORGOT_PASS_START:
      return { ...state, forgotPassLoading: true };
    case FORGOT_PASS_SUCCESS:
      return { ...state, forgotPassLoading: false, forgotPassMsg };
    case FORGOT_PASS_FAIL:
      return { ...state, forgotPassLoading: false, forgotPassErr };
    case RESET_PASS_START:
      return { ...state, resetPassLoading: true };
    case RESET_PASS_SUCCESS:
      return { ...state, resetPassLoading: false, resetPassMsg };
    case RESET_PASS_FAIL:
      return { ...state, resetPassLoading: false, resetPassErr };
    case AUTH_CHECKING_STATE_END: {
      return { ...state, authCheckingState: false };
    }

    default:
      return state;
  }
};

export default reducer;
