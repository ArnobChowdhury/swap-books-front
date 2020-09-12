import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { BookShape, BooksState } from '../books';
import { UserState } from '../user';

import {
  FETCH_BOOKS_VISITING_PROFILE_START,
  FETCH_BOOKS_VISITING_PROFILE_SUCCESS,
  FETCH_BOOKS_VISITING_PROFILE_FAIL,
  FETCH_USER_VISITING_PROFILE_START,
  FETCH_USER_VISITING_PROFILE_SUCCESS,
  FETCH_USER_VISITING_PROFILE_FAIL,
} from '../../actions/actionTypes';

export interface VisitingProfileState {
  visitingProfileUser: UserState | null;
  visitingProfileBooks: BookShape[] | null;
  visitingProfileUserLoading: boolean;
  visitingProfileBooksLoading: boolean;
  visitingProfileUserError: Error | null;
  visitingProfileBooksError: Error | null;
}

export const initialState: VisitingProfileState = {
  visitingProfileUser: null,
  visitingProfileBooks: null,
  visitingProfileUserLoading: false,
  visitingProfileBooksLoading: false,
  visitingProfileUserError: null,
  visitingProfileBooksError: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  const { userBooks, userInfo, error } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case FETCH_BOOKS_VISITING_PROFILE_START:
      return { ...state, visitingProfileBooksLoading: true };
    case FETCH_BOOKS_VISITING_PROFILE_SUCCESS:
      return {
        ...state,
        visitingProfileBooksLoading: false,
        visitingProfileBooks: userBooks,
      };
    case FETCH_BOOKS_VISITING_PROFILE_FAIL:
      return { ...state, visitingProfileBooksLoading: false, error };
    case FETCH_USER_VISITING_PROFILE_START:
      return {
        ...state,
        visitingProfileUserLoading: true,
      };
    case FETCH_USER_VISITING_PROFILE_SUCCESS:
      return {
        ...state,
        visitingProfileUserLoading: false,
        visitingProfileUser: userInfo,
      };
    case FETCH_USER_VISITING_PROFILE_FAIL:
      return {
        ...state,
        error,
        visitingProfileUserLoading: false,
      };
    default:
      return state;
  }
};

export default reducer;
