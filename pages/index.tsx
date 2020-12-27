import {
  faBell,
  faBinoculars,
  faCaretDown,
  faCogs,
  faCube,
  faFile,
  faGlobe,
  faHandshake,
  faLocationArrow,
  faNetworkWired,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Dropdown,
  Input,
  List,
  Menu,
  Popover,
  Space,
} from "antd";
import Layout, { Content, Header as HeaderTmpl } from "antd/lib/layout/layout";
import dynamic from "next/dynamic";
import Animate from "rc-animate";
import { createRef, forwardRef, useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import earthTexture from "three-globe/example/img/earth-night.jpg";
import earthElevation from "three-globe/example/img/earth-topology.png";
import universeTexture from "three-globe/example/img/night-sky.png";
import connections from "../data/connections.json";
import nodes from "../data/nodes.json";

function HomePage() {
  const { t } = useTranslation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [connectionPaths, setConnectionPaths] = useState<any[]>([]);
  const [selectedNode, _setSelectedNode] = useState<any>();
  const [hoverable, setHoverable] = useState(false);
  const [nodeComputeStats, setNodeComputeStats] = useState<any[]>([]);
  const [handleCameraChange, setHandleCameraChange] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<number[]>([0, 0]);
  const [loadingUserCoordinates, setLoadingUserCoordinates] = useState(false);

  const globeRef = createRef();

  useEffect(() => {
    setConnectionPaths([
      ...connections.management.map((conn) => ({
        coords: conn,
        properties: { name: "Management", color: "#fa8c16" },
      })),
      ...connections.application.map((conn) => ({
        coords: conn,
        properties: { name: "Application", color: "#1890ff" },
      })),
    ]);

    setNodeComputeStats([
      { ip: "127.0.2.0", score: 1000 },
      { ip: "127.0.2.1", score: 2000 },
      { ip: "127.0.2.2", score: 1500 },
      { ip: "127.0.2.3", score: 500 },
    ]);
  }, []);

  useEffect(() => {
    if (globeRef.current && handleCameraChange) {
      if (selectedNode) {
        (globeRef.current as any).pointOfView(
          {
            lat: selectedNode.latitude,
            lng: selectedNode.longitude,
            altitude: 1,
          },
          1000
        );
      } else {
        (globeRef.current as any).pointOfView(
          {
            lat: userCoordinates[0],
            lng: userCoordinates[1],
            altitude: 2.5,
          },
          1000
        );
      }

      setHandleCameraChange(false);
    }
  }, [globeRef, handleCameraChange, selectedNode, userCoordinates]);

  const getUserCoordinates = useCallback(() => {
    setLoadingUserCoordinates(true);

    typeof window !== "undefined" &&
      navigator.geolocation.getCurrentPosition(
        (position) => {
          unstable_batchedUpdates(() => {
            setHandleCameraChange(true);
            setUserCoordinates([
              position.coords.latitude,
              position.coords.longitude,
            ]);
            setLoadingUserCoordinates(false);
          });
        },
        (e) => {
          console.error(
            "could not get user location, falling back to [0,0]",
            e
          );

          setLoadingUserCoordinates(false);
        }
      );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener(
        "keydown",
        () => setSelectedNode(undefined),
        false
      );

      return () => {
        document.removeEventListener(
          "keydown",
          () => setSelectedNode(undefined),
          false
        );
      };
    }
  }, []);

  const setSelectedNode = (newNode: any) => {
    unstable_batchedUpdates(() => {
      setHandleCameraChange(true);
      _setSelectedNode(newNode);
    });
  };

  return (
    <>
      <Layout>
        <Header>
          <NavigationBar>
            <NavigationMenu>
              <NavigationButton type="primary">
                <FontAwesomeIcon size="lg" icon={faGlobe} fixedWidth />
                {t("overview")}
              </NavigationButton>

              <NavigationButton type="text">
                <FontAwesomeIcon size="lg" icon={faBinoculars} fixedWidth />
                {t("explorer")}
              </NavigationButton>

              <NavigationButton type="text">
                <FontAwesomeIcon size="lg" icon={faCogs} fixedWidth />
                {t("config")}
              </NavigationButton>
            </NavigationMenu>

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
          </NavigationBar>
        </Header>
        <Content>
          <GlobeWrapper $hoverable={hoverable}>
            <Globe
              labelsData={nodes}
              labelLat={(d: any) => (d as typeof nodes[0]).latitude}
              labelLng={(d: any) => (d as typeof nodes[0]).longitude}
              labelText={(d: any) => {
                const node = d as typeof nodes[0];

                return `${node.privateIP} (${node.location}, ${node.publicIP})`;
              }}
              labelSize={(d: any) =>
                Math.sqrt((d as typeof nodes[0]).size) * 4e-4
              }
              labelDotRadius={(d: any) =>
                Math.sqrt((d as typeof nodes[0]).size) * 4e-4
              }
              labelColor={() => "rgba(255, 165, 0, 0.75)"}
              onLabelClick={(node: any) =>
                selectedNode?.privateIP === node.privateIP
                  ? setSelectedNode(undefined)
                  : setSelectedNode(
                      nodes.find(
                        (candidate) => candidate.privateIP === node.privateIP
                      )
                    )
              }
              onLabelHover={(label: any) =>
                label ? setHoverable(true) : setHoverable(false)
              }
              pathsData={connectionPaths}
              pathPoints="coords"
              pathPointLat={(c: any) => c[1]}
              pathPointLng={(c: any) => c[0]}
              pathLabel={(c: any) => c.properties.name}
              pathColor={(c: any) => c.properties.color}
              pathDashLength={0.1}
              pathDashGap={0.008}
              pathDashAnimateTime={12000}
              globeImageUrl={earthTexture as string}
              bumpImageUrl={earthElevation as string}
              backgroundImageUrl={universeTexture as string}
              waitForGlobeReady
              ref={globeRef}
            />
          </GlobeWrapper>

          <Animate transitionName="fade" transitionAppear>
            <Stats size="small" title={`${t("clusterStatistics")}`}>
              <Pie
                appendPadding={0}
                data={nodeComputeStats}
                angleField="score"
                colorField="ip"
                color={[
                  "#612500",
                  "#ad4e00",
                  "#d46b08",
                  "#fa8c16",
                  "#ffa940",
                  "#faad14",
                ]}
                radius={0.9}
                label={{
                  type: "inner",
                  offset: "-30%",
                  content: (_ref: any) => Math.floor(_ref.percent * 100) + "%",
                  style: {
                    textAlign: "center",
                  },
                }}
                autoFit
                height={300}
                interactions={[{ type: "element-active" }]}
                legend={{
                  layout: "vertical",
                  position: "bottom",
                  flipPage: false,
                }}
                animation={false}
                pieStyle={{ cursor: "pointer" }}
                onEvent={(_, e) => {
                  if (e.type === "element:click" && e.data?.data?.ip) {
                    setSelectedNode((selectedNode: any) =>
                      selectedNode &&
                      selectedNode?.privateIP === e.data?.data.ip
                        ? undefined
                        : nodes.find(
                            (candidate) =>
                              candidate.privateIP === e.data?.data.ip
                          )
                    );
                  }
                }}
              />
            </Stats>
          </Animate>

          <Animate transitionName="fade" transitionAppear>
            {selectedNode && (
              <Inspector
                size="small"
                title={`${t("node")} ${selectedNode.privateIP}`}
                extra={
                  <Button
                    type="text"
                    onClick={() => setSelectedNode(undefined)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                }
              >
                <div>Hello, world!</div>
              </Inspector>
            )}
          </Animate>

          <Animate transitionName="fade" transitionAppear>
            <LocateButton
              type="text"
              onClick={getUserCoordinates}
              loading={loadingUserCoordinates}
              icon={<FontAwesomeIcon icon={faLocationArrow} />}
            />
          </Animate>
        </Content>
      </Layout>
    </>
  );
}

const GlobeWrapper = styled.div<{ $hoverable: boolean }>`
  ${(props) => (props.$hoverable ? "cursor: pointer;" : "")}
`;

const glass = `background: rgba(20, 20, 20, 0.5);
  backdrop-filter: blur(5px);`;

const Header = styled(HeaderTmpl)`
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 9999;
  width: 100%;
  border-bottom: 1px solid #303030;
  ${glass}
`;

const NavigationBar = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavigationMenu = styled.div`
  height: 100%;
  display: flex;
`;

const NavigationButton = styled(Button)`
  width: 5rem;
  height: 100% !important;
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SearchInput = styled(Input.Search)`
  max-width: 22.5rem;
`;

const Inspector = styled(Card)`
  position: absolute;
  height: calc(100% - 64px - 2rem);
  min-width: 20rem;
  margin: 1rem;
  top: 64px;
  right: 50px;
  margin-right: 0;
  ${glass}
`;

const Stats = styled(Card)`
  position: absolute;
  margin: 1rem;
  top: 64px;
  left: 50px;
  margin-left: 0;
  min-width: calc(5rem * 3); // NavigationButton * 3
  ${glass}
`;

const GlobeTmpl = dynamic(() => import("../components/globe"), {
  ssr: false,
});
const Globe = forwardRef((props: any, ref) => (
  <GlobeTmpl {...props} forwardRef={ref} />
));

const Pie = dynamic(async () => (await import("@ant-design/charts")).Pie, {
  ssr: false,
});

const LocateButton = styled(Button)`
  position: absolute !important;
  margin: 1rem;
  bottom: 0;
  left: 50px;
  margin-left: 0;
  ${glass}
`;

export default HomePage;
