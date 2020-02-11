const path = require('path');

/*
 * Load the needed MathJax components
 */
require('../startup/lib/startup.js');
const {Loader, CONFIG} = require('../../../js/components/loader.js');
const {combineDefaults, combineConfig} = require('../../../js/components/global.js');
const {dependencies, paths, provides} = require('../dependencies.js');

/*
 * Set up the initial configuration
 */
combineDefaults(MathJax.config, 'loader', {
  require: eval('require'),      // use node's require() to load files
  failed: (err) => {throw err}   // pass on error message to init()'s catch function
});
combineDefaults(MathJax.config.loader, 'dependencies', dependencies);
combineDefaults(MathJax.config.loader, 'paths', paths);
combineDefaults(MathJax.config.loader, 'provides', provides);

MathJax.config.loader.paths.mathjax = (function () {
  //
  // Try to locate the mathjax-full or mathjax package
  // If neither is found, try to use the directory where this file is located
  //
  try {
    return path.resolve(MathJax.config.loader.require.resolve('mathjax-full/package.json'), '../es5');
  } catch (err) {}
  try {
     return path.resolve(MathJax.config.loader.require.resolve('mathjax/package.json'), '../es5');
  } catch (err) {
    let dir = path.dirname(err.requireStack[0]); // err.requireStack[0] is the full path to this module
    if (path.basename(dir) == 'node-main') {
      //
      // This is components/src/node-main/node-main.js, so use
      // components/src as the mathjax directory, and load the source array
      //
      dir = path.dirname(dir);
      combineDefaults(MathJax.config.loader, 'source', require('../source.js').source);
    }
    return dir;
  }
})();


/*
 * Preload core and liteDOM adaptor (needed for node)
 */
Loader.preLoad('loader', 'startup', 'core', 'adaptors/liteDOM');
require('../core/core.js');
require('../adaptors/liteDOM/liteDOM.js');

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
