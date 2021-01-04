import { faArrowRight, faGlassCheers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import Text from "antd/lib/typography/Text";
import TitleTmpl from "antd/lib/typography/Title";
import Link from "next/link";
import { useRouter } from "next/router";
import Animate from "rc-animate";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  AfterWrapper,
  BlurWrapper,
  ContentWrapper,
} from "../components/layout-wrapper";
import { QRLink } from "../components/qr-link";

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "1000px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

function CreatedPage() {
  const { t } = useTranslation();

  const [link, setLink] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    setLink(
      `${
        typeof window !== "undefined" && window.location.origin
      }/join?id=127.0.2&nodeConfig=${router.query.nodeConfig as string}`
    );
  }, []);

  return (
    <AfterWrapper>
      <BlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <ContentWrapper>
            <Confetti active={link ? true : false} config={confettiConfig} />

            <Header align="center" size="middle">
              <Icon icon={faGlassCheers} size="4x" fixedWidth />

              <Title level={1}>{t("clusterCreatedSuccessfully")}</Title>
            </Header>

            <QRLink link={link || ""} />

            <ShareNoteWrapper>
              <Text strong>{t("scanQRCodeOrShareLinkToInvite")}</Text>

              <Text>{t("inviteNotesLaterNote")}</Text>
            </ShareNoteWrapper>

            <ActionBar>
              <Link href="/overview">
                <ActionButton type="primary">
                  <Space>
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("continueToOverview")}
                  </Space>
                </ActionButton>
              </Link>
            </ActionBar>
          </ContentWrapper>
        </Animate>
      </BlurWrapper>
    </AfterWrapper>
  );
}

const Icon = styled(FontAwesomeIcon)`
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
`;

const ActionBar = styled.div`
  padding-bottom: 2rem;
`;

const ActionButton = styled(Button)`
  background: #177ddc94 !important;

  &:hover {
    background: #177ddc !important;
  }
`;

const Header = styled(Space)`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
`;

const Title = styled(TitleTmpl)`
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 0 !important;
  font-size: 34px !important;

  @media screen and (min-width: 812px) {
    font-size: 36px !important;
  }
`;

const ShareNoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  position: relative;
  width: 100%;
`;

export default CreatedPage;
