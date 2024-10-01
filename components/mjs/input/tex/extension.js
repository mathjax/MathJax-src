import {combineDefaults} from '#js/components/global.js';

export function fontExtension(id, name, pkg = `@mathjax/${name}`) {
  if (MathJax.loader) {
    const FONTPATH = (typeof document === 'undefined' ? pkg : `https://cdn.jsdelivr.net/npm/${name}`);
    const path = name.replace(/-font-extension$/, '-extension');
    const extension = name.replace(/-font-extension$/, '');
    const jax = (MathJax.config?.startup?.output || 'chtml');
    combineDefaults(MathJax.config.loader, 'paths', {[path]: FONTPATH});
    combineDefaults(MathJax.config.loader, 'dependencies', {[`[${path}]/${jax}`]: [`output/${jax}`]});
    MathJax.loader.addPackageData(id, {
      extraLoads: [`[${path}]/${jax}`],
      rendererExtensions: [path]
    });
  }
}
