import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { SocketIO } from 'hoc/Sockets';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/**
       @ts-ignore*/}
      <PersistGate persistor={store.__persistor} loading={null}>
        <SocketIO>
          <Component {...pageProps} />
        </SocketIO>
      </PersistGate>
    </ThemeProvider>
  );
};

export default wrapper.withRedux(WrappedApp);
