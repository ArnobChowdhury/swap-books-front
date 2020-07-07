import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MakeStore, Context, createWrapper } from 'next-redux-wrapper';
import rootReducer, { RootState } from './reducers';

const makeStore: MakeStore<RootState> = (context: Context = {}) => {
  return createStore(rootReducer, applyMiddleware(thunk));
};

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
