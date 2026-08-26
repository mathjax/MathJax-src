import { DOM } from '../Types.js';
import { COMPONENT_LIST, MJX, MJX_OBJECT, MJX_CONFIG } from '../mjx.js';

/**
 * The HTML DOM elements
 */
export type N = HTMLElement;
export type T = Text;
export type D = Document;
export type HTML_DOM = DOM<N, T, D>;

/**
 * The type for the MathJax object based on a collection of component names.
 * This is for both configuration and after Mathjax is loaded.
 *
 * @template T   The union of component names, array of names, or definitions.
 */
export type MATHJAX<T extends COMPONENT_LIST<HTML_DOM>> = MJX<T, HTML_DOM>;

/**
 * The type for the completed MathJax object (after MathJax is loaded).
 *
 * @template T   The union of component names, array of names, or definitions.
 */
/* prettier-ignore */
export type MATHJAX_OBJECT<T extends COMPONENT_LIST<HTML_DOM>> = MJX_OBJECT<T, HTML_DOM>;

/**
 * The type for the MathJax object as a config object (before loading MathJax).
 *
 * @template T   The union of component names, array of names, or definitions.
 */
/* prettier-ignore */
export type MATHJAX_CONFIG<T extends COMPONENT_LIST<HTML_DOM>> = MJX_CONFIG<T, HTML_DOM>;
