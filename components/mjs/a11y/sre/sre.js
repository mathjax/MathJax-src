import './lib/sre.js';
import './sre_config.js';
import {context} from '#js/util/context.js';
import * as Sre from '#js/a11y/sre.js';

export {Sre};

if (MathJax.startup) {
  (context.window || global).SREfeature.custom = (loc) => Sre.preloadLocales(loc);
}

