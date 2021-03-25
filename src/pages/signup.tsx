import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ModalManager } from 'widgets/ModalManager';
import { SignupWidget } from 'widgets/SignupWidget';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import Head from 'next/head';

const UserDetails: NextPage = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { popupType, setPopupType } = rootContext as RootContextProps;

  useEffect(() => {
    if (popupType) {
      setPopupType(null);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sign Up | Pustokio</title>
      </Head>
      <TopBar />
      <ModalManager />
      <SignupWidget />
    </>
  );
};

export default UserDetails;
