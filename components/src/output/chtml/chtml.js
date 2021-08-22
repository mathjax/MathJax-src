import './lib/chtml.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {CHTML} from '../../../../js/output/chtml.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config.loader, 'output/chtml', {
    checkReady() {
      let font = MathJax.config.svg.font || 'tex';
      if (typeof(font) !== 'string') {
        MathJax.config.svg.fontData = font;
        MathJax.config.svg.font = font = 'tex';
      }
      return MathJax.loader.load(font.match(/^[\[\/]|^[a-z]+:/) ? font : 'output/chtml/fonts/' + font);
    }
  });
}

if (MathJax.startup) {
  MathJax.startup.registerConstructor('chtml', CHTML);
  MathJax.startup.useOutput('chtml');
}
