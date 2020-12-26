import i18n from "i18next";
import type { AppProps } from "next/app";
import { initReactI18next } from "react-i18next";
import en from "../i18n/en";
import "../index.less";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: "en",
  fallbackLng: "en",
});

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
