import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Modal as ModalTmpl } from "./create-resource-modal";

export interface ISearchModalProps {
  open: boolean;
  onDone: () => void;
}

const SearchModal: React.FC<ISearchModalProps> = ({
  open,
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
      onCancel={() => onDone}
      okText={t("done")}
      closable={false}
      {...otherProps}
    ></Modal>
  );
};

const Modal = styled(ModalTmpl)`
  /* We don't need the cancel button */
  .ant-modal-footer > *:first-child {
    display: none;
  }
`;

export default SearchModal;
