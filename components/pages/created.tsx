import { faArrowRight, faGlassCheers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Animate from "rc-animate";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { CreatedFooterBar, CreatedHeaderBar } from "../bars";
import { AfterWrapper, BlurWrapper, ContentWrapper } from "../layouts";
import { QRLink } from "../qr-link";
import { IlluminatedIcon, IlluminatedTitle } from "../typography";

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

/**
 * CreatedPage is a status page that shows initial sharing info for a newly created cluster.
 *
 * It shows the node join info as both a QR code and link, similar to the InviteModal.
 */
function CreatedPage() {
  // Hooks
  const { t } = useTranslation();
  const router = useHistory();

  // State
  const [link, setLink] = useState<string>();

  // Effects
  useEffect(() => {
    // Link the nodeConfig query parameter to the link
    setLink(
      `${
        typeof window !== "undefined" && window.location.origin
      }/join?id=127.0.2&nodeConfig=${new URLSearchParams(
        router.location.search
      ).get("nodeConfig")}`
    );
  }, []);

  return (
    <AfterWrapper>
      <BlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <ContentWrapper>
            {/* Confetti effect */}
            <Confetti active={link ? true : false} config={confettiConfig} />

            {/* Header */}
            <CreatedHeaderBar align="center" size="middle">
              <IlluminatedIcon icon={faGlassCheers} size="4x" fixedWidth />

              <IlluminatedTitle level={1}>
                {t("clusterCreatedSuccessfully")}
              </IlluminatedTitle>
            </CreatedHeaderBar>

            {/* QR Code with link */}
            <QRLink link={link || ""} />

            {/* Sharing instructions */}
            <ShareNotesWrapper>
              <Text strong>{t("scanQRCodeOrShareLinkToInvite")}</Text>

              <Text>{t("inviteNotesLaterNote")}</Text>
            </ShareNotesWrapper>

            {/* Footer */}
            <CreatedFooterBar>
              <Link to="/overview">
                <ActionButton type="primary">
                  <Space>
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("continueToOverview")}
                  </Space>
                </ActionButton>
              </Link>
            </CreatedFooterBar>
          </ContentWrapper>
        </Animate>
      </BlurWrapper>
    </AfterWrapper>
  );
}

// Button components
const ActionButton = styled(Button)`
  background: #177ddc94 !important;

  &:hover {
    background: #177ddc !important;
  }
`;

// Wrapper components
const ShareNotesWrapper = styled.div`
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
