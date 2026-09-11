const webpack = require('webpack');

module.exports = (pkg) => {
  pkg.output.library = {
    type: 'commonjs-static',
  }
  pkg.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /mjs\/components\/mjs\/json\.js/,
      '../../../components/mjs/main/json.cjs'
    ),
  );
  return pkg;
}
