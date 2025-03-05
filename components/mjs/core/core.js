import './lib/core.js';

import {HTMLHandler} from '#js/handlers/html/HTMLHandler.js';
import {browserAdaptor} from '#js/adaptors/browserAdaptor.js';

if (MathJax.startup) {
  MathJax.startup.registerConstructor('HTMLHandler', HTMLHandler);
  MathJax.startup.registerConstructor('browserAdaptor', browserAdaptor);
  MathJax.startup.useHandler('HTMLHandler');
  MathJax.startup.useAdaptor('browserAdaptor');
}
if (MathJax.loader) {
  const config = MathJax.config.loader;
  MathJax._.mathjax.mathjax.asyncLoad = (
    (name) => name.substring(0, 5) === 'node:'
      ? config.require(name)
      : MathJax.loader.load(name).then(result => result[0])
  );
}
