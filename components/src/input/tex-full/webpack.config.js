const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
    'input/tex-full',                   // the package to build
    '../../../../mathjax3',             // location of the mathjax3 library
    ['components/src/core/lib'],        // packages to link to
    __dirname                           // our directory
);
