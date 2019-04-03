require('./lib/tex-input.js');

if (MathJax.startup) {
    MathJax.startup.registerConstructor('tex', MathJax._.input.tex_ts.TeX);
    MathJax.startup.useInput('tex');
}
