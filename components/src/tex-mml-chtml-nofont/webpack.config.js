const PACKAGE = require('../../webpack.common.js');

module.exports = PACKAGE.NOFONT(
  'tex-mml-chtml-nofont',             // the package to build
  '../../../js',                      // location of the MathJax js library
  [],                                 // packages to link to
  __dirname                           // our directory
);
