require('./lib/semantic-enrich.js');

if (MathJax.loader) {
    const sreReady = require('./lib/a11y/sre.js').sreReady;
    const combineDefaults = require('../../../../mathjax3/components/global.js').combineDefaults;
    combineDefaults(MathJax.config.loader, 'a11y/semantic-enrich', {checkReady: () => sreReady});
}
