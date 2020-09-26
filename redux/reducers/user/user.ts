import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  UPDATE_USER_INFO,
} from '../../actions/actionTypes';

export interface UserState {
  _id?: string | null;
  name: string | null;
  dob: string | null;
  sex: string | null;
  userCreationOnGoing: boolean;
  userCreationSuccessful: boolean;
  error: any;
}

export const initialState: UserState = {
  name: null,
  dob: null,
  sex: null,
  userCreationOnGoing: false,
  userCreationSuccessful: false,
  error: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  const { name, dob, sex, error } = action;
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
        userCreationSuccessful: true,
        name,
        dob,
        sex,
      };
    default:
      return state;
  }
};

export default reducer;
