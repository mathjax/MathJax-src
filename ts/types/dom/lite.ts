import { LiteElement } from '../../adaptors/lite/Element.js';
import { LiteDocument } from '../../adaptors/lite/Document.js';
import { LiteText } from '../../adaptors/lite/Text.js';

import { DOM } from '../Types.js';
import { COMPONENT_LIST, MJX, MJX_OBJECT, MJX_CONFIG } from '../mjx.js';

/**
 * The HTML DOM elements
 */
export type N = LiteElement;
export type T = LiteText;
export type D = LiteDocument;
export type LITE_DOM = DOM<N, T, D>;

/**
 * The type for the MathJax object based on a collection of component names.
 * This is for both configuration and after Mathjax is loaded.
 */
export type MATHJAX<T extends COMPONENT_LIST<LITE_DOM>> = MJX<T, LITE_DOM>;

/**
 * The type for the completed MathJax object (after MathJax is loaded).
 */
/* prettier-ignore */
export type MATHJAX_OBJECT<T extends COMPONENT_LIST<LITE_DOM>> = MJX_OBJECT<T, LITE_DOM>;

/**
 * The type for the MathJax object as a config object (before loading MathJax).
 */
/* prettier-ignore */
export type MATHJAX_CONFIG<T extends COMPONENT_LIST<LITE_DOM>> = MJX_CONFIG<T, LITE_DOM>;
