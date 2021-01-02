import {
    faArrowLeft,
    faCogs,
    faExclamationCircle,
    faExternalLinkAlt,
    faTimes,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import Animate from "rc-animate";
import { useCallback, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import node from "../data/node";
import { ExternalLink } from "../pages/config";
import {
    ExternalExampleLink,
    Modal as ModalTmpl
} from "./create-resource-modal";
import ResourceEditorTmpl from "./resource-editor";

export interface IEditNodeConfigModalProps {
  open: boolean;
  onDone: (definition: string) => void;
  onCancel: () => void;
}

const EditNodeConfigModal: React.FC<IEditNodeConfigModalProps> = ({
  open,
  onDone,
  onCancel,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [definition, setDefinition] = useState(node);

  const clear = useCallback(
    () =>
      unstable_batchedUpdates(() => {
        setDefinition(node);
      }),
    []
  );

  const cancel = useCallback(async () => {
    try {
      await new Promise<void>((res, rej) =>
        Modal.confirm({
          centered: true,
          icon: <> </>,
          title: (
            <Space>
              <FontAwesomeIcon icon={faExclamationCircle} />
              {t("discardChangesTitle")}
            </Space>
          ),
          content: t("discardChangesDescription"),
          cancelText: (
            <Space>
              <FontAwesomeIcon icon={faArrowLeft} />
              {t("noKeepChanges")}
            </Space>
          ),
          onCancel() {
            rej();
          },
          okButtonProps: { type: "primary" },
          okText: (
            <Space>
              <FontAwesomeIcon icon={faTrash} />
              {t("yesDiscardChanges")}
            </Space>
          ),
          okType: "danger",
          onOk() {
            res();
          },
        })
      );
    } catch (e) {
      return false;
    }

    clear();

    onCancel();
  }, [definition]);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faCogs} />
            <span>{t("nodeConfig")}</span>
          </Space>

          <Button type="text" shape="circle" onClick={() => cancel()}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </>
      }
      centered
      transitionName={"fadeandzoom"}
      visible={open}
      onOk={() => {
        clear();

        onDone(definition);
      }}
      onCancel={() => cancel()}
      okText={
        <Space>
          <FontAwesomeIcon fixedWidth icon={faCogs} />
          <span>
            {t("useThis")} {t("nodeConfig")}
          </span>
        </Space>
      }
      closable={false}
      {...otherProps}
    >
      <Animate transitionName="fadeandslide" transitionAppear>
        <div>
          <ResourceEditor
            data={definition || ""}
            onEdit={(value) => setDefinition(value)}
          />

          <ExternalExampleLink>
            {t("youCanFindAnExampleInThe")}{" "}
            <ExternalLink
              href="https://github.com/pojntfx/webnetes/blob/main/app/webnetes_node/node.yaml"
              target="_blank"
            >
              GitHub Repository <FontAwesomeIcon icon={faExternalLinkAlt} />
            </ExternalLink>
            .
          </ExternalExampleLink>
        </div>
      </Animate>
    </Modal>
  );
};

const Modal = styled(ModalTmpl)`
  .ant-modal-body {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const ResourceEditor = styled(ResourceEditorTmpl)`
  margin-left: -24px;
  margin-right: -24px;
  min-height: 60vh;
`;

export default EditNodeConfigModal;
