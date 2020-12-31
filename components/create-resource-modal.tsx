import { faCube, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useTranslation } from "react-i18next";

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
      Hey!
    </Modal>
  );
};

export default CreateResourceModal;
