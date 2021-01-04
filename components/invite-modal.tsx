import { faHandshake, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import node from "../data/node";
import { urlencodeYAMLAll } from "../utils/urltranscode";
import { Modal as ModalTmpl } from "./create-resource-modal";
import { QRLink } from "./qr-link";

export interface IInviteModalProps {
  open: boolean;
  onDone: () => void;
}

const InviteModal: React.FC<IInviteModalProps> = ({
  open,
  onDone,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [link, setLink] = useState<string>();

  useEffect(() => {
    setLink(
      `${
        typeof window !== "undefined" && window.location.origin
      }/worker?id=127.0.2&nodeConfig=${urlencodeYAMLAll(node)}`
    );
  }, []);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faHandshake} />
            <span>{t("invite")}</span>
          </Space>

          <Button type="text" shape="circle" onClick={() => onDone()}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </>
      }
      centered
      transitionName="fadeandzoom"
      visible={open}
      onOk={() => {
        onDone();
      }}
      onCancel={() => onDone}
      okText={t("done")}
      closable={false}
      {...otherProps}
    >
      <QRLink link={link || ""} />

      <ShareNoteWrapper>
        <Text strong>{t("scanQRCodeOrShareLinkToInvite")}</Text>

        <Text>{t("inviteNotesLaterNote")}</Text>
      </ShareNoteWrapper>
    </Modal>
  );
};

const Modal = styled(ModalTmpl)`
  /* We don't need the cancel button */
  .ant-modal-footer > *:first-child {
    display: none;
  }

  .ant-modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const ShareNoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 2rem;
  padding-bottom: 0.5rem;
`;

export default InviteModal;
