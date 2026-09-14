import './hasown.js'; // Can be removed with ES2024 implementation of Object.hasown
import '../core/locale.js';
import './lib/startup.js';
import '../core/core.js';

import {combineDefaults} from '#js/components/global.js';
import {dependencies, paths, provides, compatibility} from '../dependencies.js';
import {Loader, CONFIG} from '#js/components/loader.js';
import {Locale} from '#js/util/Locale.js';

Loader.preLoaded('loader', 'startup', 'core');

combineDefaults(MathJax.config.loader, 'dependencies', dependencies);
combineDefaults(MathJax.config.loader, 'paths', paths);
combineDefaults(MathJax.config.loader, 'provides', provides);
combineDefaults(MathJax.config.loader, 'source', compatibility);

/**
 * Perform the startup actions:
 * - Set the locale
 * - Load the configured components
 * - Perform the ready action, if any
 * - Do the loader's ready() function
 * - If an error, do the loader's failed() function
 * - If that throws an error, reject the startup promise
 */
export function startup(ready) {
  let locale = MathJax.config.locale ?? Locale.current;
  try { locale = localStorage.getItem('MathJax-locale') ?? locale; } catch (_err) {}
  const load = CONFIG.load;
  CONFIG.load = [];
  return Locale.setLocale(locale)
               .then(() => Loader.load(...load))
               .then(() => (ready || function () {})())
               .then(() => CONFIG.ready())
               .then(() => CONFIG.load = load)
               .catch((error) => CONFIG.failed(error))
               .catch((error) => MathJax.startup.promiseReject(error));
}

/**
 * Use the checkReady() function for the component to wait for the
 * startup actions to complete before the component is considered
 * fully loaded.
 */
export function readyAfter(component, startup) {
  const load = new Promise((resolve) => {
    MathJax.config.loader[component] ??= {};
    const config = MathJax.config.loader[component];
    const ready = config.checkReady;
    config.checkReady =
      () => load.then(() => {
        if (ready) {
          config.checkReady = ready;
          return ready();
        }
      });
    startup().then(resolve);
  });
  return load;
}
