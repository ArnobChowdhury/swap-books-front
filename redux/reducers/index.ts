import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';
import books, { BooksState } from './books';

export type RootState = {
  auth: AuthState;
  books: BooksState;
};

const rootReducer = combineReducers({
  auth,
  books,
});

export default rootReducer;
