import { NextPage } from 'next';
import { PageLayout } from 'hoc/PageLayout';
import Head from 'next/head';
import { HowItWorks } from 'components/HowItWorks';

const ForgotPasswordPage: NextPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>How it works | Pustokio</title>
      </Head>
      <HowItWorks />
    </>
  );
};

export default ForgotPasswordPage;
