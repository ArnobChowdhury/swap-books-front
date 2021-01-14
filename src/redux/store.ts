import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { MakeStore, createWrapper } from 'next-redux-wrapper';
import rootReducer, { RootState } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig } from './config';

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const bindMiddlewares = (middleware: Middleware[]) => {
  if (process.env.NODE_ENV === 'development') {
    return composeWithDevTools(applyMiddleware(...middleware));
  } else {
    return applyMiddleware(...middleware);
  }
};

let store: Store<RootState>;
const makeStore: MakeStore<RootState> = () => {
  if (!process.browser) {
    return createStore(rootReducer, bindMiddlewares([thunk]));
  }
  store = createStore(persistedReducer, bindMiddlewares([thunk]));
  // @ts-ignore
  store.__persistor = persistStore(store);
  return store;
};

export { store };

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });