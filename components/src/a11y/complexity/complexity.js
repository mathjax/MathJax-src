require('./lib/complexity.js');
const combineDefaults = require('../../../../mathjax3/components/global.js').combineDefaults;

if (MathJax.loader) {
    const sreReady = require('./lib/a11y/sre.js').sreReady;
    combineDefaults(MathJax.config.loader, 'a11y/complexity', {checkReady: () => sreReady});
}

if (MathJax.startup) {
    const ComplexityHandler = require('./lib/a11y/complexity.js').ComplexityHandler;
    const MathML = require('../../../../mathjax3/input/mathml.js').MathML;
    MathJax.startup.extendHandler(handler => ComplexityHandler(handler, new MathML()));
    MathJax.startup.typesetCall('complexity', 30);
    MathJax.startup.convertCall('complexity', 30);
    combineDefaults(MathJax.config, 'options', MathJax.config['a11y/complexity'] || {});
}
