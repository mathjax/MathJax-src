import { EMPTY } from '@mathjax/src/mjs/types/Types.js';
import { COMPONENT_LIST } from '@mathjax/src/mjs/types/mjx.js';
import { LITE_DOM, MATHJAX_CONFIG, MATHJAX_OBJECT } from '@mathjax/src/mjs/types/dom/lite.js';

export function init<T extends COMPONENT_LIST<LITE_DOM> = EMPTY>(
  config: MATHJAX_CONFIG<T | 'startup'>
): Promise<MATHJAX_OBJECT<T | 'startup'>>;
