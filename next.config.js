const withPlugins = require("next-compose-plugins");
const transpile = require("next-transpile-modules")(["xterm-for-react"]);
const sass = require("@zeit/next-sass");
const less = require("@zeit/next-less");

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
