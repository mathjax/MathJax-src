/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
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

/*
 * Load the needed MathJax components
 */

import '../startup/init.js';
import {Loader, CONFIG} from '#js/components/loader.js';
import {Package} from '#js/components/package.js';
import {combineDefaults, combineConfig} from '#js/components/global.js';
import {context} from '#js/util/context.js';
import '../core/core.js';
import '../adaptors/liteDOM/liteDOM.js';
import {source} from '../source.js';

const MathJax = global.MathJax;

const path = eval('require("path")');   // get path from node, not webpack
const dir = context.path(MathJax.config.__dirname);   // set up by node-main.mjs or node-main.cjs

/*
 * Set up the initial configuration
 */
combineDefaults(MathJax.config, 'loader', {
  paths: {'mathjax-newcm': '@mathjax/mathjax-newcm-font'},
  require: eval("(file) => import(file)"),   // use dynamic imports
  failed: (err) => {throw err}               // pass on error message to init()'s catch function
});
combineDefaults(MathJax.config, 'output', {font: 'mathjax-newcm'});

/*
 * Mark the preloaded components
 */
Loader.preLoaded('loader', 'startup', 'core', 'adaptors/liteDOM');

if (path.basename(dir) === 'node-main') {
  CONFIG.paths.esm = CONFIG.paths.mathjax;
  CONFIG.paths.sre = '[esm]/sre';
  CONFIG.paths.mathjax = path.dirname(dir);
  combineDefaults(CONFIG, 'source', source);
} else {
  CONFIG.paths.mathjax = dir;
}
//
//  Set the asynchronous loader to use the js directory, so we can load
//  other files like entity definitions
//
const ROOT = path.resolve(dir, '..', '..', '..', path.basename(path.dirname(dir)));
const REQUIRE = MathJax.config.loader.require;
MathJax._.mathjax.mathjax.asyncLoad = function (name) {
  return REQUIRE(name.charAt(0) === '.' ? path.resolve(ROOT, name) :
                 name.charAt(0) === '[' ? Package.resolvePath(name) : name);
};

/*
 * The initialization function.  Use as:
 *
 *   require('mathjax').init({ ... }).then((MathJax) => { ... });
 *
 * or
 *
 *   import {init} from 'mathjax';
 *   init({...}).then((MathJax) => {...});
 *
 * where the argument to init() is a MathJax configuration (what would be set as MathJax = {...}).
 * The init() function returns a promise that is resolved when MathJax is loaded and ready, and that
 * is passed the MathJax global variable when it is called.
 */
const init = MathJax.init = (config = {}) => {
  combineConfig(MathJax.config, config);
  return Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .then(() => MathJax.startup.promise)    // Wait for MathJax to finish starting up
    .then(() => MathJax)                    // Pass MathJax global as argument to subsequent .then() calls
    .catch(error => CONFIG.failed(error));
}

/*
 * Export MathJax (with its init() function)
 */
export {MathJax};
