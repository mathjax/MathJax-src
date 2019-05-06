import './lib/core.js';

import {HTMLHandler} from '../../../mathjax3/handlers/html/HTMLHandler.js';
import {browserAdaptor} from '../../../mathjax3/adaptors/browserAdaptor.js';

if (MathJax.startup) {
    MathJax.startup.registerConstructor('HTMLHandler', HTMLHandler);
    MathJax.startup.registerConstructor('browserAdaptor', browserAdaptor);
    MathJax.startup.useHandler('HTMLHandler');
    MathJax.startup.useAdaptor('browserAdaptor');
}
if (MathJax.loader) {
    MathJax._.mathjax.MathJax.asyncLoad = (name => MathJax.loader.load(name));
}
