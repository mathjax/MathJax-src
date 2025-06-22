import './lib/speech.js';

import {combineDefaults} from '#js/components/global.js';
import {Package} from '#js/components/package.js';
import {hasWindow} from '#js/util/context.js';
import {SpeechHandler} from '#js/a11y/speech.js';

if (MathJax.loader) {
  let path = Package.resolvePath('[sre]', false);
  if (hasWindow) {
    path = new URL(path, location).href;
  } else {
    const REQUIRE = typeof require !== 'undefined' ? require : MathJax.config.loader.require;
    if (REQUIRE?.resolve) {
      path = REQUIRE.resolve(`${path}/require.mjs`).replace(/\/[^\/]*$/, '');
    } else {
      path = '';
    }
  }
  if (path) {
    combineDefaults(MathJax.config, 'options', { worker: { path } });
  }
}

if (MathJax.startup) {
  MathJax.startup.extendHandler(handler => SpeechHandler(handler));
}
