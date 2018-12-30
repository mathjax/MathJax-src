const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

/**************************************************************/

const PLUGINS = function (mathjax3, libs, dir) {
    const mj3dir = path.resolve(dir, mathjax3);
    const mj3 = new RegExp('^' + mj3dir.replace(/([\\\/.{}[\]()?*^$])/g, '\$1') + '\\/');
    const root = path.dirname(mj3dir);

    const plugins = [
        // Disable asyncLoad()
/*
        new webpack.NormalModuleReplacementPlugin(
            /AsyncLoad\.js/,
            function (resource) {
                resource.request = resource.request.replace(/AsyncLoad/,"AsyncLoad-disabled")
            }
        )
*/
    ];
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
        performance: {
            hints: false
        },
        mode: 'production'
    };
}

module.exports = PACKAGE;

