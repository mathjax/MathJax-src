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
  const config = MathJax.config.loader;
  const {mathjax} = MathJax._.mathjax;
  mathjax.asyncLoad = (name => {
    if (name.match(/\.json$/)) {
      if (name.charAt(0) === '[') {
        name = Package.resolvePath(name);
      }
      return (config.json || mathjax.json)(name).then((data) => data.default ?? data);
    }
    return name.substring(0, 5) === 'node:'
      ? config.require(name)
      : MathJax.loader.load(name).then(result => result[0]);
  });
}
