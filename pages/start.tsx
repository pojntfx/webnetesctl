import { faHandshake, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Text from "antd/lib/typography/Text";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function Start() {
  const { t } = useTranslation();

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <Image alt={t("webnetesLogo")} src="/logo.svg" />

        <ActionSplit>
          <Action>
            <ActionIcon icon={faPlus} size="3x" />

            <Text>{t("createClusterDescription")}</Text>
          </Action>

          <Action>
            <ActionIcon icon={faHandshake} size="3x" />

            <Text>{t("joinClusterDescription")}</Text>
          </Action>
        </ActionSplit>
      </Wrapper>
    </Animate>
  );
}

const Wrapper = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
`;

const Image = styled.img`
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
  max-width: 25rem;
`;

const ActionSplit = styled.div`
  width: 100%;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
  max-width: 35rem;

  @media screen and (min-width: 812px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ActionIcon = styled(FontAwesomeIcon)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

export default Start;
