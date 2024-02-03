import './lib/eulerieee.js';
import {MathJax, combineDefaults} from 'mathjax-full/js/components/global.js';

const FONTPATH = (typeof document === 'undefined' ?
                   '@mathjax/ieee-euler-font-extension' :
                   'https://cdn.jsdelivr.net/npm/ieee-euler-font-extension');

if (MathJax.config?.loader) {
  combineDefaults(MathJax.config.loader, 'paths', {
    'ieee-euler-extension': FONTPATH
  });
  MathJax.config.loader['[tex]/eulerieee'] = {
    checkReady() {
      return MathJax.loader.load(`[ieee-euler-extension]/${MathJax.config?.startup?.output || 'chtml'}`);
    }
  };
}
