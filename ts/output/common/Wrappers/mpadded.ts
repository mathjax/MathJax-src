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
 * @file  Implements the CommonMpadded wrapper mixin for the MmlMpadded object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import { BBox } from '../../../util/BBox.js';
import { Property } from '../../../core/Tree/Node.js';

/*****************************************************************/
/**
 * The CommonMpadded interface
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
export interface CommonMpadded<
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
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * Get the content bounding box, and the change in size and offsets
   *   as specified by the parameters
   *
   * @returns {number[]}  The original height, depth, width, the changes in height, depth,
   *                    and width, and the horizontal and vertical offsets of the content
   */
  getDimens(): number[];

  /**
   * Get a particular dimension, which can be relative to any of the BBox dimensions,
   *   and can be an offset from the default size of the given dimension.
   *
   * @param {Property} length   The value to be converted to a length in ems
   * @param {BBox} bbox         The bbox of the mpadded content
   * @param {string=} d         The default dimension to use for relative sizes ('w', 'h', or 'd')
   * @param {number=} m         The minimum value allowed for the dimension
   * @returns {number}           The final dimension in ems
   */
  dimen(length: Property, bbox: BBox, d?: string, m?: number): number;

  /**
   * Set the BBox dimensions using the node's attributes
   *
   * @param {BBox} bbox   The bbox to set
   */
  setBBoxDimens(bbox: BBox): void;
}

/**
 * The CommonMpaddedClass interface
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
export interface CommonMpaddedClass<
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
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommomMpadded wrapper for the MmlMpadded object
 *
 * @param {CommonWrapperConstructor} Base The constructor class
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
export function CommonMpaddedMixin<
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
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMpaddedMixin
    extends Base
    implements CommonMpadded<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public getDimens(): number[] {
      const values = this.node.attributes.getList(
        'width',
        'height',
        'depth',
        'lspace',
        'voffset'
      );
      const bbox = this.childNodes[0].getOuterBBox(); // get unmodified bbox of children
      let { w, h, d } = bbox;
      const W = w;
      const H = h;
      const D = d;
      let x = 0;
      let y = 0;
      let dx = 0;
      if (values.width !== '') w = this.dimen(values.width, bbox, 'w', 0);
      if (values.height !== '') h = this.dimen(values.height, bbox, 'h', 0);
      if (values.depth !== '') d = this.dimen(values.depth, bbox, 'd', 0);
      if (values.voffset !== '') y = this.dimen(values.voffset, bbox);
      if (values.lspace !== '') x = this.dimen(values.lspace, bbox);
      const align = this.node.attributes.get('data-align') as string;
      if (align) {
        dx = this.getAlignX(w, bbox, align);
      }
      return [H, D, W, h - H, d - D, w - W, x, y, dx];
    }

    /**
     * @override
     */
    public dimen(
      length: Property,
      bbox: BBox,
      d: string = '',
      m: number = null
    ): number {
      length = String(length);
      const match = length.match(/width|height|depth/);
      const size = (
        match
          ? bbox[match[0].charAt(0) as keyof BBox]
          : d
            ? bbox[d as keyof BBox]
            : 0
      ) as number;
      let dimen = this.length2em(length, size) || 0;
      if (length.match(/^[-+]/) && d) {
        dimen += size;
      }
      if (m != null) {
        dimen = Math.max(m, dimen);
      }
      return dimen;
    }

    /**
     * @override
     */
    public setBBoxDimens(bbox: BBox) {
      const [H, D, W, dh, dd, dw] = this.getDimens();
      bbox.w = W + dw;
      bbox.h = H + dh;
      bbox.d = D + dd;
    }

    /*****************************************************************/

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      this.setBBoxDimens(bbox);
      const w = this.childNodes[0].getOuterBBox().w;
      if (w > bbox.w) {
        const overflow = this.node.attributes.get('data-overflow');
        if (
          overflow === 'linebreak' ||
          (overflow === 'auto' &&
            this.jax.math.root.attributes.get('overflow') === 'linebreak')
        ) {
          this.childNodes[0].breakToWidth(bbox.w);
          this.setBBoxDimens(bbox);
        }
      }
      this.setChildPWidths(recompute, bbox.w);
    }

    /**
     * @override
     */
    public getWrapWidth(_i: number) {
      return this.getBBox().w;
    }

    /**
     * @override
     */
    public getChildAlign(_i: number) {
      return (this.node.attributes.get('data-align') as string) || 'left';
    }
  } as any as B;
}
