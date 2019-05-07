const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
    'input/tex/extensions/configMacros',// the package to build
    '../../../../../../mathjax3',       // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/input/tex/extensions/newcommand/lib',
        'components/src/input/tex-base/lib',
        'components/src/core/lib',
        'components/src/startup/lib'
    ],
    __dirname                           // our directory
);
