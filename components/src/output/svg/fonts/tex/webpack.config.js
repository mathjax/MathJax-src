const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
    'output/svg/fonts/tex',             // the package to build
    '../../../../../../mathjax3',       // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/core/lib',
        'components/src/svg-output'
    ],
    __dirname                           // our directory
);
