import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ModalManager } from 'widgets/ModalManager';
import { ResetPassWidget } from 'widgets/ResetPassWidget';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import Head from 'next/head';
import { PageLayout } from 'hoc/PageLayout';
import { useRouter } from 'next/router';

const ResetPass: NextPage = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { popupType, setPopupType } = rootContext as RootContextProps;

  const router = useRouter();
  const { token } = router.query;

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
        <ResetPassWidget token={token as string} />
      </PageLayout>
    </>
  );
};

export default ResetPass;
