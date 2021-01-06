import dynamic from "next/dynamic";
import { forwardRef } from "react";
import styled from "styled-components";
import { IGraph } from "../../hooks/use-webnetes";

export interface IARPageProps {
  graph: IGraph;
}

export const ARPage: React.FC<IARPageProps> = ({ graph, ...otherProps }) => {
  return typeof window === undefined ? null : (
    <PageWrapper {...otherProps}>
      <ARGraph graphData={graph} />
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
