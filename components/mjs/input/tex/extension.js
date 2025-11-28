import {combineDefaults} from '#js/components/global.js';

export function fontExtension(id, name, pkg = `[fonts]/${name}`) {
  if (MathJax.loader) {
    const path = name.replace(/-font-extension$/, '-extension');
    const jax = (MathJax.config?.startup?.output || 'chtml');
    combineDefaults(MathJax.config.loader, 'paths', {[path]: pkg});
    if (!MathJax._.output?.[jax]) {
      combineDefaults(MathJax.config.loader, 'dependencies', {[`[${path}]/${jax}`]: [`output/${jax}`]});
    }
    MathJax.loader.addPackageData(id, {
      extraLoads: [`[${path}]/${jax}`],
      rendererExtensions: [path]
    });
  }
}
