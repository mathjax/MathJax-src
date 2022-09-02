import './lib/chtml.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {CHTML} from '../../../../js/output/chtml.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config, 'chtml', MathJax.config.output || {});
  combineDefaults(MathJax.config.loader, 'output/chtml', {
    checkReady() {
      let font = MathJax.config.chtml.font || 'tex';
      if (typeof(font) !== 'string') {
        MathJax.config.chtml.fontData = font;
        MathJax.config.chtml.font = font = font.NAME;
      }
      if (font.charAt(0) !== '[') {
        const name = (font.match(/^[a-z]+:/) ? (font.match(/[^/:\\]*$/) || ['chtml'])[0] : font);
        MathJax.config.loader.paths[name + '-font'] = (name === font ? '[mathjax]/output/fonts/' + font : font);
        font = `[${name}-font]`;
      }
      return MathJax.loader.load(`${font}/chtml`);
    }
  });
}

if (MathJax.startup) {
  MathJax.startup.registerConstructor('chtml', CHTML);
  MathJax.startup.useOutput('chtml');
}
