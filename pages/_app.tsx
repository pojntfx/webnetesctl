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
import CreateResourceModal from "../components/create-resource-modal";
import { Layout } from "../components/layout-wrapper";
import Navbar, {
  DesktopHeader,
  MobileHeader,
  SearchInput,
  TabsMobile,
} from "../components/navbar";
import en from "../i18n/en";
import universeTexture from "../img/night-sky.png";
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
  overflow: hidden;

  > #__next, > * > section, .ant-layout-content {
    height: 100%;
  }
}

/* Popovers & dropdowns should always be on top */
.ant-popover, .ant-dropdown {
  z-index: 9999;
}
`;

const theme = {};

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createResourceDialogOpen, setCreateResourceDialogOpen] = useState(
    false
  );

  const createMenus = (
    <Menu>
      <Menu.Item
        key="resource"
        onClick={() => setCreateResourceDialogOpen(true)}
      >
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
  );

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
          <CreateResourceModal
            open={createResourceDialogOpen}
            onCreate={() => setCreateResourceDialogOpen(false)}
            onCancel={() => setCreateResourceDialogOpen(false)}
          />

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

              <Dropdown overlay={createMenus}>
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

              <Dropdown overlay={createMenus}>
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
