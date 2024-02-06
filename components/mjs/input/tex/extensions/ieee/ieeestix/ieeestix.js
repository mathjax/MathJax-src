import './lib/ieeestix.js';
import {MathJax, combineDefaults} from 'mathjax-full/js/components/global.js';

// Temporary for local testing!
// const FONTPATH = 'node_modules/mathjax-stix2-font';
const FONTPATH = (typeof document === 'undefined' ?
                   '@mathjax/mathjax-stix2-font' :
                   'https://cdn.jsdelivr.net/npm/mathjax-stix2-font');

combineDefaults(MathJax.config, 'loader', {
  paths: {
    'mathjax-stix2': FONTPATH
  },
  '[tex]/ieeestix': {
    checkReady() {
      const jax = MathJax.config.startup.output;
      return MathJax.loader.load(`[mathjax-stix2]/${jax}.js`).then(() => {
        MathJax.config.output.font = '[mathjax-stix2]';
        Object.assign(MathJax.config[jax], {
          dynamicPrefix: '[mathjax-stix2]/chtml/dynamic',
          fontData: MathJax._.output.fonts['mathjax-stix2'][jax + '_ts'].MathJaxStix2Font
        });
        if (jax === 'chtml') {
          Object.assign(MathJax.config[jax], {
            fontURL: FONTPATH + '/chtml/woff',
          });
        }
      });
    }
  }
});
