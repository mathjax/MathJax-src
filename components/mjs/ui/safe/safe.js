import './lib/safe.js';

import {SafeHandler} from '#js/ui/safe/SafeHandler.js';

if (MathJax.startup) {
  MathJax.startup.extendHandler(handler => SafeHandler(handler));
}
