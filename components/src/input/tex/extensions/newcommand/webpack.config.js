const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
    'input/tex/extensions/newcommand',  // the package to build
    '../../../../../../mathjax3',       // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/input/tex-base/lib',
        'components/src/core/lib'
    ],
    __dirname                           // our directory
);
