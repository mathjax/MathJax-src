const webpack = require('webpack');

module.exports = (pkg) => {
  pkg.experiments = {outputModule: true};
  pkg.output.library = {type: 'module'};
  pkg.plugins.push(
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  );
  return pkg;
}
