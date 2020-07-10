import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';

// todo
// eslint-disable-next-line react/prop-types
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Component {...pageProps} />
  </ThemeProvider>
);

export default wrapper.withRedux(WrappedApp);
