/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  Implements the CommonMtd wrapper mixin for the MmlMtd object
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
import { CommonMtable } from '../../common/Wrappers/mtable.js';
import { CommonMtr } from '../../common/Wrappers/mtr.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonMtd interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMtd<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapper<DOM, FONT, JX, WW, WF, WC> {}

/**
 * The CommonMtdClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMtdClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 *  The CommonMtd wrapper mixin for the MmlMtd object
 *
 * @param {CommonWrapperConstructor} Base The constructor class
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
export function CommonMtdMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonWrapperConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMtdMixin
    extends Base
    implements CommonMtd<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    get fixesPWidth() {
      return false;
    }

    /**
     * @override
     */
    public invalidateBBox() {
      this.bboxComputed = false;
      this.lineBBox = [];
    }

    /**
     * @override
     */
    public getWrapWidth(_j: number) {
      const table = this.parent.parent as any as CommonMtable<
        DOM,
        FONT,
        JX,
        WW,
        WF,
        WC,
        CommonMtr<DOM, FONT, JX, WW, WF, WC>
      >;
      const row = this.parent as any as CommonMtr<DOM, FONT, JX, WW, WF, WC>;
      const i = this.node.childPosition() - (row.labeled ? 1 : 0);
      return (
        typeof table.cWidths[i] === 'number'
          ? table.cWidths[i]
          : table.getTableData().W[i]
      ) as number;
    }

    /**
     * @override
     */
    public getChildAlign(_i: number) {
      return this.node.attributes.get('columnalign') as string;
    }
  } as any as B;
}
