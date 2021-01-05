import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faChevronDown,
  faChevronRight,
  faCode,
  faCube,
  faEllipsisV,
  faFont,
  faGlobe,
  faMapMarkerAlt,
  faMicrochip,
  faMinus,
  faMobile,
  faPlus,
  faShapes,
  faTerminal,
  faTrash,
  faWifi
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dropdown,
  Empty,
  Input,
  List,
  Menu,
  Space,
  Tooltip
} from "antd";
import Text from "antd/lib/typography/Text";
import yaml from "js-yaml";
import Animate from "rc-animate";
import React, { createRef, useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import nodes from "../../data/network-cluster.json";
import resources from "../../data/resources-cluster.json";
import computeStats from "../../data/stats-compute.json";
import networkingStats from "../../data/stats-networking.json";
import { filterKeys } from "../../utils/filter-keys";
import {
  parseResourceKey,
  stringifyResourceKey
} from "../../utils/resource-key";
import { ManagerWrapper, TitleSpace, WideSpace } from "../layouts";
import { ResourceItem as ResourceItemTmpl } from "../lists";
import ResourceEditorTmpl from "../resource-editor";
import Table from "../tables";
import { BareTitle } from "../typography";

/**
 * ExplorerPage is a way for the user to quickly find & manage a node or resource.
 * If a visual aid is of use, it links to the overview page.
 */
function ExplorerPage() {
  // Hooks
  const { t } = useTranslation();
  const router = useHistory();
  const ref = createRef<HTMLElement>();

  // State
  const [nodesFilter, setNodesFilter] = useState("");
  const [resourcesFilter, setResourcesFilter] = useState("");

  const [selectedNode, _setSelectedNode] = useState<string>();
  const [selectedResource, _setSelectedResource] = useState<string[]>();

  const [nodesTableOpen, setNodesTableOpen] = useState(true);
  const [resourcesTableOpen, setResourcesTableOpen] = useState(true);

  const [refActive, setRefActive] = useState(true);

  // Effects
  useEffect(() => {
    // Map privateIP query parameter to selected node
    const privateIP = new URLSearchParams(router.location.search).get(
      "privateIP"
    );

    if (privateIP) {
      const foundNode: any = nodes.find(
        (candidate) => candidate.privateIP === privateIP
      );

      unstable_batchedUpdates(() => {
        setNodesTableOpen(true);
        _setSelectedNode(foundNode?.privateIP);
      });
    } else {
      _setSelectedNode(undefined);
    }
  }, [new URLSearchParams(router.location.search).get("privateIP")]);

  useEffect(() => {
    // Map resource query parameter to selected resource
    const resource = new URLSearchParams(router.location.search).get(
      "resource"
    );

    if (resource) {
      const { kind, label, node } = parseResourceKey(resource);

      const foundResource: any = resources.find(
        (candidate) =>
          candidate.label === label &&
          candidate.kind === kind &&
          candidate.node === node
      );

      if (foundResource) {
        unstable_batchedUpdates(() => {
          setResourcesTableOpen(true);
          _setSelectedResource([
            foundResource.label,
            foundResource.kind,
            foundResource.node,
          ]);
        });
      } else {
        _setSelectedResource(undefined);
      }
    } else {
      _setSelectedResource(undefined);
    }
  }, [new URLSearchParams(router.location.search).get("resource")]);

  useEffect(() => {
    // Scroll the selected node/resource into view
    if (refActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      setRefActive(false);
    }
  }, [ref, refActive]);

  // Focused node/resource setters
  const setSelectedNode = useCallback((privateIP?: string) => {
    if (privateIP) {
      setRefActive(true);

      router.push(`/explorer?privateIP=${privateIP}`);
    } else {
      router.push("/explorer");
    }
  }, []);

  const setSelectedResource = useCallback(
    (
      resource:
        | {
            label: string;
            kind: string;
            node: string;
          }
        | undefined
    ) => {
      if (resource?.label && resource?.kind && resource?.node) {
        setRefActive(true);

        router.push(
          `/explorer?resource=${stringifyResourceKey(
            resource?.label,
            resource?.kind,
            resource?.node
          )}`
        );
      } else {
        router.push("/explorer");
      }
    },
    []
  );

  // Data sources
  const nodesDataSource = nodes.map((node) => {
    const computeScore = computeStats.find(
      (candidate) => candidate.ip === node.privateIP
    )?.score;
    const networkingScore = networkingStats.find(
      (candidate) => candidate.ip === node.privateIP
    )?.score;

    return {
      ...node,
      computeScore: `${computeScore} ${t("point", {
        count: computeScore,
      })}`,
      networkingScore: `${networkingScore} ${t("mbps", {
        count: networkingScore,
      })}`,
      key: node.privateIP,
    };
  });

  const resourcesDataSource = resources.map((resource) => ({
    ...resource,
    key: stringifyResourceKey(resource.label, resource.kind, resource.node),
  }));

  // Columns
  const nodeColumns = [
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faMobile} /> {t("privateIp")}
        </>
      ),
      dataIndex: "privateIP",
      key: "privateIP",
      sorter: (a: typeof nodesDataSource[0], b: typeof nodesDataSource[0]) =>
        parseInt(a.privateIP.split(".")[3]) -
        parseInt(b.privateIP.split(".")[3]),
    },
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faMapMarkerAlt} /> {t("location")}
        </>
      ),
      dataIndex: "location",
      key: "location",
      sorter: (a: typeof nodesDataSource[0], b: typeof nodesDataSource[0]) =>
        a.location.localeCompare(b.location),
    },
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faGlobe} /> {t("publicIp")}
        </>
      ),
      dataIndex: "publicIP",
      key: "publicIP",
      sorter: (a: typeof nodesDataSource[0], b: typeof nodesDataSource[0]) =>
        parseInt(a.publicIP.split(".")[0]) - parseInt(b.publicIP.split(".")[0]),
    },
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faMicrochip} /> {t("compute")}
        </>
      ),
      dataIndex: "computeScore",
      key: "computeScore",
      sorter: (a: typeof nodesDataSource[0], b: typeof nodesDataSource[0]) =>
        parseInt(a.computeScore.split(" ")[0]) -
        parseInt(b.computeScore.split(" ")[0]),
    },
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faWifi} /> {t("network")}
        </>
      ),
      dataIndex: "networkingScore",
      key: "networkingScore",
      sorter: (a: typeof nodesDataSource[0], b: typeof nodesDataSource[0]) =>
        parseInt(a.networkingScore.split(" ")[0]) -
        parseInt(b.networkingScore.split(" ")[0]),
    },
    {
      title: "",
      dataIndex: "privateIP",
      key: "operation",
      render: (privateIP: typeof nodesDataSource[0]["privateIP"]) => (
        <Tooltip title={t("openInOverview")}>
          <Button
            type="text"
            shape="circle"
            onClick={(e) => {
              e.stopPropagation();

              router.push(`/overview?privateIP=${privateIP}`);
            }}
          >
            <FontAwesomeIcon icon={faGlobe} />
          </Button>
        </Tooltip>
      ),
    },
  ];

  const resourceColumns = [
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faFont} /> {t("name")}
        </>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (
        a: typeof resourcesDataSource[0],
        b: typeof resourcesDataSource[0]
      ) => a.name.localeCompare(b.name),
    },
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faShapes} /> {t("kind")}
        </>
      ),
      dataIndex: "kind",
      key: "kind",
      sorter: (
        a: typeof resourcesDataSource[0],
        b: typeof resourcesDataSource[0]
      ) => a.name.localeCompare(b.name),
      render: (kind: typeof resourcesDataSource[0]["kind"]) => (
        <Text code>{kind}</Text>
      ),
    },
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faMobile} /> {t("node")}
        </>
      ),
      dataIndex: "node",
      key: "node",
      sorter: (
        a: typeof resourcesDataSource[0],
        b: typeof resourcesDataSource[0]
      ) => parseInt(a.node.split(".")[0]) - parseInt(b.node.split(".")[0]),
      render: (node: typeof resourcesDataSource[0]["node"]) => (
        <>
          {node}{" "}
          <Tooltip title={t("openInNodes")}>
            <Button
              type="text"
              shape="circle"
              onClick={(e) => {
                e.stopPropagation();

                setSelectedNode(node);
              }}
            >
              <FontAwesomeIcon fixedWidth icon={faAngleDoubleUp} />
            </Button>
          </Tooltip>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "node",
      key: "operation",
      render: (_: any, resource: typeof resourcesDataSource[0]) => (
        <>
          {resource.kind === "Workload" && (
            <>
              <Tooltip title={t("openInTerminal")}>
                <Action type="text" shape="circle">
                  <FontAwesomeIcon icon={faTerminal} />
                </Action>
              </Tooltip>

              <ActionSplit />
            </>
          )}

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="delete">
                  <Space>
                    <FontAwesomeIcon fixedWidth icon={faTrash} />
                    {t("delete")}
                  </Space>
                </Menu.Item>
              </Menu>
            }
          >
            <Action type="text" shape="circle">
              <FontAwesomeIcon icon={faEllipsisV} />
            </Action>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <ManagerWrapper>
      <Animate transitionName="fadeandzoom" transitionAppear>
        <div>
          {/* Nodes */}

          {/* Nodes title */}
          <TitleSpace
            align="center"
            onClick={() => setNodesTableOpen((nodesOpen) => !nodesOpen)}
          >
            <BareTitle level={2}>
              <FontAwesomeIcon icon={faMobile} /> {t("node", { count: 2 })}
            </BareTitle>

            <Button
              type="text"
              shape="circle"
              onClick={() => setNodesTableOpen((nodesOpen) => !nodesOpen)}
            >
              <FontAwesomeIcon
                icon={nodesTableOpen ? faChevronDown : faChevronRight}
              />
            </Button>
          </TitleSpace>

          {/* Nodes table */}
          <Animate transitionName="fadeandslide" transitionAppear>
            {nodesTableOpen && (
              <WideSpace direction="vertical" size="middle">
                <Input.Search
                  placeholder={t("filterNodes")}
                  onChange={(e) => setNodesFilter(e.target.value)}
                  value={nodesFilter}
                />

                <Table
                  dataSource={filterKeys(nodesDataSource, nodesFilter)}
                  columns={nodeColumns as any}
                  scroll={{ x: "max-content" }}
                  locale={{
                    emptyText: t("noMatchingNodesFound"),
                  }}
                  expandable={{
                    expandedRowRender: (record) => {
                      const matchingResources = resources.filter(
                        (resource) =>
                          resource.node ===
                          (record as typeof nodesDataSource[0]).privateIP
                      );

                      if (matchingResources.length === 0) {
                        return (
                          <div ref={ref as any}>
                            <Empty
                              description={t("noResourcesDeployed")}
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div ref={ref as any}>
                            <ResourceList>
                              {matchingResources.map((resource, index) => (
                                <ResourceItem
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    setSelectedResource(resource);
                                  }}
                                  actions={[
                                    resource.kind === "Workload" && (
                                      <Tooltip title={t("openInTerminal")}>
                                        <Button type="text" shape="circle">
                                          <FontAwesomeIcon icon={faTerminal} />
                                        </Button>
                                      </Tooltip>
                                    ),
                                    <Tooltip title={t("openInResources")}>
                                      <Button
                                        type="text"
                                        shape="circle"
                                        onClick={(e) => {
                                          e.stopPropagation();

                                          setSelectedResource(resource);
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          icon={faAngleDoubleDown}
                                        />
                                      </Button>
                                    </Tooltip>,
                                    <Dropdown
                                      overlay={
                                        <Menu>
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
                              ))}
                            </ResourceList>
                          </div>
                        );
                      }
                    },
                    expandedRowKeys: (() => {
                      const keys = [selectedNode].filter((s) => s);

                      if (keys.length > 0) {
                        return keys;
                      } else {
                        return undefined;
                      }
                    })() as string[],
                    expandIcon: ({ expanded, record }) => (
                      <Space>
                        <Button
                          type="text"
                          shape="circle"
                          onClick={(e) => {
                            e.stopPropagation();

                            expanded
                              ? setSelectedNode(undefined)
                              : setSelectedNode(
                                  (record as typeof nodesDataSource[0])
                                    .privateIP
                                );
                          }}
                        >
                          <FontAwesomeIcon
                            fixedWidth
                            icon={expanded ? faMinus : faPlus}
                          />
                        </Button>
                        <FontAwesomeIcon fixedWidth icon={faCube} />{" "}
                        {
                          resources.filter(
                            (resource) =>
                              resource.node ===
                              (record as typeof nodesDataSource[0]).privateIP
                          ).length
                        }
                      </Space>
                    ),
                  }}
                  onRow={(rawRecord) => {
                    const record = rawRecord as typeof nodesDataSource[0];

                    return {
                      onClick: () => {
                        if (selectedNode === record.privateIP) {
                          setSelectedNode(undefined);
                        } else {
                          setSelectedNode(record.privateIP);
                        }
                      },
                    };
                  }}
                />
              </WideSpace>
            )}
          </Animate>

          {/* Resources */}

          {/* Resources title */}
          <TitleSpace
            align="center"
            onClick={() =>
              setResourcesTableOpen((resourcesOpen) => !resourcesOpen)
            }
          >
            <BareTitle level={2}>
              <FontAwesomeIcon icon={faCube} /> {t("resource", { count: 2 })}
            </BareTitle>
            <Button type="text" shape="circle">
              <FontAwesomeIcon
                icon={resourcesTableOpen ? faChevronDown : faChevronRight}
              />
            </Button>
          </TitleSpace>

          {/* Resources table */}
          <Animate transitionName="fadeandslide" transitionAppear>
            {resourcesTableOpen && (
              <WideSpace direction="vertical" size="middle">
                <Input.Search
                  placeholder={t("filterResources")}
                  onChange={(e) => setResourcesFilter(e.target.value)}
                  value={resourcesFilter}
                />

                <ResourceTable
                  dataSource={filterKeys(resourcesDataSource, resourcesFilter)}
                  columns={resourceColumns as any}
                  scroll={{ x: "max-content" }}
                  locale={{
                    emptyText: t("noMatchingResourcesFound"),
                  }}
                  onRow={(rawRecord) => {
                    return {
                      onClick: () => {
                        const record = rawRecord as typeof resourcesDataSource[0];

                        if (
                          selectedResource &&
                          selectedResource[0] === record.label &&
                          selectedResource[1] === record.kind &&
                          selectedResource[2] === record.node
                        ) {
                          setSelectedResource(undefined);
                        } else {
                          setSelectedResource(record);
                        }
                      },
                    };
                  }}
                  expandable={{
                    expandedRowRender: (rawRecord) => {
                      const record = rawRecord as typeof resourcesDataSource[0];

                      return (
                        <ResourceEditor one data={yaml.safeDump(record)} />
                      );
                    },
                    expandedRowKeys: (() => {
                      if (selectedResource) {
                        const keys = [
                          stringifyResourceKey(
                            selectedResource[0],
                            selectedResource[1],
                            selectedResource[2]
                          ),
                        ].filter((s) => s);

                        if (keys.length > 0) {
                          return keys;
                        } else {
                          return undefined;
                        }
                      } else {
                        return undefined;
                      }
                    })() as string[],
                    expandIcon: ({ expanded, record: rawRecord }) => (
                      <Space>
                        <Button
                          type="text"
                          shape="circle"
                          onClick={(e) => {
                            e.stopPropagation();

                            const record = rawRecord as typeof resourcesDataSource[0];

                            expanded
                              ? setSelectedResource(undefined)
                              : setSelectedResource(record);
                          }}
                        >
                          <FontAwesomeIcon
                            fixedWidth
                            icon={expanded ? faMinus : faPlus}
                          />
                        </Button>
                        <FontAwesomeIcon fixedWidth icon={faCode} />{" "}
                      </Space>
                    ),
                  }}
                />
              </WideSpace>
            )}
          </Animate>
        </div>
      </Animate>
    </ManagerWrapper>
  );
}

// Resource components
const ResourceList = styled(List)``;

const ResourceItem = styled(ResourceItemTmpl)`
  margin-left: 0;
  margin-right: 0;
`;

const ResourceTable = styled(Table)`
  .ant-table-tbody > .ant-table-row > .ant-table-cell:last-child {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

const ResourceEditor = styled(ResourceEditorTmpl)`
  margin-top: -16px;
  margin-bottom: -16px;
`;

// Action components
const ActionSplit = styled.em`
  width: 1px;
  height: 14px;
  background-color: #303030;
`;

const Action = styled(Button)`
  margin-left: 8px;

  :not(:last-child) {
    margin-right: 8px;
  }
`;

export default ExplorerPage;
