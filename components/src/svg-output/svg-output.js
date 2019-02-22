const combineDefaults = require('../../../mathjax3/components/global.js').combineDefaults;
require('./lib/svg-output.js');

if (MathJax.loader) {
    combineDefaults(MathJax.config.loader, 'svg-output', {
        checkReady() {
            return MathJax.loader.load("svg-fonts/tex");
        }
    });
}

if (MathJax.startup) {
    MathJax.startup.registerConstructor('svg', MathJax._.output.svg_ts.SVG);
    MathJax.startup.useOutput('svg');
}
