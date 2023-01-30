import {combineDefaults, combineWithMathJax} from '../../../js/components/global.js';
import {Package} from "../../../js/components/package.js";

export const FONTPATH = (typeof document === 'undefined' ?
                         '@mathjax/%%FONT%%-font/es5' :
                         'https://cdn.jsdelivr.net/npm/%%FONT%%-font/es5');

export const OutputUtil = {
  config(jax, jaxClass, defaultFont, fontClass) {

    if (MathJax.loader) {

      combineDefaults(MathJax.config, jax, MathJax.config.output || {});

      let config = MathJax.config[jax];
      let font = config.font || defaultFont;
      if (typeof(font) !== 'string') {
        config.fontData = font;
        config.font = font = font.NAME;
      }

      if (font.charAt(0) !== '[') {
        const path = (config.fontPath || FONTPATH);
        const name = (font.match(/^[a-z]+:/) ? (font.match(/[^/:\\]*$/) || [jax])[0] : font);
        combineDefaults(MathJax.config.loader, 'paths', {
          [name]: (name === font ? path.replace(/%%FONT%%/g, font) : font)
        });
        font = `[${name}]`;
      }
      const name = font.substr(1, font.length - 2);

      if (name !== defaultFont) {

        combineDefaults(MathJax.config.loader, `output/${jax}`, {
          checkReady() {
            return MathJax.loader.load(`${font}/${jax}`).catch(err => console.log(err));
          }
        });

      } else {

        combineWithMathJax({_: {
          output: {
            fonts: {
              [name]: {
                [jax + '_ts']: {
                  [fontClass.NAME + 'Font']: fontClass
                }
              }
            }
          }
        }});

        combineDefaults(MathJax, 'config', {
          output: {
            font: font,
          },
          [jax]: {
            fontData: fontClass,
            dynamicPrefix: `${font}/${jax}/dynamic`
          }
        });
        if (jax === 'chtml') {
          combineDefaults(MathJax.config, jax, {
            fontURL: Package.resolvePath(`${font}/${jax}/woff`, false),
          });
        }

      }
    }

    if (MathJax.startup) {
      MathJax.startup.registerConstructor(jax, jaxClass);
      MathJax.startup.useOutput(jax);
    }

  },

  loadFont(startup, jax, font, preload) {
    if (!MathJax.loader) {
      return Promise.resolve();
    }
    if (preload) {
      MathJax.loader.preLoad(`[${font}]/${jax}`);
    }
    const check = MathJax.config.loader[`output/${jax}`];
    const start = (check && check.checkReady ? check.checkReady().then(startup) : startup());
    return start.catch(err => console.log(err));
  }

};
