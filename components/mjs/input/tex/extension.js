import {combineDefaults} from '#js/components/global.js';

export function fontExtension(id, name, pkg = `@mathjax/${name}`) {
  if (MathJax.config?.loader) {
    const FONTPATH = (typeof document === 'undefined' ? pkg :
                      `https://cdn.jsdelivr.net/npm/${name}`);
    const path = name.replace(/-font-extension$/, '-extension');
    const extension = name.replace(/-font-extension$/, '');
    combineDefaults(MathJax.config.loader, 'paths', {[path]: FONTPATH});
    MathJax.config.loader[id] = {
      checkReady() {
        return MathJax.loader.load(
          `[${path}]/${MathJax.config?.startup?.output || 'chtml'}`
        ).then(() => {
          MathJax.startup.document?.outputJax?.addExtension(extension);
        });
      }
    };
  }
}
