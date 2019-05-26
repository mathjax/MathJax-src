import './lib/chtml-output.js';

import {combineDefaults} from '../../../mathjax3/components/global.js';
import {CHTML} from '../../../mathjax3/output/chtml.js';

if (MathJax.loader) {
    combineDefaults(MathJax.config.loader, 'chtml-output', {
        checkReady() {
            return MathJax.loader.load("chtml-fonts/tex");
        }
    });
}

if (MathJax.startup) {
    MathJax.startup.registerConstructor('chtml', CHTML);
    MathJax.startup.useOutput('chtml');
}
