const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
  'output/fonts/tex/svg',             // the package to build
  '../../../../../../js',             // location of the MathJax js library
  [                                   // packages to link to
    'components/src/core/lib',
    'components/src/output/svg/lib'
  ],
  __dirname                           // our directory
);
