import React, { useState } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { Posts } from 'widgets/Posts';
// TODO: Need to make Posts widget
//import {} from 'widgets/Posts';
import { RootContext, PopupType } from 'contexts/RootContext';

const Root: NextPage = (): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  return (
    <RootContext.Provider
      value={{ showModal, setShowModal, popupType, setPopupType }}
    >
      <TopBar />
      <ActivityBar />
      <Posts />
    </RootContext.Provider>
  );
};

export default Root;
