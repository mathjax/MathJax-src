import './lib/svg.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {SVG} from '../../../../js/output/svg.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config.loader, 'output/svg', {
    checkReady() {
      let font = MathJax.config.svg.font || 'tex';
      if (typeof(font) !== 'string') {
        MathJax.config.svg.fontData = font;
        MathJax.config.svg.font = font = 'tex';
      }
      return MathJax.loader.load(font.match(/^[\[\/]|^[a-z]+:/) ? font : 'output/svg/fonts/' + font);
    }
  });
}

if (MathJax.startup) {
  MathJax.startup.registerConstructor('svg', SVG);
  MathJax.startup.useOutput('svg');
}
