import React, { useContext } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { ModalManager } from 'widgets/ModalManager';
import { Posts } from 'widgets/Posts';
import { NavBar } from 'widgets/NavBar';
import { Notifications } from 'widgets/Notifications';
import { Message } from 'widgets/Message';
import { useWindowSize } from 'hooks';
import { largeScreen } from 'mediaConfig';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { PageLayout } from 'hoc/PageLayout';
import { RootContext, RootContextProps } from 'contexts/RootContext';

const Root: NextPage = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { contentType } = rootContext as RootContextProps;
  const { width } = useWindowSize();
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);

  return (
    <>
      <ModalManager />
      <TopBar
        navBar={width >= largeScreen && <NavBar />}
        // activityBar={width >= mediumScreen && <ActivityBar />}
        activityBar={<ActivityBar />}
      />
      {/* {width < mediumScreen && <ActivityBar />} */}
      {isSignedIn && width < largeScreen && <NavBar />}

      <PageLayout>
        {(width >= largeScreen || contentType === 'Posts') && <Posts />}
        {width < largeScreen && contentType === 'Notifications' && <Notifications />}
        {width < largeScreen && contentType === 'Messages' && <Message />}
      </PageLayout>
    </>
  );
};

export default Root;
