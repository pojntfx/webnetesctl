export const parseResourceKey = (key: string) => {
  const parts = key.split(":");

  return {
    name: parts[0],
    kind: parts[1],
    node: parts[2],
  };
};

export const stringifyResourceKey = (
  name: string,
  kind: string,
  node: string
) => {
  return name + ":" + kind + ":" + node;
};
