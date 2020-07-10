import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { MakeStore, Context, createWrapper } from 'next-redux-wrapper';
import rootReducer, { RootState } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const makeStore: MakeStore<RootState> = (context: Context = {}) => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
};

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
