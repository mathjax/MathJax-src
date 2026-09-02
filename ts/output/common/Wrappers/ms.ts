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
 * @file  Implements the CommonMs wrapper mixin for the MmlMs object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import { CommonOutputJax, COMMON_FONT } from '../../common.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonMs interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMs<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapper<DOM, FONT, JX, WW, WF, WC> {
  /**
   * Create a text wrapper with the given text;
   *
   * @param {string} text   The text for the wrapped element
   * @returns {WW}           The wrapped text node
   */
  createText(text: string): WW;
}

/**
 * The CommonMsClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMsClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMs wrapper mixin for the MmlMs object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 *
 * @template B     The mixin interface to create
 */
export function CommonMsMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonWrapperConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMsMixin
    extends Base
    implements CommonMs<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * Create a text wrapper with the given text;
     *
     * @param {string} text   The text for the wrapped element
     * @returns {WW}           The wrapped text node
     */
    public createText(text: string): WW {
      const node = this.wrap(this.mmlText(text));
      node.parent = this as any as WW;
      return node;
    }

    /*****************************************************/

    /**
     * Add the quote characters to the wrapper children so they will be output
     *
     * @override
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      const attributes = this.node.attributes;
      const quotes = attributes.getList('lquote', 'rquote');
      if (this.variant !== 'monospace') {
        if (!attributes.isSet('lquote') && quotes.lquote === '"') {
          quotes.lquote = '\u201C';
        }
        if (!attributes.isSet('rquote') && quotes.rquote === '"') {
          quotes.rquote = '\u201D';
        }
      }
      this.childNodes.unshift(this.createText(quotes.lquote as string));
      this.childNodes.push(this.createText(quotes.rquote as string));
    }
  } as any as B;
}
