import {
  faAngleDoubleRight,
  faChevronDown,
  faChevronRight,
  faCode,
  faCube,
  faExternalLinkAlt,
  faPlus,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Select as SelectTmpl, Space } from "antd";
import ModalTmpl from "antd/lib/modal/Modal";
import Title from "antd/lib/typography/Title";
import Animate from "rc-animate";
import { useState } from "react";
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
  const [definition, setDefinition] = useState("");
  const [maximized, setMaximized] = useState(true);

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

            <Button
              type="text"
              shape="circle"
              onClick={() => {
                setMaximized(true);
                onCancel();
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Space>
        </>
      }
      centered
      transitionName={maximized ? "fadeandzoom" : "fadeandslideright"}
      visible={open}
      onOk={() => {
        setMaximized(true);
        onCreate();
      }}
      onCancel={() => {
        setMaximized(true);
        onCancel();
      }}
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
              data={definition}
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
