import { ForceGraphAR } from "react-force-graph";
require("ar.js");

export const ARGraph = ({ forwardRef, ...otherProps }: any) => (
  <ForceGraphAR {...otherProps} ref={forwardRef} />
);
