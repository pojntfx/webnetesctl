import { ControlledEditor, monaco } from "@monaco-editor/react";
import yaml from "js-yaml";
import solarizedMonaco from "monaco-themes/themes/Solarized-dark.json";
import { useEffect, useState } from "react";
import JSONTree from "react-json-tree";
import styled from "styled-components";
import solarized from "../data/theme-solarized.json";

export interface IResourceEditorProps {
  data: string;
  onEdit?: (value: string) => void;
  one?: boolean;
}

/**
 * ResourceEditor is a YAML editor and JSON renderer to edit resources with.
 *
 * @param param0 Props
 */
const ResourceEditor: React.FC<IResourceEditorProps> = ({
  data,
  onEdit,
  one,
  ...otherProps
}) => {
  const [parsedData, setParsedData] = useState<any>({});

  useEffect(() => {
    // Parse YAML safely for the JSON tree
    try {
      const parsedData = one ? yaml.safeLoad(data) : yaml.safeLoadAll(data);

      setParsedData(parsedData);
    } catch (e) {
      console.error("could not parse YAML", e);

      setParsedData({ error: e.message });
    }
  }, [data, one]);

  useEffect(() => {
    // Init the monaco editor with the solarized theme to match the JSON tree
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
      <ControlledEditor
        height="100%"
        language="yaml"
        value={data}
        onChange={(_, value) => onEdit && onEdit(value || "")}
        theme="solarized"
        options={{
          cursorSmoothCaretAnimation: true,
          readOnly: onEdit ? false : true,
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />

      <JSONTree theme={solarized} invertTheme={false} data={parsedData} />
    </ResourceDisplay>
  );
};

const ResourceDisplay = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;

  @media screen and (min-width: 812px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }

  > *:first-child {
    border-bottom: 1px solid #303030 !important;

    @media screen and (min-width: 812px) {
      border-bottom: 0;
      border-right: 1px solid #303030 !important;
    }
  }

  > ul {
    margin: 0 !important;
    min-height: 32px;
    padding: 1rem !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
    overflow-y: auto;
  }
`;

export default ResourceEditor;
