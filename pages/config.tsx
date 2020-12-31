import {
  faCheckCircle,
  faLocationArrow,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Text from "antd/lib/typography/Text";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Wrapper } from "../components/layout-wrapper";
import packageJSON from "../package.json";
import glass from "../styles/glass";
import getPublicIp from "public-ip";
import { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import { unstable_batchedUpdates } from "react-dom";
import { feature } from "@ideditor/country-coder";

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
    const feat = feature(userCoordinates as any);

    if (feat) {
      unstable_batchedUpdates(() => {
        setFeatureLocation(feat.properties.nameEn!);
        setFeatureFlag(feat.properties.emojiFlag!);
      });
    }
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
          <ConnectedStatus>
            <FontAwesomeIcon icon={faCheckCircle} size="lg" fixedWidth />{" "}
            {t("connected")}!
          </ConnectedStatus>

          <ClusterData>
            <div>You are:</div>
            <IPAddress>127.0.0.10</IPAddress>
            <div>
              <Button
                type="text"
                onClick={getUserCoordinates}
                loading={loadingUserCoordinates}
                icon={<FontAwesomeIcon icon={faLocationArrow} />}
              />
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Baiersbronn,{" "}
              {featureFlag} {featureLocation}
            </div>
            <div>({JSON.stringify(userCoordinates)})</div>
            <div>({publicIP})</div>
          </ClusterData>

          <VersionInformation>
            <dl>
              <dt>webnetesctl</dt>
              <dd>
                <Text code>{packageJSON.version}</Text>
              </dd>
              <dt>webnetes</dt>
              <dd>
                <Text code>
                  {packageJSON.dependencies["@pojntfx/webnetes"]}
                </Text>
              </dd>
            </dl>
          </VersionInformation>
        </StatusCard>
      </Wrapper>
    </Animate>
  );
}

const StatusCard = styled.div`
  display: grid;
  grid-template-columns: 25% 50% 25%;
  align-items: center;
  justify-items: center;
  padding: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border: 1px solid #303030;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  ${glass}
`;

const ConnectedStatus = styled.div`
  font-size: 1.5rem;
`;

const ClusterData = styled.div``;

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

export default Config;
