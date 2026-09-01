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
 * @file  Interfaces and abstract classes for FindMath objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { userOptions, defaultOptions, OptionList } from '../util/Options.js';
import { ProtoItem } from './MathItem.js';
import { DOM_TYPES, N } from '../types/Types.js';

/*****************************************************************/
/**
 *  The FindMath interface
 *
 * @template DOM   The DOM node types
 */
export interface FindMath<DOM extends DOM_TYPES> {
  /**
   * One of two possibilities:  Look through a DOM element,
   *   or look through an array of strings for delimited math.
   *
   * @param {N} node   The node to search for math
   * @returns {ProtoItem<DOM>[]}
   */
  findMath(node: N<DOM>): ProtoItem<DOM>[];
  /**
   *
   * @param {string[]} strings    The strings to search for math
   * @returns {ProtoItem<DOM>[]}
   */
  findMath(strings: string[]): ProtoItem<DOM>[];
}

/*****************************************************************/
/**
 *  The FindMath abstract class
 */

/**
 * @template DOM   The DOM node types
 */
export abstract class AbstractFindMath<
  DOM extends DOM_TYPES,
> implements FindMath<DOM> {
  /**
   * The default options for FindMath
   */
  public static OPTIONS: OptionList = {};

  /**
   * The actual options for this instance
   */
  protected options: OptionList;

  /**
   * @param {OptionList} options  The user options for this instance
   */
  constructor(options: OptionList) {
    const CLASS = this.constructor as typeof AbstractFindMath;
    this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
  }

  /**
   * Locate math in an Element or a string array;
   *
   * @param {Element | string[]} where  The node or string array to search for math
   * @returns {ProtoItem[]}              The array of proto math items found
   */
  public abstract findMath(where: N<DOM> | string[]): ProtoItem<DOM>[];
}
