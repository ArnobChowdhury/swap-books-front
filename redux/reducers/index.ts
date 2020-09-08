import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';
import books, { BooksState } from './books';
import user, { UserState } from './user';
import notifications, { NotificationState } from './notifications';
import { persistReducer } from 'redux-persist';
import { authPersisConfig } from '../config';

export type RootState = {
  auth: AuthState;
  books: BooksState;
  user: UserState;
  notifications: NotificationState;
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersisConfig, auth),
  books,
  user,
  notifications,
});

export default rootReducer;
