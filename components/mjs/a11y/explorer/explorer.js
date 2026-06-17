import './lib/explorer.js';

import {ExplorerHandler} from '#js/a11y/explorer.js';
import {hasWindow} from '#js/util/context.js';

if (MathJax.startup && hasWindow) {
  MathJax.startup.extendHandler(handler => ExplorerHandler(handler));
}
