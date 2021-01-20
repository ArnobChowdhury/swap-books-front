import React from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { ModalManager } from 'widgets/ModalManager';
import { Posts } from 'widgets/Posts';
import { useWindowSize } from 'hooks';
import { mediumScreen } from 'mediaConfig';

const Root: NextPage = (): JSX.Element => {
  const { width } = useWindowSize();

  return (
    <>
      <ModalManager />
      <TopBar activityBar={width >= mediumScreen && <ActivityBar />} />
      {width < mediumScreen && <ActivityBar />}
      <Posts />
    </>
  );
};

export default Root;
