const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
    'input/tex/extensions/extpfeil',    // the package to build
    '../../../../../../mathjax3',       // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/input/tex/extensions/ams/lib',
        'components/src/input/tex/extensions/newcommand/lib',
        'components/src/input/tex-lib/lib',
        'components/src/core/lib'
    ],
    __dirname                           // our directory
);
