const combineWithMathJax = require('../../../mathjax3/components/global.js').combineWithMathJax;
require('./lib/chtml-output.js');

if (MathJax.loader) {
    const config = MathJax.config.loader['chtml-output'];
    MathJax.config.loader['chtml-output'] = {
        checkReady() {
            return MathJax.loader.load("chtml-fonts/tex");
        }
    };
    if (config) {
        combineWithMathJax({config: {loader: {'chtml-output': config}}});
    }
}

if (MathJax.startup) {
    MathJax.startup.registerConstructor('chtml', MathJax._.output.chtml_ts.CHTML);
    MathJax.startup.useOutput('chtml');
}
