import './lib/sre.js';
import './sre_config.js';
import {Sre} from '#js/a11y/sre.js';
import {context} from '#js/util/context.js';

export {Sre};

if (MathJax.startup) {
  (context.window || global).SREfeature.custom = (loc) => Sre.preloadLocales(loc);
}

