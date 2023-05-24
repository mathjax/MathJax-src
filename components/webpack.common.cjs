/*************************************************************
 *
 *  Copyright (c) 2018-2023 The MathJax Consortium
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

/****************************************************************/

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const DIRNAME = __dirname;

/**
 * @param {string} string  The string whose special characters are to be escaped
 * @return {string}        The string with regex special characters escaped
 */
function quoteRE(string) {
  return string.replace(/([\\.{}[\]()?*^$])/g, '\\$1');
}

function fullPath(resource) {
  const file = resource.request ?
        (resource.request.charAt(0) === '.' ?
         path.resolve(resource.path, resource.request) :
         resource.request) :
        resource.path;
  return file.charAt(0) === '/' ? file : require.resolve(file);
}

/****************************************************************/

/**
 * Creates the plugin needed for including jsdir in the output
 *
 * @param {string} js          The location of the compiled js files
 * @param {string} dir         The directory of the component being built
 * @param {string} es          The es version (5 or '')
 * @param {boolean} font       False to replace font with the no-font file
 * @param {string} jax         The name of jax for a font-based default redirection
 * @param {string} name        The component name
 * @return {any[]}             The plugin array (empty or with the conversion plugin)
 */
const PLUGINS = function (js, dir, es, font, jax, name) {
  //
  // Replace a11y/util with the webpack version
  //
  const plugins = [new webpack.NormalModuleReplacementPlugin(
    /components\/src\/a11y\/util\.js/,
    './util-pack.js'
  )];


  //
  // Replace default font with the no-font file
  //
  if (!font) {
    const jax = (name.match(/chtml|svg/) || ['chtml'])[0];
    const nofont = path.resolve(DIRNAME, 'src', 'output', jax, 'nofont.js');
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /DefaultFont.js/,
        function (resource) {
          resource.request = path.relative(resource.context, nofont).replace(/^([^.])/, './$1');
        }
      )
    );
  }

  //
  // Replace font-based default font
  //
  if (jax) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        new RegExp(`#default-font\\/${jax}\\/default\\.js$`),
        function (resource) {
          resource.request = path.resolve(dir, `../../js${es}/${jax}/default.js`);
        }
      )
    );
  }

  return plugins;
};

/****************************************************************/

/**
 * Creates the plugin needed for converting mathjax references to component/lib references
 *
 * @param {string} js          The location of the compiled js files
 * @param {string} dir         The directory of the component being built
 * @param {string} es          The es version (5 or '')
 * @param {string[]} libs      The component library directories to be linked against
 * @return {Object}            The plugin object: {plugins: [...]}
 */
const RESOLVE = function (js, dir, es, libs) {
  //
  // Get directories and regular expressions for them
  //
  const sep = quoteRE(path.sep);
  const root = path.dirname(DIRNAME);
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
          //
          //  Return the proper library file (.cjs or .js as needed)
          //
          if (es === 5) {
            const cfile = file.replace(/\.js$/, '.cjs');
            if (fs.existsSync(cfile)) {
              return cfile;
            }
          }
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
  const src = path.join(path.dirname(require.resolve('mathjax-full/package.json')), 'js');
  const jsd = jsdir.replace(/\/js[56]$/, '/js');
  return {
    plugins: [new ResolveReplacementPlugin()],
    alias: {
      '#js': 'mathjax-full/js' + es,
      [jsd]: jsd + es,
      'mathjax-full/js': 'mathjax-full/js' + es,
      [src]: src + es,   // needed for development environment with symbolic link to mathjax-full
    }
  };
}

/****************************************************************/

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
  const dirRE = (dir.substr(0, DIRNAME.length) === DIRNAME ? quoteRE(DIRNAME) :
                 '(?:' + quoteRE(DIRNAME) + '|' + quoteRE(dir) + ')');
  const es5 = path.join(path.dirname(DIRNAME), 'es5');
  return {
    rules: [{
      test: new RegExp(dirRE + quoteRE(path.sep) + '.*\\.js$'),
      exclude: new RegExp(quoteRE(es5 + path.sep)),
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env'],
          plugins: ['@babel/plugin-syntax-import-assertions']
        }
      }
    }]
  }
};

/****************************************************************/

/**
 * Create a webpack configuration for a distribution file
 *
 * @param {{
 *          name: string,     // The name of the component to create
 *          js: string,       // The path to the compiled .js files (default is mathjax js directory)
 *          libs: string[],   // Array of paths to component lib directories to link against
 *          dir: string,      // The directory of the component being built
 *          dist: string,     // The path to the directory where the component .js file will be placed
 *                                (defaults to es5 or es6 in the same directory as the js directory)
 *          font: boolean,    // false to replace default font with no font
 *          jax: string,      // the jax whose default font should be redirected
 *        }}  options
 * @return {object}           The webpack configuration object
 */
const PACKAGE = function (options) {
  let {name, js, es = '6', libs = [], dir, dist = '', font = true, jax = ''} = options;
  dir = dir.replace(/\/$/, '');
  if (!js) {
    js = path.relative(dir, path.resolve(DIRNAME, '..', 'js'));
  }
  const distDir = dist ? path.resolve(dir, dist) :
                         path.resolve(js, '..', 'es' + es, path.dirname(name));
  const basename = path.basename(name);
  return {
    name: basename,
    entry: path.join(dir, basename + '.js'),
    output: {
      path: distDir,
      filename: basename + (dist === '.' ? '.min.js' : '.js')
    },
    target: ['web', 'es' + es],  // needed for IE11 and old browsers
    plugins: PLUGINS(js, dir, es, font, jax, name),
    resolve: RESOLVE(js, dir, es, libs),
    module: (es ? MODULE(dir) : undefined),
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
//    devtool: 'source-map',
    mode: 'production'
  };
}

module.exports.PACKAGE = PACKAGE;
