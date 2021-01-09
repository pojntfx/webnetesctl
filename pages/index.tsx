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
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dropdown,
  Empty,
  List,
  Menu,
  message,
  notification,
  Popover,
  Space,
  Tooltip,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import Text from "antd/lib/typography/Text";
import Emittery from "emittery";
import React, { useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { XTerm } from "xterm-for-react";
import CreateFileModal from "../components/create-file-modal";
import CreateResourceModal from "../components/create-resource-modal";
import GraphModal from "../components/graph-modal";
import InviteModal from "../components/invite-modal";
import { Layout } from "../components/layouts";
import Navbar, {
  DesktopHeader,
  MobileHeader,
  MobileTabs,
  SearchInput,
} from "../components/navbar";
import { ARPage } from "../components/pages/ar";
import { ConfigPage } from "../components/pages/config";
import CreatedPage from "../components/pages/created";
import { ExplorerPage } from "../components/pages/explorer";
import { HomePage } from "../components/pages/home";
import { JoinPage } from "../components/pages/join";
import { OverviewPage } from "../components/pages/overview";
import SearchModal from "../components/search-modal";
import TerminalModal from "../components/terminal-modal";
import { AppTray } from "../components/trays";
import { useWebnetes } from "../hooks/use-webnetes";
import { parseResourceKey, stringifyResourceKey } from "../utils/resource-key";

/**
 * RoutesPage is the client-side routing part of the hybrid PWA.
 * As such, it handles all imports which are not handled by Next.js.
 */
function RoutesPage() {
  // Hooks
  const { t } = useTranslation();
  const router = useHistory();
  const location = useLocation();

  // Webnetes Hook
  const [terminalLabels, setTerminalLabels] = useState<string[]>([]);
  const terminalRefs = useRef<Map<string, XTerm>>(new Map());
  const terminalStdinHandlersRef = useRef<
    Map<string, (key: string) => Promise<void>>
  >(new Map());
  const terminalBus = useRef<Emittery>();
  const { graphs, cluster, local, stats, log, node } = useWebnetes({
    onResourceRejection: async (diagnostics) => {
      notification.error({
        message: t("resourceRejected"),
        description: (
          <Text>
            {t("diagnostics")}:<br />
            <Text code>{JSON.stringify(diagnostics)}</Text>
          </Text>
        ),
      });
    },
    onCPUBenchmarking: () => {
      const hide = message.loading(t("benchmarkingYourCPU"), 0);

      return hide;
    },
    onNetworkBenchmarking: () => {
      const hide = message.loading(t("benchmarkingYourNetwork"), 0);

      return hide;
    },
    onCreateTerminal: async (onStdin, id) => {
      setTerminalLabels((oldTerminalLabels) => [...oldTerminalLabels, id]);

      terminalStdinHandlersRef.current?.set(id, onStdin);
    },
    onWriteToTerminal: async (id, msg) => {
      let terminal = terminalRefs.current?.get(id);
      if (!terminal) {
        await terminalBus.current?.once(id);

        terminal = terminalRefs.current?.get(id);
      }

      terminal?.terminal.write(msg.replace(/\n/g, "\n\r"));
    },
    onDeleteTerminal: async (id) => {
      let terminal = terminalRefs.current?.get(id);
      if (!terminal) {
        await terminalBus.current?.once(id);

        terminal = terminalRefs.current?.get(id);
      }

      terminalRefs.current?.delete(id);
      terminalStdinHandlersRef.current?.delete(id);

      setTerminalLabels((oldTerminalLabels) =>
        oldTerminalLabels.filter((candidate) => candidate !== id)
      );
    },
  });

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
                      router.push("/");

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
                    router.push("/");

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
    // Create the terminal bus
    terminalBus.current = new Emittery();
  }, []);

  useEffect(() => {
    // Redirect to home if node not open and no node config set
    if (
      !node.opened &&
      !(
        location.pathname === "/" ||
        new URLSearchParams(location.search).get("nodeConfig")
      )
    ) {
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, [node.opened, location]);

  useEffect(() => {
    // Map the privateIP query parameter to state
    if (
      new URLSearchParams(location.search).get("privateIP") &&
      cluster.nodes
    ) {
      const node = cluster.nodes.find(
        (candidate) =>
          candidate.privateIP ===
          new URLSearchParams(location.search).get("privateIP")
      );
      if (node) {
        setSearchQuery(
          `${t("node")} ${node.privateIP} (${node.location}, ${node.publicIP})`
        );
      } else {
        setSearchQuery(undefined);
      }
    }
  }, [location.search, cluster.nodes]);

  useEffect(() => {
    // Map the resource query parameter to state
    if (
      new URLSearchParams(location.search).get("resource") &&
      cluster.resources
    ) {
      const { kind, label, node } = parseResourceKey(
        new URLSearchParams(location.search).get("resource") as string
      );

      const resource = cluster.resources.find(
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
  }, [location.search, cluster.resources]);

  useEffect(() => {
    // Map the privateIP and resource query parameters to state
    if (
      !new URLSearchParams(location.search).get("privateIP") &&
      !new URLSearchParams(location.search).get("resource")
    ) {
      setSearchQuery(undefined);
    }
  }, [location.search]);

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
      <Menu.Item key="cluster">
        <a href="/" target="_blank">
          <Space>
            <FontAwesomeIcon fixedWidth icon={faNetworkWired} />
            {t("cluster")}
          </Space>
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Switch>
      <Route path="/join">
        {graphs.local && graphs.network && graphs.resources && (
          <JoinPage
            cluster={graphs.local}
            network={graphs.network}
            resources={graphs.resources}
            latitude={local.location.latitude}
            longitude={local.location.longitude}
            nodeAddress={local.location.address || ""}
            nodeCoordinatesLoading={local.location.loading}
            nodeFlag={local.location.flag || ""}
            refreshNodeLocation={local.location.refreshLocation}
            nodeId={local.nodeId}
            node={node}
          />
        )}
      </Route>

      <Route path="/ar">
        {graphs.cluster && graphs.local && (
          <ARPage cluster={graphs.cluster} local={graphs.local} />
        )}
      </Route>

      <Route path="/created">
        <CreatedPage />
      </Route>

      <Route path="/" exact>
        {local.nodeConfig && <HomePage nodeConfig={local.nodeConfig} />}
      </Route>

      <Route path="/">
        {/^\/(overview|explorer|config)/.test(location.pathname) && (
          // Manager layout

          <Layout>
            {/* Modals */}
            {cluster.nodes && (
              <CreateResourceModal
                open={createResourceDialogOpen && createResourceModalMaximized}
                onCreate={async (resources, nodeId) => {
                  await node.createResources(resources, nodeId);

                  setCreateResourceDialogOpen(false);
                  setTerminalsModalOpen(true);
                }}
                onCancel={() => setCreateResourceDialogOpen(false)}
                onMinimize={() => setCreateResourceModalMaximized(false)}
                nodes={cluster.nodes}
              />
            )}

            {cluster.resources && local.nodeId && (
              <CreateFileModal
                open={createFileModalOpen && createFileModalMaximized}
                onCreate={async (
                  label: string,
                  name: string,
                  repository: string,
                  fileInstance: Uint8Array
                ) => {
                  node.seedFile(label, name, repository, fileInstance);

                  setCreateFileModalOpen(false);
                }}
                onCancel={() => setCreateFileModalOpen(false)}
                onMinimize={() => setCreateFileModalMaximized(false)}
                resources={cluster.resources}
                nodeId={local.nodeId}
              />
            )}

            {local.nodeConfig && (
              <InviteModal
                open={inviteModalOpen}
                onDone={() => setInviteModalOpen(false)}
                nodeConfig={local.nodeConfig}
              />
            )}

            <GraphModal
              open={graphModalOpen}
              onDone={() => setGraphModalOpen(false)}
              onOpenInAR={() => router.push("/ar")}
              graphData={graphs.cluster}
            />

            {cluster.resources && (
              <TerminalModal
                open={terminalsModalOpen}
                onDone={() => setTerminalsModalOpen(false)}
                onTerminalCreated={(label, xterm) => {
                  terminalRefs.current?.set(label, xterm);
                  terminalBus.current?.emit(label, true);
                }}
                onStdin={(label, key) => {
                  const stdinHandler = terminalStdinHandlersRef.current?.get(
                    label
                  );

                  stdinHandler && stdinHandler(key);
                }}
                labels={terminalLabels}
              />
            )}

            {cluster.nodes && cluster.resources && (
              <SearchModal
                open={searchModalOpen}
                handleChange={(query) => {
                  if (query) {
                    setSearchQuery(query);

                    if (query.startsWith("node=")) {
                      location.pathname === "/config"
                        ? router?.push(
                            `/explorer?privateIP=${query.split("node=")[1]}`
                          )
                        : router?.push(`?privateIP=${query.split("node=")[1]}`);
                    } else {
                      router?.push(
                        `/explorer?resource=${query.split("resource=")[1]}`
                      );
                    }

                    setSearchModalOpen(false);
                  } else {
                    setSearchQuery(undefined);

                    router?.push(location.pathname);
                  }
                }}
                query={searchQuery as string}
                nodes={cluster.nodes}
                resources={cluster.resources}
                onDone={() => setSearchModalOpen(false)}
              />
            )}

            {/* App tray */}
            {(!createResourceModalMaximized ||
              !createFileModalMaximized ||
              !graphModalOpen ||
              !terminalsModalOpen) && (
              <AppTray>
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
                      {log.length === 0 && (
                        <Empty description={t("noNotifications")} />
                      )}
                      {log.map((line, i) => (
                        <List.Item key={i}>{line}</List.Item>
                      ))}
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
              <Navbar path={location.pathname} />

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
                      location.pathname === "/config"
                        ? router?.push(
                            `/explorer?privateIP=${
                              e.toString().split("node=")[1]
                            }`
                          )
                        : router?.push(
                            `?privateIP=${e.toString().split("node=")[1]}`
                          );
                    } else {
                      router?.push(
                        `/explorer?resource=${
                          e.toString().split("resource=")[1]
                        }`
                      );
                    }
                  } else {
                    setSearchQuery(undefined);

                    router?.push(location.pathname);
                  }
                }}
                value={searchQuery}
                allowClear
              >
                {cluster.nodes?.map((node) => (
                  <SearchInput.Option
                    value={`node=${node.privateIP}`}
                    key={`node=${node.privateIP}`}
                  >
                    {t("node")} {node.privateIP} ({node.location},{" "}
                    {node.publicIP})
                  </SearchInput.Option>
                ))}
                {cluster.resources?.map((resource) => (
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
                      {log.length === 0 && (
                        <Empty description={t("noNotifications")} />
                      )}
                      {log.map((line, i) => (
                        <List.Item key={i}>{line}</List.Item>
                      ))}
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
              <Route path="/overview">
                {cluster.nodes &&
                  cluster.resources &&
                  cluster.connections &&
                  stats.compute &&
                  stats.networking && (
                    <OverviewPage
                      cluster={{
                        nodes: cluster.nodes,
                        resources: cluster.resources,
                        connections: cluster.connections,
                      }}
                      stats={{
                        compute: stats.compute,
                        networking: stats.networking,
                      }}
                      onOpenTerminal={() => setTerminalsModalOpen(true)}
                      latitude={local.location.latitude}
                      longitude={local.location.longitude}
                      nodeCoordinatesLoading={local.location.loading}
                      refreshNodeLocation={local.location.refreshLocation}
                      node={node}
                      nodeId={local.nodeId || ""}
                    />
                  )}
              </Route>

              <Route path="/explorer">
                {cluster.nodes &&
                  cluster.resources &&
                  stats.compute &&
                  stats.networking && (
                    <ExplorerPage
                      cluster={{
                        nodes: cluster.nodes,
                        resources: cluster.resources,
                      }}
                      stats={{
                        compute: stats.compute,
                        networking: stats.networking,
                      }}
                      onOpenTerminal={() => setTerminalsModalOpen(true)}
                      deleteResources={node.deleteResources}
                    />
                  )}
              </Route>

              <Route path="/config">
                {local.nodeConfig && local.nodeId && (
                  <ConfigPage
                    nodeConfig={local.nodeConfig}
                    setNodeConfig={local.setNodeConfig}
                    nodeId={local.nodeId}
                    nodePublicIPv6={local.nodePublicIPv6}
                    latitude={local.location.latitude}
                    longitude={local.location.longitude}
                    nodeAddress={local.location.address || ""}
                    nodeCoordinatesLoading={local.location.loading}
                    nodeFlag={local.location.flag || ""}
                    refreshNodeLocation={local.location.refreshLocation}
                  />
                )}
              </Route>
            </Content>

            {/* Mobile-friendly main navigation */}
            <MobileTabs>
              <Navbar path={location.pathname} />
            </MobileTabs>
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

export default RoutesPage;
