import {
  faTerminal,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Collapse, Space } from "antd";
import dynamic from "next/dynamic";
import { forwardRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { XTerm } from "xterm-for-react";
import { Modal as ModalTmpl } from "./create-resource-modal";

export interface ITerminalModalProps {
  open: boolean;
  onDone: () => void;
  onStdin: (label: string, key: string) => void;
  onTerminalCreated: (label: string, xterm: XTerm) => void;
}

const TerminalModal: React.FC<ITerminalModalProps> = ({
  open,
  onDone,
  onStdin,
  onTerminalCreated,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const ref = useCallback((xterm: XTerm) => {
    xterm && onTerminalCreated("echo_server", xterm);
  }, []);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faTerminal} />
            <span>{t("terminal", { count: 2 })}</span>
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
      <Collapse ghost defaultActiveKey={["1"]}>
        <Collapse.Panel header="echo_server" key="1">
          <Terminal
            onData={(key) => {
              if (key.charCodeAt(0) === 13) {
                // Return
                onStdin("echo_server", "\n");
              } else if (key.charCodeAt(0) === 127) {
                // Backspace
                onStdin("echo_server", "\b \b");
              } else {
                onStdin("echo_server", key);
              }
            }}
            ref={(ref as unknown) as React.RefObject<XTerm>}
          />
        </Collapse.Panel>
      </Collapse>
    </Modal>
  );
};

const Modal = styled(ModalTmpl)`
  /* We don't need the cancel button */
  .ant-modal-footer > *:first-child {
    display: none;
  }

  .ant-modal-body {
    padding-left: 0;
    padding-right: 0;
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
