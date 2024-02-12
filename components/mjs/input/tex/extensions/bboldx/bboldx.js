import './lib/bboldx.js';
import {MathJax, combineDefaults} from 'mathjax-full/js/components/global.js';

const FONTPATH = (typeof document === 'undefined' ?
                   '@mathjax/mathjax-bboldx-font-extension' :
                   'https://cdn.jsdelivr.net/npm/mathjax-bboldx-font-extension');

if (MathJax.config?.loader) {
  combineDefaults(MathJax.config.loader, 'paths', {
    'mathjax-bboldx-extension': FONTPATH
  });
  MathJax.config.loader['[tex]/bboldx'] = {
    checkReady() {
      return MathJax.loader.load(`[mathjax-bboldx-extension]/${MathJax.config?.startup?.output || 'chtml'}`);
    }
  };
}
