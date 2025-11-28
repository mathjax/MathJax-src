import './hasown.js'; // Can be removed with ES2024 implementation of Object.hasown
import './lib/startup.js';

import {combineDefaults} from '#js/components/global.js';
import {dependencies, paths, provides, compatibility} from '../dependencies.js';
import {Loader, CONFIG} from '#js/components/loader.js';

Loader.preLoaded('loader', 'startup');

combineDefaults(MathJax.config.loader, 'dependencies', dependencies);
combineDefaults(MathJax.config.loader, 'paths', paths);
combineDefaults(MathJax.config.loader, 'provides', provides);
combineDefaults(MathJax.config.loader, 'source', compatibility);

export function startup(ready) {
  return Loader.load(...CONFIG.load)
               .then(() => (ready || function () {})())
               .then(() => CONFIG.ready())
               .catch(error => CONFIG.failed(error));
}
