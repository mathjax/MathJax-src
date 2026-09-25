import { MathJax, combineConfig, combineDefaults } from '#js/components/global.js';
import { Loader } from '#js/components/loader.js';
import { hasWindow } from '#js/util/context.js';

if (hasWindow) {
  window.exports ??= {};
}

/**
 * This funciton is called below and by ../main.js in order to create
 * the needed init() function that is exported for initializing
 * MathJax and returning the completed MathJax object.  For use in node,
 * the nodeSetup function is called to do extra setup (like setting the
 * the asyncLoad function and getting the path to the MathJax files), and
 * the adaptor will be added to the loading list if one isnt already
 * inclkuded there.
 *
 * @param {() => void} nodeSetup   The function to do extra setup for node
 * @param {string} adaptor         The adaptor to use for node
 * @returns {(config} => MathJax}  The init() function for export
 */
export function makeInit(nodeSetup = null, adaptor = '') {
  return async function init(config, component = 'startup') {
    Loader.preLoaded('loader', 'core');
    MathJax.config.loader.failed = (err) => {throw err};
    if (hasWindow) {
      MathJax.config.loader.paths.mathjax = 'https://cdn.jsdelivr.net/npm/mathjax';
    }
    if (nodeSetup) {
      await nodeSetup();
    }
    combineConfig(MathJax.config, config);
    if (adaptor) {
      const CONFIG = MathJax.config.loader;
      CONFIG.load ??= [];
      if (CONFIG.load.filter((name) => name.substring(0, 9) === 'adaptors/').length === 0) {
        CONFIG.load.unshift(adaptor);
      }
    }
    MathJax.loader = Loader;
    if (component) {
      await Loader.load(component);
    }
    await MathJax.startup?.promise ?? Promise.resolve();
    return MathJax;
  }
};

export const init = MathJax.init = makeInit();
export default MathJax;
