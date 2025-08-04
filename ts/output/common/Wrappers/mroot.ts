/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import { CommonMsqrt, CommonMsqrtClass } from './msqrt.js';
import { BBox } from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The CommonMroot interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonMroot<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonMsqrt<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/**
 * The CommonMrootClass interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonMrootClass<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonMsqrtClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMroot wrapper mixin for the MmlMroot object (extends CommonMsqrt)
 *
 * @param {Constructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 *
 * @template B   The mixin interface to create
 */
export function CommonMrootMixin<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonMsqrtClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: Constructor<CommonMsqrt<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>>
): B {
  return class CommonMrootMixin
    extends Base
    implements CommonMroot<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
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
