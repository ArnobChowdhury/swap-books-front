import React, { useState, FC, useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
import { ThemeProvider } from 'styled-components';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import {
  authRedirectSuccess,
  authCheckState,
  authLogoutForOtherTabs,
} from 'redux/actions/auth';
import { SocketIO } from 'hoc/Sockets';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';
import {
  RootContext,
  PopupType,
  ContentType,
  UserProfileTabType,
} from 'contexts/RootContext';
import { useRouter } from 'next/router';
import { useWindowSize } from 'hooks/useWindowSize';
import { largeScreen } from 'mediaConfig';
import {
  HOME_ROUTE,
  MESSAGES_ROUTE,
  NOTIFICATIONS_ROUTE,
  USER_ROUTE,
} from 'frontEndRoutes';
import { AuthStateLoader } from 'components/AuthStateLoader';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();
  const { authRedirectPath, authCheckingState } = useSelector(
    (s: RootState) => s.auth,
  );
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [contentType, setContentType] = useState<ContentType>('Posts');
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedTabUserProfile, setSelectedTabUserProfile] = useState<
    UserProfileTabType
  >('Available to Swap');

  const { pathname, push: routerPush } = useRouter();
  const { width } = useWindowSize();

  // LOGOUT AND LOGIN FUNCTIONALITY FOR OTHER TABS
  useEffect(() => {
    const logoutListenerFunc = (event: StorageEvent) => {
      if (event.key === 'accessToken') {
        if (event.newValue === null) {
          dispatch(authLogoutForOtherTabs());
        } else if (event.oldValue === null && event.newValue) {
          // if authCheckState is fired synchronously (without setTimeout), authCheckState cannot get localStorage values
          setTimeout(() => {
            dispatch(authCheckState());
          }, 1000);
        }
      }
    };

    window.addEventListener('storage', logoutListenerFunc);

    return () => {
      window.removeEventListener('storage', logoutListenerFunc);
    };
  }, []);

  useEffect(() => {
    dispatch(authCheckState());
  }, []);

  useEffect(() => {
    if (authRedirectPath) {
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
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
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
          selectedTabUserProfile,
          setSelectedTabUserProfile,
        }}
      >
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SocketIO>
            <script>0</script>
            {authCheckingState && <AuthStateLoader />}
            {!authCheckingState && <Component {...pageProps} />}
          </SocketIO>
        </ThemeProvider>
      </RootContext.Provider>
    </>
  );
};

export default wrapper.withRedux(WrappedApp);
