import {
  faBinoculars,
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
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import earthTexture from "three-globe/example/img/earth-night.jpg";
import earthElevation from "three-globe/example/img/earth-topology.png";
import universeTexture from "three-globe/example/img/night-sky.png";
import { useWindowSize } from "use-window-size-hook";
import { stringifyResourceKey } from "../../utils/resource-key";
import { ResourceItem, ResourceList } from "../lists";
import NodeChart from "../node-chart";
import { InspectorPanel, StatsPanel } from "../panels";
import { OverviewTray } from "../trays";
import { IClusterNode, IClusterResource, INodeScore } from "./explorer";

export interface IConnections {
  management: number[][][];
  application: number[][][];
}

export interface IOverviewPageProps {
  cluster: {
    nodes: IClusterNode[];
    resources: IClusterResource[];
    connections: IConnections;
  };
  stats: {
    compute: INodeScore[];
    networking: INodeScore[];
  };
  onOpenTerminal: (label: string) => void;
  refreshNodeLocation: () => void;
  nodeCoordinatesLoading: boolean;
  latitude: number;
  longitude: number;
}

/**
 * OverviewPage shows a central globe for a quick topological cluster overview.
 * Using the inspector and stats panels, it is possible to quickly and visually get insights.
 * For complex resources, it links to the explorer page.
 */
export const OverviewPage: React.FC<IOverviewPageProps> = ({
  cluster: { nodes, resources, connections },
  stats: { compute, networking },
  onOpenTerminal,
  refreshNodeLocation,
  nodeCoordinatesLoading,
  latitude,
  longitude,
  ...otherProps
}) => {
  // Hooks
  const { t } = useTranslation();
  const ref = createRef();
  const { width, height } = useWindowSize();
  const router = useHistory();
  const location = useLocation();

  // State
  const [statsPanelOpen, setStatsPanelOpen] = useState(true);
  const [inspectorPanelOpen, setInspectorPanelOpen] = useState(true);

  const [selectedNode, _setSelectedNode] = useState<any>();
  const [globeInteractive, setGlobeInteractive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const [resourcesFilter, setResourcesFilter] = useState("");

  const [clusterId, setClusterId] = useState<string>();
  const [connectionPaths, setConnectionPaths] = useState<any[]>([]);

  // Effects
  useEffect(() => {
    // Transform connections into paths
    setConnectionPaths([
      ...connections.management.map((conn) => ({
        coords: conn,
        properties: { name: t("management"), color: "#fa8c16" },
      })),
      ...connections.application.map((conn) => ({
        coords: conn,
        properties: { name: t("application"), color: "#1890ff" },
      })),
    ]);

    setClusterId("127.0.2");
  }, []);

  useEffect(() => {
    // Map coordinates to globe position
    if (!ref.current) {
      setTimeout(() => setCameraActive(true), 1000); // Retry if globe hasn't rendered yet
    }

    if (ref.current && cameraActive) {
      if (selectedNode) {
        (ref.current as any).pointOfView(
          {
            lat: selectedNode.latitude,
            lng: selectedNode.longitude,
            altitude: 1,
          },
          1000
        );
      } else {
        (ref.current as any).pointOfView(
          {
            lat: latitude,
            lng: longitude,
            altitude: 2.5,
          },
          1000
        );
      }

      setCameraActive(false);
    }
  }, [ref.current, cameraActive, selectedNode, latitude, longitude]);

  useEffect(() => {
    // Map privateIP query parameter to globe position
    if (ref.current) {
      const privateIP = new URLSearchParams(location.search).get("privateIP");

      if (privateIP) {
        const foundNode: any = nodes.find(
          (candidate) => candidate.privateIP === privateIP
        );

        unstable_batchedUpdates(() => {
          setCameraActive(true);
          _setSelectedNode(foundNode);
        });
      } else {
        unstable_batchedUpdates(() => {
          setCameraActive(true);
          _setSelectedNode(undefined);
        });
      }
    }
  }, [ref, location.search]);

  const refreshLocation = useCallback(() => {
    // Get a user's coordinates and set the globe position accordingly
    unstable_batchedUpdates(() => {
      setCameraActive(true);
      setSelectedNode(undefined);
    });

    refreshNodeLocation();
  }, []);

  useEffect(() => {
    // When the escape key is pressed, clear the selected node
    if (typeof window !== "undefined") {
      const handleEscape = (e: KeyboardEvent) =>
        e.code === "Escape" && setSelectedNode(undefined);

      document.addEventListener("keydown", handleEscape, false);

      return () => {
        document.removeEventListener("keydown", handleEscape, false);
      };
    }
  }, []);

  const setSelectedNode = useCallback((newNode: any) => {
    // Set the selected node
    if (newNode?.privateIP) {
      setInspectorPanelOpen(true);

      router.push(`/overview?privateIP=${newNode.privateIP}`);
    } else {
      setInspectorPanelOpen(false);

      router.push("/overview");
    }
  }, []);

  return (
    <>
      {/* Globe */}
      <GlobeWrapper $hoverable={globeInteractive} {...otherProps}>
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
              ? !inspectorPanelOpen
                ? setInspectorPanelOpen(true)
                : setSelectedNode(undefined)
              : setSelectedNode(
                  nodes.find(
                    (candidate) => candidate.privateIP === node.privateIP
                  )
                )
          }
          onLabelHover={(label: any) =>
            label ? setGlobeInteractive(true) : setGlobeInteractive(false)
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
          ref={ref}
        />
      </GlobeWrapper>

      {/* Stats panel */}
      <Animate transitionName="fadeandslide" transitionAppear>
        {statsPanelOpen && (
          <StatsPanel
            size="small"
            title={
              <Space>
                <FontAwesomeIcon fixedWidth icon={faNetworkWired} />
                {t("cluster") + " " + clusterId}
              </Space>
            }
            extra={
              <Button
                type="text"
                shape="circle"
                onClick={() => setStatsPanelOpen(false)}
              >
                <FontAwesomeIcon icon={faWindowMinimize} />
              </Button>
            }
          >
            <StatsPanelWrapper>
              <Statistic
                title={t("node", { count: nodes.length })}
                value={nodes.length}
                prefix={<FontAwesomeIcon fixedWidth icon={faMobile} />}
              />
              <Statistic
                title={t("resource", { count: resources.length })}
                value={resources.length}
                prefix={<FontAwesomeIcon fixedWidth icon={faCube} />}
              />
            </StatsPanelWrapper>

            <StatsPanelDivider />

            <StatsPanelWrapper $long>
              <Statistic
                title={
                  <Space>
                    <FontAwesomeIcon icon={faMicrochip} />
                    {t("compute")}
                  </Space>
                }
                value={compute.reduce((all, curr) => all + curr.score, 0)}
                suffix={t("point", {
                  count: compute.reduce((all, curr) => all + curr.score, 0),
                })}
              />
              <Statistic
                title={
                  <Space>
                    <FontAwesomeIcon icon={faWifi} />
                    {t("network")}
                  </Space>
                }
                value={networking.reduce((all, curr) => all + curr.score, 0)}
                suffix={t("mbps", {
                  count: networking.reduce((all, curr) => all + curr.score, 0),
                })}
              />
            </StatsPanelWrapper>

            <Collapse defaultActiveKey={[]} ghost destroyInactivePanel>
              <Collapse.Panel
                header={t("computeDistribution")}
                key="computeDistribution"
              >
                <NodeChart
                  data={compute}
                  colors={[
                    "#1890ff",
                    "#096dd9",
                    "#0050b3",
                    "#003a8c",
                    "#002766",
                  ]}
                  onClick={(ip) =>
                    _setSelectedNode((selectedNode: any) =>
                      setSelectedNode(
                        selectedNode && selectedNode?.privateIP === ip
                          ? undefined
                          : nodes.find(
                              (candidate) => candidate.privateIP === ip
                            )
                      )
                    )
                  }
                />
              </Collapse.Panel>

              <Collapse.Panel
                header={t("networkingDistribution")}
                key="networkingDistribution"
              >
                <NodeChart
                  data={networking}
                  colors={[
                    "#faad14",
                    "#d48806",
                    "#ad6800",
                    "#874d00",
                    "#613400",
                  ]}
                  onClick={(ip) =>
                    _setSelectedNode((selectedNode: any) =>
                      setSelectedNode(
                        selectedNode && selectedNode?.privateIP === ip
                          ? undefined
                          : nodes.find(
                              (candidate) => candidate.privateIP === ip
                            )
                      )
                    )
                  }
                />
              </Collapse.Panel>
            </Collapse>
          </StatsPanel>
        )}
      </Animate>

      {/* Inspector panel */}
      <Animate transitionName="fadeandslide" transitionAppear>
        {selectedNode && inspectorPanelOpen && (
          <InspectorPanel
            size="small"
            title={
              <Space>
                <FontAwesomeIcon fixedWidth icon={faMobile} />
                {t("node") + " " + selectedNode.privateIP}
              </Space>
            }
            extra={
              <Space>
                <Link to={`/explorer?privateIP=${selectedNode.privateIP}`}>
                  <Tooltip title={t("openInExplorer")} placement="bottom">
                    <Button type="text" shape="circle">
                      <FontAwesomeIcon icon={faBinoculars} />
                    </Button>
                  </Tooltip>
                </Link>

                <Button
                  type="text"
                  shape="circle"
                  onClick={() => setInspectorPanelOpen(false)}
                >
                  <FontAwesomeIcon icon={faWindowMinimize} />
                </Button>

                <Button
                  type="text"
                  shape="circle"
                  onClick={() => setSelectedNode(undefined)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </Space>
            }
          >
            <StatsPanelWrapper $long>
              <Space>
                <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />
                {selectedNode.location}
              </Space>
              <Space>
                <FontAwesomeIcon icon={faGlobe} size="lg" />
                {selectedNode.publicIP}
              </Space>
            </StatsPanelWrapper>

            <StatsPanelDivider />

            <StatsPanelWrapper $long>
              <Statistic
                title={
                  <Space>
                    <FontAwesomeIcon icon={faMicrochip} />
                    {t("compute")}
                  </Space>
                }
                value={
                  compute.find(
                    (candidate) => candidate.ip === selectedNode?.privateIP
                  )?.score
                }
                suffix={t("point", {
                  count: compute.find(
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
                  networking.find(
                    (candidate) => candidate.ip === selectedNode?.privateIP
                  )?.score
                }
                suffix={t("mbps", {
                  count: networking.find(
                    (candidate) => candidate.ip === selectedNode?.privateIP
                  )?.score,
                })}
              />
            </StatsPanelWrapper>

            <StatsPanelDivider />

            <ResourceList direction="vertical">
              <Input.Search
                placeholder={t("filterResources")}
                onChange={(e) => setResourcesFilter(e.target.value)}
                value={resourcesFilter}
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
                      resourcesFilter.length === 0
                        ? matchingResources
                        : matchingResources.filter(
                            (resource) =>
                              resource.name
                                .toLowerCase()
                                .includes(resourcesFilter.toLowerCase()) ||
                              resource.kind
                                .toLowerCase()
                                .includes(resourcesFilter.toLowerCase())
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
                          onClick={(e) => {
                            e.stopPropagation();

                            router.push(
                              `/explorer?resource=${stringifyResourceKey(
                                resource.label,
                                resource.kind,
                                resource.node
                              )}`
                            );
                          }}
                          actions={[
                            resource.kind === "Workload" && (
                              <Tooltip title={t("openTerminals")}>
                                <Button
                                  type="text"
                                  shape="circle"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    onOpenTerminal(resource.label);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTerminal} />
                                </Button>
                              </Tooltip>
                            ),
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item
                                    key="openInExplorer"
                                    onClick={(e) => {
                                      e.domEvent.stopPropagation();

                                      router.push(
                                        `/explorer?resource=${stringifyResourceKey(
                                          resource.label,
                                          resource.kind,
                                          resource.node
                                        )}`
                                      );
                                    }}
                                  >
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
          </InspectorPanel>
        )}
      </Animate>

      {/* Overview tray */}
      <Animate transitionName="fadeandzoom" transitionAppear>
        <OverviewTray>
          <Button
            type="text"
            onClick={refreshLocation}
            loading={nodeCoordinatesLoading}
            icon={<FontAwesomeIcon icon={faLocationArrow} />}
          />

          {!statsPanelOpen && (
            <Button
              type="text"
              onClick={() => setStatsPanelOpen(true)}
              icon={<FontAwesomeIcon icon={faNetworkWired} />}
            />
          )}

          {!inspectorPanelOpen && selectedNode && (
            <Button
              type="text"
              onClick={() => setInspectorPanelOpen(true)}
              icon={<FontAwesomeIcon icon={faMobile} />}
            />
          )}
        </OverviewTray>
      </Animate>
    </>
  );
};

// Globe components
const GlobeTmpl = dynamic(() => import("../globe"), {
  ssr: false,
});

const Globe = forwardRef((props: any, ref) => (
  <GlobeTmpl {...props} forwardRef={ref} />
));

const GlobeWrapper = styled.div<{ $hoverable: boolean }>`
  ${(props) => (props.$hoverable ? "cursor: pointer;" : "")}
`;

// Stats panel components
const StatsPanelWrapper = styled.div<{ $long?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 12px 16px;

  ${(props) =>
    props.$long
      ? ".ant-statistic-content { font-size: 18px !important; }"
      : "padding-bottom: 6px;"}
`;

const StatsPanelDivider = styled(Divider)`
  margin: 0.25rem 0;
`;