/**
 * filterKeys filters an array of objects matching each object's key with a filter.
 *
 * @param dataSource The array to filter
 * @param filter The text to filter by
 */
export const filterKeys = (dataSource: any[], filter: string) =>
  dataSource.filter((node) =>
    filter.length === 0
      ? node
      : Object.values(node).reduce<boolean>(
          (all, curr) =>
            all || ("" + curr).toLowerCase().includes(filter.toLowerCase()),
          false
        )
  );
