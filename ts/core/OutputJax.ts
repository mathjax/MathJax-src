/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @file  Implements the interface and abstract class for the OutputJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { userOptions, defaultOptions, OptionList } from '../util/Options.js';
import { MathDocument } from './MathDocument.js';
import { MathItem } from './MathItem.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import { FunctionList } from '../util/FunctionList.js';
import type { DOM, DOM_TYPES, N } from '../types/Types.js';
import type { FilterFunctions, FilterFunctionList } from './FilterFunctions.js';

/*****************************************************************/
/**
 *  The OutputJax interface
 *
 * @template DOM   The DOM node types
 */
export interface OutputJax<DOM extends DOM_TYPES> {
  /**
   * The name of this output jax class
   */
  name: string;

  /**
   * The options for the instance
   */
  options: OptionList;

  /**
   * List of pre-filters to call after typesetting the math
   */
  preFilters: FunctionList;

  /**
   * List of post-filters to call before typesetting the math
   */
  postFilters: FunctionList;

  /**
   * The DOM adaptor for managing HTML elements
   */
  adaptor: DOMAdaptor<DOM>;

  /**
   * @param {DOMAdaptor} adaptor The adaptor to use in this jax
   */
  setAdaptor(adaptor: DOMAdaptor<DOM>): void;

  /**
   * Do any initialization that depends on the document being set up
   */
  initialize(): void;

  /**
   * Reset any needed features of the output jax
   *
   * @param {any[]} args   The arguments needed by the reset operation
   */
  reset(...args: any[]): void;

  /**
   * Typset a given MathItem
   *
   * @param {MathItem} math          The MathItem to be typeset
   * @param {MathDocument} document  The MathDocument in which the typesetting should occur
   * @returns {N}                    The DOM tree for the typeset math
   */
  typeset(math: MathItem<DOM>, document?: MathDocument<DOM>): N<DOM>;

  /**
   * Handle an escaped character (e.g., \$ from the TeX input jax preventing it from being a delimiter)
   *
   * @param {MathItem} math          The MathItem to be escaped
   * @param {MathDocument} document  The MathDocument in which the math occurs
   * @returns {N}                    The DOM tree for the escaped item
   */
  escaped(math: MathItem<DOM>, document?: MathDocument<DOM>): N<DOM>;

  /**
   * Get the metric information for all math in the given document
   *
   * @param {MathDocument} document  The MathDocument being processed
   */
  getMetrics(document: MathDocument<DOM>): void;

  /**
   * Produce the stylesheet needed for this output jax
   *
   * @param {MathDocument} document  The MathDocument being processed
   */
  styleSheet(document: MathDocument<DOM>): N<DOM>;

  /**
   * Produce any page-specific elements needed for this output jax
   *
   * @param {MathDocument} document  The MathDocument being processed
   */
  pageElements(document: MathDocument<DOM>): N<DOM>;
}

/**
 * The OutputJax option types.
 */
export type OUTPUTJAX_OPTIONS<
  D extends DOM_TYPES = DOM,
  PRE = any,
  POST = PRE,
> = {
  preFilters: FilterFunctionList<PRE, D>;
  postFilters: FilterFunctionList<POST, D>;
};

/*****************************************************************/
/**
 *  The OutputJax abstract class
 *
 * @template DOM   The DOM node types
 */
export abstract class AbstractOutputJax<
  DOM extends DOM_TYPES,
> implements OutputJax<DOM> {
  /**
   * The name for the output jax
   */
  public static NAME: string = 'generic';

  /**
   * The default options for the output jax
   */
  public static OPTIONS: OUTPUTJAX_OPTIONS = {
    preFilters: [],
    postFilters: [],
  };

  /**
   * The actual options supplied to the output jax
   */
  public options: OptionList;

  /**
   * Filters to run before the output is processed
   */
  public preFilters: FilterFunctions<N<DOM>, DOM>;

  /**
   * Filters to run after the output is processed
   */
  public postFilters: FilterFunctions<N<DOM>, DOM>;

  /**
   * The MathDocument's DOMAdaptor
   */
  public adaptor: DOMAdaptor<DOM> = null; // set by the handler

  /**
   * @param {OptionList} options  The options for this instance
   */
  constructor(options: OptionList = {}) {
    const CLASS = this.constructor as typeof AbstractOutputJax;
    this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
    this.preFilters = new FunctionList(this.options.preFilters);
    this.postFilters = new FunctionList(this.options.postFilters);
  }

  /**
   * @returns {string}  The name for this output jax class
   */
  public get name(): string {
    return (this.constructor as typeof AbstractOutputJax).NAME;
  }

  /**
   * @override
   */
  public setAdaptor(adaptor: DOMAdaptor<DOM>) {
    this.adaptor = adaptor;
  }

  /**
   * @override
   */
  public initialize() {}

  /**
   * @override
   */
  public reset(..._args: any[]) {}

  /**
   * @override
   */
  public abstract typeset(
    math: MathItem<DOM>,
    document?: MathDocument<DOM>
  ): N<DOM>;

  /**
   * @override
   */
  public abstract escaped(
    math: MathItem<DOM>,
    document?: MathDocument<DOM>
  ): N<DOM>;

  /**
   * @override
   */
  public getMetrics(_document: MathDocument<DOM>) {}

  /**
   * @override
   */
  public styleSheet(_document: MathDocument<DOM>) {
    return null as N<DOM>;
  }

  /**
   * @override
   */
  public pageElements(_document: MathDocument<DOM>) {
    return null as N<DOM>;
  }

  /**
   * Execute a set of filters, passing them the MathItem and any needed data,
   *  and return the (possibly modified) data
   *
   * @param {FunctionList} filters   The list of functions to be performed
   * @param {MathItem} math          The math item that is being processed
   * @param {MathDocument} document  The math document contaiing the math item
   * @param {any} data               Whatever other data is needed
   * @returns {any}                  The (possibly modified) data
   */
  protected executeFilters(
    filters: FunctionList,
    math: MathItem<DOM>,
    document: MathDocument<DOM>,
    data: any
  ): any {
    const args = { math, document, data };
    filters.execute(args);
    return args.data;
  }
}
