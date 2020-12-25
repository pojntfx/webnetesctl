import { XTerm } from "xterm-for-react";

const XTermTest = ({ forwardRef }: { forwardRef: any }) =>
  typeof window === "undefined" ? <div /> : <XTerm ref={forwardRef} />;

export default XTermTest;
