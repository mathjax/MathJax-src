import './lib/svg-output.js';

import {combineDefaults} from '../../../mathjax3/components/global.js';
import {SVG} from '../../../mathjax3/output/svg.js';

if (MathJax.loader) {
    combineDefaults(MathJax.config.loader, 'svg-output', {
        checkReady() {
            return MathJax.loader.load("svg-fonts/tex");
        }
    });
}

if (MathJax.startup) {
    MathJax.startup.registerConstructor('svg', SVG);
    MathJax.startup.useOutput('svg');
}
