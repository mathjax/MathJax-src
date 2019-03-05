import './lib/loader.js';

import {Loader, CONFIG} from '../../../mathjax3/components/loader.js';
import {combineDefaults} from '../../../mathjax3/components/global.js';
import {dependencies} from '../dependencies.js';

combineDefaults(MathJax.config.loader, 'dependencies', dependencies);

Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .catch((message, name) => CONFIG.failed(message, name));
