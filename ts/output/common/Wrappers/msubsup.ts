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
 * @file  Implements the CommonMsubsup wrapper mixin for the MmlMsubsup object
 *                and the special cases CommonMsub and CommonMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CommonWrapper, CommonWrapperClass } from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import {
  CommonScriptbase,
  CommonScriptbaseClass,
  CommonScriptbaseConstructor,
} from './scriptbase.js';
import { BBox } from '../../../util/BBox.js';
import {
  MmlMsubsup,
  MmlMsub,
  MmlMsup,
} from '../../../core/MmlTree/MmlNodes/msubsup.js';

/*****************************************************************/
/**
 * The CommonMsub interface
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
export interface CommonMsub<
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
> extends CommonScriptbase<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/**
 * The CommonMsubClass interface
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
export interface CommonMsubClass<
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
> extends CommonScriptbaseClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMsub wrapper mixin for the MmlMsub object
 *
 * @param {CommonScriptbaseConstructor} Base The constructor class to extend
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
export function CommonMsubMixin<
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
  B extends CommonScriptbaseClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonScriptbaseConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMsubMixin
    extends Base
    implements CommonMsub<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * Do not include italic correction
     */
    public static useIC: boolean = false;

    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMsub).sub];
    }

    /**
     * Get the shift for the subscript
     *
     * @override
     */
    public getOffset() {
      const x = this.baseIsChar ? 0 : this.getAdjustedIc();
      return [x, -this.getV()];
    }
  } as any as B;
}

/*****************************************************************/
/**
 * The CommonMsup interface
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
export interface CommonMsup<
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
> extends CommonScriptbase<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/**
 * The CommonMsupClass interface
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
export interface CommonMsupClass<
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
> extends CommonScriptbaseClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMsup wrapper mixin for the MmlMsup object
 *
 * @param {CommonScriptbaseConstructor} Base The constructor class to extend
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
export function CommonMsupMixin<
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
  B extends CommonScriptbaseClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonScriptbaseConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMsupMixin
    extends Base
    implements CommonMsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMsup).sup];
    }

    /**
     * Get the shift for the superscript
     *
     * @override
     */
    public getOffset() {
      const x = this.getAdjustedIc() - (this.baseRemoveIc ? 0 : this.baseIc);
      return [x, this.getU()];
    }
  } as any as B;
}

/*****************************************************************/
/**
 * The CommonMsubsup interface
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
export interface CommonMsubsup<
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
> extends CommonScriptbase<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   *  Cached values for the script offsets and separation (so if they are
   *  computed in computeBBox(), they don't have to be recomputed during output)
   */
  UVQ: number[];

  /**
   * The wrapper for the subscript
   */
  readonly subChild: WW;

  /**
   * The wrapper for the superscript
   */
  readonly supChild: WW;

  /**
   * Get the shift for the scripts and their separation (TeXBook Appendix G 18adef)
   *
   * @param {BBox} subbox     The bounding box of the superscript
   * @param {BBox} supbox     The bounding box of the subscript
   * @returns {number[]}       The vertical offsets for super and subscripts, and the space between them
   */
  getUVQ(subbox?: BBox, supbox?: BBox): number[];
}

/**
 * The CommonMsubsupClass interface
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
export interface CommonMsubsupClass<
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
> extends CommonScriptbaseClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommomMsubsup wrapper for the MmlMsubsup object
 *
 * @param {CommonScriptbaseConstructor} Base The constructor class to extend
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
export function CommonMsubsupMixin<
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
  B extends CommonScriptbaseClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonScriptbaseConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMsubsupMixin
    extends Base
    implements CommonMsubsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * Do not include italic correction
     */
    public static useIC: boolean = false;

    /**
     * @override
     */
    public UVQ: number[] = null;

    /**
     * @override
     */
    public get subChild(): WW {
      return this.childNodes[(this.node as MmlMsubsup).sub];
    }

    /**
     * @override
     */
    public get supChild(): WW {
      return this.childNodes[(this.node as MmlMsubsup).sup];
    }

    /**
     * @override
     */
    public get scriptChild(): WW {
      return this.supChild;
    }

    /**
     * @override
     */
    public getUVQ(
      subbox: BBox = this.subChild.getOuterBBox(),
      supbox: BBox = this.supChild.getOuterBBox()
    ): number[] {
      const base = this.baseCore;
      const bbox = base.getLineBBox(base.breakCount);
      if (this.UVQ) return this.UVQ;
      const tex = this.font.params;
      const t = 3 * tex.rule_thickness;
      const subscriptshift = this.length2em(
        this.node.attributes.get('subscriptshift'),
        tex.sub2
      );
      const drop = this.baseCharZero(
        bbox.d * this.baseScale + tex.sub_drop * subbox.rscale
      );
      const supd = supbox.d * supbox.rscale;
      const subh = subbox.h * subbox.rscale;
      //
      // u and v are the veritcal shifts of the scripts, initially set to minimum values and then adjusted
      //
      let [u, v] = [this.getU(), Math.max(drop, subscriptshift)];
      //
      // q is the space currently between the super- and subscripts.
      // If it is less than 3 rule thicknesses,
      //   Increase the subscript offset to make the space 3 rule thicknesses
      //   If the bottom of the superscript is below 4/5 of the x-height
      //     raise both the super- and subscripts by the difference
      //     (make the bottom of the superscript be at 4/5 the x-height, and the
      //      subscript 3 rule thickness below that),
      //     provided we don't move up past the original subscript position.
      //
      let q = u - supd - (subh - v);
      if (q < t) {
        v += t - q;
        const p = (4 / 5) * tex.x_height - (u - supd);
        if (p > 0) {
          u += p;
          v -= p;
        }
      }
      //
      // Make sure the shifts are at least the minimum amounts and
      // return the shifts and the space between the scripts
      //
      u = Math.max(
        this.length2em(this.node.attributes.get('superscriptshift'), u),
        u
      );
      v = Math.max(
        this.length2em(this.node.attributes.get('subscriptshift'), v),
        v
      );
      q = u - supd - (subh - v);
      this.UVQ = [u, -v, q];
      return this.UVQ;
    }

    /*********************************************************************/

    /**
     * @override
     */
    public appendScripts(bbox: BBox): BBox {
      const [subbox, supbox] = [
        this.subChild.getOuterBBox(),
        this.supChild.getOuterBBox(),
      ];
      const w = this.getBaseWidth();
      const x = this.getAdjustedIc();
      const [u, v] = this.getUVQ();
      const y =
        bbox.d - this.baseChild.getLineBBox(this.baseChild.breakCount).d;
      bbox.combine(subbox, w + (this.baseIsChar ? 0 : x), v - y);
      bbox.combine(supbox, w + x, u - y);
      bbox.w += this.font.params.scriptspace;
      return bbox;
    }
  } as any as B;
}
