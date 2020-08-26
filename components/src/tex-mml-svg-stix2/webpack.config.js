const webpack = require('webpack');
const PACKAGE = require('../../webpack.common.js');

module.exports = PACKAGE(
  'tex-mml-svg-stix2',                // the package to build
  '../../../js',                      // location of the MathJax js library
  [],                                 // packages to link to
  __dirname                           // our directory
);

module.exports.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /\/fonts\/tex\.js$/,
    function (resource) {
      resource.request = '../../components/src/output/svg/nofont.js';
    }
  )
);
