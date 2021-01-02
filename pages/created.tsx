import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import TitleTmpl from "antd/lib/typography/Title";
import dynamic from "next/dynamic";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import bg from "../img/fernando-rodrigues-sGJUb5HJBqs-unsplash.jpg";
import icon from "../img/icon-512x512.png";

function Created() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Animate transitionName="fadeandzoom" transitionAppear>
        <ContentWrapper>
          <Header align="center" size="middle">
            <Icon icon={faCheckCircle} size="4x" />

            <Title level={1}>{t("clusterCreatedSuccessfully")}</Title>
          </Header>

          <QRCode
            value={`${
              typeof window !== "undefined" && window.location.origin
            }/join?id=127.0.2`}
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
  padding-bottom: 2rem;
`;

const Title = styled(TitleTmpl)`
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 0 !important;
  font-size: 36px !important;
`;

const QRCode = styled(dynamic(import("qrcode.react"), { ssr: false }))`
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
  max-width: 100%;
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
