const combineDefaults = require('../../../mathjax3/components/global.js').combineDefaults;
require('./lib/chtml-output.js');

if (MathJax.loader) {
    combineDefaults(MathJax.config.loader, 'chtml-output', {
        checkReady() {
            return MathJax.loader.load("chtml-fonts/tex");
        }
    });
}

if (MathJax.startup) {
    MathJax.startup.registerConstructor('chtml', MathJax._.output.chtml_ts.CHTML);
    MathJax.startup.useOutput('chtml');
}
