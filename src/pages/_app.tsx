import React, { useState, FC } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { SocketIO } from 'hoc/Sockets';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';
import { RootContext, PopupType, ContentType } from 'contexts/RootContext';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [contentType, setContentType] = useState<ContentType>('Posts');

  return (
    <RootContext.Provider
      value={{
        showModal,
        setShowModal,
        popupType,
        setPopupType,
        contentType,
        setContentType,
      }}
    >
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
    </RootContext.Provider>
  );
};

export default wrapper.withRedux(WrappedApp);
