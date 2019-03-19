import './lib/explorer.js';

import {combineDefaults} from '../../../../mathjax3/components/global.js';
import {ExplorerHandler} from '../../../../mathjax3/a11y/explorer.js';

if (MathJax.startup) {
    MathJax.startup.extendHandler(handler => ExplorerHandler(handler));
}
