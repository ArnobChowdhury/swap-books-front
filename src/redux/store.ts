import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper';
import rootReducer, { RootState } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const bindMiddlewares = (middleware: Middleware[]) => {
  if (process.env.NODE_ENV === 'development') {
    return composeWithDevTools(applyMiddleware(...middleware));
  } else {
    return applyMiddleware(...middleware);
  }
};

let store: Store<RootState>;
const makeStore: MakeStore<RootState> = (context: Context) => {
  store = createStore(rootReducer, bindMiddlewares([thunk]));
  return store;
};

export { store };

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
