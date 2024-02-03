import './lib/ieeestix.js';
import {MathJax, combineDefaults} from 'mathjax-full/js/components/global.js';

const FONTPATH = (typeof document === 'undefined' ?
                   '@mathjax/mathjax-stix2-font' :
                   'https://cdn.jsdelivr.net/npm/mathjax-stix2-font');

if (MathJax.config?.loader) {
  combineDefaults(MathJax.config.loader, 'paths', {
    'mathjax-stix2': FONTPATH
  });
  MathJax.config.loader['[tex]/ieeestix'] = {
    checkReady() {
      return MathJax.loader.load(`[mathjax-stix2]/${MathJax.config?.startup?.output || 'chtml'}`);
    }
  };
}
