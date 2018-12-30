require('./lib/liteDOM.js');

if (MathJax.startup) {
    MathJax.startup.registerConstructor('liteAdaptor', MathJax._.adaptors.liteAdaptor.liteAdaptor);
    MathJax.config.startup.adaptor = 'liteAdaptor';
}
