const PACKAGE = require('../../webpack.common.js');

module.exports = PACKAGE(
    'tex2mml',                          // the package to build
    '../../../mathjax3',                // location of the mathjax3 library
    [                                   // packages to link to
      'components/src/tex-input/lib',
      'components/src/core/lib'
    ],
    __dirname,                          // our directory
    '.'                                 // dist directory
);
