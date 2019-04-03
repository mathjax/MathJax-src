const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
    'ui/menu',                             // the package to build
    '../../../../mathjax3',             // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/core/lib',
        'components/src/mml-input/lib'
    ],
    __dirname                           // our directory
);
