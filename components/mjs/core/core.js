import './locale.js';
import './lib/core.js';

import {HTMLHandler} from '#js/handlers/html/HTMLHandler.js';
import {browserAdaptor} from '#js/adaptors/browserAdaptor.js';
import {Package} from '#js/components/package.js';

if (MathJax.startup) {
  MathJax.startup.registerConstructor('HTMLHandler', HTMLHandler);
  MathJax.startup.registerConstructor('browserAdaptor', browserAdaptor);
  MathJax.startup.useHandler('HTMLHandler');
  MathJax.startup.useAdaptor('browserAdaptor');
}
if (MathJax.loader) {
  MathJax._.mathjax.mathjax.asyncLoad = (name => {
    if (name.match(/\.json$/)) {
      if (name.charAt(0) === '[') {
        name = Package.resolvePath(name);
      }
      return fetch(name).then(response => response.json());
    }
    return MathJax.loader.load(name);
  });
}
