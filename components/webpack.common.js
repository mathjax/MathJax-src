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

function fullPath(resource) {
  const file = resource.request ?
        (resource.request.charAt(0) === '.' ?
         path.resolve(resource.path, resource.request) :
         resource.request) :
        resource.path;
  return file.charAt(0) === '/' ? file : require.resolve(file);
}

/**
 * Creates the plugin needed for including jsdir in the output
 *
 * @param {string} js          The location of the compiled js files
 * @param {string} dir         The directory of the component being built
 * @return {any[]}             The plugin array (empty or with the conversion plugin)
 */
const PLUGINS = function (js, dir, es) {
  const jsdir = path.resolve(dir, js + es);
  //
  //  Record the js directory for the pack command
  //
  return [new webpack.DefinePlugin({
    __JSDIR__: jsdir
  })];
};

/**
 * Creates the plugin needed for converting mathjax references to component/lib references
 *
 * @param {string} js          The location of the compiled js files
 * @param {string} dir         The directory of the component being built
 * @param {string[]} libs      The component library directories to be linked against
 * @return {Object}            The plugin object: {plugins: [...]}
 */
const RESOLVE = function (js, dir, es, libs) {
  //
  // Get directories and regular expressions for them
  //
  const sep = quoteRE(path.sep);
  const root = path.dirname(__dirname);
  const mjdir = path.resolve(root, 'js');
  const jsdir = path.resolve(dir, js);
  const jsRE = new RegExp((es ? quoteRE(jsdir).replace(/^(.*\/js)(\/|$)/, '$1' + es + '?$2') : quoteRE(jsdir)) + sep);
  const mjRE = new RegExp((es ? quoteRE(mjdir) + es + '?' : quoteRE(mjdir)) + sep);

  //
  //  Add directory names to libraries
  //
  const libREs = libs.map(
    lib => (lib.charAt(0) === '.' ?
            [jsRE, path.join(dir, lib) + path.sep] :
            [mjRE, path.join(root, lib) + path.sep])
  );

  //
  // Function to replace imported files by ones in the specified component lib directories.
  //
  const replaceLibs = (resource) => {
    const request = fullPath(resource);
    //
    // Loop through the libraries and see if the imported file is there,
    //   and return it if so.
    //
    for (const [re, lib] of libREs) {
      const match = request.match(re);
      if (match) {
        const file = lib + request.substr(match[0].length);
        if (fs.existsSync(file)) {
          return file;
        }
      }
    }
  }

  //
  // A plugin that looks for files and modules to see if they need replacing with library versions.
  //
  class ResolveReplacementPlugin {
    apply(resolver) {
      const target = resolver.ensureHook("resolved");
      resolver
	.getHook('normalResolve')
	.tapAsync(ResolveReplacementPlugin.name, (request, resolveContext, callback) => {
	  const file = replaceLibs(request);
	  if (!file) return callback();
	  resolver.doResolve(
	    target,
	    {...request, path: file, request: undefined},
	    'library redirect',
	    resolveContext,
	    callback
	  );
        });
    }
  }

  //
  // The resolve object to use
  //
  const resolve = {plugins: [new ResolveReplacementPlugin()]};

  //
  //  Add aliases for js => js6, if needed
  //
  if (es) {
    const src = path.join(path.dirname(require.resolve('mathjax-full/package.json')), 'js');
    resolve.alias = {
      [jsdir]: jsdir + es,
      'mathjax-full/js': 'mathjax-full/js' + es,
      [src]: src + es   // needed for development environment with symbolic link to mathjax-full
    }
  }

  return resolve;
}

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
 * @param {{
 *          name: string,     // The name of the component to create
 *          js: string,       // The path to the compiled .js files (default is mathjax js directory)
 *          libs: string[],   // Array of paths to component lib directories to link against
 *          dir: string,      // The directory of the component being built
 *          dist: string      // The path to the directory where the component .js file will be placed
 *                                (defaults to es5 or es6 in the same directory as the js directory)
 *        }}  options
 * @return {object}           The webpack configuration object
 */
const PACKAGE = function (options) {
  let {name, js, libs = [], dir, dist = ''} = options;
  if (!js) {
    js = path.relative(dir, path.resolve(__dirname, '..', 'js'));
  }
  return (env) => {
    const es = env.es || '';
    const distDir = dist ? path.resolve(dir, dist) :
                           path.resolve(js, '..', 'es' + (es || 5), path.dirname(name));
    const basename = path.basename(name);
    return {
      name: basename,
      entry: path.join(dir, basename + '.js'),
      output: {
        path: distDir,
        filename: basename + (dist === '.' ? '.min.js' : '.js')
      },
      target: ['web', 'es' + (es || 5)],  // needed for IE11 and old browsers
      plugins: PLUGINS(js, dir, es),
      resolve: RESOLVE(js, dir, es, libs),
      module: (es ? undefined : MODULE(dir)),
      performance: {
        hints: false
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          extractComments: false,
          parallel: true,
          terserOptions: {
            output: {
              ascii_only: true
            }
          }
        })]
      },
      mode: 'production'
    };
  };
}

/**
 * Create a webpack configuration for a distribution file with no default font
 *
 * @param {{
 *          name: string,     // The name of the component to create
 *          js: string,       // The path to the compiled .js files (default is mathjax js directory)
 *          libs: string[],   // Array of paths to component lib directories to link against
 *          dir: string,      // The directory of the component being built
 *          dist: string      // The path to the directory where the component .js file will be placed
 *                                (defaults to es5 or es6 in the same directory as the js directory)
 *        }}  options
 * @return {object}           The webpack configuration object
 */
PACKAGE.NOFONT = function (options) {
  const jax = (options.name.match(/chtml|svg/) || ['chtml'])[0];
  const nofont = path.resolve(__dirname, 'src', 'output', jax, 'nofont.js');
  return (env) => {
    const package = PACKAGE(options)(env);
    package.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /DefaultFont.js/,
        function (resource) {
          resource.request = path.relative(resource.context, nofont).replace(/^([^.])/, './$1');
        }
      )
    );
    return package;
  }
}

module.exports = PACKAGE;
