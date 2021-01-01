import { faHandshake, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
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
          <Action direction="vertical" align="center">
            <ActionIcon icon={faPlus} size="3x" />

            <Text strong>{t("createClusterIntro")}</Text>

            <Text>{t("createClusterDescription")}</Text>

            <Button type="primary">
              {t("create")} {t("cluster")}
            </Button>
          </Action>

          <DividerWrapper>
            <Divider />

            <span>{t("or")}</span>

            <Divider />
          </DividerWrapper>

          <Action direction="vertical" align="center">
            <ActionIcon icon={faHandshake} size="3x" />

            <Text strong>{t("joinClusterIntro")}</Text>

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
  max-width: 45rem;

  @media screen and (min-width: 812px) {
    grid-template-columns: 6fr 1fr 6fr;
  }
`;

const Action = styled(Space)`
  text-align: center;

  > *:last-child {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

const ActionIcon = styled(FontAwesomeIcon)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const DividerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > *:not(:first-child):not(:last-child) {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  > *:first-child,
  > *:last-child {
    flex: 1;
  }

  @media screen and (min-width: 812px) {
    height: 100%;
    flex-direction: column;

    > *:not(:first-child):not(:last-child) {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }
`;

const Divider = styled.div`
  border: 1px solid #303030 !important;
`;

export default Start;
