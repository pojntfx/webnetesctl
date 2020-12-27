const withPlugins = require("next-compose-plugins");
const transpile = require("next-transpile-modules")([
  "xterm-for-react",
  "@ant-design/charts",
  "@antv/g6/es",
]);
const sass = require("@zeit/next-sass");
const less = require("@zeit/next-less");
const images = require("next-images");

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
