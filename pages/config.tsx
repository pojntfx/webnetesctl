import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Wrapper } from "../components/layout-wrapper";
import glass from "../styles/glass";

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

          <div>
            <h2>127.0.0.10</h2>
          </div>

          <div>
            <h2>webnetes 0.0.5</h2>
          </div>
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

export default Config;
