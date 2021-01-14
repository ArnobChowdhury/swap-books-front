import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  UPDATE_USER_INFO,
  UPDATE_USER_LOC_START,
  UPDATE_USER_LOC_SUCCESS,
  UPDATE_USER_LOC_FAIL,
} from '../../actions/actionTypes';

export interface UserState {
  _id?: string | null;
  name: string | null;
  dob: string | null;
  sex: string | null;
  userCreationOnGoing: boolean;
  userCreationSuccessful: boolean;
  locationUpdatetOnGoing: boolean;
  userLon: number | null;
  userLat: number | null;
  error: Error | null;
}

export const initialState: UserState = {
  name: null,
  dob: null,
  sex: null,
  userCreationOnGoing: false,
  userCreationSuccessful: false,
  locationUpdatetOnGoing: false,
  userLon: null,
  userLat: null,
  error: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  const { name, dob, sex, error, userCreationSuccessful, userLat, userLon } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case CREATE_USER_START:
      return { ...state, userCreationOnGoing: true };
    case CREATE_USER_SUCCESS:
      return { ...state, userCreationOnGoing: false, userCreationSuccessful: true };
    case CREATE_USER_FAIL:
      return { ...state, userCreationOnGoing: false, error };
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
        error,
        locationUpdatetOnGoing: false,
      };
    default:
      return state;
  }
};

export default reducer;
