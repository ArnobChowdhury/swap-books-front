import { useContext, useEffect, useState } from 'react';
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
import { Tabs } from 'ui-kits/Tabs';

const UserPage: NextPage = (): JSX.Element => {
  const { accessToken, userId } = useSelector((store: RootState) => store.auth);
  const { profileName } = useSelector((store: RootState) => store.profile);
  const isSignedIn = Boolean(accessToken);

  const { query, asPath } = useRouter();
  const { id: profileId } = query;

  const rootContext = useContext(RootContext);
  const {
    contentType,
    setContentType,
    setShowDropDown,
    setShowModal,
    selectedTabUserProfile,
    setSelectedTabUserProfile,
  } = rootContext as RootContextProps;
  const { width } = useWindowSize();

  useEffect(() => {
    setContentType('User');
    setShowDropDown(false);
    setShowModal(false);
  }, [asPath]);

  const isOwners = userId === profileId;

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
          {isOwners && (
            <Tabs
              options={['Available to Swap', 'Swap Request Pending']}
              onClick={setSelectedTabUserProfile}
              selectedTab={selectedTabUserProfile}
            />
          )}
          <Posts
            profileId={profileId as string}
            selectedTab={selectedTabUserProfile}
          />
        </>
      </PageLayout>
    </>
  );
};

export default UserPage;
