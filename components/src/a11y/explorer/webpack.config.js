const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
    'explorer',                        // the package to build
    '../../../../mathjax3',             // location of the mathjax3 library
    [                                   // packages to link to
        'components/src/a11y/semantic-enrich/lib',
        'components/src/mml-input/lib',
        'components/src/core/lib'
    ],
    __dirname,                          // our directory
    '../../../dist/a11y'                // dist directory
);
