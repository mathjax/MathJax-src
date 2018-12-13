const PACKAGE = require('../webpack.common.js');

module.exports = PACKAGE(
    'mathjax3-core',                    // the package to build
    '../../mathjax3',                   // location of the mathjax3 library
    [],                                 // packages to link to
    __dirname                           // our directory
);
