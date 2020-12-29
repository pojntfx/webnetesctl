import {
  faCube,
  faGlobe,
  faMapMarkerAlt,
  faMicrochip,
  faMinus,
  faMobile,
  faPlus,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Space, Tooltip } from "antd";
import Title from "antd/lib/typography/Title";
import Link from "next/link";
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
import glass from "../styles/glass";

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

  const dataSource = nodes.map((node) => {
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

  const columns = [
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faMobile} /> {t("privateIp")}
        </>
      ),
      dataIndex: "privateIP",
      key: "privateIP",
      sorter: (a: typeof dataSource[0], b: typeof dataSource[0]) =>
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
      sorter: (a: typeof dataSource[0], b: typeof dataSource[0]) =>
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
      sorter: (a: typeof dataSource[0], b: typeof dataSource[0]) =>
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
      sorter: (a: typeof dataSource[0], b: typeof dataSource[0]) =>
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
      sorter: (a: typeof dataSource[0], b: typeof dataSource[0]) =>
        parseInt(a.networkingScore.split(" ")[0]) -
        parseInt(b.networkingScore.split(" ")[0]),
    },
    {
      title: "",
      dataIndex: "privateIP",
      key: "operation",
      render: (privateIP: typeof dataSource[0]["privateIP"]) => (
        <Link href={`/?privateIP=${privateIP}`}>
          <Tooltip title={t("openInOverview")}>
            <Button type="text" shape="circle">
              <FontAwesomeIcon icon={faGlobe} />
            </Button>
          </Tooltip>
        </Link>
      ),
    },
  ];

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <Title level={2}>{t("node", { count: 2 })}</Title>

        <WideSpace direction="vertical" size="middle">
          <Input.Search
            placeholder={t("filterNodes")}
            onChange={(e) => setNodeFilter(e.target.value)}
            value={nodeFilter}
          />

          <Table
            dataSource={dataSource.filter((node) =>
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
            columns={columns as any}
            scroll={{ x: "max-content" }}
            locale={{
              emptyText: t("noMatchingNodesFound"),
            }}
            expandable={{
              expandedRowRender: () => <div>Hello, world!</div>,
              expandedRowKeys: (() => {
                const keys = [selectedRow].filter((s) => s);

                if (keys.length > 0) {
                  return keys;
                } else {
                  return undefined;
                }
              })() as string[],
              expandIcon: ({ expanded, record }) =>
                expanded ? (
                  <Space>
                    <Button
                      type="text"
                      shape="circle"
                      onClick={() => setSelectedRow(undefined)}
                    >
                      <FontAwesomeIcon fixedWidth icon={faMinus} />
                    </Button>
                    <FontAwesomeIcon fixedWidth icon={faCube} /> 16
                  </Space>
                ) : (
                  <Space>
                    <Button
                      type="text"
                      shape="circle"
                      onClick={() =>
                        setSelectedRow(
                          (record as typeof dataSource[0]).privateIP
                        )
                      }
                    >
                      <FontAwesomeIcon fixedWidth icon={faPlus} />
                    </Button>
                    <FontAwesomeIcon fixedWidth icon={faCube} /> 16
                  </Space>
                ),
            }}
          />
        </WideSpace>
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

export default Explorer;
