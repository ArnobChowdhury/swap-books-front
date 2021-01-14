import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';
import books, { BooksState } from './books';
import user, { UserState } from './user';
import profile, { ProfileState } from './profile';
import notifications, { NotificationState } from './notifications';
import message, { MessageProps } from './message';
import { persistReducer } from 'redux-persist';
import { authPersisConfig } from '../config';

export type RootState = {
  auth: AuthState;
  books: BooksState;
  user: UserState;
  notifications: NotificationState;
  profile: ProfileState;
  message: MessageProps;
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersisConfig, auth),
  books,
  user,
  notifications,
  profile,
  message,
});

export default rootReducer;
