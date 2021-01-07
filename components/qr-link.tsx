import { faCheckCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card as CardTmpl, Space, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import dynamic from "next/dynamic";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import icon from "../img/icon-512x512.png";
import { BareLink } from "./typography";

export interface IQRCodeProps {
  link: string;
}

/**
 * QRLink is a QR code with a copyable link.
 *
 * @param param0 Props
 */
export const QRLink: React.FC<IQRCodeProps> = ({ link, ...otherProps }) => {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  return (
    <QRCodeWrapper {...otherProps}>
      <Space direction="vertical" align="center">
        <QRCode
          value={link}
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

        <LinkWrapper>
          <Text code>
            <BareLink href={link} target="_blank">
              {link}
            </BareLink>
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
              text={link}
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
        </LinkWrapper>
      </Space>
    </QRCodeWrapper>
  );
};

const QRCode = styled(dynamic(import("qrcode.react"), { ssr: false }))`
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;

const QRCodeWrapper = styled(CardTmpl)`
  margin-left: 1rem;
  margin-right: 1rem;
  max-width: calc(100% - 1rem - 1rem);

  .ant-card-body {
    padding-bottom: 12px;
  }

  .ant-space,
  .ant-space-item {
    width: 100%;
  }

  @media screen and (min-width: 812px) {
    max-width: 17rem;
  }
`;

const LinkWrapper = styled(Space)`
  .ant-space-item {
    width: auto;
  }

  .ant-space-item:first-child {
    white-space: nowrap;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;
