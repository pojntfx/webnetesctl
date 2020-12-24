import { XTerm } from "xterm-for-react";

export default ({ forwardRef }: { forwardRef: any }) => (
  <XTerm ref={forwardRef} />
);
