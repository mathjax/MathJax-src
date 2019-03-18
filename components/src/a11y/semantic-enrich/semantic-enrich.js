import './lib/semantic-enrich.js';

import {combineDefaults} from '../../../../mathjax3/components/global.js';
import {sreReady} from '../../../../mathjax3/a11y/sre.js';
import {EnrichHandler} from '../../../../mathjax3/a11y/semantic-enrich.js';
import {MathML} from '../../../../mathjax3/input/mathml.js';

if (MathJax.loader) {
    combineDefaults(MathJax.config.loader, 'a11y/semantic-enrich', {checkReady: () => sreReady});
}

if (MathJax.startup) {
    MathJax.startup.extendHandler(handler => EnrichHandler(handler, new MathML()));
}
