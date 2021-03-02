import React, { useState, FC, useEffect } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
import { ThemeProvider } from 'styled-components';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import { authRedirectSuccess, authCheckState } from 'redux/actions/auth';
import { SocketIO } from 'hoc/Sockets';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';
import { RootContext, PopupType, ContentType } from 'contexts/RootContext';
import { useRouter } from 'next/router';
import { useWindowSize } from 'hooks/useWindowSize';
import { largeScreen } from 'mediaConfig';
import {
  HOME_ROUTE,
  MESSAGES_ROUTE,
  NOTIFICATIONS_ROUTE,
  USER_ROUTE,
} from 'frontEndRoutes';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();
  const { authRedirectPath } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [contentType, setContentType] = useState<ContentType>('Posts');
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const { pathname, push: routerPush } = useRouter();
  const { width } = useWindowSize();

  useEffect(() => {
    dispatch(authCheckState());
  }, []);

  useEffect(() => {
    if (
      authRedirectPath &&
      (pathname === MESSAGES_ROUTE ||
        pathname === USER_ROUTE ||
        pathname === NOTIFICATIONS_ROUTE)
    ) {
      routerPush(authRedirectPath);
      dispatch(authRedirectSuccess());
    }
  }, [authRedirectPath]);

  useEffect(() => {
    if (width < largeScreen) {
      if (pathname === HOME_ROUTE && contentType !== 'Posts') {
        setContentType('Posts');
      } else if (pathname === MESSAGES_ROUTE && contentType !== 'Messages') {
        setContentType('Messages');
      } else if (
        pathname === NOTIFICATIONS_ROUTE &&
        contentType !== 'Notifications'
      ) {
        setContentType('Notifications');
      } else if (pathname === USER_ROUTE && contentType !== 'User') {
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
        showDropDown,
        setShowDropDown,
      }}
    >
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <SocketIO>
          <Component {...pageProps} />
        </SocketIO>
      </ThemeProvider>
    </RootContext.Provider>
  );
};

export default wrapper.withRedux(WrappedApp);
