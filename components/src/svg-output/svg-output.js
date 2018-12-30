require('./lib/svg-output.js');

if (MathJax.startup) {
    MathJax.startup.registerConstructor('svg', MathJax._.output.svg_ts.SVG);
    MathJax.startup.useOutput('svg');
}
