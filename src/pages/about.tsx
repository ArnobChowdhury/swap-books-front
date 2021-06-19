import { NextPage } from 'next';
import Head from 'next/head';
import { About } from 'components/About';

const AboutPage: NextPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>About | Pustokio</title>
      </Head>
      <About />
    </>
  );
};

export default AboutPage;
