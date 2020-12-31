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
import { Wrapper } from "../components/layout-wrapper";
import ResourceEditorTmpl from "../components/resource-editor";
import node from "../data/node";
import packageJSON from "../package.json";
import glass from "../styles/glass";
import { TitleSpace as TitleSpaceTmpl } from "./explorer";

function Config() {
  const { t } = useTranslation();

  const [publicIP, setPublicIP] = useState("");
  const [loadingUserCoordinates, setLoadingUserCoordinates] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<number[]>([
    2.2770202,
    48.8589507,
  ]);
  const [featureLocation, setFeatureLocation] = useState("");
  const [featureFlag, setFeatureFlag] = useState("");

  useEffect(() => {
    getPublicIp
      .v6()
      .then((ip) => setPublicIP(ip))
      .catch((e) => console.log("could not get public IPv6", e));
  }, []);

  useEffect(() => {
    Nominatim.reverseGeocode({
      lat: userCoordinates[1].toString(),
      lon: userCoordinates[0].toString(),
      addressdetails: true,
    }).then((res: any) => {
      if (res.address?.country_code) {
        const feat = feature(res.address?.country_code as string);

        if (feat) {
          unstable_batchedUpdates(() => {
            setFeatureLocation(res.display_name);
            setFeatureFlag(feat.properties.emojiFlag!);
          });
        }
      }
    });
  }, [userCoordinates]);

  const getUserCoordinates = useCallback(() => {
    setLoadingUserCoordinates(true);

    typeof window !== "undefined" &&
      navigator.geolocation.getCurrentPosition(
        (position) => {
          unstable_batchedUpdates(() => {
            setUserCoordinates([
              position.coords.longitude,
              position.coords.latitude,
            ]);
            setLoadingUserCoordinates(false);
          });
        },
        (e) => {
          console.error(
            "could not get user location, falling back to [0,0]",
            e
          );

          setUserCoordinates([0, 0]);
          setLoadingUserCoordinates(false);
        }
      );
  }, []);

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <StatusCard>
          <Overview>
            <ConnectedStatus>
              <FontAwesomeIcon icon={faCheckCircle} size="lg" fixedWidth />{" "}
              {t("connected")}!
            </ConnectedStatus>

            <ClusterData direction="vertical" align="center">
              <div>{t("youAre")}:</div>

              <Space align="center">
                <Button
                  type="text"
                  shape="circle"
                  onClick={getUserCoordinates}
                  loading={loadingUserCoordinates}
                  icon={<FontAwesomeIcon icon={faLocationArrow} />}
                />

                <IPAddress>127.0.0.10</IPAddress>
              </Space>
            </ClusterData>

            <VersionInformation>
              <dl>
                <dt>
                  <ExternalLink
                    href="https://github.com/pojntfx/webnetesctl"
                    target="_blank"
                  >
                    webnetesctl <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </ExternalLink>
                </dt>
                <dd>
                  <Text code>{packageJSON.version}</Text>
                </dd>

                <dt>
                  <ExternalLink
                    href="https://github.com/pojntfx/webnetes"
                    target="_blank"
                  >
                    webnetes <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </ExternalLink>
                </dt>
                <dd>
                  <Text code>
                    {packageJSON.dependencies["@pojntfx/webnetes"]}
                  </Text>
                </dd>
              </dl>
            </VersionInformation>
          </Overview>

          <Divider>{t("metadata")}</Divider>

          <Details>
            <dl>
              <dt>
                <FontAwesomeIcon icon={faGlobe} /> {t("publicIp")}
              </dt>
              <dd>{publicIP}</dd>

              <dt>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {t("location")}
              </dt>
              <dd>
                {featureLocation}
                {`${featureFlag ? " " + featureFlag : ""}`}
              </dd>

              <dt>
                <FontAwesomeIcon icon={faThumbtack} /> {t("coordinates")}
              </dt>
              <dd>
                {userCoordinates[0]}, {userCoordinates[1]}
              </dd>
            </dl>
          </Details>
        </StatusCard>

        <TitleSpace align="center">
          <Title level={2}>{t("nodeConfig")}</Title>

          <Button>
            <Space>
              <FontAwesomeIcon icon={faSave} />
              {t("applyAndReload")}
            </Space>
          </Button>
        </TitleSpace>

        <ResourceEditor data={node} />
      </Wrapper>
    </Animate>
  );
}

const Overview = styled.div`
  display: grid;
  grid-template-columns: 100%;
  align-items: center;
  justify-items: start;
  padding: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  grid-gap: 1rem;

  @media screen and (min-width: 812px) {
    grid-template-columns: 25% 50% 25%;
    justify-items: center;
  }
`;

const ExternalLink = styled.a`
  color: unset;
`;

const Details = styled.div`
  padding: 1rem;

  dl,
  dd:last-child {
    margin-bottom: 0;
  }

  code {
    margin: 0;
  }
`;

const Divider = styled(DividerTmpl)`
  margin-top: -0.5rem !important;
  margin-bottom: -0.5rem !important;
`;

const StatusCard = styled.div`
  border: 1px solid #303030;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.5rem;
  margin-bottom: 2.5rem;
  max-width: 812px;
  ${glass}
`;

const ConnectedStatus = styled.div`
  font-size: 1.5rem;
  margin: 0 auto;
`;

const ClusterData = styled(Space)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const IPAddress = styled.span`
  font-size: 2.5rem;
`;

const VersionInformation = styled.div`
  dl,
  dd:last-child {
    margin-bottom: 0;
  }

  code {
    margin: 0;
  }
`;

const ResourceEditor = styled(ResourceEditorTmpl)`
  height: calc(
    100vh - 64px - 64px - 2rem
  ); /* Top navbar, bottom navbar, top & bottom margins */
`;

const TitleSpace = styled(TitleSpaceTmpl)`
  h2 {
    margin-bottom: 0;
  }
`;

export default Config;
