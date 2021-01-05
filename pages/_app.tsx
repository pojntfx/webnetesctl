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
  faProjectDiagram,
  faSearch,
  faTerminal,
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
import { createGlobalStyle, ThemeProvider } from "styled-components";
import CreateFileModal from "../components/create-file-modal";
import CreateResourceModal from "../components/create-resource-modal";
import GraphModal from "../components/graph-modal";
import InviteModal from "../components/invite-modal";
import { Layout } from "../components/layouts";
import Navbar, {
  DesktopHeader,
  MobileHeader,

  MobileTabs, SearchInput
} from "../components/navbar";
import SearchModal from "../components/search-modal";
import TerminalModal from "../components/terminal-modal";
import { AppTray } from "../components/trays";
import composite from "../data/composite.json";
import nodes from "../data/nodes.json";
import resources from "../data/resources.json";
import en from "../i18n/en";
import frostedGlass from "../styles/frosted-glass";
import "../styles/index.less";
import { parseResourceKey, stringifyResourceKey } from "../utils/resource-key";

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
  // Hooks
  const { t } = useTranslation();
  const router = useRouter();

  // State
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [createResourceDialogOpen, setCreateResourceDialogOpen] = useState(
    false
  );
  const [createFileModalOpen, setCreateFileModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [graphModalOpen, setGraphModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [terminalsModalOpen, setTerminalsModalOpen] = useState(false);

  const [
    createResourceModalMaximized,
    setCreateResourceModalMaximized,
  ] = useState(true);
  const [createFileModalMaximized, setCreateFileModalMaximized] = useState(
    true
  );

  const [searchQuery, setSearchQuery] = useState<string>();

  // Effects
  useEffect(() => {
    // Handle service worker updates
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

  useEffect(() => {
    // Map the privateIP query parameter to state
    if (router.query.privateIP) {
      const node = nodes.find(
        (candidate) => candidate.privateIP === router.query.privateIP
      );

      if (node) {
        setSearchQuery(
          `${t("node")} ${node.privateIP} (${node.location}, ${node.publicIP})`
        );
      } else {
        setSearchQuery(undefined);
      }
    }
  }, [router.query.privateIP]);

  useEffect(() => {
    // Map the resource query parameter to state
    if (router.query.resource) {
      const { kind, label, node } = parseResourceKey(
        router.query.resource as string
      );

      const resource = resources.find(
        (candidate) =>
          candidate.kind === kind &&
          candidate.label === label &&
          candidate.node === node
      );

      if (resource) {
        setSearchQuery(
          `${t("resource")} ${resource.kind}/${resource.name} on ${
            resource.node
          }`
        );
      } else {
        setSearchQuery(undefined);
      }
    }
  }, [router.query.resource]);

  useEffect(() => {
    // Map the privateIP and resource query parameters to state
    if (!router.query.privateIP && !router.query.resource) {
      setSearchQuery(undefined);
    }
  }, [router.query.privateIP, router.query.resource]);

  // Inline components
  const createMenus = (
    <Menu>
      <Menu.Item
        key="resource"
        onClick={() => {
          unstable_batchedUpdates(() => {
            setCreateResourceModalMaximized(true);
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
            setCreateFileModalMaximized(true);
            setCreateFileModalOpen(true);
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
        {/^(\/$|\/join.*|\/created.*)/.test(router.pathname) ? (
          // Worker & immediate states layout

          <Component {...pageProps} />
        ) : (
          // Manager layout

          <Layout>
            {/* Modals */}
            <CreateResourceModal
              open={createResourceDialogOpen && createResourceModalMaximized}
              onCreate={() => setCreateResourceDialogOpen(false)}
              onCancel={() => setCreateResourceDialogOpen(false)}
              onMinimize={() => setCreateResourceModalMaximized(false)}
            />

            <CreateFileModal
              open={createFileModalOpen && createFileModalMaximized}
              onCreate={() => setCreateFileModalOpen(false)}
              onCancel={() => setCreateFileModalOpen(false)}
              onMinimize={() => setCreateFileModalMaximized(false)}
            />

            <InviteModal
              open={inviteModalOpen}
              onDone={() => setInviteModalOpen(false)}
            />

            <GraphModal
              open={graphModalOpen}
              onDone={() => setGraphModalOpen(false)}
              graphData={composite}
            />

            <TerminalModal
              open={terminalsModalOpen}
              onDone={() => setTerminalsModalOpen(false)}
              onTerminalCreated={(label, xterm) =>
                setInterval(
                  () => xterm.terminal.writeln(`${label} Hello, world!`),
                  1000
                )
              }
              onStdin={(label, key) => console.log(label, key)}
              labels={resources
                .filter((resource) => resource.kind === "Workload")
                .map((resource) => resource.label)}
            />

            <SearchModal
              open={searchModalOpen}
              handleChange={(query) => {
                if (query) {
                  setSearchQuery(query);

                  if (query.startsWith("node=")) {
                    router.pathname === "/config"
                      ? router.push(
                          `/explorer?privateIP=${query.split("node=")[1]}`
                        )
                      : router.push(`?privateIP=${query.split("node=")[1]}`);
                  } else {
                    router.push(
                      `/explorer?resource=${query.split("resource=")[1]}`
                    );
                  }

                  setSearchModalOpen(false);
                } else {
                  setSearchQuery(undefined);

                  router.push(router.pathname);
                }
              }}
              query={searchQuery as string}
              nodes={nodes}
              resources={resources}
              onDone={() => setSearchModalOpen(false)}
            />

            {/* App tray */}
            {(!createResourceModalMaximized ||
              !createFileModalMaximized ||
              !graphModalOpen ||
              !terminalsModalOpen) && (
              <AppTray>
                {!createResourceModalMaximized && (
                  <Button
                    type="text"
                    onClick={() => setCreateResourceModalMaximized(true)}
                    icon={<FontAwesomeIcon icon={faCube} />}
                  />
                )}

                {!createFileModalMaximized && (
                  <Button
                    type="text"
                    onClick={() => setCreateFileModalMaximized(true)}
                    icon={<FontAwesomeIcon icon={faFile} />}
                  />
                )}

                {!graphModalOpen && (
                  <Button
                    type="text"
                    onClick={() => setGraphModalOpen(true)}
                    icon={<FontAwesomeIcon icon={faProjectDiagram} />}
                  />
                )}

                {!terminalsModalOpen && (
                  <Button
                    type="text"
                    onClick={() => setTerminalsModalOpen(true)}
                    icon={<FontAwesomeIcon icon={faTerminal} />}
                  />
                )}
              </AppTray>
            )}

            {/* Mobile-friendly header */}
            <MobileHeader>
              {/* Search modal trigger */}
              <Tooltip title={t("findNodeOrResource")}>
                <Button
                  type="text"
                  shape="circle"
                  onClick={() => setSearchModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Tooltip>

              <Space>
                {/* Notifications */}
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

                {/* Create dropdown */}
                <Dropdown overlay={createMenus}>
                  <Button type="text" shape="circle">
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </Dropdown>

                {/* Invite trigger */}
                <Tooltip title={t("invite")}>
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => setInviteModalOpen(true)}
                  >
                    <FontAwesomeIcon icon={faHandshake} />
                  </Button>
                </Tooltip>
              </Space>
            </MobileHeader>

            {/* Desktop-friendly header */}
            <DesktopHeader>
              {/* Main navigation */}
              <Navbar path={router.pathname} />

              {/* Global node & resource search */}
              <SearchInput
                showSearch
                suffixIcon={<FontAwesomeIcon icon={faSearch} />}
                placeholder={t("findNodeOrResource")}
                optionFilterProp="children"
                notFoundContent={t("noMatchingNodesOrResourcesFound")}
                onChange={(e) => {
                  if (e) {
                    setSearchQuery(e.toString());

                    if (e.toString().startsWith("node=")) {
                      router.pathname === "/config"
                        ? router.push(
                            `/explorer?privateIP=${
                              e.toString().split("node=")[1]
                            }`
                          )
                        : router.push(
                            `?privateIP=${e.toString().split("node=")[1]}`
                          );
                    } else {
                      router.push(
                        `/explorer?resource=${
                          e.toString().split("resource=")[1]
                        }`
                      );
                    }
                  } else {
                    setSearchQuery(undefined);

                    router.push(router.pathname);
                  }
                }}
                value={searchQuery}
                allowClear
              >
                {nodes.map((node) => (
                  <SearchInput.Option
                    value={`node=${node.privateIP}`}
                    key={`node=${node.privateIP}`}
                  >
                    {t("node")} {node.privateIP} ({node.location},{" "}
                    {node.publicIP})
                  </SearchInput.Option>
                ))}
                {resources.map((resource) => (
                  <SearchInput.Option
                    value={`resource=${stringifyResourceKey(
                      resource.label,
                      resource.kind,
                      resource.node
                    )}`}
                    key={`resource=${stringifyResourceKey(
                      resource.label,
                      resource.kind,
                      resource.node
                    )}`}
                  >
                    {t("resource")} {resource.kind}/{resource.name} on{" "}
                    {resource.node}
                  </SearchInput.Option>
                ))}
              </SearchInput>

              <Space>
                {/* Notifications */}
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

                {/* Create dropdown */}
                <Dropdown overlay={createMenus}>
                  <Button>
                    <Space>
                      <FontAwesomeIcon icon={faPlus} />
                      {t("create")}
                      <FontAwesomeIcon icon={faCaretDown} />
                    </Space>
                  </Button>
                </Dropdown>

                {/* Invite trigger */}
                <Button type="primary" onClick={() => setInviteModalOpen(true)}>
                  <Space>
                    <FontAwesomeIcon icon={faHandshake} />
                    {t("invite")}
                  </Space>
                </Button>
              </Space>
            </DesktopHeader>

            {/* Main content */}
            <Content>
              <Component {...pageProps} />
            </Content>

            {/* Mobile-friendly main navigation */}
            <MobileTabs>
              <Navbar path={router.pathname} />
            </MobileTabs>
          </Layout>
        )}
      </ThemeProvider>
    </>
  );
}

export default MyApp;
