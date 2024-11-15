import './lib/sre.js';
import './sre_config.js';
import * as Sre from '#js/a11y/sre.js';

export {Sre};

if (MathJax.startup) {
  ((typeof window !== 'undefined') ? window : global).
    SREfeature.custom = (loc) => Sre.preloadLocales(loc);
}

