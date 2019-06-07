const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
    'a11y/explorer',                    // the package to build
    '../../../../mathjax3',             // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/a11y/semantic-enrich/lib',
        'components/src/mml-input/lib',
        'components/src/core/lib'
    ],
    __dirname                           // our directory
);
