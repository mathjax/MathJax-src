import './lib/tex-input.js';

import {TeX} from '../../../mathjax3/input/tex.js';

if (MathJax.startup) {
    MathJax.startup.registerConstructor('tex', TeX);
    MathJax.startup.useInput('tex');
}
