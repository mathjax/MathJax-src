import './lib/semantic-enrich.js';

import {combineDefaults} from '#js/components/global.js';
import * as Sre from '#js/a11y/sre.js';
import {EnrichHandler} from '#js/a11y/semantic-enrich.js';
import {MathML} from '#js/input/mathml.js';
import {Package} from '#js/components/package.js';
import {hasWindow} from '#js/util/context.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config.loader, 'a11y/semantic-enrich', {
    checkReady: () => Sre.sreReady(),
  });

  let path = Package.resolvePath('[sre]', false);
  if (!hasWindow) {
    // In Node get the absolute path to the pool file.
    try {
      const require = MathJax.config.loader.require;
      path = require.resolve(path, MathJax.config.options.worker.pool).replace(/\/.*?$/, '');
    } catch(_err) { }
  }
  combineDefaults(MathJax.config, 'options', { worker: { path } });
}

if (MathJax.startup) {
  MathJax.startup.extendHandler(
    handler => EnrichHandler(handler, new MathML({allowHtmlInTokenNodes: true}))
  );
}
