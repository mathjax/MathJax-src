import './lib/dsfont.js';
import {MathJax, combineDefaults} from 'mathjax-full/js/components/global.js';

const FONTPATH = (typeof document === 'undefined' ?
                   '@mathjax/mathjax-dsfont-font-extension' :
                   'https://cdn.jsdelivr.net/npm/mathjax-dsfont-font-extension');

if (MathJax.config?.loader) {
  combineDefaults(MathJax.config.loader, 'paths', {
    'mathjax-dsfont-extension': FONTPATH
  });
  MathJax.config.loader['[tex]/dsfont'] = {
    checkReady() {
      return MathJax.loader.load(`[mathjax-dsfont-extension]/${MathJax.config?.startup?.output || 'chtml'}`);
    }
  };
}
