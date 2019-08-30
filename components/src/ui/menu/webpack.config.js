const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
    'ui/menu',                          // the package to build
    '../../../../js',                   // location of the MathJax js library
    [                                   // packages to link to
        'components/src/core/lib',
        'components/src/mml-input/lib'
    ],
    __dirname                           // our directory
);
