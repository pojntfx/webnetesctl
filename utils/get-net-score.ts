export const getNetScore = async (sizeInBytes: number) => {
  const start = Date.now();

  await fetch(`https://httpbin.org/stream-bytes/${sizeInBytes}`);

  const end = Date.now();

  return Math.floor(sizeInBytes / 1000 / ((end - start) / 1000));
};
