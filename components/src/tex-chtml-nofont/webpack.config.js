const PACKAGE = require('../../webpack.common.js');

module.exports = PACKAGE.NOFONT(
  'tex-chtml-nofont',                 // the package to build
  '../../../js',                      // location of the MathJax js library
  [],                                 // packages to link to
  __dirname                           // our directory
);
