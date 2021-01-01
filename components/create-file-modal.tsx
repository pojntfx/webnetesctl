import {
    faAngleDoubleRight,
    faFile,
    faPlus,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./create-resource-modal";

export interface ICreateFileModalProps {
  open: boolean;
  onCreate: () => void;
  onCancel: () => void;
  onMinimize: () => void;
}

const CreateFileModal: React.FC<ICreateFileModalProps> = ({
  open,
  onCreate,
  onCancel,
  onMinimize,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [maximized, setMaximized] = useState(true);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faFile} />
            <span>
              {t("create")} {t("file")}
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
            {t("create")} {t("file")}
          </span>
        </Space>
      }
      closable={false}
      {...otherProps}
    >
      <h1>Hello, world!</h1>
    </Modal>
  );
};

export default CreateFileModal;
