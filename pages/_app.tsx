// @ts-nocheck
// import React from 'react';
// import App, { AppInitialProps } from 'next/app';
// import Head from 'next/head';

// import withRedux from 'next-redux-wrapper';
// import { makeStore } from 'redux/store';
// import { Provider } from 'react-redux';
// import { LOGIN } from 'redux/reducers/auth';

// type MyAppProps = AppInitialProps;

// export default withRedux(makeStore)(
//   class MyApp extends App<MyAppProps> {
//     static async getInitialProps({ Component, ctx }) {
//       const token = 'TODO';
//       ctx.store.dispatch({ type: LOGIN, token });

//       const pageProps = Component.getInitialProps
//         ? await Component.getInitialProps(ctx)
//         : {};

//       return { pageProps };
//     }

//     render() {
//       const { Component, pageProps, store } = this.props;

//       return (
//         <>
//           <Head>
//             <title>Hello</title>
//             <link rel="icon" href="/favicon.ico" />
//           </Head>
//           <Provider store={store}>
//             <Component {...pageProps} />
//           </Provider>
//         </>
//       );
//     }
//   },
// );

import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from 'redux/store';
// @ts-ignore
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default wrapper.withRedux(WrappedApp);
