import './lib/asciimath.js';

import {AsciiMath} from '../../../../mathjax3/input/asciimath.js';

if (MathJax.startup) {
    MathJax.startup.registerConstructor('asciimath', AsciiMath);
    MathJax.startup.useInput('asciimath');
}
