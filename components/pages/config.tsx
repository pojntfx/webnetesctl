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
import { feature } from "@ideditor/country-coder";
import { Button, Divider as DividerTmpl, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import * as Nominatim from "nominatim-browser";
import getPublicIp from "public-ip";
import Animate from "rc-animate";
import { useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import nodeResource, { nodeId } from "../../data/node-config";
import packageJSON from "../../package.json";
import glass from "../../styles/glass";
import { LocationButton } from "../buttons";
import { ManagerWrapper, TitleSpace } from "../layouts";
import ResourceEditorTmpl from "../resource-editor";
import { BareLink, MoreLink } from "../typography";

/**
 * ConfigPage allows the user to get some info about their current node.
 * Advanced users can also manually configure their node here.
 */
function ConfigPage() {
  // Hooks
  const { t } = useTranslation();

  // State
  const [publicIP, setPublicIP] = useState("");

  const [userCoordinates, setUserCoordinates] = useState<number[]>([
    2.2770202,
    48.8589507,
  ]);
  const [userCoordinatesLoading, setUserCoordinatesLoading] = useState(false);

  const [userLocationAddress, setUserLocationAddress] = useState("");
  const [userLocationEmoji, setUserLocationEmoji] = useState("");

  const [node, setNode] = useState(nodeResource);

  // Effects
  useEffect(() => {
    // Get the public IPv6 address
    getPublicIp
      .v6()
      .then((ip) => setPublicIP(ip))
      .catch((e) => console.log("could not get public IPv6", e));
  }, []);

  useEffect(() => {
    // Map an address to the user's coordinates
    Nominatim.reverseGeocode({
      lat: userCoordinates[1].toString(),
      lon: userCoordinates[0].toString(),
      addressdetails: true,
    }).then((res: any) => {
      if (res.address?.country_code) {
        const feat = feature(res.address?.country_code as string);

        if (feat) {
          unstable_batchedUpdates(() => {
            setUserLocationAddress(res.display_name);
            setUserLocationEmoji(feat.properties.emojiFlag!);
          });
        }
      }
    });
  }, [userCoordinates]);

  const refreshUserCoordinates = useCallback(() => {
    // Get a user's coordinates and set them
    setUserCoordinatesLoading(true);

    typeof window !== "undefined" &&
      navigator.geolocation.getCurrentPosition(
        (position) => {
          unstable_batchedUpdates(() => {
            setUserCoordinates([
              position.coords.longitude,
              position.coords.latitude,
            ]);
            setUserCoordinatesLoading(false);
          });
        },
        (e) => {
          console.error(
            "could not get user location, falling back to [0,0]",
            e
          );

          setUserCoordinates([0, 0]);
          setUserCoordinatesLoading(false);
        }
      );
  }, []);

  return (
    <ManagerWrapper>
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
                    onClick={refreshUserCoordinates}
                    loading={userCoordinatesLoading}
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
                <dd>{publicIP}</dd>

                <dt>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {t("location")}
                </dt>
                <dd>
                  {userLocationAddress}
                  {`${userLocationEmoji ? " " + userLocationEmoji : ""}`}
                </dd>

                <dt>
                  <FontAwesomeIcon icon={faThumbtack} /> {t("coordinates")}
                </dt>
                <dd>
                  {userCoordinates[0]}, {userCoordinates[1]}
                </dd>
              </dl>
            </PhysicialNodeDisplay>
          </NodeMetadataCard>

          {/* Node config */}

          {/* Node config toolbar */}
          <TitleSpace align="center">
            <Title level={2}>{t("nodeConfig")}</Title>

            <Button>
              <Space>
                <FontAwesomeIcon icon={faSave} />
                {t("applyAndReload")}
              </Space>
            </Button>
          </TitleSpace>

          {/* Node config editor */}
          <ResourceEditor data={node} onEdit={(value) => setNode(value)} />

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
}

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

export default ConfigPage;
