import {
  faCheckCircle,
  faExternalLinkAlt,
  faGlobe,
  faLocationArrow,
  faMapMarkerAlt,
  faSave,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider as DividerTmpl, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import packageJSON from "../../package.json";
import glass from "../../styles/glass";
import { urlencodeYAMLAll } from "../../utils/urltranscode";
import { LocationButton } from "../buttons";
import { ManagerWrapper, TitleSpace } from "../layouts";
import ResourceEditorTmpl from "../resource-editor";
import { BareLink, MoreLink } from "../typography";

export interface IConfigPageProps {
  nodeId: string;
  nodeConfig: string;
  nodePublicIPv6?: string;
  setNodeConfig: (newNodeConfig: string) => void;
  refreshNodeLocation: () => void;
  nodeCoordinatesLoading: boolean;
  latitude: number;
  longitude: number;
  nodeAddress: string;
  nodeFlag: string;
}

/**
 * ConfigPage allows the user to get some info about their current node.
 * Advanced users can also manually configure their node here.
 */
export const ConfigPage: React.FC<IConfigPageProps> = ({
  nodeId,
  nodeConfig,
  setNodeConfig,
  nodePublicIPv6,
  refreshNodeLocation,
  nodeCoordinatesLoading,
  latitude,
  longitude,
  nodeAddress,
  nodeFlag,
  ...otherProps
}) => {
  // Hooks
  const { t } = useTranslation();
  const router = useHistory();

  return (
    <ManagerWrapper {...otherProps}>
      <Animate transitionName="fadeandzoom" transitionAppear>
        <div>
          {/* Node metadata */}
          <NodeMetadataCard>
            <NodeMetadataOverview>
              {/* Connection status */}
              <ConnectionStatusDisplay>
                <FontAwesomeIcon icon={faCheckCircle} size="lg" fixedWidth />{" "}
                {t("connected")}!
              </ConnectionStatusDisplay>

              {/* Cluster node */}
              <ClusterNodeDisplay direction="vertical" align="center">
                <div>{t("youAre")}:</div>

                <Space align="center">
                  <LocationButton
                    type="text"
                    shape="circle"
                    onClick={refreshNodeLocation}
                    loading={nodeCoordinatesLoading}
                    icon={<FontAwesomeIcon icon={faLocationArrow} fixedWidth />}
                  />

                  <IPAddressDisplays>{nodeId}</IPAddressDisplays>
                </Space>
              </ClusterNodeDisplay>

              {/* Version information */}
              <VersionInformationDisplay>
                <dl>
                  <dt>
                    <BareLink
                      href="https://github.com/pojntfx/webnetesctl"
                      target="_blank"
                    >
                      webnetesctl <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </BareLink>
                  </dt>
                  <dd>
                    <Text code>{packageJSON.version}</Text>
                  </dd>

                  <dt>
                    <BareLink
                      href="https://github.com/pojntfx/webnetes"
                      target="_blank"
                    >
                      webnetes <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </BareLink>
                  </dt>
                  <dd>
                    <Text code>
                      {packageJSON.dependencies["@pojntfx/webnetes"]}
                    </Text>
                  </dd>
                </dl>
              </VersionInformationDisplay>
            </NodeMetadataOverview>

            <VirtualPhysicalDivider>{t("metadata")}</VirtualPhysicalDivider>

            {/* Information on the physical node */}
            <PhysicialNodeDisplay>
              <dl>
                <dt>
                  <FontAwesomeIcon icon={faGlobe} /> {t("publicIp")}
                </dt>
                <dd>{nodePublicIPv6 || t("loading")}</dd>

                <dt>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {t("location")}
                </dt>
                <dd>
                  {nodeAddress ? nodeAddress : t("notSet")}
                  {`${nodeFlag ? " " + nodeFlag : ""}`}
                </dd>

                <dt>
                  <FontAwesomeIcon icon={faThumbtack} /> {t("coordinates")}
                </dt>
                <dd>
                  {latitude === 0 && longitude === 0
                    ? t("notSet")
                    : `${latitude}, ${longitude}`}
                </dd>
              </dl>
            </PhysicialNodeDisplay>
          </NodeMetadataCard>

          {/* Node config */}

          {/* Node config toolbar */}
          <TitleSpace align="center">
            <Title level={2}>{t("nodeConfig")}</Title>

            <Button
              onClick={() => {
                router.push(
                  `/overview?nodeConfig=${urlencodeYAMLAll(nodeConfig)}`
                );

                typeof window !== "undefined" && window.location.reload();
              }}
            >
              <Space>
                <FontAwesomeIcon icon={faSave} />
                {t("applyAndReload")}
              </Space>
            </Button>
          </TitleSpace>

          {/* Node config editor */}
          <ResourceEditor data={nodeConfig} onEdit={setNodeConfig} />

          <MoreLink>
            {t("youCanFindAnExampleInThe")}{" "}
            <BareLink
              href="https://github.com/pojntfx/webnetes/blob/main/app/webnetes_node/node.yaml"
              target="_blank"
            >
              GitHub Repository <FontAwesomeIcon icon={faExternalLinkAlt} />
            </BareLink>
            .
          </MoreLink>
        </div>
      </Animate>
    </ManagerWrapper>
  );
};

// Layout components
const NodeMetadataCard = styled.div`
  border: 1px solid #303030;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.5rem;
  margin-bottom: 2.5rem;
  max-width: 812px;
  ${glass}
`;

const NodeMetadataOverview = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: start;
  padding: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  grid-gap: 1rem;

  @media screen and (min-width: 812px) {
    grid-template-columns: 1fr 2fr 1fr;
    justify-items: center;
  }
`;

const VirtualPhysicalDivider = styled(DividerTmpl)`
  margin-top: -0.5rem !important;
  margin-bottom: -0.5rem !important;
`;

// Display components
const PhysicialNodeDisplay = styled.div`
  padding: 1rem;

  dl,
  dd:last-child {
    margin-bottom: 0;
  }

  code {
    margin: 0;
  }
`;

const ConnectionStatusDisplay = styled.div`
  font-size: 1.5rem;
  margin: 0 auto;
`;

const ClusterNodeDisplay = styled(Space)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const IPAddressDisplays = styled.span`
  font-size: 2.5rem;
`;

const VersionInformationDisplay = styled.div`
  dl,
  dd:last-child {
    margin-bottom: 0;
  }

  code {
    margin: 0;
  }
`;

// Editor components
const ResourceEditor = styled(ResourceEditorTmpl)`
  min-height: calc(
    100vh - 64px - 64px - 64px - 2rem - 1rem - 1.5715em
  ); /* Top navbar, bottom navbar, top & bottom margins, example link */

  @media screen and (min-width: 812px) {
    height: calc(
      100vh - 64px - 64px - 2rem - 1rem - 1.5715em
    ); /* Top navbar, top & bottom margins, example link */
  }
`;
