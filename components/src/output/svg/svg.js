import './lib/svg.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {SVG} from '../../../../js/output/svg.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config, 'svg', MathJax.config.output || {});
  combineDefaults(MathJax.config.loader, 'output/svg', {
    checkReady() {
      let font = MathJax.config.svg.font || 'tex';
      if (typeof(font) !== 'string') {
        MathJax.config.svg.fontData = font;
        MathJax.config.svg.font = font = font.NAME;
      }
      if (font.charAt(0) !== '[') {
        const name = (font.match(/^[a-z]+:/) ? (font.match(/[^/:\\]*$/) || ['svg-font'])[0] : font);
        MathJax.config.loader.paths[name] = (name === font ? '[mathjax]/output/fonts/' + font : font);
        font = `[${name}]`;
      }
      return MathJax.loader.load(`${font}/svg`);
    }
  });
}

if (MathJax.startup) {
  MathJax.startup.registerConstructor('svg', SVG);
  MathJax.startup.useOutput('svg');
}
