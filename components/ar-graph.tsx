import { useEffect, useState } from "react";
import { ForceGraphAR } from "react-force-graph";

export const ARGraph = ({ forwardRef, ...otherProps }: any) => {
  const [arJS, setArJS] = useState();

  useEffect(() => {
    typeof window !== "undefined" && setArJS(require("ar.js"));
  }, []);

  return arJS ? <ForceGraphAR {...otherProps} ref={forwardRef} /> : null;
};
