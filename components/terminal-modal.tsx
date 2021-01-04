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
  labels: string[];
}

const TerminalModal: React.FC<ITerminalModalProps> = ({
  open,
  onDone,
  onStdin,
  onTerminalCreated,
  labels,
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
            <span>{t("terminals")}</span>
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
      <Collapse ghost defaultActiveKey={labels}>
        {labels.map((label) => (
          <Collapse.Panel header={label} key={label}>
            <Terminal
              onData={(key) => {
                if (key.charCodeAt(0) === 13) {
                  // Return
                  onStdin(label, "\n");
                } else if (key.charCodeAt(0) === 127) {
                  // Backspace
                  onStdin(label, "\b \b");
                } else {
                  onStdin(label, key);
                }
              }}
              ref={(ref as unknown) as React.RefObject<XTerm>}
            />
          </Collapse.Panel>
        ))}
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
