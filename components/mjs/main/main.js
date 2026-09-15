import { MathJax } from '#js/components/global.js';
import { hasWindow } from '#js/util/context.js';
import { setup, adaptor } from './node/setup.js';
import { makeInit } from './browser/browser.js';

if (!hasWindow) {
  MathJax.init = makeInit(setup, adaptor);
}

export const init = MathJax.init;
export default MathJax;

