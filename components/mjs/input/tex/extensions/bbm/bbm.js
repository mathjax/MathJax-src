import './lib/bbm.js';
import {MathJax, combineDefaults} from 'mathjax-full/js/components/global.js';

const FONTPATH = (typeof document === 'undefined' ?
                   '@mathjax/mathjax-bbm-font-extension' :
                   'https://cdn.jsdelivr.net/npm/mathjax-bbm-font-extension');

if (MathJax.config?.loader) {
  combineDefaults(MathJax.config.loader, 'paths', {
    'mathjax-bbm-extension': FONTPATH
  });
  MathJax.config.loader['[tex]/bbm'] = {
    checkReady() {
      return MathJax.loader.load(`[mathjax-bbm-extension]/${MathJax.config?.startup?.output || 'chtml'}`);
    }
  };
}
