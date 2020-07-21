import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';
import books, { BooksState } from './books';
import user, { UserState } from './user';

export type RootState = {
  auth: AuthState;
  books: BooksState;
  user: UserState;
};

const rootReducer = combineReducers({
  auth,
  books,
  user,
});

export default rootReducer;
