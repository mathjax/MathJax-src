import { MathJax, combineDefaults } from '#js/components/global.js';
import { Package } from '#js/components/package.js';
import { mathjax } from '#js/mathjax.js';
import { isCJS } from '#js/util/context.js';
import { resolvePath } from '#js/util/AsyncLoad.js';

export async function setup() {
  const CONFIG = MathJax.config.loader;
  const { REQUIRE, path, source } = await import(/* webpackIgnore: true */ './data.cjs');
  //
  // If the path was not able to be determined, try to find the mathjax packages
  // and use those if found.  The user can still override it.
  //
  if (CONFIG.paths.mathjax === '/' || CONFIG.paths.mathjax === 'file:///') {
    try {
      REQUIRE.resolve('@mathjax/src/package.json');
      CONFIG.paths.mathjax = '@mathjax/src/bundle';
    } catch (_) {
      try {
        REQUIRE.resolve('mathjax/package.json');
        CONFIG.paths.mathjax = '@mathjax';
      } catch (_) {}
    }
  }
  //
  // If we are loading from the components main directory,
  // load the source file mapping into the source configuration,
  //   and set the paths for mathjax and sre.
  //
  if (source) {
    CONFIG.source = await source();
  }
  //
  // If asyncLoad hasn't been specified, use REQUIRE
  //
  if (!mathjax.asyncLoad) {
    mathjax.asyncLoad = function (name) {
      if (name.substring(0, 5) !== 'node:') {
        name = Package.resolvePath(name);
      }
      return REQUIRE(
        resolvePath(name, (file) => path.resolve(CONFIG.paths.mathjax, file))
      );
    };
    mathjax.asyncIsSynchronous = true;
  }
  //
  // Use dynamic imports for require.
  //
  combineDefaults(MathJax.config, 'loader', {
    require: (file) => REQUIRE(file),
  });
}

export const adaptor = 'adaptors/liteDOM';
