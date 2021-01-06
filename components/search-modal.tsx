import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { stringifyResourceKey } from "../utils/resource-key";
import { Modal as ModalTmpl } from "./create-resource-modal";
import { SearchInput } from "./navbar";
import { IClusterNode, IClusterResource } from "../hooks/use-webnetes";

export interface ISearchModalProps {
  open: boolean;
  nodes: IClusterNode[];
  resources: IClusterResource[];
  query: string;
  handleChange: (newValue?: string) => void;
  onDone: () => void;
}

/**
 * SearchModal is a mobile-friendly alternative to an inline search field.
 *
 * @param param0 Props
 */
const SearchModal: React.FC<ISearchModalProps> = ({
  open,
  nodes,
  resources,
  query,
  handleChange,
  onDone,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        <Space>
          <FontAwesomeIcon fixedWidth icon={faSearch} />
          <span>{t("findNodeOrResource")}</span>
        </Space>
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
      <SearchInput
        showSearch
        suffixIcon={<FontAwesomeIcon icon={faSearch} />}
        placeholder={t("findNodeOrResource")}
        optionFilterProp="children"
        notFoundContent={t("noMatchingNodesOrResourcesFound")}
        onChange={(e) => {
          handleChange(e ? e.toString() : undefined);
        }}
        value={query}
        allowClear
      >
        {nodes.map((node) => (
          <SearchInput.Option
            value={`node=${node.privateIP}`}
            key={`node=${node.privateIP}`}
          >
            {t("node")} {node.privateIP} ({node.location}, {node.publicIP})
          </SearchInput.Option>
        ))}
        {resources.map((resource) => (
          <SearchInput.Option
            value={`resource=${stringifyResourceKey(
              resource.label,
              resource.kind,
              resource.node
            )}`}
            key={`resource=${stringifyResourceKey(
              resource.label,
              resource.kind,
              resource.node
            )}`}
          >
            {t("resource")} {resource.kind}/{resource.name} on {resource.node}
          </SearchInput.Option>
        ))}
      </SearchInput>
    </Modal>
  );
};

const Modal = styled(ModalTmpl)`
  /* We don't need the cancel button */
  .ant-modal-footer > *:first-child {
    display: none;
  }
`;

export default SearchModal;
