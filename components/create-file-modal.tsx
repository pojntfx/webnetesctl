import {
  faAngleDoubleRight,
  faFile,
  faPlus,
  faQuestionCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, Space, Upload } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
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
  const [form] = Form.useForm();

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
      <WideSpace size="middle" direction="vertical">
        <Upload.Dragger multiple={false} beforeUpload={() => false}>
          <div>
            <FontAwesomeIcon icon={faPlus} />

            <div>{t("addFile")}</div>
          </div>
        </Upload.Dragger>

        <Form form={form} layout="vertical">
          <Form.Item
            label={t("fileLabel")}
            required
            tooltip={{
              title: t("fileLabelDescription"),
              icon: <FontAwesomeIcon icon={faQuestionCircle} />,
            }}
          >
            <Input placeholder="myfile" />
          </Form.Item>

          <Form.Item
            label={t("fileName")}
            required
            tooltip={{
              title: t("fileNameDescription"),
              icon: <FontAwesomeIcon icon={faQuestionCircle} />,
            }}
          >
            <Input placeholder="My File" />
          </Form.Item>
        </Form>
      </WideSpace>
    </Modal>
  );
};

const WideSpace = styled(Space)`
  width: 100%;

  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

export default CreateFileModal;
