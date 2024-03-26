import './lib/explorer.js';

import {ExplorerHandler} from '#js/a11y/explorer.js';

if (MathJax.startup && typeof window !== 'undefined') {
  MathJax.startup.extendHandler(handler => ExplorerHandler(handler));
}
