const PACKAGE = require('../../../../webpack.common.js');

module.exports = PACKAGE(
    'tex',                              // the package to build
    '../../../../../mathjax3',          // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/core/lib',
        'components/src/chtml-output'
    ],
    __dirname,                          // our directory
    '../../../../dist/chtml-fonts'      // dist directory
);
