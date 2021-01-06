import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Popover, Space } from "antd";
import Text from "antd/lib/typography/Text";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import SpriteText from "three-spritetext";
import { IGraph } from "../../hooks/use-webnetes";
import glass from "../../styles/glass";
import { getColorForGraphGroup } from "../../styles/graph-group-color";

export interface IARPageProps {
  cluster: IGraph;
  local: IGraph;
}

export const ARPage: React.FC<IARPageProps> = ({
  cluster,
  local,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const router = useHistory();

  return typeof window === undefined ? null : (
    <>
      <BackButton onClick={() => router.goBack()}>
        <Space>
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("back")}
        </Space>
      </BackButton>

      <Popover
        title={t("arRequiresATracker")}
        content={
          <Text>
            {t("trackerLinkInfo")}{" "}
            <a
              href="https://upload.wikimedia.org/wikipedia/commons/4/48/Hiro_marker_ARjs.png"
              target="_blank"
            >
              {t("hiroTracker")}
            </a>
          </Text>
        }
        placement="bottomRight"
      >
        <InfoButton shape="circle">
          <FontAwesomeIcon icon={faInfoCircle} />
        </InfoButton>
      </Popover>

      <PageWrapper {...otherProps}>
        <ARGraph
          warmupTicks={500}
          graphData={
            new URLSearchParams(location.search).get("local") ? local : cluster
          }
          showNavInfo={false}
          nodeThreeObject={(node: any) => {
            const sprite = new SpriteText(node.id?.toString());

            sprite.color = "#ffffff";
            sprite.textHeight = 2;
            sprite.backgroundColor = getColorForGraphGroup(node.group) + "F0";
            sprite.padding = 2;

            return sprite;
          }}
        />
      </PageWrapper>
    </>
  );
};

const BackButton = styled(Button)`
  position: absolute;
  left: 0;
  top: 0;
  margin: 1rem;
  z-index: 999;
  ${glass}
`;

const InfoButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
  margin: 1rem;
  z-index: 999;
  ${glass}
`;

const PageWrapper = styled.div`
  &,
  > *,
  > * > * {
    height: 100% !important;
    width: 100% !important;
  }
`;

const ARGraphTmpl = dynamic(async () => (await import("../ar-graph")).ARGraph, {
  ssr: false,
});

const ARGraph = forwardRef((props: any, ref) => (
  <ARGraphTmpl {...props} forwardRef={ref} />
));
