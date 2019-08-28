const webpack = require("webpack");
const PACKAGE = require('../../webpack.common.js');

module.exports = PACKAGE(
    'startup',                          // the package to build
    '../../../js',                      // location of the MathJax js library
    [],                                 // packages to link to
    __dirname                           // our directory
);

//
//  Force linking to core/MathItem.js from the core package, since
//  that is not needed until after core is loaded (can't link to all
//  of core, as we need PrioritizedList.js and global.js before that)
//
module.exports.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
        /\/core\/MathItem\.js$/,
        function (resource) {
            resource.request = '../../components/src/core/lib/core/MathItem.js';
        }
    )
);
