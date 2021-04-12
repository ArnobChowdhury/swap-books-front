import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  CREATE_USER_REFRESH,
  UPDATE_USER_INFO,
  UPDATE_USER_LOC_START,
  UPDATE_USER_LOC_SUCCESS,
  UPDATE_USER_LOC_FAIL,
  VERIFY_EMAIL_START,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAIL,
  ADD_A_BOOK_SUCCESS,
  MAKE_UNAVAILABLE_SUCCESS,
} from '../../actions/actionTypes';

export interface UserState {
  name: string | null;
  userCreationOnGoing: boolean;
  userCreationSuccessful: boolean;
  userCreationSuccessfulMsg: string | null;
  userCreationError: { message: string; status: number } | null;
  locationUpdatetOnGoing: boolean;
  userLon: number | null;
  userLat: number | null;
  locationUpdatetError: { message: string; status: number } | null;
  verifyEmailReqOnGoing: boolean;
  verifyEmailSuccessMsg: string | null;
  verifyEmailErr: { message: string; status: number } | null;
  booksAvailableToSwap: number;
}

export const initialState: UserState = {
  name: null,
  userCreationOnGoing: false,
  userCreationSuccessful: false,
  userCreationSuccessfulMsg: null,
  userCreationError: null,
  locationUpdatetOnGoing: false,
  userLon: null,
  userLat: null,
  locationUpdatetError: null,
  verifyEmailReqOnGoing: false,
  verifyEmailSuccessMsg: null,
  verifyEmailErr: null,
  booksAvailableToSwap: 0,
};

const reducer = (state = initialState, action: AnyAction) => {
  const {
    name,
    dob,
    sex,
    userCreationError,
    userCreationSuccessful,
    userCreationSuccessfulMsg,
    userLat,
    userLon,
    locationUpdatetError,
    verifyEmailSuccessMsg,
    verifyEmailErr,
    booksAvailableToSwap,
  } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case CREATE_USER_START:
      return { ...state, userCreationOnGoing: true };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        userCreationOnGoing: false,
        userCreationSuccessful: true,
        userCreationSuccessfulMsg,
      };
    case CREATE_USER_FAIL:
      return { ...state, userCreationOnGoing: false, userCreationError };
    case CREATE_USER_REFRESH:
      return { ...state, userCreationOnGoing: false, userCreationError: null };
    case VERIFY_EMAIL_START:
      return { ...state, verifyEmailReqOnGoing: true };
    case VERIFY_EMAIL_SUCCESS:
      return { ...state, verifyEmailReqOnGoing: false, verifyEmailSuccessMsg };
    case VERIFY_EMAIL_FAIL:
      return { ...state, verifyEmailReqOnGoing: false, verifyEmailErr };
    case UPDATE_USER_INFO:
      return {
        ...state,
        userCreationOnGoing: false,
        userCreationSuccessful,
        name,
        dob,
        sex,
        userLon,
        userLat,
        booksAvailableToSwap,
      };
    case UPDATE_USER_LOC_START:
      return {
        ...state,
        locationUpdatetOnGoing: true,
      };
    case UPDATE_USER_LOC_SUCCESS:
      return {
        ...state,
        userLat,
        userLon,
        locationUpdatetOnGoing: false,
      };
    case UPDATE_USER_LOC_FAIL:
      return {
        ...state,
        locationUpdatetError,
        locationUpdatetOnGoing: false,
      };
    case ADD_A_BOOK_SUCCESS:
      const { booksAvailableToSwap: currentCount } = state;
      return { ...state, booksAvailableToSwap: currentCount + 1 };
    case MAKE_UNAVAILABLE_SUCCESS: {
      const { booksAvailableToSwap: currentCount } = state;
      return { ...state, booksAvailableToSwap: currentCount - 1 };
    }
    default:
      return state;
  }
};

export default reducer;
