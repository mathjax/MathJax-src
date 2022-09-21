import './lib/startup.js';

import {combineDefaults} from '../../../js/components/global.js';
import {dependencies, paths, provides, compatibility} from '../dependencies.js';
import {Loader, CONFIG} from '../../../js/components/loader.js';

Loader.preLoad('loader', 'startup');

combineDefaults(MathJax.config.loader, 'dependencies', dependencies);
combineDefaults(MathJax.config.loader, 'paths', paths);
combineDefaults(MathJax.config.loader, 'provides', provides);
combineDefaults(MathJax.config.loader, 'source', compatibility);

export function startup() {
  return Loader.load(...CONFIG.load)
               .then(() => CONFIG.ready())
               .catch(error => CONFIG.failed(error));
}

