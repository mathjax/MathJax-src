import './lib/semantic-enrich.js';

import {combineDefaults} from '#js/components/global.js';
import {EnrichHandler} from '#js/a11y/semantic-enrich.js';
import {MathML} from '#js/input/mathml.js';

if (MathJax.startup) {
  MathJax.startup.extendHandler(
    handler => EnrichHandler(handler, new MathML({allowHtmlInTokenNodes: true}))
  );
}
