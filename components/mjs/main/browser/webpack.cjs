const webpack = require('webpack');

module.exports = (pkg) => {
  pkg.output.library = {
    type: 'commonjs2',
    export: ['default'],
  };
  pkg.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /mjs\/components\/mjs\/json\.js/,
      '../../../components/mjs/main/browser/json.cjs',
    ),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  );
  return pkg;
}
