import Editor, { monaco } from "@monaco-editor/react";
import yaml from "js-yaml";
import solarizedMonaco from "monaco-themes/themes/Solarized-dark.json";
import { useEffect } from "react";
import JSONTree from "react-json-tree";
import styled from "styled-components";
import solarized from "../data/solarized.json";

export interface IResourceEditorProps {
  data: string;
  one?: boolean;
}

const ResourceEditor: React.FC<IResourceEditorProps> = ({
  data,
  one,
  ...otherProps
}) => {
  useEffect(() => {
    typeof window !== "undefined" &&
      monaco
        .init()
        .then((monaco) =>
          monaco.editor.defineTheme("solarized", solarizedMonaco as any)
        )
        .catch((error) =>
          console.error(
            "An error occurred during initialization of Monaco: ",
            error
          )
        );
  }, []);

  return (
    <ResourceDisplay {...otherProps}>
      <Editor
        height="100%"
        language="yaml"
        value={data}
        theme="solarized"
        options={{
          cursorSmoothCaretAnimation: true,
          readOnly: true,
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />

      <JSONTree
        theme={solarized}
        invertTheme={false}
        data={one ? yaml.safeLoad(data) : yaml.safeLoadAll(data)}
      />
    </ResourceDisplay>
  );
};

const ResourceDisplay = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;

  > *:first-child {
    border-right: 1px solid #303030 !important;
  }

  > ul {
    margin: 0 !important;
    min-height: 32px;
    padding: 1rem !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }
`;

export default ResourceEditor;
