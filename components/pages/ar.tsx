import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import SpriteText from "three-spritetext";
import { IGraph } from "../../hooks/use-webnetes";
import { getColorForGraphGroup } from "../../styles/graph-group-color";
import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import glass from "../../styles/glass";

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
