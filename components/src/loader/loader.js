const {Loader, CONFIG} = require('./lib/loader.js');

Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .catch((message, name) => CONFIG.failed(message, name));
