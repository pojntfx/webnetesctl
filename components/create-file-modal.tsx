import {
  faArrowLeft,
  faExclamationCircle,
  faFile,
  faPlus,
  faQuestionCircle,
  faTimes,
  faTrash,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, Select, Space, Upload } from "antd";
import Text from "antd/lib/typography/Text";
import { useCallback, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Modal } from "./create-resource-modal";
import { IClusterResource } from "../hooks/use-webnetes";

export interface ICreateFileModalProps {
  open: boolean;
  onCreate: (
    label: string,
    name: string,
    repo: string,
    content: Uint8Array
  ) => Promise<void>;
  onCancel: () => void;
  onMinimize: () => void;
  nodeId: string;
  resources: IClusterResource[];
}

/**
 * CreateFileModal is a component for seeding files.
 * It also enables adding metadata such as labels and names to them.
 *
 * @param param0 Props
 */
const CreateFileModal: React.FC<ICreateFileModalProps> = ({
  open,
  onCreate,
  onCancel,
  onMinimize,
  resources,
  nodeId,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const router = useHistory();

  const [maximized, setMaximized] = useState(true);
  const [fileLabel, setFileLabel] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [fileRepo, setFileRepo] = useState<string>();
  const [fileContent, setFileContent] = useState<Uint8Array>();

  const clear = useCallback(
    () =>
      unstable_batchedUpdates(() => {
        setFileLabel(undefined);
        setFileName(undefined);
        setFileRepo(undefined);
        setFileContent(undefined);
        setMaximized(true);
      }),
    []
  );

  const cancel = useCallback(async () => {
    if (fileLabel || fileName || fileRepo) {
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
      onOk={() => {
        if (fileLabel && fileName && fileRepo && fileContent) {
          clear();

          onCreate(fileLabel, fileName, fileRepo, fileContent);
        }
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
      <ModalContentWrapper size="middle" direction="vertical">
        {/* File input */}
        <Upload.Dragger
          multiple={false}
          beforeUpload={(e) => {
            e.arrayBuffer().then((buf) => setFileContent(new Uint8Array(buf)));

            return false;
          }}
        >
          <div>
            <FontAwesomeIcon icon={faPlus} />

            <div>{t("addFile")}</div>
          </div>
        </Upload.Dragger>

        {/* Metadata inputs */}
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

        {/* Example link */}
        <Text>
          {t("youCanFindYourCreatedFileResourcesInThe")}{" "}
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
      </ModalContentWrapper>
    </Modal>
  );
};

const ModalContentWrapper = styled(Space)`
  width: 100%;

  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

export default CreateFileModal;
