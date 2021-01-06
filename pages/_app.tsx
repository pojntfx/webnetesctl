import i18n from "i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { initReactI18next } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import en from "../i18n/en";
import frostedGlass from "../styles/frosted-glass";
import "../styles/index.less";

// Setup internationalization
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: "en",
  fallbackLng: "en",
});

// Global styles
// Prefer this over `index.less` due to proper scoping & templating support
const GlobalStyle = createGlobalStyle`
body {
  > #__next, > * > section, .ant-layout-content {
    height: 100%;
  }
}

/* AFRAME styles */
body {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  overflow-x: hidden;
}

#arjs-video {
  height: 100% !important;
}
/* End of AFRAME styles */

.ant-modal-mask {
  ${frostedGlass}
}

.ant-notification-notice-btn, .ant-modal-confirm-btns {
  width: 100%;
  overflow-x: auto;
}

.ant-modal-confirm-btns {
  white-space: nowrap;
  display: flex;

  > *:first-child {
    margin-left: auto;
  }
}

.ant-notification-notice {
  border: 1px solid #303030;
  ${frostedGlass}
}

/* Popovers & dropdowns should always be on top */
.ant-popover, .ant-dropdown {
  z-index: 9999;
}
`;

// Theme provider configuration
// For future use
const theme = {};

/**
 * MyApp is the main wrapper component, handling global state and interactive routing.
 *
 * @param param0 Props
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* PWA integration */}
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      {/* styled-components integration */}
      <GlobalStyle />

      <ThemeProvider theme={theme}>
        <BodyWrapper suppressHydrationWarning>
          {typeof window === "undefined" ? null : (
            <Router>
              <Component {...pageProps} />
            </Router>
          )}
        </BodyWrapper>
      </ThemeProvider>
    </>
  );
}

const BodyWrapper = styled.div`
  height: 100%;
`;

export default MyApp;
