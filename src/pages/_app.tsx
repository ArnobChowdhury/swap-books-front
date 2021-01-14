import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { SocketIO } from 'hoc/Sockets';
import { Message } from 'hoc/Message';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();
  const { accessToken: userAuthenticated } = useSelector(
    (store: RootState) => store.auth,
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/**
       @ts-ignore*/}
      <PersistGate persistor={store.__persistor} loading={null}>
        <SocketIO>
          {userAuthenticated && <Message />}
          <Component {...pageProps} />
        </SocketIO>
      </PersistGate>
    </ThemeProvider>
  );
};

export default wrapper.withRedux(WrappedApp);
