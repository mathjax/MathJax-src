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
 * @file  Implements the CommonMspace wrapper mixin for the MmlMspace object
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
import { MmlMspace } from '../../../core/MmlTree/MmlNodes/mspace.js';
import { BBox } from '../../../util/BBox.js';
import { LineBBox } from '../LineBBox.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonMspance interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMspace<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapper<DOM, FONT, JX, WW, WF, WC> {
  /**
   * True when mspace is allowed to break
   */
  canBreak: boolean;

  /**
   * The linebreak style
   */
  breakStyle: string;

  /**
   * Set a breakpoint to the given type
   *
   * @param {string} linebreak   The type of linebreak to set
   */
  setBreakStyle(linebreak?: string): void;
}

/**
 * The CommonMspaceClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMspaceClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMspace wrapper mixin for the MmlMspace object
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
export function CommonMspaceMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonWrapperConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMspaceMixin
    extends Base
    implements CommonMspace<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    get canBreak() {
      return (this.node as MmlMspace).canBreak;
    }

    /**
     * @override
     */
    public breakStyle: string;

    /**
     * @override
     */
    get breakCount() {
      return this.breakStyle ? 1 : 0;
    }

    /**
     * @override
     */
    public setBreakStyle(linebreak: string = '') {
      this.breakStyle =
        linebreak ||
        ((this.node as MmlMspace).hasNewline ||
        this.node.getProperty('forcebreak')
          ? 'before'
          : '');
    }

    /***************************************************/

    /**
     * @override
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      this.setBreakStyle();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const attributes = this.node.attributes;
      bbox.w = this.length2em(attributes.get('width'), 0);
      bbox.h = this.length2em(attributes.get('height'), 0);
      bbox.d = this.length2em(attributes.get('depth'), 0);
    }

    /**
     * @override
     */
    public computeLineBBox(i: number): LineBBox {
      const leadingString = this.node.attributes.get(
        'data-lineleading'
      ) as string;
      const leading = this.length2em(
        leadingString,
        this.linebreakOptions.lineleading
      );
      const bbox = LineBBox.from(BBox.zero(), leading);
      if (i === 1) {
        bbox.getIndentData(this.node);
        bbox.w = this.getBBox().w;
        bbox.isFirst = bbox.w === 0;
      }
      return bbox;
    }
  } as any as B;
}
