require('./lib/chtml-output.js');

if (MathJax.startup) {
    MathJax.startup.registerConstructor('chtml', MathJax._.output.chtml_ts.CHTML);
    MathJax.startup.useOutput('chtml');
}
