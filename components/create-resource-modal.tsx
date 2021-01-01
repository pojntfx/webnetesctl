import {
  faAngleDoubleRight,
  faArrowLeft,
  faChevronDown,
  faChevronRight,
  faCode,
  faCube,
  faExclamationCircle,
  faExternalLinkAlt,
  faPlus,
  faTimes,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal as ModalTmpl, Select as SelectTmpl, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Animate from "rc-animate";
import { useCallback, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import nodes from "../data/nodes.json";
import {
  ExternalExampleLink as ExternalExampleLinkTmpl,
  ExternalLink
} from "../pages/config";
import { TitleSpace } from "../pages/explorer";
import ResourceEditorTmpl from "./resource-editor";

export interface ICreateResourceModalProps {
  open: boolean;
  onCreate: () => void;
  onCancel: () => void;
  onMinimize: () => void;
}

const CreateResourceModal: React.FC<ICreateResourceModalProps> = ({
  open,
  onCreate,
  onCancel,
  onMinimize,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [definitionOpen, setDefinitionOpen] = useState(true);
  const [maximized, setMaximized] = useState(true);
  const [definition, setDefinition] = useState<string>();
  const [node, setNode] = useState<string>();

  const clear = useCallback(
    () =>
      unstable_batchedUpdates(() => {
        setDefinitionOpen(true);
        setDefinition(undefined);
        setNode(undefined);
        setMaximized(true);
      }),
    []
  );

  const cancel = useCallback(async () => {
    if (definition || node) {
      try {
        await new Promise<void>((res, rej) =>
          Modal.confirm({
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
    }

    clear();

    onCancel();
  }, [definition, node]);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faCube} />
            <span>
              {t("create")} {t("resource")}
            </span>
          </Space>

          <Space>
            <Button
              type="text"
              shape="circle"
              onClick={() => {
                setMaximized(false);
                onMinimize();
              }}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </Button>

            <Button type="text" shape="circle" onClick={() => cancel()}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Space>
        </>
      }
      centered
      transitionName={maximized ? "fadeandzoom" : "fadeandslideright"}
      visible={open}
      onOk={() => {
        clear();

        onCreate();
      }}
      onCancel={() => cancel()}
      okText={
        <Space>
          <FontAwesomeIcon fixedWidth icon={faPlus} />
          <span>
            {t("create")} {t("resource")}
          </span>
        </Space>
      }
      closable={false}
      {...otherProps}
    >
      <TitleSpace
        align="center"
        onClick={() => setDefinitionOpen((resourcesOpen) => !resourcesOpen)}
      >
        <Title level={2}>
          <FontAwesomeIcon icon={faCode} /> {t("definition")}
        </Title>
        <Button type="text" shape="circle">
          <FontAwesomeIcon
            icon={definitionOpen ? faChevronDown : faChevronRight}
          />
        </Button>
      </TitleSpace>

      <Animate transitionName="fadeandslide" transitionAppear>
        {definitionOpen && (
          <div>
            <ResourceEditor
              data={definition || ""}
              onEdit={(value) => setDefinition(value)}
            />

            <ExternalExampleLink>
              {t("youCanFindSomeExamplesInThe")}{" "}
              <ExternalLink
                href="https://github.com/pojntfx/webnetes/tree/main/examples"
                target="_blank"
              >
                GitHub Repository <FontAwesomeIcon icon={faExternalLinkAlt} />
              </ExternalLink>
              .
            </ExternalExampleLink>
          </div>
        )}
      </Animate>

      <Select
        showSearch
        placeholder={t("selectATargetNode")}
        optionFilterProp="children"
        notFoundContent={t("noMatchingNodesFound")}
        onChange={(e) => setNode(e.toString())}
        value={node}
      >
        {nodes.map((node) => (
          <Select.Option value={node.privateIP} key={node.privateIP}>
            {node.privateIP} ({node.location}, {node.publicIP})
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

const ResourceEditor = styled(ResourceEditorTmpl)`
  margin-left: -24px;
  margin-right: -24px;
  min-height: 60vh;
`;

export const Modal = styled(ModalTmpl)`
  min-width: 80vw;

  .ant-modal-content {
    border: 0;
    box-shadow: none;
  }

  .ant-modal-header,
  .ant-modal-content {
    background: transparent;
  }

  .ant-modal-header {
    padding-right: 16px;
  }

  .ant-modal-title {
    display: flex;
    justify-content: space-between;
  }
`;

export const ExternalExampleLink = styled(ExternalExampleLinkTmpl)`
  padding-bottom: 1rem;
`;

const Select = styled(SelectTmpl)`
  width: 100%;
`;

export default CreateResourceModal;
