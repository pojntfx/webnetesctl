import {
  faChevronDown,
  faChevronRight,
  faCode,
  faCube,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import ModalTmpl from "antd/lib/modal/Modal";
import Title from "antd/lib/typography/Title";
import Animate from "rc-animate";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TitleSpace } from "../pages/explorer";
import ResourceEditorTmpl from "./resource-editor";

export interface ICreateResourceModalProps {
  open: boolean;
  onCreate: () => void;
  onCancel: () => void;
}

const CreateResourceModal: React.FC<ICreateResourceModalProps> = ({
  open,
  onCreate,
  onCancel,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [definitionOpen, setDefinitionOpen] = useState(true);
  const [definition, setDefinition] = useState("");

  return (
    <Modal
      title={
        <Space>
          <FontAwesomeIcon fixedWidth icon={faCube} />
          <span>
            {t("create")} {t("resource")}
          </span>
        </Space>
      }
      centered
      visible={open}
      onOk={onCreate}
      onCancel={onCancel}
      okText={
        <Space>
          <FontAwesomeIcon fixedWidth icon={faPlus} />
          <span>
            {t("create")} {t("resource")}
          </span>
        </Space>
      }
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
          <ResourceEditor
            data={definition}
            onEdit={(value) => setDefinition(value)}
          />
        )}
      </Animate>
    </Modal>
  );
};

const ResourceEditor = styled(ResourceEditorTmpl)`
  margin-left: -24px;
  margin-right: -24px;
  min-height: 60vh;
`;

const Modal = styled(ModalTmpl)`
  min-width: 80vw;
`;

export default CreateResourceModal;
