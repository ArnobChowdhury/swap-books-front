import React, { useState, FC, useEffect } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { SocketIO } from 'hoc/Sockets';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';
import { RootContext, PopupType, ContentType } from 'contexts/RootContext';
import { useRouter } from 'next/router';
import { useWindowSize } from 'hooks/useWindowSize';
import { largeScreen } from 'mediaConfig';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [contentType, setContentType] = useState<ContentType>('Posts');

  const { pathname } = useRouter();
  const { width } = useWindowSize();

  useEffect(() => {
    if (width < largeScreen) {
      if (pathname === '/' && contentType !== 'Posts') {
        setContentType('Posts');
      } else if (pathname === '/messages' && contentType !== 'Messages') {
        setContentType('Messages');
      } else if (pathname === '/notifications' && contentType !== 'Notifications') {
        setContentType('Notifications');
      } else if (pathname === '/user/[id]' && contentType !== 'User') {
        setContentType('User');
      }
    }
  }, [width]);

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
