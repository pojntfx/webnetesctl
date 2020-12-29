import {
  faBell,
  faCaretDown,
  faCube,
  faFile,
  faHandshake,
  faNetworkWired,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, List, Menu, Popover, Space, Tooltip } from "antd";
import { Content } from "antd/lib/layout/layout";
import i18n from "i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import universeTexture from "three-globe/example/img/night-sky.png";
import { Layout } from "../components/layout-wrapper";
import Navbar, {
  DesktopHeader,
  MobileHeader,
  SearchInput,
  TabsMobile,
} from "../components/navbar";
import en from "../i18n/en";
import "../styles/index.less";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: "en",
  fallbackLng: "en",
});

const GlobalStyle = createGlobalStyle`
body {
  background: url(${universeTexture}) no-repeat center center fixed; 
  background-size: cover;
}
`;

const theme = {};

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Layout>
          <MobileHeader>
            <Tooltip title={t("findNodeOrResource")}>
              <Button type="text" shape="circle">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Tooltip>

            <Space>
              <Popover
                title={t("notifications")}
                trigger="click"
                visible={notificationsOpen}
                onVisibleChange={(open) => setNotificationsOpen(open)}
                content={
                  <List>
                    <List.Item>Example notification 1</List.Item>
                    <List.Item>Example notification 2</List.Item>
                  </List>
                }
              >
                <Button
                  type="text"
                  shape="circle"
                  onClick={() => setNotificationsOpen(true)}
                >
                  <FontAwesomeIcon icon={faBell} />
                </Button>
              </Popover>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="resource">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faCube} />
                        {t("resource")}
                      </Space>
                    </Menu.Item>
                    <Menu.Item key="cluster">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faNetworkWired} />
                        {t("cluster")}
                      </Space>
                    </Menu.Item>
                    <Menu.Item key="file">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faFile} />
                        {t("file")}
                      </Space>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button type="text" shape="circle">
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Dropdown>

              <Tooltip title={t("invite")}>
                <Button type="primary" shape="circle">
                  <FontAwesomeIcon icon={faHandshake} />
                </Button>
              </Tooltip>
            </Space>
          </MobileHeader>

          <DesktopHeader>
            <Navbar path={router.pathname} />

            <SearchInput placeholder={t("findNodeOrResource")} />

            <Space>
              <Popover
                title={t("notifications")}
                trigger="click"
                visible={notificationsOpen}
                onVisibleChange={(open) => setNotificationsOpen(open)}
                content={
                  <List>
                    <List.Item>Example notification 1</List.Item>
                    <List.Item>Example notification 2</List.Item>
                  </List>
                }
              >
                <Button
                  type="text"
                  shape="circle"
                  onClick={() => setNotificationsOpen(true)}
                >
                  <FontAwesomeIcon icon={faBell} />
                </Button>
              </Popover>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="resource">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faCube} />
                        {t("resource")}
                      </Space>
                    </Menu.Item>
                    <Menu.Item key="cluster">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faNetworkWired} />
                        {t("cluster")}
                      </Space>
                    </Menu.Item>
                    <Menu.Item key="file">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faFile} />
                        {t("file")}
                      </Space>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <Space>
                    <FontAwesomeIcon icon={faPlus} />
                    {t("create")}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </Space>
                </Button>
              </Dropdown>

              <Button type="primary">
                <Space>
                  <FontAwesomeIcon icon={faHandshake} />
                  {t("invite")}
                </Space>
              </Button>
            </Space>
          </DesktopHeader>

          <Content>
            <Component {...pageProps} />
          </Content>

          <TabsMobile>
            <Navbar path={router.pathname} />
          </TabsMobile>
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
