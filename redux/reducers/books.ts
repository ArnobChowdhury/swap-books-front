import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { action } from '@storybook/addon-actions';
import {
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  FETCH_BOOKS_FAIL,
} from '../actions/actionTypes';

export interface BooksState {
  books: any;
  error: string | null;
  loading: boolean;
}

const initialState: BooksState = {
  // todo need to check what kind of json is returned, (possibly array)
  books: [],
  error: null,
  loading: false,
};

// todo do we really need to separate the functions from the reducer? Can't we just return the objects from here
const reducer = (state = initialState, action: AnyAction) => {
  const { books, error } = action;
  console.log('from reducer', books);
  switch (action.type) {
    case HYDRATE:
      // our action do not return a property named payload
      return { ...state };
    case FETCH_BOOKS_START:
      return { ...state, loading: true };
    case FETCH_BOOKS_SUCCESS:
      return { ...state, loading: false, books };
    case FETCH_BOOKS_FAIL:
      return { ...state, loading: false, error };
    default:
      return state;
  }
};

export default reducer;
