import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Text from "antd/lib/typography/Text";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Wrapper } from "../components/layout-wrapper";
import glass from "../styles/glass";
import packageJSON from "../package.json";

function Config() {
  const { t } = useTranslation();

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <StatusCard>
          <ConnectedStatus>
            <FontAwesomeIcon icon={faCheckCircle} size="lg" fixedWidth />{" "}
            {t("connected")}!
          </ConnectedStatus>

          <ClusterData>
            <IPAddress>127.0.0.10</IPAddress>
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
