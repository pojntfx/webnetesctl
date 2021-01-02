import TitleTmpl from "antd/lib/typography/Title";
import dynamic from "next/dynamic";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import bg from "../img/fernando-rodrigues-sGJUb5HJBqs-unsplash.jpg";

function Created() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Animate transitionName="fadeandzoom" transitionAppear>
        <ContentWrapper>
          <Title level={1}>🎉 {t("clusterCreatedSuccessfully")}</Title>

          <QRCode
            value={`${
              typeof window !== "undefined" && window.location.origin
            }/join?id=127.0.2`}
            size={128}
            fgColor="#ffffff"
            bgColor="#000000"
            level="H"
            renderAs="svg"
            imageSettings={{
              src: "https://webnetesctl.vercel.app/icons/apple-touch-icon.png",
              height: 50,
              width: 50,
              excavate: false,
            }}
          />
        </ContentWrapper>
      </Animate>
    </Wrapper>
  );
}

const Title = styled(TitleTmpl)`
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  text-align: center;
`;

const QRCode = styled(dynamic(import("qrcode.react"), { ssr: false }))`
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
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
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Created;
