import React, { useState, FC } from 'react';
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
import { RootContext, PopupType } from 'contexts/RootContext';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();
  const { accessToken: userAuthenticated } = useSelector(
    (store: RootState) => store.auth,
  );

  const [showModal, setShowModal] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType | null>(null);

  return (
    <RootContext.Provider
      value={{ showModal, setShowModal, popupType, setPopupType }}
    >
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
    </RootContext.Provider>
  );
};

export default wrapper.withRedux(WrappedApp);
