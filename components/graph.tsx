import { ForceGraph3D } from "react-force-graph";

const Graph = ({ forwardRef, ...otherProps }: any) => (
  <ForceGraph3D {...otherProps} ref={forwardRef} />
);

export default Graph;
