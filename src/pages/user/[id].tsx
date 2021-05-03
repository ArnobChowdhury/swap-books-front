import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { User } from 'widgets/User';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { ModalManager } from 'widgets/ModalManager';
import { Posts } from 'widgets/Posts';
import { NavBar } from 'widgets/NavBar';
import { useWindowSize } from 'hooks';
import { largeScreen, mediumScreen } from 'mediaConfig';
import { PageLayout } from 'hoc/PageLayout';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import Head from 'next/head';

const UserPage: NextPage = (): JSX.Element => {
  const { accessToken } = useSelector((store: RootState) => store.auth);
  const { profileName } = useSelector((store: RootState) => store.profile);
  const isSignedIn = Boolean(accessToken);

  const router = useRouter();
  const { id: profileId } = router.query;

  const rootContext = useContext(RootContext);
  const {
    contentType,
    setContentType,
    setShowDropDown,
    setShowModal,
  } = rootContext as RootContextProps;
  const { width } = useWindowSize();
  console.log(contentType);

  useEffect(() => {
    setContentType('User');
    setShowDropDown(false);
    setShowModal(false);
  }, []);

  return (
    <>
      <Head>
        <title>{profileName} | Pustokio</title>
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

      <PageLayout>
        <>
          <User profileId={profileId as string} />
          <Posts profileId={profileId as string} />
        </>
      </PageLayout>
    </>
  );
};

export default UserPage;
