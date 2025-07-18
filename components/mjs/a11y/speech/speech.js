import './lib/speech.js';

import {combineDefaults} from '#js/components/global.js';
import {Package} from '#js/components/package.js';
import {hasWindow} from '#js/util/context.js';
import {SpeechHandler} from '#js/a11y/speech.js';

if (MathJax.loader) {
  let path = Package.resolvePath('[sre]', false);
  let maps = Package.resolvePath('[mathmaps]', false);
  if (hasWindow) {
    path = new URL(path, location).href;
    maps = new URL(maps, location).href;
  } else {
    const REQUIRE = typeof require !== 'undefined' ? require : MathJax.config.loader.require;
    if (REQUIRE?.resolve) {
      path = REQUIRE.resolve(`${path}/require.mjs`).replace(/\/[^\/]*$/, '');
      maps = REQUIRE.resolve(`${maps}/base.json`).replace(/\/[^\/]*$/, '');
    } else {
      path = maps = '';
    }
  }
  if (path) {
    combineDefaults(MathJax.config, 'options', { worker: { path, maps } });
  }
}

if (MathJax.startup) {
  MathJax.startup.extendHandler(handler => SpeechHandler(handler));
}
