import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ModalManager } from 'widgets/ModalManager';
import { ForgotPassword } from 'widgets/ForgotPassword';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { PageLayout } from 'hoc/PageLayout';
import Head from 'next/head';

const ForgotPasswordPage: NextPage = (): JSX.Element => {
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
        <title>Forgot Password | Pustokio</title>
      </Head>
      <TopBar />
      <ModalManager />
      <PageLayout formPage>
        <ForgotPassword />
      </PageLayout>
    </>
  );
};

export default ForgotPasswordPage;
