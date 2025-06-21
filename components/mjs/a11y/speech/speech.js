import './lib/speech.js';

import {combineDefaults} from '#js/components/global.js';
import {Package} from '#js/components/package.js';
import {hasWindow} from '#js/util/context.js';
import {SpeechHandler} from '#js/a11y/speech.js';

if (MathJax.loader) {
  let path = Package.resolvePath('[sre]', false);
  if (!hasWindow) {
    const REQUIRE = typeof require !== 'undefined' ? require : MathJax.config.loader.require;
    if (REQUIRE?.resolve) {
      const pool = MathJax.config.options?.worker?.pool || 'speech-workerpool.js';
      path = path.replace(/\/bundle\/sre$/, '/cjs/a11y/sre');
      path = REQUIRE.resolve(`${path}/${pool}`).replace(/\/[^\/]*$/, '');
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
