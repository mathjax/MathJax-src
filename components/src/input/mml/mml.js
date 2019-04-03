import './lib/mml.js';

import {MathML} from '../../../../mathjax3/input/mathml.js';

if (MathJax.startup) {
    MathJax.startup.registerConstructor('mml', MathML);
    MathJax.startup.useInput('mml');
}
