import { useContext } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { User } from 'widgets/User';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { ModalManager } from 'widgets/ModalManager';
import { Posts } from 'widgets/Posts';
import { NavBar } from 'widgets/NavBar';
import { Notifications } from 'widgets/Notifications';
import { Message } from 'widgets/Message';
import { useWindowSize } from 'hooks';
import { largeScreen, mediumScreen } from 'mediaConfig';
import { PageLayout } from 'hoc/PageLayout';
import { RootContext, RootContextProps } from 'contexts/RootContext';

const UserPage: NextPage = (): JSX.Element => {
  const { accessToken } = useSelector((store: RootState) => store.auth);
  const isSignedIn = Boolean(accessToken);

  const router = useRouter();
  const { id: profileId } = router.query;

  const rootContext = useContext(RootContext);
  const { contentType } = rootContext as RootContextProps;
  const { width } = useWindowSize();

  return (
    <>
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
        {(width >= largeScreen || contentType === 'Posts') && (
          <>
            <User profileId={profileId as string} />
            <Posts profileId={profileId as string} />
          </>
        )}
        {width < largeScreen && contentType === 'Notifications' && <Notifications />}
        {width < largeScreen && contentType === 'Messages' && <Message />}
      </PageLayout>
    </>
  );
};

export default UserPage;
