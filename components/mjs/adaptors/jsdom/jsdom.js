import './lib/jsdom.js';

import {jsdomAdaptor} from '#js/adaptors/jsdomAdaptor.js';

if (MathJax.startup) {
  MathJax.startup.registerConstructor(
    'jsdomAdaptor',
    (options) => jsdomAdaptor(MathJax.config.JSDOM, options)
  );
  MathJax.startup.useAdaptor('jsdomAdaptor', true);
}
