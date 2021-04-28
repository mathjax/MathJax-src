/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Creates configurations for webpacking of MathJax components
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

/**************************************************************/

/**
 * @param {string} string  The string whose special characters are to be escaped
 * @return {string}        The string with regex special characters escaped
 */
function quoteRE(string) {
  return string.replace(/([\\.{}[\]()?*^$])/g, '\\$1')
}

/**
 * Creates the plugin needed for converting mathjax references to component/lib references
 *
 * @param {string} js          The location of the compiled js files
 * @param {string[]} lib       The component library directories to be linked against
 * @param {string} dir         The directory of the component being built
 * @return {any[]}             The plugin array (empty or with the conversion plugin)
 */
const PLUGINS = function (js, libs, dir) {
  const mjdir = path.resolve(__dirname, '..', 'js');
  const jsdir = path.resolve(dir, js);
  const mjRE = new RegExp('^(?:' + quoteRE(jsdir) + '|' + quoteRE(mjdir) + ')' + quoteRE(path.sep));
  const root = path.dirname(mjdir);
  const rootRE = new RegExp('^' + quoteRE(root + path.sep));
  const nodeRE = new RegExp('^' + quoteRE(path.dirname(root) + path.sep));

  //
  //  Record the js directory for the pack command
  //
  const plugins = [new webpack.DefinePlugin({jsdir: jsdir})];

  if (libs.length) {
    plugins.push(
      //
      // Move mathjax references to component libraries
      //
      new webpack.NormalModuleReplacementPlugin(
        /^[^\/]/,
        function (resource) {
          const request = require.resolve(resource.request.charAt(0) === '.' ?
                                          path.resolve(resource.context, resource.request) :
                                          resource.request);
          if (!request.match(mjRE)) return;
          for (const lib of libs) {
            const file = request.replace(mjRE, path.join(root, lib) + path.sep);
            if (fs.existsSync(file)) {
              resource.request = file;
              break;
            }
          }
        }
      )
    );
  }
  plugins.push(
    //
    // Check for packages that should be rerouted to node_modules
    //
    new webpack.NormalModuleReplacementPlugin(
      /^[^\/]$/,
      function (resource) {
        const request = require.resolve(resource.request.charAt(0) === '.' ?
                                        path.resolve(resource.context, resource.request) :
                                        resource.request);
        if (request.match(rootRE) || !request.match(nodeRE) || fs.existsSync(request)) return;
        const file = request.replace(nodeRE, path.join(root, 'node_modules') + path.sep);
        if (fs.existsSync(file)) {
          resource.request = file;
        }
      }
    )
  );
  return plugins;
};

/**
 * Add babel-loader to appropriate directories
 *
 * @param {string} dir    The directory for the component being built
 * @return {any}          The modules specification for the webpack configuration
 */
const MODULE = function (dir) {
  //
  // Only need to transpile our directory and components directory
  //
  const dirRE = (dir.substr(0, __dirname.length) === __dirname ? quoteRE(__dirname) :
                 '(?:' + quoteRE(__dirname) + '|' + quoteRE(dir) + ')');
  return {
    // NOTE: for babel transpilation
    rules: [{
      test: new RegExp(dirRE + quoteRE(path.sep) + '.*\\.js$'),
      exclude: new RegExp(quoteRE(path.join(path.dirname(__dirname), 'es5') + path.sep)),
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    }]
  }
};

/**
 * Create a webpack configuration for a distribution file
 *
 * @param {string} name       The name of the component to create
 * @param {string} js         The path to the compiled .js files
 * @param {string[]} libs     Array of paths to component lib directories to link against
 * @param {string} dir        The directory of the component buing built
 * @param {string} dist       The path to the directory where the component .js file will be placed
 *                              (defaults to es5 in the same directory as the js directory)
 */
const PACKAGE = function (name, js, libs, dir, dist) {
  const distDir = dist ? path.resolve(dir, dist) :
                         path.resolve(path.dirname(js), 'es5', path.dirname(name));
  name = path.basename(name);
  return {
    name: name,
    entry: path.join(dir, name + '.js'),
    output: {
      path: distDir,
      filename: name + (dist === '.' ? '.min.js' : '.js')
    },
    target: ['web', 'es5'],  // needed for IE11 and old browsers
    plugins: PLUGINS(js, libs, dir),
    module: MODULE(dir),
    performance: {
      hints: false
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            ascii_only: true
          }
        }
      })]
    },
    mode: 'production'
  };
}

module.exports = PACKAGE;
