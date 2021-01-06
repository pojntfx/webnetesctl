import dynamic from "next/dynamic";
import { forwardRef } from "react";
import styled from "styled-components";
import SpriteText from "three-spritetext";
import { IGraph } from "../../hooks/use-webnetes";
import { getColorForGraphGroup } from "../../styles/graph-group-color";

export interface IARPageProps {
  graph: IGraph;
}

export const ARPage: React.FC<IARPageProps> = ({ graph, ...otherProps }) => {
  return typeof window === undefined ? null : (
    <PageWrapper {...otherProps}>
      <ARGraph
        warmupTicks={500}
        graphData={graph}
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
  );
};

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
