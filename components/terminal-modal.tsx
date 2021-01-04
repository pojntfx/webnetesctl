import {
  faTerminal,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import dynamic from "next/dynamic";
import { forwardRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { XTerm } from "xterm-for-react";
import { Modal as ModalTmpl } from "./create-resource-modal";

export interface ITerminalModalProps {
  open: boolean;
  terminalName: string;
  onDone: () => void;
}

const TerminalModal: React.FC<ITerminalModalProps> = ({
  open,
  terminalName,
  onDone,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const ref = useCallback((xterm: XTerm) => {
    if (xterm) {
      setInterval(() => xterm.terminal.writeln("Hello, world!"), 1000);
    }
  }, []);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faTerminal} />
            <span>
              {t("terminal")} {terminalName}
            </span>
          </Space>

          <Button type="text" shape="circle" onClick={() => onDone()}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </Button>
        </>
      }
      centered
      transitionName="fadeandzoom"
      visible={open}
      onOk={() => {
        onDone();
      }}
      onCancel={() => onDone()}
      okText={t("done")}
      closable={false}
      {...otherProps}
    >
      <Terminal ref={(ref as unknown) as React.RefObject<XTerm>} />
    </Modal>
  );
};

const Modal = styled(ModalTmpl)`
  /* We don't need the cancel button */
  .ant-modal-footer > *:first-child {
    display: none;
  }

  .xterm-viewport {
    overflow-y: auto !important;
  }
`;

const TerminalTmpl = dynamic<
  XTerm["props"] & { forwardRef: React.RefObject<XTerm> }
>(() => import("./terminal"), {
  ssr: false,
});

const Terminal = forwardRef(
  (props: XTerm["props"], ref: React.ForwardedRef<XTerm>) => (
    <TerminalTmpl {...props} forwardRef={ref as React.RefObject<XTerm>} />
  )
);

export default TerminalModal;
