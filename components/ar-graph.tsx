import { useEffect } from "react";
import { ForceGraphAR } from "react-force-graph";

export const ARGraph = ({ forwardRef, ...otherProps }: any) => {
  useEffect(() => {
    typeof window !== "undefined" && require("ar.js");
  }, []);

  return <ForceGraphAR {...otherProps} ref={forwardRef} />;
};
