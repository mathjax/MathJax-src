const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
  'a11y/sre',                         // the package to build
  '../../../../js',                   // location of the MathJax js library
  [                                   // packages to link to
    'components/src/input/mml/lib',
    'components/src/core/lib',
    'node_modules/speech-rule-engine/js'
  ],
  __dirname                           // our directory
);
