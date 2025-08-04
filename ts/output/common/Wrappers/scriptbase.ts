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
 * @file  Implements the a base mixin for CommonMsubsup, CommonMunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
  Constructor,
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
import { CommonMunderover } from './munderover.js';
import { CommonMo } from './mo.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMsubsup } from '../../../core/MmlTree/MmlNodes/msubsup.js';
import { MmlMo } from '../../../core/MmlTree/MmlNodes/mo.js';
import { BBox } from '../../../util/BBox.js';
import { LineBBox } from '../LineBBox.js';
import { DIRECTION } from '../FontData.js';

/*****************************************************************/
/**
 * The CommonScriptbase interface
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
export interface CommonScriptbase<
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
   * The core mi or mo of the base (or the base itself if there isn't one)
   */
  readonly baseCore: WW;

  /**
   * The base element's wrapper
   */
  readonly baseChild: WW;

  /**
   * The relative scaling of the base compared to the munderover/msubsup
   */
  readonly baseScale: number;

  /**
   * The italic correction of the base (if any)
   */
  readonly baseIc: number;

  /**
   * True if base italic correction should be removed (msub and msubsup or mathaccents)
   */
  readonly baseRemoveIc: boolean;

  /**
   * True if the base is a single character
   */
  readonly baseIsChar: boolean;

  /**
   * True if the base has an accent  over
   */
  readonly baseHasAccentOver: boolean;
  /**
   * True if the base has an accent under
   */
  readonly baseHasAccentUnder: boolean;

  /**
   * True if this is an overline
   */
  readonly isLineAbove: boolean;
  /**
   * True if this is an underline
   */
  readonly isLineBelow: boolean;

  /**
   * True if this is an msup with script that is a math accent
   */
  readonly isMathAccent: boolean;

  /**
   * The script element's wrapper (overridden in subclasses)
   */
  readonly scriptChild: WW;

  /***************************************************************************/
  /*
   *  Methods for information about the core element for the base
   */

  /**
   * @returns {WW}    The wrapper for the base core mi or mo (or whatever)
   */
  getBaseCore(): WW;

  /**
   * @param {WW} core   The element to check for accents
   */
  setBaseAccentsFor(core: WW): void;

  /**
   * @returns {WW}    The base fence item or null
   */
  getSemanticBase(): WW;

  /**
   * Recursively retrieves an element for a given fencepointer
   *
   * @param {WW} fence    The potential fence
   * @param {string} id   The fencepointer id
   * @returns {WW}         The original fence the scripts belong to
   */
  getBaseFence(fence: WW, id: string): WW;

  /**
   * @returns {number}   The scaling factor for the base core relative to the munderover/msubsup
   */
  getBaseScale(): number;

  /**
   * The base's italic correction (properly scaled)
   */
  getBaseIc(): number;

  /**
   * An adjusted italic correction (for slightly better results)
   */
  getAdjustedIc(): number;

  /**
   * @returns {boolean}  True if the base is an mi, mn, or mo (not a largeop) consisting of
   *                    a single unstretched character
   */
  isCharBase(): boolean;

  /**
   * Determine if the under- and overscripts are under- or overlines.
   */
  checkLineAccents(): void;

  /**
   * @param {WW} script   The script node to check for being a line
   * @returns {boolean}    True if the script is U+2015
   */
  isLineAccent(script: WW): boolean;

  /***************************************************************************/
  /*
   *  Methods for sub-sup nodes
   */

  /**
   * @returns {number}    The base child's width without the base italic correction (if not needed)
   */
  getBaseWidth(): number;

  /**
   * Get the shift for the script (implemented in subclasses)
   *
   * @returns {number[]}   The horizontal and vertical offsets for the script
   */
  getOffset(): number[];

  /**
   * @param {number} n    The value to use if the base isn't a (non-large-op, unstretched) char
   * @returns {number}     Either n or 0
   */
  baseCharZero(n: number): number;

  /**
   * Get the shift for a subscript (TeXBook Appendix G 18ab)
   *
   * @returns {number}     The vertical offset for the script
   */
  getV(): number;

  /**
   * Get the shift for a superscript (TeXBook Appendix G 18acd)
   *
   * @returns {number}     The vertical offset for the script
   */
  getU(): number;

  /***************************************************************************/
  /*
   *  Methods for under-over nodes
   */

  /**
   * @returns {boolean}  True if the base has movablelimits (needed by munderover)
   */
  hasMovableLimits(): boolean;

  /**
   * Get the separation and offset for overscripts (TeXBoox Appendix G 13, 13a)
   *
   * @param {BBox} basebox  The bounding box of the base
   * @param {BBox} overbox  The bounding box of the overscript
   * @returns {number[]}     The separation between their boxes, and the offset of the overscript
   */
  getOverKU(basebox: BBox, overbox: BBox): number[];

  /**
   * Get the separation and offset for underscripts (TeXBoox Appendix G 13, 13a)
   *
   * @param {BBox} basebox   The bounding box of the base
   * @param {BBox} underbox  The bounding box of the underscript
   * @returns {number[]}      The separation between their boxes, and the offset of the underscript
   */
  getUnderKV(basebox: BBox, underbox: BBox): number[];

  /**
   * @param {BBox[]} boxes     The bounding boxes whose offsets are to be computed
   * @param {number[]=} delta  The initial x offsets of the boxes
   * @returns {number[]}        The actual offsets needed to center the boxes in the stack
   */
  getDeltaW(boxes: BBox[], delta?: number[]): number[];

  /**
   * @param {WW} script         The child that is above or below the base
   * @param {boolean=} noskew   Whether to ignore the skew amount
   * @returns {number}           The offset for under and over
   */
  getDelta(script: WW, noskew?: boolean): number;

  /**
   * Handle horizontal stretching of children to match greatest width
   *  of all children
   */
  stretchChildren(): void;

  /**
   * Add the scripts into the given bounding box for msub and msup (overridden by msubsup)
   *
   * @param {BBox} bbox   The bounding box to augment
   * @returns {BBox}       The modified bounding box
   */
  appendScripts(bbox: BBox): BBox;
}

/**
 * The CommonScriptbaseClass interface
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
export interface CommonScriptbaseClass<
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
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * Set to true for munderover/munder/mover/msup (Appendix G 13)
   */
  useIC: boolean;
}

/**
 *  Shorthand for the CommonScriptbase constructor
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
 *
 * @template B   The mixin interface being created
 */
export type CommonScriptbaseConstructor<
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
> = Constructor<CommonScriptbase<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>>;

/*****************************************************************/
/**
 * A base class for msup/msub/msubsup and munder/mover/munderover
 * wrapper mixin implementations
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
export function CommonScriptbaseMixin<
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
  return class CommonScriptbaseMixin
    extends Base
    implements CommonScriptbase<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * Set to false for msubsup/msub (Appendix G 13)
     */
    public static useIC: boolean = true;

    /**
     * @override
     */
    public baseCore: WW;

    /**
     * @override
     */
    public baseScale: number = 1;

    /**
     * @override
     */
    public baseIc: number = 0;

    /**
     * @override
     */
    public baseRemoveIc: boolean = false;

    /**
     * @override
     */
    public baseIsChar: boolean = false;

    /**
     * @override
     */
    public baseHasAccentOver: boolean = null;
    /**
     * @override
     */
    public baseHasAccentUnder: boolean = null;

    /**
     * @override
     */
    public isLineAbove: boolean = false;
    /**
     * @override
     */
    public isLineBelow: boolean = false;

    /**
     * @override
     */
    public isMathAccent: boolean = false;

    /**
     * @override
     */
    public get baseChild(): WW {
      return this.childNodes[(this.node as MmlMsubsup).base];
    }

    /**
     * @override
     */
    public get scriptChild(): WW {
      return this.childNodes[1];
    }

    /***************************************************************************/
    /*
     *  Methods for information about the core element for the base
     */

    /**
     * @override
     */
    public getBaseCore(): WW {
      let core = this.getSemanticBase() || this.childNodes[0];
      let node = core?.node;
      while (
        core &&
        ((core.childNodes.length === 1 &&
          (node.isKind('mrow') ||
            node.isKind('TeXAtom') ||
            node.isKind('mstyle') ||
            (node.isKind('mpadded') && !node.getProperty('vbox')) ||
            node.isKind('mphantom') ||
            node.isKind('semantics'))) ||
          (node.isKind('munderover') &&
            /* prettier-ignore */
            (
              core as any as
              CommonMunderover<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
            ).isMathAccent))
      ) {
        this.setBaseAccentsFor(core);
        core = core.childNodes[0];
        node = core?.node;
      }
      if (!core) {
        this.baseHasAccentOver = this.baseHasAccentUnder = false;
      }
      return core || this.childNodes[0];
    }

    /**
     * @override
     */
    public setBaseAccentsFor(core: WW) {
      if (core.node.isKind('munderover')) {
        if (this.baseHasAccentOver === null) {
          this.baseHasAccentOver = !!core.node.attributes.get('accent');
        }
        if (this.baseHasAccentUnder === null) {
          this.baseHasAccentUnder = !!core.node.attributes.get('accentunder');
        }
      }
    }

    /**
     * @override
     */
    public getSemanticBase(): WW {
      const fence = this.node.attributes.getExplicit(
        'data-semantic-fencepointer'
      ) as string;
      return this.getBaseFence(this.baseChild, fence);
    }

    /**
     * @override
     */
    public getBaseFence(fence: WW, id: string): WW {
      if (!fence || !fence.node.attributes || !id) {
        return null;
      }
      if (fence.node.attributes.getExplicit('data-semantic-id') === id) {
        return fence;
      }
      for (const child of fence.childNodes) {
        const result = this.getBaseFence(child, id);
        if (result) {
          return result;
        }
      }
      return null;
    }

    /**
     * @override
     */
    public getBaseScale(): number {
      let child = this.baseCore as any;
      let scale = 1;
      while (child && child !== this) {
        const bbox = child.getOuterBBox();
        scale *= bbox.rscale;
        child = child.parent;
      }
      return scale;
    }

    /**
     * @override
     */
    public getBaseIc(): number {
      return this.baseCore.getOuterBBox().ic * this.baseScale;
    }

    /**
     * @override
     */
    public getAdjustedIc(): number {
      return this.baseIc ? 1.05 * this.baseIc + 0.05 : 0;
    }

    /**
     * @override
     */
    public isCharBase(): boolean {
      const base = this.baseCore;
      return (
        ((base.node.isKind('mo') && (base as any).size === null) ||
          base.node.isKind('mi') ||
          base.node.isKind('mn')) &&
        base.bbox.rscale === 1 &&
        Array.from(base.getText()).length === 1
      );
    }

    /**
     * @override
     */
    public checkLineAccents() {
      if (!this.node.isKind('munderover')) return;
      if (this.node.isKind('mover')) {
        this.isLineAbove = this.isLineAccent(this.scriptChild);
      } else if (this.node.isKind('munder')) {
        this.isLineBelow = this.isLineAccent(this.scriptChild);
      } else {
        /* prettier-ignore */
        const mml = this as any as CommonMunderover<
          N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
        this.isLineAbove = this.isLineAccent(mml.overChild);
        this.isLineBelow = this.isLineAccent(mml.underChild);
      }
    }

    /**
     * @override
     */
    public isLineAccent(script: WW): boolean {
      const node = script.coreMO().node;
      return node.isToken && (node as MmlMo).getText() === '\u2015';
    }

    /***************************************************************************/
    /*
     *  Methods for sub-sup nodes
     */

    /**
     * @override
     */
    public getBaseWidth(): number {
      const bbox = this.baseChild.getLineBBox(this.baseChild.breakCount);
      return (
        bbox.w * bbox.rscale -
        (this.baseRemoveIc ? this.baseIc : 0) +
        this.font.params.extra_ic
      );
    }

    /**
     * @override
     */
    public getOffset(): [number, number] {
      return [0, 0];
    }

    /**
     * @override
     */
    public baseCharZero(n: number): number {
      const largeop = !!this.baseCore.node.attributes.get('largeop');
      const sized = !!(
        this.baseCore.node.isKind('mo') &&
        /* prettier-ignore */
        (this.baseCore as any as
         CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>).size
      );
      const scale = this.baseScale;
      return this.baseIsChar && !largeop && !sized && scale === 1 ? 0 : n;
    }

    /**
     * @override
     */
    public getV(): number {
      const base = this.baseCore;
      const bbox = base.getLineBBox(base.breakCount);
      const sbox = this.scriptChild.getOuterBBox();
      const tex = this.font.params;
      const subscriptshift = this.length2em(
        this.node.attributes.get('subscriptshift'),
        tex.sub1
      );
      return Math.max(
        this.baseCharZero(bbox.d * this.baseScale + tex.sub_drop * sbox.rscale),
        subscriptshift,
        sbox.h * sbox.rscale - (4 / 5) * tex.x_height
      );
    }

    /**
     * @override
     */
    public getU(): number {
      const base = this.baseCore;
      const bbox = base.getLineBBox(base.breakCount);
      const sbox = this.scriptChild.getOuterBBox();
      const tex = this.font.params;
      const attr = this.node.attributes.getList(
        'displaystyle',
        'superscriptshift'
      );
      const prime = this.node.getProperty('texprimestyle');
      const p = prime ? tex.sup3 : attr.displaystyle ? tex.sup1 : tex.sup2;
      const superscriptshift = this.length2em(attr.superscriptshift, p);
      return Math.max(
        this.baseCharZero(bbox.h * this.baseScale - tex.sup_drop * sbox.rscale),
        superscriptshift,
        sbox.d * sbox.rscale + (1 / 4) * tex.x_height
      );
    }

    /***************************************************************************/
    /*
     *  Methods for under-over nodes
     */

    /**
     * @override
     */
    public hasMovableLimits(): boolean {
      const display = this.node.attributes.get('displaystyle');
      const mo = this.baseChild.coreMO().node;
      return !display && !!mo.attributes.get('movablelimits');
    }

    /**
     * @override
     */
    public getOverKU(basebox: BBox, overbox: BBox): [number, number] {
      const accent = this.node.attributes.get('accent') as boolean;
      const tex = this.font.params;
      const d = overbox.d * overbox.rscale;
      const t = tex.rule_thickness * tex.separation_factor;
      const delta = this.baseHasAccentOver ? t : 0;
      const T = this.isLineAbove ? 3 * tex.rule_thickness : t;
      const k =
        (accent
          ? T
          : Math.max(
              tex.big_op_spacing1,
              tex.big_op_spacing3 - Math.max(0, d)
            )) - delta;
      return [k, basebox.h * basebox.rscale + k + d];
    }

    /**
     * @override
     */
    public getUnderKV(basebox: BBox, underbox: BBox): [number, number] {
      const accent = this.node.attributes.get('accentunder') as boolean;
      const tex = this.font.params;
      const h = underbox.h * underbox.rscale;
      const t = tex.rule_thickness * tex.separation_factor;
      const delta = this.baseHasAccentUnder ? t : 0;
      const T = this.isLineBelow ? 3 * tex.rule_thickness : t;
      const k =
        (accent ? T : Math.max(tex.big_op_spacing2, tex.big_op_spacing4 - h)) -
        delta;
      return [k, -(basebox.d * basebox.rscale + k + h)];
    }

    /**
     * @override
     */
    public getDeltaW(boxes: BBox[], delta: number[] = [0, 0, 0]): number[] {
      const align = this.node.attributes.get('align');
      const widths = boxes.map((box) => box.w * box.rscale);
      widths[0] -=
        this.baseRemoveIc && !this.baseCore.node.attributes.get('largeop')
          ? this.baseIc
          : 0;
      const w = Math.max(...widths);
      const dw = [] as number[];
      let m = 0;
      for (const i of widths.keys()) {
        dw[i] =
          (align === 'center'
            ? (w - widths[i]) / 2
            : align === 'right'
              ? w - widths[i]
              : 0) + delta[i];
        if (dw[i] < m) {
          m = -dw[i];
        }
      }
      if (m) {
        for (const i of dw.keys()) {
          dw[i] += m;
        }
      }
      [1, 2].map(
        (i) => (dw[i] += boxes[i] ? boxes[i].dx * boxes[0].rscale : 0)
      );
      return dw;
    }

    /**
     * @override
     */
    public getDelta(script: WW, noskew: boolean = false): number {
      const accent = this.node.attributes.get('accent');
      let { sk, ic } = this.baseCore.getOuterBBox();
      if (accent) {
        sk -= script.getOuterBBox().sk;
      }
      return (
        ((accent && !noskew ? sk : 0) + this.font.skewIcFactor * ic) *
        this.baseScale
      );
    }

    /**
     * @override
     */
    public stretchChildren() {
      const stretchy: WW[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const child of this.childNodes) {
        if (child.canStretch(DIRECTION.Horizontal)) {
          stretchy.push(child);
        }
      }
      const count = stretchy.length;
      const nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        let W = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the width of the non-stretchy children.
        //
        const all = count > 1 && count === nodeCount;
        for (const child of this.childNodes) {
          const noStretch = child.stretch.dir === DIRECTION.None;
          if (all || noStretch) {
            const { w, rscale } = child.getOuterBBox(noStretch);
            if (w * rscale > W) W = w * rscale;
          }
        }
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          const core = child.coreMO();
          if (core.size === null) {
            core.getStretchedVariant([W / child.coreRScale()]);
          }
        }
      }
    }

    /***************************************************************************/

    /**
     * @override
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      //
      //  Find the base core
      //
      const core = (this.baseCore = this.getBaseCore());
      if (!core) return;
      //
      // Get information about the base element
      //
      this.setBaseAccentsFor(core);
      this.baseScale = this.getBaseScale();
      this.baseIc = this.getBaseIc();
      this.baseIsChar = this.isCharBase();
      //
      //  Determine if we are setting a mathaccent
      //
      this.isMathAccent =
        this.baseIsChar &&
        this.scriptChild &&
        this.scriptChild.coreMO().node.getProperty('mathaccent') !== undefined;
      //
      // Check for overline/underline accents
      //
      this.checkLineAccents();
      //
      //  Check if the base is a mi or mo that needs italic correction removed
      //
      this.baseRemoveIc =
        !this.isLineAbove &&
        !this.isLineBelow &&
        (!(
          /* prettier-ignore */
          (this.constructor as CommonScriptbaseClass<
            N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
          >)
          .useIC
        ) ||
          this.isMathAccent);
    }

    /**
     * This gives the common bbox for msub, msup, and msubsup.  It is overridden
     * for all the others (munder, mover, munderover).
     *
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      bbox.empty();
      bbox.append(this.baseChild.getOuterBBox());
      this.appendScripts(bbox);
      bbox.clean();
      this.setChildPWidths(recompute);
    }

    /**
     * @override
     */
    public appendScripts(bbox: BBox): BBox {
      const w = this.getBaseWidth();
      const [x, y] = this.getOffset();
      bbox.combine(this.scriptChild.getOuterBBox(), w + x, y);
      bbox.w += this.font.params.scriptspace;
      return bbox;
    }

    /**
     * @override
     */
    get breakCount() {
      if (this._breakCount < 0) {
        this._breakCount = this.node.isEmbellished
          ? this.coreMO().embellishedBreakCount
          : !this.node.linebreakContainer
            ? this.childNodes[0].breakCount
            : 0;
      }
      return this._breakCount;
    }

    /**
     * msubsup/mub/msupo is a linebreak container for its scripts
     *
     * @override
     */
    public breakTop(mrow: WW, child: WW): WW {
      return this.node.linebreakContainer ||
        !this.parent ||
        this.node.childIndex(child.node)
        ? mrow
        : this.parent.breakTop(mrow, this as any as WW);
    }

    /**
     * @override
     */
    public computeLineBBox(i: number) {
      const n = this.breakCount;
      if (!n)
        return LineBBox.from(
          this.getOuterBBox(),
          this.linebreakOptions.lineleading
        );
      const bbox = this.baseChild.getLineBBox(i).copy();
      if (i < n) {
        if (i === 0) {
          this.addLeftBorders(bbox);
        }
        this.addMiddleBorders(bbox);
      } else {
        this.appendScripts(bbox);
        this.addMiddleBorders(bbox);
        this.addRightBorders(bbox);
      }
      return bbox;
    }
  } as any as B;
}
