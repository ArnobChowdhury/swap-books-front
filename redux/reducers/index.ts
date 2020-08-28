import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';
import books, { BooksState } from './books';
import user, { UserState } from './user';
import { persistReducer } from 'redux-persist';
import { authPersisConfig } from '../config';

export type RootState = {
  auth: AuthState;
  books: BooksState;
  user: UserState;
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersisConfig, auth),
  books,
  user,
});

export default rootReducer;
