const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for 'crypto' and 'fs' modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        fs: false
      };

      // See https://github.com/webpack/webpack/issues/6725
      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: 'javascript/auto'
      });

      return webpackConfig;
    }
  }
};
