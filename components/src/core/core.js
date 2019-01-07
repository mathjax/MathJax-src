require('./lib/core.js');

if (MathJax.startup) {
    MathJax.startup.registerConstructor('HTMLHandler', MathJax._.handlers.html.HTMLHandler.HTMLHandler);
    MathJax.startup.registerConstructor('browserAdaptor', MathJax._.adaptors.browserAdaptor.browserAdaptor);
    MathJax.startup.useHandler('HTMLHandler');
    MathJax.startup.useAdaptor('browserAdaptor');
}
if (MathJax.loader) {
    MathJax._.mathjax.MathJax.asyncLoad = (name => MathJax.loader.load(name));
}
