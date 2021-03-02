import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';
import books, { BooksState } from './books';
import user, { UserState } from './user';
import profile, { ProfileState } from './profile';
import notifications, { NotificationState } from './notifications';
import message, { MessageProps } from './message';
import { Action } from 'redux';
import { AUTH_LOGOUT } from '../actions/actionTypes';

export type RootState = {
  auth: AuthState;
  books: BooksState;
  user: UserState;
  notifications: NotificationState;
  profile: ProfileState;
  message: MessageProps;
};

const appReducer = combineReducers({
  auth: auth,
  books,
  user,
  notifications,
  profile,
  message,
});

const rootReducer = (state: RootState | undefined, action: Action) => {
  const { type } = action;
  if (type === AUTH_LOGOUT) {
    state = undefined;
  }

  // @ts-ignore
  return appReducer(state, action);
};

export default rootReducer;
