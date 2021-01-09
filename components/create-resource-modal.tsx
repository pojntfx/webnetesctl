import {
  faArrowLeft,
  faChevronDown,
  faChevronRight,
  faCode,
  faCube,
  faExclamationCircle,
  faExternalLinkAlt,
  faPlus,
  faTimes,
  faTrash,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal as ModalTmpl, Select as SelectTmpl, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import Animate from "rc-animate";
import { useCallback, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { IClusterNode } from "../hooks/use-webnetes";
import { TitleSpace } from "./layouts";
import ResourceEditorTmpl from "./resource-editor";
import { MoreLink } from "./typography";

export interface ICreateResourceModalProps {
  open: boolean;
  onCreate: (resources: string, nodeId: string) => Promise<void>;
  onCancel: () => void;
  onMinimize: () => void;
  nodes: IClusterNode[];
}

/**
 * CreateResourceModal provides a resource editor and target node selector.
 * It enables deploying resources to a specific node.
 *
 * @param param0 Props
 */
const CreateResourceModal: React.FC<ICreateResourceModalProps> = ({
  open,
  onCreate,
  onCancel,
  onMinimize,
  nodes,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const router = useHistory();

  const [definitionOpen, setDefinitionOpen] = useState(true);
  const [maximized, setMaximized] = useState(true);
  const [definition, setDefinition] = useState<string>();
  const [node, setNode] = useState<string>();
  const [creating, setCreating] = useState(false);

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
              <FontAwesomeIcon icon={faWindowMinimize} />
            </Button>

            <Button type="text" shape="circle" onClick={() => cancel()}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Space>
        </>
      }
      centered
      transitionName={maximized ? "fadeandzoom" : "fadeandslide"}
      visible={open}
      confirmLoading={creating}
      onOk={async () => {
        if (definition && node) {
          setCreating(true);

          await onCreate(definition, node);

          clear();
          setCreating(false);
        }
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
      {/* Resource editor toggler */}
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
            {/* Resource editor */}
            <ResourceEditor
              data={definition || ""}
              onEdit={(value) => setDefinition(value)}
            />

            <MoreLink>
              {t("youCanFindSomeExamplesInThe")}{" "}
              <a
                href="https://github.com/alphahorizonio/webnetes/tree/main/examples"
                target="_blank"
              >
                GitHub Repository <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
              .
            </MoreLink>
          </div>
        )}
      </Animate>

      {/* Target node selector */}
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

      {/* Example link */}
      <Text>
        {t("youCanFindYourCreatedResourcesInThe")}{" "}
        <a
          href="/explorer"
          onClick={(e) => {
            e.preventDefault();

            setMaximized(false);
            onMinimize();

            router.push("/explorer");
          }}
        >
          {t("explorer")}
        </a>
        .
      </Text>
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

const Select = styled(SelectTmpl)`
  width: 100%;
  margin-bottom: 1rem;
`;

export default CreateResourceModal;
