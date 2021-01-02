import { faHandshake, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Link from "next/link";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import bg from "../img/fernando-rodrigues-sGJUb5HJBqs-unsplash.jpg";
import glass from "../styles/glass";

function Start() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Animate transitionName="fadeandzoom" transitionAppear>
        <ContentWrapper>
          <Image alt={t("webnetesLogo")} src="/logo.svg" />

          <ActionSplit>
            <Action direction="vertical" align="center">
              <ActionIcon icon={faPlus} size="3x" />

              <Text strong>{t("createClusterIntro")}</Text>

              <Text>{t("createClusterDescription")}</Text>

              <Link href="/">
                <Button type="primary">
                  {t("create")} {t("cluster")}
                </Button>
              </Link>
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

              <Input.Search
                enterButton={t("joinCluster")}
                placeholder={t("clusterId")}
              />
            </Action>
          </ActionSplit>
        </ContentWrapper>
      </Animate>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: url(${bg}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(
      black,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      black
    );
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const Image = styled.img`
  position: relative;
  z-index: 10;
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-right: 1rem;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
  max-height: 10rem;
`;

const ActionSplit = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
  max-width: 45rem;
  margin-bottom: 2rem;

  .ant-btn-primary {
    background: #177ddc94 !important;

    &:hover {
      background: #177ddc !important;
    }
  }

  > * {
    z-index: 10;
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    mask-image: linear-gradient(to top, rgb(0 0 0), rgba(0, 0, 0, 0)),
      linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    -webkit-mask-image: linear-gradient(to top, rgb(0 0 0), rgba(0, 0, 0, 0)),
      linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    mask-size: 100% 50%;
    -webkit-mask-size: 100% 50%;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: left top, left bottom;
    -webkit-mask-position: left top, left bottom;
    transform: scaleY(3);
    ${glass}
    backdrop-filter: blur(100px);
  }

  @media screen and (min-width: 812px) {
    grid-template-columns: 6fr 1fr 6fr;
    margin-bottom: 5rem; /* Visual centering offset for logo */
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
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
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
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.85) !important;

  @media screen and (min-width: 812px) {
    border-right: 0.5px solid rgba(255, 255, 255, 0.85) !important;
  }
`;

export default Start;
