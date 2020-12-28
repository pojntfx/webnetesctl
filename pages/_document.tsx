import Document, { Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="theme-color" content="#141414" />
          <link rel="manifest" href="/manifest.json" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link rel="shortcut icon" href="/icons/apple-touch-icon.png" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://webnetesctl.vercel.app/" />
          <meta name="twitter:title" content="webnetesctl" />
          <meta
            name="twitter:description"
            content="Like kubectl, but for webnetes."
          />
          <meta
            name="twitter:image"
            content="https://webnetesctl.vercel.app/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@pojntfx" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="webnetesctl" />
          <meta
            property="og:description"
            content="Like kubectl, but for webnetes."
          />
          <meta property="og:site_name" content="webnetesctl" />
          <meta property="og:url" content="https://webnetesctl.vercel.app/" />
          <meta
            property="og:image"
            content="https://webnetesctl.vercel.app/icons/apple-touch-icon.png"
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
