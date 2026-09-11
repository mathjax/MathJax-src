import { MathJax } from '#js/components/global.js';
import { makeInit } from '../browser/browser.js';
import { setup, adaptor } from './setup.js';

export default MathJax;
export const init = makeInit(setup, adaptor);
