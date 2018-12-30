require('../../../mathjax3/components/startup.js');
const {Loader, CONFIG} = require('../../../mathjax3/components/loader.js');

Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .catch((message, name) => CONFIG.failed(message, name));
