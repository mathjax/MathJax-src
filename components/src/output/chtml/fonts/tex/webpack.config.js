const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
    'output/chtml/fonts/tex',           // the package to build
    '../../../../../../mathjax3',       // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/core/lib',
        'components/src/chtml-output'
    ],
    __dirname                           // our directory
);
