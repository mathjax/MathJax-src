/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
  return string.replace(/([\\.{}[\]()?*+^$])/g, '\\$1');
}

/****************************************************************/

/**
 * Creates the plugin needed for including jsdir in the output
 *
 * @param {string} js          The location of the compiled js files
 * @param {string} dir         The directory of the component being built
 * @param {string} target      The module target (cjs or mjs)
 * @param {boolean} font       False to replace font with the no-font file
 * @param {string} jax         The name of jax for a font-based default redirection
 * @param {string} name        The component name
 * @return {any[]}             The plugin array (empty or with the conversion plugin)
 */
const PLUGINS = function (js, dir, target, font, jax, name) {
  //
  // Replace components/mjs/root with the webpack version
  //   and map mathjax-full/js to mathjax-full/${target}
  //   similarly for @mathjax/src/js.
  //
  const plugins = [
    new webpack.NormalModuleReplacementPlugin(
      /mjs\/components\/mjs\/root\.js/,
      '../../../components/root-pack.js'
    ),
    new webpack.NormalModuleReplacementPlugin(
      /mjs\/components\/mjs\/sre-root\.js/,
      '../../../components/sre-pack.js'
    ),
    new webpack.NormalModuleReplacementPlugin(
      /mathjax-full\/js\//,
      function (resource) {
        resource.request = resource.request.replace(/mathjax-full\/js\//, `mathjax-full/${target}/`);
      }
    ),
    new webpack.NormalModuleReplacementPlugin(
      /@mathjax\/src\/js\//,
      function (resource) {
        resource.request = resource.request.replace(/@mathjax\/src\/js\//, `@mathjax/src/${target}/`);
      }
    )
  ];

  //
  // Replace default font with the no-font file
  //
  if (!font) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /-font\/.*?\/default\.js/,
        function (resource) {
          resource.request = resource.request.replace(/\/.*?\/default\.js/, '/nofont.js');
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
          resource.request = path.resolve(dir, `../../${target}/${jax}/default.js`);
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
const RESOLVE = function (js, dir, target, libs) {
  //
  // Get directories and regular expressions for them
  //
  const sep = quoteRE(path.sep);
  const root = path.dirname(DIRNAME);
  const mjdir = path.resolve(root, target);
  const jsdir = path.resolve(dir, js);
  const jsRE = new RegExp(quoteRE(jsdir) + sep);
  const mjRE = new RegExp(quoteRE(mjdir) + sep);

  //
  //  Add directory names to libraries
  //
  const libREs = libs
        .map(lib => lib.replace(/components\/(?:src|js)\//, 'components/' + target + '/'))
        .map(lib => (lib.charAt(0) === '.' ?
                     [jsRE, path.join(dir, lib) + path.sep] :
                     [mjRE, path.join(root, lib) + path.sep]));

  //
  // Function to get full paths using the proper package.json file get the
  // pseudo-package includes to be correct.
  //
  const {fullPath} = require(`./${target}/fullpath.cjs`);

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
        const file = lib + request.substring(match[0].length);
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
  return {
    plugins: [new ResolveReplacementPlugin()]
  };
}

/****************************************************************/

/**
 * Create a webpack configuration for a distribution file
 *
 * @param {{
 *          name: string,     // The name of the component to create
 *          js: string,       // The path to the compiled .js files (default is mathjax js directory)
 *          target: string,   // 'mjs' or 'cjs' (defaults to 'mjs')
 *          bundle: string,   // name of sub-directory where packed files go (defaults to 'bundle')
 *          libs: string[],   // Array of paths to component lib directories to link against
 *          dir: string,      // The directory of the component being built
 *          dist: string,     // The path to the directory where the component .js file will be placed
 *                                (defaults to the bundle directory in the same directory as the js directory)
 *          font: boolean,    // false to replace default font with no font
 *          jax: string,      // the jax whose default font should be redirected
 *        }}  options
 * @return {object}           The webpack configuration object
 */
const PACKAGE = function (options) {
  let {name, js, target = 'mjs', bundle = 'bundle', libs = [], dir, dist = '', font = true, jax = ''} = options;
  dir = dir.replace(/\/$/, '');
  if (!js) {
    js = path.relative(process.cwd(), path.resolve(DIRNAME, '..', target));
  }
  const distDir = dist ? path.resolve(dir, dist) :
                         path.resolve(js, '..', bundle, path.dirname(name));
  const basename = path.basename(name);
  return {
    name: basename,
    entry: path.join(dir, basename + '.js'),
    output: {
      path: distDir,
      filename: basename + (dist === '.' ? '.min.js' : '.js')
    },
    target: ['web', 'es' + (target === 'mjs' ? '6' : '5')],  // needed for IE11 and old browsers
    plugins: PLUGINS(js, dir, target, font, jax, name),
    resolve: RESOLVE(js, dir, target, libs),
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
