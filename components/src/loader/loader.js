import './lib/loader.js';

import {Loader, CONFIG} from '../../../mathjax3/components/loader.js';

Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .catch((message, name) => CONFIG.failed(message, name));
