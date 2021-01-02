import {
  faCheckCircle,
  faCopy,
  faGlassCheers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card as CardTmpl, Space, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import TitleTmpl from "antd/lib/typography/Title";
import dynamic from "next/dynamic";
import Animate from "rc-animate";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Confetti from "react-dom-confetti";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import bg from "../img/fernando-rodrigues-sGJUb5HJBqs-unsplash.jpg";
import icon from "../img/icon-512x512.png";
import { ExternalLink } from "./config";

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

function Created() {
  const { t } = useTranslation();

  const [link, setLink] = useState<string>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLink(
      `${
        typeof window !== "undefined" && window.location.origin
      }/join?id=127.0.2`
    );
  }, []);

  return (
    <Wrapper>
      <Animate transitionName="fadeandzoom" transitionAppear>
        <ContentWrapper>
          <Confetti active={link ? true : false} config={confettiConfig} />

          <Header align="center" size="middle">
            <Icon icon={faGlassCheers} size="4x" fixedWidth />

            <Title level={1}>{t("clusterCreatedSuccessfully")}</Title>
          </Header>

          <Card>
            <Space direction="vertical" align="center">
              <QRCode
                value={link || ""}
                size={256}
                fgColor="#ffffff"
                bgColor="#000000"
                level="H"
                renderAs="svg"
                imageSettings={{
                  src: icon as string,
                  height: 78,
                  width: 78,
                  excavate: false,
                }}
              />

              <Space>
                <Text code>
                  <ExternalLink href={link || ""} target="_blank">
                    {link || ""}
                  </ExternalLink>
                </Text>

                <Tooltip
                  title={
                    copied ? (
                      <Space>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {t("copiedToClipboard")}
                      </Space>
                    ) : (
                      t("copyToClipboard")
                    )
                  }
                >
                  <CopyToClipboard
                    text={link || ""}
                    onCopy={() => {
                      setCopied(true);

                      setTimeout(() => setCopied(false), 5000);
                    }}
                  >
                    <Button type="text" shape="circle">
                      <FontAwesomeIcon icon={faCopy} fixedWidth />
                    </Button>
                  </CopyToClipboard>
                </Tooltip>
              </Space>
            </Space>
          </Card>
        </ContentWrapper>
      </Animate>
    </Wrapper>
  );
}

const Icon = styled(FontAwesomeIcon)`
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
`;

const Header = styled(Space)`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 2rem;
  padding-bottom: 3rem;
`;

const Card = styled(CardTmpl)`
  .ant-card-body {
    padding-bottom: 12px;
  }

  .ant-space-item:first-child {
    width: 100%;
  }
`;

const Title = styled(TitleTmpl)`
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 0 !important;
  font-size: 34px !important;

  @media screen and (min-width: 812px) {
    font-size: 36px !important;
  }
`;

const QRCode = styled(dynamic(import("qrcode.react"), { ssr: false }))`
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  background: url(${bg}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  position: relative;
  padding: 1rem;

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
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Created;
