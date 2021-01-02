const withPlugins = require("next-compose-plugins");
const transpile = require("next-transpile-modules")([
  "xterm-for-react",
  "@ant-design/charts",
  "@antv/g6/es",
  "jsoncrush",
]);
const sass = require("@zeit/next-sass");
const less = require("@zeit/next-less");
const images = require("next-images");
const pwa = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

runtimeCaching[0].handler = "StaleWhileRevalidate";

module.exports = withPlugins(
  [
    transpile,
    [
      sass,
      {
        lessLoaderOptions: {
          javascriptEnabled: true,
        },
      },
    ],
    less,
    images,
    [
      pwa,
      {
        pwa: {
          disable: process.env.NODE_ENV === "development",
          dest: "public",
          register: false,
          skipWaiting: false,
          runtimeCaching,
        },
      },
    ],
  ],
  {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.node = {
          fs: "empty",
        };
      }

      return config;
    },
  }
);
