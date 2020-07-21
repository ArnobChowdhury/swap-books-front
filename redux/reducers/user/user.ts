import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

import {
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
} from '../../actions/actionTypes';

export interface UserState {
  name: string;
  dob: string;
  sex: string;
  loading: boolean;
  error: any;
}

export const initialState: UserState = {
  name: '',
  dob: '',
  sex: '',
  loading: false,
  error: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  const { name, dob, sex, error } = action;
  switch (action.type) {
    case HYDRATE:
      return { ...state };
    case CREATE_USER_START:
      return { ...state, loading: true };
    case CREATE_USER_SUCCESS:
      return { ...state, loading: false, name, dob, sex };
    case CREATE_USER_FAIL:
      return { ...state, loading: false, error };
    default:
      return state;
  }
};

export default reducer;
