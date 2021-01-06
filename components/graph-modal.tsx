import {
  faProjectDiagram,
  faVrCardboard,
  faWindowMinimize
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space, Tooltip } from "antd";
import dynamic from "next/dynamic";
import { forwardRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import SpriteText from "three-spritetext";
import { useWindowSize } from "use-window-size-hook";
import { getColorForGraphGroup } from "../styles/graph-group-color";
import { Modal as ModalTmpl } from "./create-resource-modal";

export interface IGraphModalProps {
  open: boolean;
  graphData: any;
  onDone: () => void;
  onOpenInAR: () => void;
}

/**
 * GraphModal is a modalized version of the composite graph from JoinPage.
 * It visualizes the relationships between nodes and resources.
 *
 * @param param0 Props
 */
const GraphModal: React.FC<IGraphModalProps> = ({
  open,
  graphData,
  onDone,
  onOpenInAR,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();

  const compositeGraphRef = useCallback((graph) => {
    // Zoom the graph to fit as soon as it exists

    if (graph) {
      setTimeout(() => graph.zoomToFit(500, 0), 500);
    }
  }, []);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faProjectDiagram} />
            <span>{t("clusterGraph")}</span>
          </Space>

          <Space>
            <Tooltip title={t("openInAugmentedReality")}>
              <Button type="text" shape="circle" onClick={() => onOpenInAR()}>
                <FontAwesomeIcon icon={faVrCardboard} />
              </Button>
            </Tooltip>

            <Button type="text" shape="circle" onClick={() => onDone()}>
              <FontAwesomeIcon icon={faWindowMinimize} />
            </Button>
          </Space>
        </>
      }
      centered
      transitionName="fadeandslide"
      visible={open}
      onOk={() => {
        onDone();
      }}
      onCancel={() => onDone()}
      okText={t("done")}
      closable={false}
      {...otherProps}
    >
      <Graph
        warmupTicks={500}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        width={width}
        height={height ? height - 200 : 0}
        nodeThreeObject={(node: any) => {
          const sprite = new SpriteText(node.id?.toString());

          sprite.color = "#ffffff";
          sprite.textHeight = 2;
          sprite.backgroundColor = getColorForGraphGroup(node.group) + "F0";
          sprite.padding = 2;

          return sprite;
        }}
        ref={compositeGraphRef}
      />
    </Modal>
  );
};

const Modal = styled(ModalTmpl)`
  /* We don't need the cancel button */
  .ant-modal-footer > *:first-child {
    display: none;
  }

  .ant-modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
`;

const GraphTmpl = dynamic(() => import("./graph"), {
  ssr: false,
});
const Graph = forwardRef((props: any, ref) => (
  <GraphTmpl {...props} forwardRef={ref} />
));

export default GraphModal;
