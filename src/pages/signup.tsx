import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ModalManager } from 'widgets/ModalManager';
import { SignupWidget } from 'widgets/SignupWidget';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import Head from 'next/head';
import { PageLayout } from 'hoc/PageLayout';

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
      <PageLayout formPage>
        <SignupWidget />
      </PageLayout>
    </>
  );
};

export default UserDetails;
