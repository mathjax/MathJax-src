import './lib/startup.js';

import {Loader, CONFIG} from '../../../mathjax3/components/loader.js';
import {combineDefaults} from '../../../mathjax3/components/global.js';
import {dependencies, paths, provides} from '../dependencies.js';

combineDefaults(MathJax.config.loader, 'dependencies', dependencies);
combineDefaults(MathJax.config.loader, 'paths', paths);
combineDefaults(MathJax.config.loader, 'provides', provides);

Loader.preLoad('loader');

Loader.load(...CONFIG.load)
    .then(() => CONFIG.ready())
    .catch(error => CONFIG.failed(error));
