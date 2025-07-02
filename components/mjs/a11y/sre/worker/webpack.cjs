const webpack = require('webpack');

module.exports = (pkg) => {
  pkg.plugins.push(
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  );
  return pkg;
}
