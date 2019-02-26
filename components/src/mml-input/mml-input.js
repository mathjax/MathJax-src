require('./lib/mml-input.js');

if (MathJax.startup) {
    MathJax.startup.registerConstructor('mml', MathJax._.input.mathml_ts.MathML);
    MathJax.startup.useInput('mml');
}
