const withPlugins = require("next-compose-plugins");
const transpile = require("next-transpile-modules")(["xterm-for-react"]);

module.exports = withPlugins([transpile], {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
});
