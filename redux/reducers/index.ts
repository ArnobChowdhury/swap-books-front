import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';

export type RootState = {
  auth: AuthState;
};

export default combineReducers({
  auth,
});
