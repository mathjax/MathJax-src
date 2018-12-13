const PACKAGE = require('../webpack.common.js');

module.exports = PACKAGE(
    'mathjax3-tex-input',               // the package to build
    '../../mathjax3',                   // location of the mathjax3 library
    ['components/mathjax3-core/lib'],   // packages to link to
    __dirname                           // our directory
);
