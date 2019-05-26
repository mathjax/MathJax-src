const webpack = require("webpack");
const PACKAGE = require('../../webpack.common.js');

module.exports = PACKAGE(
    'chtml-output',                     // the package to build
    '../../../mathjax3',                // location of the mathjax3 library
    ['components/src/core/lib'],        // packages to link to
    __dirname                           // our directory
);

module.exports.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
        /\/fonts\/tex\.js$/,
        function (resource) {
            resource.request = '../../components/src/chtml-output/nofont.js';
        }
    )
);

