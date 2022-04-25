import './lib/sre.js';
import './sre_config.js';
import Sre from '../../../../js/a11y/sre.js';

if (MathJax.startup) {
  console.log(3);
  ((typeof window !== 'undefined') ? window : global).
    SREfeature.custom = (loc) => Sre.preloadLocales(loc);
  console.log(((typeof window !== 'undefined') ? window : global).SREfeature);
}

