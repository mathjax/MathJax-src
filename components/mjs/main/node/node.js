import { MathJax } from '#js/components/global.js';
import { makeInit } from '../browser/browser.js';
import { setup, adaptor } from './setup.js';

export const init = MathJax.init = makeInit(setup, adaptor);
export default MathJax;
