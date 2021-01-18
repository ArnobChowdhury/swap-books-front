import storage from 'redux-persist/lib/storage';
import { PersistConfig } from 'redux-persist';
import { AuthState } from './reducers/auth';

export const authPersisConfig: PersistConfig<AuthState> = {
  key: 'auth',
  storage,
  blacklist: ['loading'],
};

export const rootPersistConfig = {
  key: 'bookswap',
  storage,
  blacklist: ['auth', 'notifications', 'profile', 'message', 'books'],
};
