import { XTerm } from "xterm-for-react";

const Terminal = ({
  forwardRef,
  ...otherProps
}: XTerm["props"] & { forwardRef: React.RefObject<XTerm> }) => (
  <XTerm {...otherProps} ref={forwardRef} />
);

export default Terminal;
