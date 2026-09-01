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
 * @file  Implements the CommonMroot wrapper mixin for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CommonWrapper, CommonWrapperClass, Constructor } from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import { CommonOutputJax, COMMON_FONT } from '../../common.js';
import { CommonMsqrt, CommonMsqrtClass } from './msqrt.js';
import { BBox } from '../../../util/BBox.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonMroot interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMroot<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonMsqrt<DOM, FONT, JX, WW, WF, WC> {}

/**
 * The CommonMrootClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMrootClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonMsqrtClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMroot wrapper mixin for the MmlMroot object (extends CommonMsqrt)
 *
 * @param {Constructor} Base The constructor class to extend
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
export function CommonMrootMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonMsqrtClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: Constructor<CommonMsqrt<DOM, FONT, JX, WW, WF, WC>>): B {
  return class CommonMrootMixin
    extends Base
    implements CommonMroot<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    get root(): number {
      return 1;
    }

    /**
     * @override
     */
    public combineRootBBox(BBOX: BBox, sbox: BBox, H: number) {
      const bbox = this.childNodes[this.root].getOuterBBox();
      const h = this.getRootDimens(sbox, H)[1];
      BBOX.combine(bbox, 0, h);
    }

    /**
     * @override
     */
    public getRootDimens(sbox: BBox, H: number) {
      const surd = this.surd;
      const bbox = this.childNodes[this.root].getOuterBBox();
      const offset = (surd.size < 0 ? 0.5 : 0.6) * sbox.w;
      const { w, rscale } = bbox;
      const W = Math.max(w, offset / rscale);
      const dx = Math.max(0, W - w);
      const h = this.rootHeight(bbox, sbox, surd.size, H);
      const x = W * rscale - offset;
      return [x, h, dx];
    }

    /**
     * @override
     */
    public rootHeight(rbox: BBox, sbox: BBox, size: number, H: number): number {
      const h = sbox.h + sbox.d;
      const b = (size < 0 ? 1.9 : 0.55 * h) - (h - H);
      return b + Math.max(0, rbox.d * rbox.rscale);
    }

    /**
     * @override
     */
    public rootWidth() {
      const bbox = this.childNodes[this.root].getOuterBBox();
      return 0.4 + bbox.w * bbox.rscale;
    }
  } as any as B;
}
