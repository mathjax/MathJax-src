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
 * @file  Implements the CommonMfrac wrapper mixin for the MmlMfrac object
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
import { CommonMo } from './mo.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { BBox } from '../../../util/BBox.js';
import { DIRECTION } from '../FontData.js';

/*****************************************************************/
/**
 * The CommonMfrac interface
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
export interface CommonMfrac<
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
   * Wrapper for <mo> to use for bevelled fraction
   */
  bevel: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;

  /**
   * Padding around fractions
   */
  pad: number;

  /**
   * @param {BBox} bbox        The buonding box to modify
   * @param {boolean} display  True for display-mode fractions
   * @param {number} t         The thickness of the line
   */
  getFractionBBox(bbox: BBox, display: boolean, t: number): void;

  /**
   * @param {boolean} display  True for display-mode fractions
   * @param {number} t         The thickness of the line
   * @returns {object}          The expanded rule thickness (T), and baseline offsets
   *                             for numerator and denomunator (u and v)
   */
  getTUV(display: boolean, t: number): { T: number; u: number; v: number };

  /**
   * @param {BBox} bbox        The bounding box to modify
   * @param {boolean} display  True for display-mode fractions
   */
  getAtopBBox(bbox: BBox, display: boolean): void;

  /**
   * @param {boolean} display  True for diplay-mode fractions
   * @returns {object}
   *    The vertical offsets of the numerator (u), the denominator (v),
   *    the separation between the two, and the bboxes themselves.
   */
  getUVQ(display: boolean): {
    u: number;
    v: number;
    q: number;
    nbox: BBox;
    dbox: BBox;
  };

  /**
   * @param {BBox} bbox        The boundng box to modify
   * @param {boolean} display  True for display-mode fractions
   */
  getBevelledBBox(bbox: BBox, display: boolean): void;

  /**
   * @param {boolean} display  True for display-style fractions
   * @returns {object}          The height (H) of the bevel, horizontal offest (delta)
   *                             vertical offsets (u and v) of the parts, and
   *                             bounding boxes of the parts.
   */
  getBevelData(display: boolean): {
    H: number;
    delta: number;
    u: number;
    v: number;
    nbox: BBox;
    dbox: BBox;
  };

  /**
   * @returns {boolean}   True if in display mode, false otherwise
   */
  isDisplay(): boolean;
}

/**
 * The CommonMfracClass interface
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
export interface CommonMfracClass<
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
 * The CommonMfrac wrapper mixin for the MmlMfrac object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
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
export function CommonMfracMixin<
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
  return class CommonMfracMixin
    extends Base
    implements CommonMfrac<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public bevel: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> = null;

    /**
     * @override
     */
    public pad: number;

    /************************************************/

    /**
     * @override
     */
    public getFractionBBox(bbox: BBox, display: boolean, t: number) {
      const nbox = this.childNodes[0].getOuterBBox();
      const dbox = this.childNodes[1].getOuterBBox();
      const tex = this.font.params;
      const a = tex.axis_height;
      const { T, u, v } = this.getTUV(display, t);
      bbox.combine(nbox, 0, a + T + Math.max(nbox.d * nbox.rscale, u));
      bbox.combine(dbox, 0, a - T - Math.max(dbox.h * dbox.rscale, v));
      bbox.w += 2 * this.pad + 0.2;
    }

    /**
     * @override
     */
    public getTUV(
      display: boolean,
      t: number
    ): { T: number; u: number; v: number } {
      const tex = this.font.params;
      const a = tex.axis_height;
      const T = (display ? 3.5 : 1.5) * t;
      return {
        T: (display ? 3.5 : 1.5) * t,
        u: (display ? tex.num1 : tex.num2) - a - T,
        v: (display ? tex.denom1 : tex.denom2) + a - T,
      };
    }

    /************************************************/

    /**
     * @override
     */
    public getAtopBBox(bbox: BBox, display: boolean) {
      const { u, v, nbox, dbox } = this.getUVQ(display);
      bbox.combine(nbox, 0, u);
      bbox.combine(dbox, 0, -v);
      bbox.w += 2 * this.pad;
    }

    /**
     * @override
     */
    public getUVQ(display: boolean): {
      u: number;
      v: number;
      q: number;
      nbox: BBox;
      dbox: BBox;
    } {
      const nbox = this.childNodes[0].getOuterBBox();
      const dbox = this.childNodes[1].getOuterBBox();
      const tex = this.font.params;
      //
      //  Initial offsets (u, v)
      //  Minimum separation (p)
      //  Actual separation with initial positions (q)
      //
      let [u, v] = display ? [tex.num1, tex.denom1] : [tex.num3, tex.denom2];
      const p = (display ? 7 : 3) * tex.rule_thickness;
      let q = u - nbox.d * nbox.scale - (dbox.h * dbox.scale - v);
      //
      //  If actual separation is less than minimum, move them farther apart
      //
      if (q < p) {
        u += (p - q) / 2;
        v += (p - q) / 2;
        q = p;
      }
      return { u, v, q, nbox, dbox };
    }

    /************************************************/

    /**
     * @override
     */
    public getBevelledBBox(bbox: BBox, display: boolean) {
      const { u, v, delta, nbox, dbox } = this.getBevelData(display);
      const lbox = this.bevel.getOuterBBox();
      bbox.combine(nbox, 0, u);
      bbox.combine(lbox, bbox.w - delta / 2, 0);
      bbox.combine(dbox, bbox.w - delta / 2, v);
    }

    /**
     * @override
     */
    public getBevelData(display: boolean): {
      H: number;
      delta: number;
      u: number;
      v: number;
      nbox: BBox;
      dbox: BBox;
    } {
      const nbox = this.childNodes[0].getOuterBBox();
      const dbox = this.childNodes[1].getOuterBBox();
      const delta = display ? 0.4 : 0.15;
      const H =
        Math.max(
          nbox.scale * (nbox.h + nbox.d),
          dbox.scale * (dbox.h + dbox.d)
        ) +
        2 * delta;
      const a = this.font.params.axis_height;
      const u = (nbox.scale * (nbox.d - nbox.h)) / 2 + a + delta;
      const v = (dbox.scale * (dbox.d - dbox.h)) / 2 + a - delta;
      return { H, delta, u, v, nbox, dbox };
    }

    /************************************************/

    /**
     * @override
     */
    public isDisplay(): boolean {
      const { displaystyle, scriptlevel } = this.node.attributes.getList(
        'displaystyle',
        'scriptlevel'
      );
      return displaystyle && scriptlevel === 0;
    }

    /************************************************/

    /**
     * @override
     * @class
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      this.pad = (this.node.getProperty('withDelims') as boolean)
        ? 0
        : this.font.params.nulldelimiterspace;
      //
      //  create internal bevel mo element
      //
      if (this.node.attributes.get('bevelled')) {
        const { H } = this.getBevelData(this.isDisplay());
        const bevel = (this.bevel = this.createMo('/'));
        bevel.node.attributes.set('symmetric', true);
        bevel.canStretch(DIRECTION.Vertical);
        bevel.getStretchedVariant([H], true);
      }
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      bbox.empty();
      const { linethickness, bevelled } = this.node.attributes.getList(
        'linethickness',
        'bevelled'
      );
      const display = this.isDisplay();
      let w = null as number | null;
      if (bevelled) {
        this.getBevelledBBox(bbox, display);
      } else {
        const thickness = this.length2em(String(linethickness), 0.06);
        w = -2 * this.pad;
        if (thickness === 0) {
          this.getAtopBBox(bbox, display);
        } else {
          this.getFractionBBox(bbox, display, thickness);
          w -= 0.2;
        }
        w += bbox.w;
      }
      bbox.clean();
      this.setChildPWidths(recompute, w);
    }

    /**
     * @override
     */
    public canStretch(_direction: string) {
      return false;
    }

    /**
     * @override
     */
    public getChildAlign(i: number) {
      const attributes = this.node.attributes;
      return attributes.get('bevelled')
        ? 'left'
        : (attributes.get(['numalign', 'denomalign'][i]) as string);
    }

    /**
     * @override
     */
    public getWrapWidth(i: number) {
      const attributes = this.node.attributes;
      if (attributes.get('bevelled')) {
        return this.childNodes[i].getOuterBBox().w;
      }
      const w = this.getBBox().w;
      const thickness = this.length2em(attributes.get('linethickness'));
      return w - (thickness ? 0.2 : 0) - 2 * this.pad;
    }
  } as any as B;
}
