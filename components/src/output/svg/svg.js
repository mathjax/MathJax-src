import './lib/svg.js';

import {combineDefaults} from '../../../../mathjax3/components/global.js';
import {SVG} from '../../../../mathjax3/output/svg.js';

if (MathJax.loader) {
    combineDefaults(MathJax.config.loader, 'svg', {
        checkReady() {
            return MathJax.loader.load("output/svg/fonts/tex");
        }
    });
}

if (MathJax.startup) {
    MathJax.startup.registerConstructor('svg', SVG);
    MathJax.startup.useOutput('svg');
}
