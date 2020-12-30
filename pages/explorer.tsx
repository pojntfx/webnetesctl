import {
  faAngleDoubleDown,
  faAngleDoubleUp,
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
  faWifi,
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
  Tooltip,
} from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { useRouter } from "next/router";
import Animate from "rc-animate";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Wrapper } from "../components/layout-wrapper";
import Table from "../components/table";
import computeStats from "../data/compute-stats.json";
import networkingStats from "../data/networking-stats.json";
import nodes from "../data/nodes.json";
import resources from "../data/resources.json";
import glass from "../styles/glass";
import { ResourceItem as ResourceItemTmpl } from "./index";

function Explorer() {
  const { t } = useTranslation();
  const router = useRouter();

  const [nodeFilter, setNodeFilter] = useState("");
  const [selectedRow, _setSelectedRow] = useState<string>();

  useEffect(() => {
    const privateIP = router.query.privateIP;

    if (privateIP) {
      const foundNode: any = nodes.find(
        (candidate) => candidate.privateIP === privateIP
      );

      _setSelectedRow(foundNode?.privateIP);
    } else {
      _setSelectedRow(undefined);
    }
  }, [router.query.privateIP]);

  const setSelectedRow = (privateIP?: string) => {
    if (privateIP) {
      router.push(`/explorer?privateIP=${privateIP}`);
    } else {
      router.push("/explorer");
    }
  };

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

  const resourcesDataSource = resources.map((resource, index) => ({
    ...resource,
    key: index,
  }));

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

              router.push(`/?privateIP=${privateIP}`);
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

                setSelectedRow(node);
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
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <Title level={2}>
          <FontAwesomeIcon icon={faMobile} /> {t("node", { count: 2 })}
        </Title>

        <WideSpace direction="vertical" size="middle">
          <Input.Search
            placeholder={t("filterNodes")}
            onChange={(e) => setNodeFilter(e.target.value)}
            value={nodeFilter}
          />

          <Table
            dataSource={nodesDataSource.filter((node) =>
              nodeFilter.length === 0
                ? node
                : Object.values(node).reduce<boolean>(
                    (all, curr) =>
                      all ||
                      ("" + curr)
                        .toLowerCase()
                        .includes(nodeFilter.toLowerCase()),
                    false
                  )
            )}
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
                    <Empty
                      description={t("noResourcesDeployed")}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  );
                } else {
                  return (
                    <ResourceList>
                      {matchingResources.map((resource, index) => (
                        <ResourceItem
                          actions={[
                            resource.kind === "Workload" && (
                              <Tooltip title={t("openInTerminal")}>
                                <Button type="text" shape="circle">
                                  <FontAwesomeIcon icon={faTerminal} />
                                </Button>
                              </Tooltip>
                            ),
                            <Tooltip title={t("openInResources")}>
                              <Button type="text" shape="circle">
                                <FontAwesomeIcon icon={faAngleDoubleDown} />
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
                  );
                }
              },
              expandedRowKeys: (() => {
                const keys = [selectedRow].filter((s) => s);

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
                        ? setSelectedRow(undefined)
                        : setSelectedRow(
                            (record as typeof nodesDataSource[0]).privateIP
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
            onRow={(record) => {
              return {
                onClick: () => {
                  if (
                    selectedRow ===
                    (record as typeof nodesDataSource[0]).privateIP
                  ) {
                    setSelectedRow(undefined);
                  } else {
                    setSelectedRow(
                      (record as typeof nodesDataSource[0]).privateIP
                    );
                  }
                },
              };
            }}
          />
        </WideSpace>

        <Title level={2}>
          <FontAwesomeIcon icon={faCube} /> {t("resource", { count: 2 })}
        </Title>

        <ResourceTable
          dataSource={resourcesDataSource}
          columns={resourceColumns as any}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: t("noMatchingResourcesFound"),
          }}
        />
      </Wrapper>
    </Animate>
  );
}

const WideSpace = styled(Space)`
  width: 100%;

  .ant-input-group-wrapper,
  .ant-pagination > * {
    ${glass}
  }
`;

const ResourceList = styled(List)``;

const ResourceItem = styled(ResourceItemTmpl)`
  margin-left: 0;
  margin-right: 0;
`;

const ResourceTable = styled(Table)`
  .ant-table-tbody .ant-table-cell:last-child {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

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

export default Explorer;
