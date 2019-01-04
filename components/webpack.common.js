const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

/**************************************************************/

function quoteRE(string) {
    return string.replace(/([\\.{}[\]()?*^$])/g, '\$1')
}

const PLUGINS = function (mathjax3, libs, dir) {
    const mj3dir = path.resolve(dir, mathjax3);
    const mj3 = new RegExp('^' + quoteRE(mj3dir) + '\\/');
    const root = path.dirname(mj3dir);

    const plugins = [];
    if (libs.length) {
        plugins.push(
            // Move mathjax3 to component libraries
            new webpack.NormalModuleReplacementPlugin(
                /^[^\/].*\.js$/,
                function (resource) {
                    const request = path.resolve(resource.context, resource.request);
                    if (!request.match(mj3)) return;
                    for (const lib of libs) {
                        const file = request.replace(mj3, path.join(root, lib) + '/');
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

const MODULE = function (dir) {
    //
    // Only need to transpile our directory and components directory
    //
    const dirRE = (dir.substr(0, __dirname.length) === __dirname ? quoteRE(__dirname) :
                   '(?:' + quoteRE(__dirname) + '|' + quoteRE(dir) + ')');
    return {
        // NOTE: for babel transpilation
        rules: [{
            test: new RegExp(dirRE + '\\/.*\\.js$'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    }
};

//
//  Create a configuration for a distribution file
//
const PACKAGE = function (name, mathjax3, components, dir, dist) {
    const distDir = dist ? path.resolve(dir, dist) :
                           path.resolve(path.dirname(mathjax3), 'components', dist || 'dist');
    return {
        name: name,
        entry: path.join(dir, name + '.js'),
        output: {
            path: distDir,
            filename: name + (dist === '.' ? '.min.js' : '.js')
        },
        plugins: PLUGINS(mathjax3, components, dir),
        module: MODULE(dir),
        performance: {
            hints: false
        },
        mode: 'production'
    };
}

module.exports = PACKAGE;

