export const parseResourceKey = (key: string) => {
  const parts = key.split(":");

  return {
    label: parts[0],
    kind: parts[1],
    node: parts[2],
  };
};

export const stringifyResourceKey = (
  label: string,
  kind: string,
  node: string
) => {
  return label + ":" + kind + ":" + node;
};
