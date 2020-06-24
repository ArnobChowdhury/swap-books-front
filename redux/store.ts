import { createStore, AnyAction } from 'redux';
import { MakeStore, Context, createWrapper } from 'next-redux-wrapper';
import rootReducer from './reducers';
import { RootState } from './reducers';

const makeStore: MakeStore<RootState> = (context: Context = {}) => {
  return createStore(rootReducer);
};

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
