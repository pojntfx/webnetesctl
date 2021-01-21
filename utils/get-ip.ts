import getPublicIp from "public-ip";

export const getIP = async () =>
  new Promise<string>((res, rej) =>
    getPublicIp
      .v4()
      .then((ip) => res(ip))
      .catch((e) => rej(e))
  );
