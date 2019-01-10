const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
    'semantic-enrich',                  // the package to build
    '../../../../mathjax3',             // location of the mathjax3 library
    ['components/src/core/lib'],        // packages to link to
    __dirname,                          // our directory
    '../../../dist/a11y'                // dist directory
);
