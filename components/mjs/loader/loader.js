import './lib/loader.js';
import '../core/core.js';

import {Loader, CONFIG} from '#js/components/loader.js';
import {combineDefaults} from '#js/components/global.js';
import {dependencies, paths, provides} from '../dependencies.js';
import {Locale} from '#js/util/Locale.js';

Loader.preLoaded('loader', 'core');

combineDefaults(MathJax.config.loader, 'dependencies', dependencies);
combineDefaults(MathJax.config.loader, 'paths', paths);
combineDefaults(MathJax.config.loader, 'provides', provides);

let locale = MathJax.config.locale ?? Locale.current;
try { locale = localStorage.getitem('MathJax-locale') ?? locale; } catch (_err) {}
Locale.setLocale(locale)
  .then(() => Loader.load(...CONFIG.load))
  .then(() => CONFIG.ready())
  .catch((message, name) => CONFIG.failed(message, name));
