require('./lib/startup.js');
const {Loader, CONFIG} = require('../../../mathjax3/components/loader.js');

Loader.preLoad('loader');

Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .catch(error => CONFIG.failed(error));
