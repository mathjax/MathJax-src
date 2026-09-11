import { MathJax } from '#js/components/global.js';
import { hasWindow } from '#js/util/context.js';
import { setup, adaptor } from './node/setup.js';
import { init as browserInit, makeInit } from './browser/browser.js';

MathJax.init = hasWindow ? browserInit : makeInit(setup, adaptor);

export { MathJax };
export const init = MathJax.init;
