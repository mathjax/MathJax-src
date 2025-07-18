import {combineDefaults} from '#js/components/global.js';
import {hasWindow} from '#js/util/context.js';

export function fontExtension(id, name, pkg = `@mathjax/${name}`) {
  if (MathJax.loader) {
    const FONTPATH = hasWindow ? `https://cdn.jsdelivr.net/npm/${pkg}` : pkg;
    const path = name.replace(/-font-extension$/, '-extension');
    const jax = (MathJax.config?.startup?.output || 'chtml');
    combineDefaults(MathJax.config.loader, 'paths', {[path]: FONTPATH});
    combineDefaults(MathJax.config.loader, 'dependencies', {[`[${path}]/${jax}`]: [`output/${jax}`]});
    MathJax.loader.addPackageData(id, {
      extraLoads: [`[${path}]/${jax}`],
      rendererExtensions: [path]
    });
  }
}
