import './lib/complexity.js';

import {combineDefaults} from '../../../../mathjax3/components/global.js';
import {ComplexityHandler} from '../../../../mathjax3/a11y/complexity.js';

if (MathJax.startup) {
    MathJax.startup.extendHandler(handler => ComplexityHandler(handler));
    combineDefaults(MathJax.config, 'options', MathJax.config['a11y/complexity'] || {});
}
