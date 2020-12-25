import { XTerm } from "xterm-for-react";

const XTermTest = ({ forwardRef }: { forwardRef: any }) =>
  typeof window === "undefined" ? (
    <div />
  ) : (
    <XTerm
      className="xtermterminal"
      ref={forwardRef}
      options={{
        allowTransparency: true,
        theme: {
          background: "rgba(0,0,0,0.8)",
        },
      }}
    />
  );

export default XTermTest;
