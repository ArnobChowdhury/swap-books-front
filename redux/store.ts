import { createStore, applyMiddleware, Middleware } from 'redux';
import thunk from 'redux-thunk';
import { MakeStore, createWrapper } from 'next-redux-wrapper';
import rootReducer, { RootState } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'bookswap',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const bindMiddlewares = (middleware: Middleware[]) => {
  if (process.env.NODE_ENV === 'development') {
    return composeWithDevTools(applyMiddleware(...middleware));
  } else {
    return applyMiddleware(...middleware);
  }
};

const makeStore: MakeStore<RootState> = () => {
  if (!process.browser) {
    return createStore(rootReducer, bindMiddlewares([thunk]));
  }
  const store = createStore(persistedReducer, bindMiddlewares([thunk]));
  // @ts-ignore
  store.__persistor = persistStore(store);
  return store;
};

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
