import {
  faArrowCircleUp,
  faBan,
  faBell,
  faCaretDown,
  faCube,
  faFile,
  faHandshake,
  faNetworkWired,
  faPlus,
  faSearch,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dropdown,
  List,
  Menu,
  notification,
  Popover,
  Space,
  Tooltip
} from "antd";
import { Content } from "antd/lib/layout/layout";
import i18n from "i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { initReactI18next, useTranslation } from "react-i18next";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import CreateFileModal from "../components/create-file-modal";
import CreateResourceModal from "../components/create-resource-modal";
import { Layout } from "../components/layout-wrapper";
import Navbar, {
  DesktopHeader,
  MobileHeader,
  SearchInput,
  TabsMobile
} from "../components/navbar";
import en from "../i18n/en";
import frostedGlass from "../styles/frosted-glass";
import glass from "../styles/glass";
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
  > #__next, > * > section, .ant-layout-content {
    height: 100%;
  }
}

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

const theme = {};

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [createResourceDialogOpen, setCreateResourceDialogOpen] = useState(
    false
  );
  const [createFileDialogOpen, setCreateFileDialogOpen] = useState(false);

  const [
    createResourceDialogMaximized,
    setCreateResourceDialogMaximized,
  ] = useState(true);
  const [createFileDialogMaximized, setCreateFileDialogMaximized] = useState(
    true
  );

  const createMenus = (
    <Menu>
      <Menu.Item
        key="resource"
        onClick={() => {
          unstable_batchedUpdates(() => {
            setCreateResourceDialogMaximized(true);
            setCreateResourceDialogOpen(true);
          });
        }}
      >
        <Space>
          <FontAwesomeIcon fixedWidth icon={faCube} />
          {t("resource")}
        </Space>
      </Menu.Item>
      <Menu.Item key="cluster">
        <a href="/start" target="_blank">
          <Space>
            <FontAwesomeIcon fixedWidth icon={faNetworkWired} />
            {t("cluster")}
          </Space>
        </a>
      </Menu.Item>
      <Menu.Item
        key="file"
        onClick={() => {
          unstable_batchedUpdates(() => {
            setCreateFileDialogMaximized(true);
            setCreateFileDialogOpen(true);
          });
        }}
      >
        <Space>
          <FontAwesomeIcon fixedWidth icon={faFile} />
          {t("file")}
        </Space>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox !== undefined
    ) {
      const wb = (window as any).workbox;

      const promptNewVersionAvailable = () => {
        const key = "update";

        notification.open({
          message: t("updateAvailable"),
          description: t("reloadToUpdate"),
          btn: (
            <Space>
              <Button
                onClick={async () => {
                  wb.addEventListener("controlling", () => {
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  });

                  wb.messageSW({ type: "SKIP_WAITING" });

                  const registrations = await navigator.serviceWorker.getRegistrations();

                  await Promise.all(
                    registrations.map((reg) => reg.unregister())
                  );

                  notification.close(key);

                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }}
                type="primary"
              >
                <Space>
                  <FontAwesomeIcon icon={faArrowCircleUp} />
                  {t("reloadAndUpdate")}
                </Space>
              </Button>

              <Button onClick={() => notification.close(key)}>
                <Space>
                  <FontAwesomeIcon icon={faBan} />
                  {t("dontUpdate")}
                </Space>
              </Button>
            </Space>
          ),
          duration: 0,
          onClose: () => notification.close(key),
          closeIcon: <FontAwesomeIcon icon={faTimes} />,
          key,
        });
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);
      wb.addEventListener("externalwaiting", promptNewVersionAvailable);

      wb.register();
    }
  }, []);

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
        {router.pathname.includes("/start") ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <CreateResourceModal
              open={createResourceDialogOpen && createResourceDialogMaximized}
              onCreate={() => setCreateResourceDialogOpen(false)}
              onCancel={() => setCreateResourceDialogOpen(false)}
              onMinimize={() => setCreateResourceDialogMaximized(false)}
            />

            <CreateFileModal
              open={createFileDialogOpen && createFileDialogMaximized}
              onCreate={() => setCreateFileDialogOpen(false)}
              onCancel={() => setCreateFileDialogOpen(false)}
              onMinimize={() => setCreateFileDialogMaximized(false)}
            />

            {(!createResourceDialogMaximized || !createFileDialogMaximized) && (
              <SideTray>
                {!createResourceDialogMaximized && (
                  <Button
                    type="text"
                    onClick={() => setCreateResourceDialogMaximized(true)}
                    icon={<FontAwesomeIcon icon={faCube} />}
                  />
                )}

                {!createFileDialogMaximized && (
                  <Button
                    type="text"
                    onClick={() => setCreateFileDialogMaximized(true)}
                    icon={<FontAwesomeIcon icon={faFile} />}
                  />
                )}
              </SideTray>
            )}

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
        )}
      </ThemeProvider>
    </>
  );
}

const SideTray = styled.div`
  z-index: 999;
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid #303030;
  margin: 1rem;
  right: 0;
  display: flex;
  flex-direction: column;
  ${glass}

  > *:first-child:not(:last-child) {
    border-bottom: 1px solid #303030;
  }
`;

export default MyApp;
