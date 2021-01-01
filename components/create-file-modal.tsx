import {
  faAngleDoubleRight,
  faArrowLeft,
  faExclamationCircle,
  faFile,
  faPlus,
  faQuestionCircle,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, Select, Space, Upload } from "antd";
import { useCallback, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { nodeId } from "../data/node";
import resources from "../data/resources.json";
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
  const [form] = Form.useForm();

  const [maximized, setMaximized] = useState(true);
  const [fileLabel, setFileLabel] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [fileRepo, setFileRepo] = useState<string>();

  const clear = useCallback(
    () =>
      unstable_batchedUpdates(() => {
        setFileLabel(undefined);
        setFileName(undefined);
        setFileRepo(undefined);
        setMaximized(true);
      }),
    []
  );

  const cancel = useCallback(async () => {
    if (fileLabel || fileName || fileRepo) {
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
  }, [fileLabel, fileName, fileRepo]);

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
            <Input
              placeholder="myfile"
              value={fileLabel}
              onChange={(e) => setFileLabel(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label={t("fileName")}
            required
            tooltip={{
              title: t("fileNameDescription"),
              icon: <FontAwesomeIcon icon={faQuestionCircle} />,
            }}
          >
            <Input
              placeholder="My File"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label={t("fileRepo")}
            required
            tooltip={{
              title: t("fileRepoDescription"),
              icon: <FontAwesomeIcon icon={faQuestionCircle} />,
            }}
          >
            <Select
              showSearch
              placeholder={t("selectAFileRepo")}
              optionFilterProp="children"
              notFoundContent={t("noMatchingReposFound")}
              value={fileRepo}
              onChange={(e) => setFileRepo(e.toString())}
            >
              {resources
                .filter(
                  (resource) =>
                    resource.node === nodeId && resource.kind === "Repository"
                )
                .map((repo) => (
                  <Select.Option value={repo.label} key={repo.label}>
                    {repo.name}
                  </Select.Option>
                ))}
            </Select>
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
