import { MathJax, combineConfig, combineDefaults } from '#js/components/global.js';
import { Loader } from '#js/components/loader.js';
import { hasWindow } from '#js/util/context.js';

if (hasWindow) {
  window.exports ??= {};
}

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
