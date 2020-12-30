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
