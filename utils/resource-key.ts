/**
 * parseResourceKey parses a stringified resource key.
 *
 * @param key The stringified key to parse
 */
export const parseResourceKey = (key: string) => {
  const parts = key.split(":");

  return {
    label: parts[0],
    kind: parts[1],
    node: parts[2],
  };
};

/**
 * stringifyResourceKey stringifies a resource's key.
 *
 * @param label The resource's label
 * @param kind The resource's kind
 * @param node The resource's node
 */
export const stringifyResourceKey = (
  label: string,
  kind: string,
  node: string
) => {
  return label + ":" + kind + ":" + node;
};
