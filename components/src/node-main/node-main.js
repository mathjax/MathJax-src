/*************************************************************
 *
 *  Copyright (c) 2019-2021 The MathJax Consortium
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
import '../core/core.js';
import '../adaptors/liteDOM/liteDOM.js';
import {source} from '../source.js';
import path from 'path';

/*
 * Set up the initial configuration
 */
combineDefaults(MathJax.config, 'loader', {
  require: (file => import(file)),   // use dynamic imports
  failed: (err) => {throw err}       // pass on error message to init()'s catch function
});

/*
 * Mark the preloaded components
 */
Loader.preLoad('loader', 'startup', 'core', 'adaptors/liteDOM');


/*
 * Set the mathjax root path to the location where node-main.js was loaded from,
 * and removing the directory if we are loaded from components/src/node-main.
 */
const dir = path.dirname(new URL(import.meta.url).pathname);

if (path.basename(dir) === 'node-main') {
  CONFIG.paths.es6 = CONFIG.paths.mathjax;
  CONFIG.paths.sre = '[es6]/sre/mathmaps';
  CONFIG.paths.mathjax = path.dirname(dir);
  combineDefaults(CONFIG, 'source', source);
  //
  //  Set the asynchronous loader to use the js directory, so we can load
  //  other files like entity definitions
  //
  const ROOT = path.resolve(dir, '..', '..', '..', 'js');
  const REQUIRE = MathJax.config.loader.require;
  MathJax._.mathjax.mathjax.asyncLoad = function (name) {
    return REQUIRE(name.charAt(0) === '.' ? path.resolve(ROOT, name) :
                   name.charAt(0) === '[' ? Package.resolvePath(name) : name);
  };
}

/*
 * The initialization function.  Use as:
 *
 *   require('mathjax').init({ ... }).then((MathJax) => { ... });
 *
 * where the argument to init() is a MathJax configuration (what would be set as MathJax = {...}).
 * The init() function returns a promise that is resolved when MathJax is loaded and ready, and that
 * is passed the MathJax global variable when it is called.
 */
const init = (config = {}) => {
  combineConfig(MathJax.config, config);
  return Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .then(() => MathJax)                    // Pass MathJax global as argument to subsequent .then() calls
    .catch(error => CONFIG.failed(error));
}

/*
 * Export the init() function
 */
export {init};
