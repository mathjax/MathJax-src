const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
    'output/svg/fonts/tex',             // the package to build
    '../../../../../../js',             // location of the MathJax js library
    [                                   // packages to link to
        'components/src/core/lib',
        'components/src/svg-output'
    ],
    __dirname                           // our directory
);
