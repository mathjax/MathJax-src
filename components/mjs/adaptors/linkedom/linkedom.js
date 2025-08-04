import './lib/linkedom.js';

import {linkedomAdaptor} from '#js/adaptors/linkedomAdaptor.js';

if (MathJax.startup) {
  MathJax.startup.registerConstructor(
    'linkedomAdaptor',
    (options) => linkedomAdaptor(MathJax.config.LINKEDOM, options)
  );
  MathJax.startup.useAdaptor('linkedomAdaptor', true);
}
