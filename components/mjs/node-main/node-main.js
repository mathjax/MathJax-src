/*************************************************************
 *
 *  Copyright (c) 2019-2024 The MathJax Consortium
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
import {MathJax, combineDefaults, combineConfig} from '#js/components/global.js';
import {resolvePath} from '#js/util/AsyncLoad.js';
import '../core/core.js';
import '../adaptors/liteDOM/liteDOM.js';
import {source} from '../source.js';

const path = eval('require("path")');          // get path from node, not webpack
const fs = eval('require("fs").promises');
const dir = MathJax.config.__dirname;   // set up by node-main.mjs or node-main.cjs

/*
 * Set up the initial configuration
 */
combineDefaults(MathJax.config, 'loader', {
  paths: {'mathjax-modern': 'mathjax-modern-font'},
  require: eval("(file) => import(file)"),   // use dynamic imports
  failed: (err) => {throw err}               // pass on error message to init()'s catch function
});
combineDefaults(MathJax.config, 'output', {font: 'mathjax-modern'});

/*
 * Mark the preloaded components
 */
Loader.preLoad('loader', 'startup', 'core', 'adaptors/liteDOM');

/*
 * Set the paths.
 */
if (path.basename(dir) === 'node-main') {
  CONFIG.paths.esm = CONFIG.paths.mathjax;
  CONFIG.paths.sre = '[esm]/sre/mathmaps';
  CONFIG.paths.mathjax = path.resolve(dir, '..', '..', '..', MathJax.config.__js);
  combineDefaults(CONFIG, 'source', source);
} else {
  CONFIG.paths.mathjax = dir;
}

/*
 * Set the asynchronous loader to handle json files
 */
MathJax._.mathjax.mathjax.asyncLoad = function (name) {
  const file = resolvePath(name, (name) => path.resolve(CONFIG.paths.mathjax, name));
  return file.match(/\.json$/) ?
    fs.readFile(file).then((json) => JSON.parse(json)) :
    MathJax.config.loader.require(file);
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
