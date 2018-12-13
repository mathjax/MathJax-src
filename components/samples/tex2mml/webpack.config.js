const PACKAGE = require('../../webpack.common.js');

module.exports = PACKAGE(
    'tex2mml',                          // the package to build
    '../../../mathjax3',                // location of the mathjax3 library
    [                                   // packages to link to
      'components/mathjax3-tex-input/lib',
      'components/mathjax3-core/lib'
    ],
    __dirname                           // our directory
);
