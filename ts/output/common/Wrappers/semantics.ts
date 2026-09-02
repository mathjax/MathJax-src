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
 * @file  Implements the CommonSemantics wrapper mixin for the MmlSemantics object
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
import { BBox } from '../../../util/BBox.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonSemantics interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonSemantics<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapper<DOM, FONT, JX, WW, WF, WC> {}

/**
 * The CommonSemanticsClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonSemanticsClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonSemantics wrapper mixin for the MmlSemantics object
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
export function CommonSemanticsMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonWrapperConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonSemanticsMixin
    extends Base
    implements CommonSemantics<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      if (this.childNodes.length) {
        const { w, h, d } = this.childNodes[0].getBBox();
        bbox.w = w;
        bbox.h = h;
        bbox.d = d;
      }
    }

    /**
     * @override
     */
    get breakCount() {
      return this.node.isEmbellished
        ? this.coreMO().embellishedBreakCount
        : this.childNodes[0].breakCount;
    }
  } as any as B;
}
