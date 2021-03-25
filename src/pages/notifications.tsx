import React, { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { ModalManager } from 'widgets/ModalManager';
import { NavBar } from 'widgets/NavBar';
import { Notifications } from 'widgets/Notifications';
import { useWindowSize } from 'hooks';
import { largeScreen, mediumScreen } from 'mediaConfig';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { PageLayout } from 'hoc/PageLayout';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import Head from 'next/head';

const Root: NextPage = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { contentType, setContentType } = rootContext as RootContextProps;
  const { width } = useWindowSize();
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);

  useEffect(() => {
    setContentType('Notifications');
  }, []);

  return (
    <>
      <Head>
        <title>Notifications | Pustokio</title>
      </Head>
      <ModalManager />
      <TopBar
        navBar={width >= largeScreen && <NavBar />}
        // activityBar={width >= mediumScreen && <ActivityBar />}
        activityBar={
          (width >= mediumScreen || contentType === 'Posts') && <ActivityBar />
        }
      />
      {/* {width < mediumScreen && <ActivityBar />} */}
      {isSignedIn && width < largeScreen && <NavBar />}

      <PageLayout largeTopMargin={contentType === 'Posts'}>
        <Notifications />
      </PageLayout>
    </>
  );
};

export default Root;
