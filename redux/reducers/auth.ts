import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export interface LoginAction {
  type: typeof LOGIN;
  token: string;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    case LOGIN:
      return { ...state, token: action.token };
    case LOGOUT:
      return { token: null };
    default:
      return state;
  }
};
