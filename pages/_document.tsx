import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  //@ts-ignore
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            as="font"
            href="https://fonts.googleapis.com/css?family=Quicksand:300,400,500,600,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
