require('./lib/semantic-enrich.js');

if (MathJax.loader) {
    const sreReady = require('./lib/a11y/sre.js').sreReady;
    const combineDefaults = require('../../../../mathjax3/components/global.js').combineDefaults;
    combineDefaults(MathJax.config.loader, 'a11y/semantic-enrich', {checkReady: () => sreReady});
}

if (MathJax.startup) {
    const EnrichHandler = require('./lib/a11y/semantic-enrich.js').EnrichHandler;
    const MathML = require('../../../../mathjax3/input/mathml.js').MathML;
    MathJax.startup.extendHandler(handler => {
        return EnrichHandler(handler, new MathML());
    });
    MathJax.startup.typesetCall('enrich', 30);
    MathJax.startup.convertCall('enrich', 30);
}
