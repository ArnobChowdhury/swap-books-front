import React, { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { ModalManager } from 'widgets/ModalManager';
import { LandingPage } from 'widgets/LandingPage';
import { Posts } from 'widgets/Posts';
import { NavBar } from 'widgets/NavBar';
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
  const { userLon, userLat } = useSelector((s: RootState) => s.user);
  const isSignedIn = Boolean(accessToken);

  useEffect(() => {
    setContentType('Posts');
  }, []);

  return (
    <>
      <Head>
        <title>Pustokio</title>
      </Head>
      <ModalManager />
      {!isSignedIn && userLon === null && userLat === null && <LandingPage />}
      {(isSignedIn || (userLon && userLat)) && (
        <>
          <TopBar
            navBar={width >= largeScreen && <NavBar />}
            activityBar={
              (width >= mediumScreen || contentType === 'Posts') && <ActivityBar />
            }
          />
          {/* {width < mediumScreen && <ActivityBar />} */}
          {isSignedIn && width < largeScreen && <NavBar />}

          <PageLayout largeTopMargin={contentType === 'Posts'}>
            <Posts />
          </PageLayout>
        </>
      )}
    </>
  );
};

export default Root;
