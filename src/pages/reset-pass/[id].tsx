import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ModalManager } from 'widgets/ModalManager';
import { ResetPassWidget } from 'widgets/ResetPassWidget';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import Head from 'next/head';
import { PageLayout } from 'hoc/PageLayout';

const ResetPass: NextPage = (): JSX.Element => {
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
        <title>Reset Password | Pustokio</title>
      </Head>
      <TopBar />
      <ModalManager />
      <PageLayout formPage>
        <ResetPassWidget />
      </PageLayout>
    </>
  );
};

export default ResetPass;
