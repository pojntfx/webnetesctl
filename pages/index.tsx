import {
  faBinoculars,
  faChartPie,
  faCube,
  faEllipsisV,
  faGlobe,
  faLocationArrow,
  faMapMarkerAlt,
  faMicrochip,
  faMobile,
  faNetworkWired,
  faTerminal,
  faTimes,
  faTrash,
  faWifi,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Collapse,
  Divider,
  Dropdown,
  Empty,
  Input,
  List,
  Menu,
  Space,
  Statistic,
  Tooltip,
} from "antd";
import Text from "antd/lib/typography/Text";
import dynamic from "next/dynamic";
import Animate from "rc-animate";
import { createRef, forwardRef, useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import earthTexture from "three-globe/example/img/earth-night.jpg";
import earthElevation from "three-globe/example/img/earth-topology.png";
import universeTexture from "three-globe/example/img/night-sky.png";
import { useWindowSize } from "use-window-size-hook";
import NodeChart from "../components/node-chart";
import computeStats from "../data/compute-stats.json";
import connections from "../data/connections.json";
import networkingStats from "../data/networking-stats.json";
import nodes from "../data/nodes.json";
import resources from "../data/resources.json";
import glass from "../styles/glass";

function HomePage() {
  const { t } = useTranslation();
  const globeRef = createRef();
  const { width, height } = useWindowSize();

  const [statsOpen, setStatsOpen] = useState(true);
  const [connectionPaths, setConnectionPaths] = useState<any[]>([]);
  const [selectedNode, _setSelectedNode] = useState<any>();
  const [globeHoverable, setGlobeHoverable] = useState(false);
  const [handleCameraChange, setHandleCameraChange] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<number[]>([0, 0]);
  const [loadingUserCoordinates, setLoadingUserCoordinates] = useState(false);
  const [clusterId, setClusterId] = useState<string>();
  const [resourceNameFilter, setResourceNameFilter] = useState("");

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

    setClusterId("127.0.2");

    if (typeof window !== "undefined") {
      const wb = (window as any).workbox;

      if (wb) {
        const reload = () => {
          if (
            confirm(
              "A newer version of this web app is available, reload to update?"
            )
          ) {
            wb.addEventListener("controlling", () => window.location.reload());

            wb.messageSW({ type: "SKIP_WAITING" });
          }
        };

        wb.addEventListener("waiting", reload);
        wb.addEventListener("externalwaiting", reload);

        wb.register();
      }
    }
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
      const handleEscape = (e: KeyboardEvent) =>
        e.code === "Escape" && setSelectedNode(undefined);

      document.addEventListener("keydown", handleEscape, false);

      return () => {
        document.removeEventListener("keydown", handleEscape, false);
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
      <GlobeWrapper $hoverable={globeHoverable}>
        <Globe
          labelsData={nodes}
          labelLat={(d: any) => (d as typeof nodes[0]).latitude}
          labelLng={(d: any) => (d as typeof nodes[0]).longitude}
          labelText={(d: any) => {
            const node = d as typeof nodes[0];

            return `${node.privateIP} (${node.location}, ${node.publicIP})`;
          }}
          labelSize={(d: any) => Math.sqrt((d as typeof nodes[0]).size) * 3e-4}
          labelDotRadius={(d: any) =>
            Math.sqrt((d as typeof nodes[0]).size) * 2e-4
          }
          labelColor={() => "#faad14"}
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
            label ? setGlobeHoverable(true) : setGlobeHoverable(false)
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
          width={width}
          height={height}
          ref={globeRef}
        />
      </GlobeWrapper>

      <Animate transitionName="fadeandslide" transitionAppear>
        {(selectedNode
          ? width && width <= 821
            ? false
            : statsOpen
          : statsOpen) && (
          <Stats
            size="small"
            title={
              <Space>
                <FontAwesomeIcon fixedWidth icon={faNetworkWired} />
                {t("cluster") + " " + clusterId}
              </Space>
            }
            extra={
              <Button type="text" onClick={() => setStatsOpen(false)}>
                <FontAwesomeIcon icon={faWindowMinimize} />
              </Button>
            }
          >
            <StatsWrapper>
              <Statistic
                title={t("node", { count: 4 })}
                value={4}
                prefix={<FontAwesomeIcon fixedWidth icon={faMobile} />}
              />
              <Statistic
                title={t("resource", { count: 16 })}
                value={16}
                prefix={<FontAwesomeIcon fixedWidth icon={faCube} />}
              />
            </StatsWrapper>

            <StatsDivider />

            <StatsWrapper $long>
              <Statistic
                title={
                  <Space>
                    <FontAwesomeIcon icon={faMicrochip} />
                    {t("compute")}
                  </Space>
                }
                value={1560}
                suffix={t("point", { count: 1560 })}
              />
              <Statistic
                title={
                  <Space>
                    <FontAwesomeIcon icon={faWifi} />
                    {t("network")}
                  </Space>
                }
                value={920}
                suffix={t("mbps", { count: 920 })}
              />
            </StatsWrapper>

            <Collapse defaultActiveKey={[]} ghost destroyInactivePanel>
              <Collapse.Panel
                header={t("computeDistribution")}
                key="computeDistribution"
              >
                <NodeChart
                  data={computeStats}
                  colors={[
                    "#1890ff",
                    "#096dd9",
                    "#0050b3",
                    "#003a8c",
                    "#002766",
                  ]}
                  onClick={(ip) =>
                    setSelectedNode((selectedNode: any) =>
                      selectedNode && selectedNode?.privateIP === ip
                        ? undefined
                        : nodes.find((candidate) => candidate.privateIP === ip)
                    )
                  }
                />
              </Collapse.Panel>

              <Collapse.Panel
                header={t("networkingDistribution")}
                key="networkingDistribution"
              >
                <NodeChart
                  data={networkingStats}
                  colors={[
                    "#faad14",
                    "#d48806",
                    "#ad6800",
                    "#874d00",
                    "#613400",
                  ]}
                  onClick={(ip) =>
                    setSelectedNode((selectedNode: any) =>
                      selectedNode && selectedNode?.privateIP === ip
                        ? undefined
                        : nodes.find((candidate) => candidate.privateIP === ip)
                    )
                  }
                />
              </Collapse.Panel>
            </Collapse>
          </Stats>
        )}
      </Animate>

      <Animate transitionName="fadeandzoom" transitionAppear>
        {selectedNode && (
          <Inspector
            size="small"
            title={
              <Space>
                <FontAwesomeIcon fixedWidth icon={faMobile} />
                {t("node") + " " + selectedNode.privateIP}
              </Space>
            }
            extra={
              <Space>
                <Tooltip title={t("openInExplorer")} placement="bottom">
                  <Button type="text" shape="circle">
                    <FontAwesomeIcon icon={faBinoculars} />
                  </Button>
                </Tooltip>

                <Button type="text" onClick={() => setSelectedNode(undefined)}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </Space>
            }
          >
            <StatsWrapper $long>
              <Space>
                <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />
                {selectedNode.location}
              </Space>
              <Space>
                <FontAwesomeIcon icon={faGlobe} size="lg" />
                {selectedNode.publicIP}
              </Space>
            </StatsWrapper>

            <StatsDivider />

            <StatsWrapper $long>
              <Statistic
                title={
                  <Space>
                    <FontAwesomeIcon icon={faMicrochip} />
                    {t("compute")}
                  </Space>
                }
                value={
                  computeStats.find(
                    (candidate) => candidate.ip === selectedNode?.privateIP
                  )?.score
                }
                suffix={t("point", {
                  count: computeStats.find(
                    (candidate) => candidate.ip === selectedNode?.privateIP
                  )?.score,
                })}
              />
              <Statistic
                title={
                  <Space>
                    <FontAwesomeIcon icon={faWifi} />
                    {t("network")}
                  </Space>
                }
                value={
                  networkingStats.find(
                    (candidate) => candidate.ip === selectedNode?.privateIP
                  )?.score
                }
                suffix={t("mbps", {
                  count: networkingStats.find(
                    (candidate) => candidate.ip === selectedNode?.privateIP
                  )?.score,
                })}
              />
            </StatsWrapper>

            <StatsDivider />

            <ResourceList direction="vertical">
              <Input.Search
                placeholder={t("filterResources")}
                onChange={(e) => setResourceNameFilter(e.target.value)}
                value={resourceNameFilter}
              />

              <List>
                {(() => {
                  const matchingResources = resources.filter(
                    (resource) => resource.node === selectedNode?.privateIP
                  );

                  if (matchingResources.length === 0) {
                    return (
                      <Empty
                        description={t("noResourcesDeployed")}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    );
                  } else {
                    const filteredResources =
                      resourceNameFilter.length === 0
                        ? matchingResources
                        : matchingResources.filter(
                            (resource) =>
                              resource.name
                                .toLowerCase()
                                .includes(resourceNameFilter.toLowerCase()) ||
                              resource.kind
                                .toLowerCase()
                                .includes(resourceNameFilter.toLowerCase())
                          );

                    if (filteredResources.length === 0) {
                      return (
                        <Empty
                          description={t("noMatchingResourcesFound")}
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      );
                    } else {
                      return filteredResources.map((resource, index) => (
                        <ResourceItem
                          actions={[
                            resource.kind === "Workload" && (
                              <Button type="text" shape="circle">
                                <FontAwesomeIcon icon={faTerminal} />
                              </Button>
                            ),
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item key="openInExplorer">
                                    <Space>
                                      <FontAwesomeIcon
                                        fixedWidth
                                        icon={faBinoculars}
                                      />
                                      {t("openInExplorer")}
                                    </Space>
                                  </Menu.Item>

                                  <Menu.Item key="delete">
                                    <Space>
                                      <FontAwesomeIcon
                                        fixedWidth
                                        icon={faTrash}
                                      />
                                      {t("delete")}
                                    </Space>
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <Button type="text" shape="circle">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </Button>
                            </Dropdown>,
                          ].filter((component) => component)}
                          key={index}
                        >
                          <List.Item.Meta
                            title={
                              <>
                                {resource.name}{" "}
                                <Text code>{resource.kind}</Text>
                              </>
                            }
                          />
                        </ResourceItem>
                      ));
                    }
                  }
                })()}
              </List>
            </ResourceList>
          </Inspector>
        )}
      </Animate>

      <Animate transitionName="fadeandzoom" transitionAppear>
        <GlobeActions>
          <Button
            type="text"
            onClick={getUserCoordinates}
            loading={loadingUserCoordinates}
            icon={<FontAwesomeIcon icon={faLocationArrow} />}
          />

          {!(selectedNode
            ? width && width <= 821
              ? true
              : statsOpen
            : statsOpen) && (
            <Button
              type="text"
              onClick={() => setStatsOpen(true)}
              icon={<FontAwesomeIcon icon={faChartPie} />}
            />
          )}
        </GlobeActions>
      </Animate>
    </>
  );
}

const GlobeWrapper = styled.div<{ $hoverable: boolean }>`
  ${(props) => (props.$hoverable ? "cursor: pointer;" : "")}
`;

const Inspector = styled(Card)`
  position: absolute;
  height: calc(100% - 64px - 64px); // Top & bottom menus
  overflow-y: auto;
  min-width: 20rem;
  top: 64px;
  border: 0;
  left: 0;
  right: 0;
  margin: 0;
  ${glass}

  .ant-card-head {
    border-bottom: 0;
  }

  .ant-card-body {
    padding: 0;
  }

  @media screen and (min-width: 812px) {
    height: calc(100% - 64px - 2rem); // Navbar & self-margins
    border: 1px solid #303030;
    left: auto;
    right: 50px;
    margin: 1rem;
    margin-right: 0;
  }
`;

const Stats = styled(Card)`
  position: absolute;
  // The last part is the bottom toolbar
  max-height: calc(100% - 64px - 64px); // Top & bottom menus
  min-width: calc(5rem * 3); // NavigationButton * 3
  overflow-y: auto;
  bottom: 64px;
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  left: 0;
  right: 0;
  margin: 0;

  .ant-card-head {
    border-bottom: 0;
  }

  .ant-card-body {
    padding: 0;
  }

  ${glass}

  @media screen and (min-width: 812px) {
    top: 64px;
    left: 50px;
    right: auto;
    bottom: auto;
    border: 1px solid #303030;
    max-height: calc(100% - 64px - 2rem - 32px - 1rem);
    margin: 1rem;
    margin-left: 0;
  }
`;

const GlobeTmpl = dynamic(() => import("../components/globe"), {
  ssr: false,
});
const Globe = forwardRef((props: any, ref) => (
  <GlobeTmpl {...props} forwardRef={ref} />
));

const GlobeActions = styled.div`
  position: absolute !important;
  bottom: 64px;
  border: 1px solid #303030;
  margin: 1rem;
  right: 0;
  ${glass}

  @media screen and (min-width: 812px) {
    bottom: 0;
    left: 50px;
    right: auto;
    margin-left: 0;
  }
`;

const StatsWrapper = styled.div<{ $long?: boolean }>`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 12px 16px;

  ${(props) =>
    props.$long
      ? ".ant-statistic-content { font-size: 20px !important; }"
      : "padding-bottom: 6px;"}
`;

const StatsDivider = styled(Divider)`
  margin: 0.25rem 0;
`;

const ResourceList = styled(Space)`
  padding: 12px 16px;
  width: 100%;
`;

const ResourceItem = styled(List.Item)`
  .ant-list-item-action {
    margin-left: 1rem;
  }
`;

export default HomePage;
