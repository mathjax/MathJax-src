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
 * @file  Implements the interface and abstract class for the InputJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MathDocument } from './MathDocument.js';
import { MathItem, ProtoItem } from './MathItem.js';
import { MmlNode } from './MmlTree/MmlNode.js';
import { MmlFactory } from './MmlTree/MmlFactory.js';
import { userOptions, defaultOptions, OptionList } from '../util/Options.js';
import { FunctionList } from '../util/FunctionList.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import type { DOM, DOM_TYPES, N } from '../types/Types.js';
import type { FilterFunctions, FilterFunctionList } from './FilterFunctions.js';

/*****************************************************************/
/**
 *  The InputJax interface
 *
 * @template DOM   THe DOM node types
 */
export interface InputJax<DOM extends DOM_TYPES> {
  /**
   * The name of the input jax subclass (e.g,. 'TeX')
   */
  name: string;

  /**
   * Whether this input jax processes string arrays or DOM nodes
   * (TeX and AsciiMath process strings, MathML processes DOM nodes)
   */
  processStrings: boolean;

  /**
   * The options for this input jax instance
   */
  options: OptionList;

  /**
   * Lists of pre- and post-filters to call before and after processing the input
   */
  preFilters: FilterFunctions<any, DOM>;
  postFilters: FilterFunctions<any, DOM>;

  /**
   * The DOM adaptor for managing HTML elements
   */
  adaptor: DOMAdaptor<DOM>;

  /**
   * The MmlFactory for this input jax
   */
  mmlFactory: MmlFactory;

  /**
   * @param {DOMAdaptor} adaptor The adaptor to use in this jax
   */
  setAdaptor(adaptor: DOMAdaptor<DOM>): void;

  /**
   * @param {MmlFactory} mmlFactory The MmlFactory to use in this jax
   */
  setMmlFactory(mmlFactory: MmlFactory): void;

  /**
   * Do any initialization that depends on the document being set up
   */
  initialize(): void;

  /**
   * Reset any needed features of the input jax
   *
   * @param {any[]} args   The arguments needed by the reset operation
   */
  reset(...args: any[]): void;

  /**
   * Finds the math within the DOM or the list of strings
   *
   * @param {N|string[]} which     The element or array of strings to be searched for math
   * @param {OptionList} options   The options for the search, if any
   * @returns {ProtoItem[]}        Array of proto math items found (further processed by the
   *                               handler to produce actual MathItem objects)
   */
  findMath(which: N<DOM> | string[], options?: OptionList): ProtoItem<DOM>[];

  /**
   * Convert the math in a math item into the internal format
   *
   * @param {MathItem} math           The MathItem whose math content is to processed
   * @param {MathDocument} document   The MathDocument for this input jax.
   * @returns {MmlNode}               The resulting internal node tree for the math
   */
  compile(math: MathItem<DOM>, document: MathDocument<DOM>): MmlNode;
}

/**
 * The InputJax option types.
 *
 * @template DOM   The DOM node types
 * @template PRE   The type of data passed to the pre-filter functions
 * @template POST  The type of data passed to the post-filter functions
 */
export type INPUTJAX_OPTIONS<
  D extends DOM_TYPES = DOM,
  PRE = any,
  POST = PRE,
> = {
  preFilters: FilterFunctionList<PRE, D>;
  postFilters: FilterFunctionList<POST, D>;
};

/*****************************************************************/
/**
 *  The abstract InputJax class
 *
 * @template DOM   The DOM node types
 * @template PRE   The type of data passed to the pre-filter functions
 * @template POST  The type of data passed to the post-filter functions
 */
export abstract class AbstractInputJax<
  DOM extends DOM_TYPES,
  PRE = any,
  POST = PRE,
> implements InputJax<DOM> {
  /**
   * The name of the input jax
   */
  public static NAME: string = 'generic';

  /**
   * The default options for the input jax
   */
  public static OPTIONS: INPUTJAX_OPTIONS = {
    preFilters: [],
    postFilters: [],
  };

  /**
   * The actual options supplied to the input jax
   */
  public options: OptionList;

  /**
   * Filters to run on the TeX string before it is processed
   */
  public preFilters: FilterFunctions<PRE, DOM>;

  /**
   * Filters to run on the generated MathML after the TeX string is processed
   */
  public postFilters: FilterFunctions<POST, DOM>;

  /**
   * The DOMAdaptor for the MathDocument for this input jax
   */
  public adaptor: DOMAdaptor<DOM> = null; // set by the handler
  /**
   * The MathML node factory
   */
  public mmlFactory: MmlFactory = null; // set by the handler

  /**
   * @param {OptionList} options  The options to apply to this input jax
   *
   * @class
   */
  constructor(options: OptionList = {}) {
    const CLASS = this.constructor as typeof AbstractInputJax;
    this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
    this.preFilters = new FunctionList(this.options.preFilters);
    this.postFilters = new FunctionList(this.options.postFilters);
  }

  /**
   * @returns {string}  The name of this input jax class
   */
  public get name(): string {
    return (this.constructor as typeof AbstractInputJax).NAME;
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
  public setMmlFactory(mmlFactory: MmlFactory) {
    this.mmlFactory = mmlFactory;
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
   * @returns {boolean}  True means find math in string array, false means in DOM element
   */
  public get processStrings(): boolean {
    return true;
  }

  /**
   * @override
   */
  public findMath(_node: N<DOM> | string[], _options?: OptionList) {
    return [] as ProtoItem<DOM>[];
  }

  /**
   * @override
   */
  public abstract compile(
    math: MathItem<DOM>,
    document: MathDocument<DOM>
  ): MmlNode;

  /**
   * Execute a set of filters, passing them the MathItem and any needed data,
   *  and return the (possibly modified) data
   *
   * @param {FunctionList} filters   The list of functions to be performed
   * @param {MathItem} math          The math item that is being processed
   * @param {MathDocument} document  The math document containg the math item
   * @param {any} data               Whatever other data is needed
   * @returns {any}                  The (possibly modified) data
   *
   * @template DATA  The type of data being passed
   */
  protected executeFilters<DATA = PRE | POST>(
    filters: FunctionList,
    math: MathItem<DOM>,
    document: MathDocument<DOM>,
    data: DATA
  ): any {
    const args = { math: math, document: document, data: data };
    filters.execute(args);
    return args.data;
  }
}
