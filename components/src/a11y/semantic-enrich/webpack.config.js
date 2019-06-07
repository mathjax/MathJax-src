const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
    'a11y/semantic-enrich',             // the package to build
    '../../../../mathjax3',             // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/mml-input/lib',
        'components/src/core/lib'
    ],
    __dirname                           // our directory
);
