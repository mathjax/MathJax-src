import './lib/explorer.js';

import {combineDefaults} from '../../../../mathjax3/components/global.js';
import {sreReady} from '../../../../mathjax3/a11y/sre.js';
import {ExplorerHandler} from '../../../../mathjax3/a11y/explorer.js';

if (MathJax.loader) {
    combineDefaults(MathJax.config.loader, 'a11y/explorer', {checkReady: () => sreReady});
}

if (MathJax.startup) {
    MathJax.startup.extendHandler(handler => ExplorerHandler(handler));
}
