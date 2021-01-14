import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  FETCH_PROFILE_START,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
} from '../../actions/actionTypes';

export interface ProfileReqResponse {
  name: string | null;
}

export interface ProfileState {
  profileName: string | null;
  profileLoading: boolean;
  profileError: Error | null;
}

export const initialState: ProfileState = {
  profileName: null,
  profileLoading: false,
  profileError: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  const { userInfo, error } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case FETCH_PROFILE_START:
      return {
        ...state,
        profileLoading: true,
      };
    case FETCH_PROFILE_SUCCESS:
      const { name } = userInfo;
      return {
        ...state,
        profileLoading: false,
        profileName: name,
      };
    case FETCH_PROFILE_FAIL:
      return {
        ...state,
        profileError: error,
        profileLoading: false,
      };
    default:
      return state;
  }
};

export default reducer;
