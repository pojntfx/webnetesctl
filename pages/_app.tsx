import type { AppProps } from "next/app";

import "../index.less";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
