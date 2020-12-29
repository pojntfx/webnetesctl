import {
  faGlobe,
  faMapMarkerAlt,
  faMicrochip,
  faMobile,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Animate from "rc-animate";
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

  const columns = [
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faMobile} /> {t("privateIp")}
        </>
      ),
      dataIndex: "privateIP",
      key: "privateIP",
      sorter: (a: typeof nodes[0], b: typeof nodes[0]) =>
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
      sorter: (a: typeof nodes[0], b: typeof nodes[0]) =>
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
      sorter: (a: typeof nodes[0], b: typeof nodes[0]) =>
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
      sorter: (a: typeof nodes[0], b: typeof nodes[0]) =>
        parseInt((a as any).computeScore.split(" ")[0]) -
        parseInt((b as any).computeScore.split(" ")[0]),
    },
    {
      title: (
        <>
          <FontAwesomeIcon fixedWidth icon={faWifi} /> {t("network")}
        </>
      ),
      dataIndex: "networkingScore",
      key: "networkingScore",
      sorter: (a: typeof nodes[0], b: typeof nodes[0]) =>
        parseInt((a as any).networkingScore.split(" ")[0]) -
        parseInt((b as any).networkingScore.split(" ")[0]),
    },
  ];

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <Title level={2}>{t("node", { count: 2 })}</Title>

        <WideSpace direction="vertical">
          <Input.Search placeholder={t("filterNodes")} />

          <Table
            dataSource={nodes.map((node) => {
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
            })}
            columns={columns}
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
