import React, { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { ModalManager } from 'widgets/ModalManager';
import { NavBar } from 'widgets/NavBar';
import { Message } from 'widgets/Message';
import { useWindowSize } from 'hooks';
import { largeScreen, mediumScreen } from 'mediaConfig';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { PageLayout } from 'hoc/PageLayout';
import { RootContext, RootContextProps } from 'contexts/RootContext';

const Root: NextPage = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { contentType, setContentType } = rootContext as RootContextProps;
  const { width } = useWindowSize();
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);

  useEffect(() => {
    setContentType('Messages');
  }, []);

  return (
    <>
      <ModalManager />
      <TopBar
        navBar={width >= largeScreen && <NavBar />}
        activityBar={
          (width >= mediumScreen || contentType === 'Posts') && <ActivityBar />
        }
      />
      {isSignedIn && width < largeScreen && <NavBar />}
      <PageLayout>
        <Message />
      </PageLayout>
    </>
  );
};

export default Root;
