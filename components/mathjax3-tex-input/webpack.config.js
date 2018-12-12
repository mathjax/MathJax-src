const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const Uglify = require('uglifyjs-webpack-plugin');

const COMPONENT_LIBS = [
    '/components/mathjax3-core/lib/'
];
const MATHJAX3 = /\/mathjax3\//;

const PLUGINS = function (redirect) {
    const plugins = [
        // For minifcation
        new Uglify({
            uglifyOptions: {
                ie8: true
            }
        }),
        // Disable asyncLoad()
        new webpack.NormalModuleReplacementPlugin(
            /AsyncLoad\.js/,
            function (resource) {
                resource.request = resource.request.replace(/AsyncLoad/,"AsyncLoad-disabled")
            }
        )
    ];
    if (redirect) {
        plugins.push(
            // Move mathjax3 to component libraries
            new webpack.NormalModuleReplacementPlugin(
                /^\.\.\/.*\.js$/,
                function (resource) {
                    const request = path.resolve(resource.context, resource.request);
                    if (!request.match(MATHJAX3)) return;
                    for (const lib of COMPONENT_LIBS) {
                        const file = request.replace(MATHJAX3, lib);
                        if (fs.existsSync(file)) {
                            resource.request = file;
                            break;
                        }
                    }
                }
            )
        );
    }
    return plugins;
};

const MODULE = function () {
    return {
        // NOTE: for babel transpilation
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader'
            }
        }]
    };
};

//
//  Create a configuration for a distribution file
//
const CONFIG = function (name, redirect) {
    const dir = __dirname;
    return {
        name: name,
        entry: dir + '/' + name + '.js',
        output: {
            path: dir,
            filename: name + '.dist.js'
        },
        module: MODULE(),
        plugins: PLUGINS(redirect),
        performance: {
            hints: false
        },
        mode: 'production'
    };
}

//
// Pack the configuration
//
module.exports = CONFIG('mathjax3-tex-input', true);
