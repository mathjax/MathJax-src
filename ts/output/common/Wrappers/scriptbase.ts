/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Implements the a base mixin for CommonMsubsup, CommonMunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor, AnyWrapperClass} from '../Wrapper.js';
import {CommonMo} from './mo.js';
import {MmlMsubsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CommonScriptbase interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonScriptbase<W extends AnyWrapper> extends AnyWrapper {

  /**
   * The core mi or mo of the base (or the base itself if there isn't one)
   */
  readonly baseCore: W;

  /**
   * The base element's wrapper
   */
  readonly baseChild: W;

  /**
   * The relative scaling of the base compared to the munderover/msubsup
   */
  readonly baseScale: number;

  /**
   * The italic correction of the base (if any)
   */
  readonly baseIc: number;

  /**
   * True if the base is a single character
   */
  readonly baseIsChar: boolean;

  /**
   * True if this is an msup with script that is a math accent
   */
  readonly isMathAccent: boolean;

  /**
   * The script element's wrapper (overridden in subclasses)
   */
  readonly scriptChild: W;

  /***************************************************************************/
  /*
   *  Methods for information about the core element for the base
   */

  /**
   * @return {W}    The wrapper for the base core mi or mo (or whatever)
   */
  getBaseCore(): W;

  /**
   * @return {W}    The base fence item or null
   */
  getSemanticBase(): W;

  /**
   * Recursively retrieves an element for a given fencepointer.
   *
   * @param {W} fence The potential fence.
   * @param {string} id The fencepointer id.
   * @return {W} The original fence the scripts belong to.
   */
  getBaseFence(fence: W, id: string): W;

  /**
   * @return {number}   The scaling factor for the base core relative to the munderover/msubsup
   */
  getBaseScale(): number;

  /**
   * The base's italic correction (properly scaled)
   */
  getBaseIc(): number;

  /**
   * @return {boolean}  True if the base is an mi, mn, or mo (not a largeop) consisting of
   *                    a single unstretched character
   */
  isCharBase(): boolean;

  /***************************************************************************/
  /*
   *  Methods for sub-sup nodes
   */

  /**
   * Get the shift for the script (implemented in subclasses)
   *
   * @return {number[]}   The horizontal and vertical offsets for the script
   */
  getOffset(): number[];

  /**
   * Get the shift for a subscript (TeXBook Appendix G 18ab)
   *
   * @return {number}     The vertical offset for the script
   */
  getV(): number;

  /**
   * Get the shift for a superscript (TeXBook Appendix G 18acd)
   *
   * @return {number}     The vertical offset for the script
   */
  getU(): number;

  /***************************************************************************/
  /*
   *  Methods for under-over nodes
   */

  /**
   * @return {boolean}  True if the base has movablelimits (needed by munderover)
   */
  hasMovableLimits(): boolean;

  /**
   * Get the separation and offset for overscripts (TeXBoox Appendix G 13, 13a)
   *
   * @param {BBox} basebox  The bounding box of the base
   * @param {BBox} overbox  The bounding box of the overscript
   * @return {number[]}     The separation between their boxes, and the offset of the overscript
   */
  getOverKU(basebox: BBox, overbox: BBox): number[];

  /**
   * Get the separation and offset for underscripts (TeXBoox Appendix G 13, 13a)
   *
   * @param {BBox} basebox   The bounding box of the base
   * @param {BBox} underbox  The bounding box of the underscript
   * @return {number[]}      The separation between their boxes, and the offset of the underscript
   */
  getUnderKV(basebox: BBox, underbox: BBox): number[];

  /**
   * @param {BBox[]} boxes     The bounding boxes whose offsets are to be computed
   * @param {number[]=} delta  The initial x offsets of the boxes
   * @return {number[]}        The actual offsets needed to center the boxes in the stack
   */
  getDeltaW(boxes: BBox[], delta?: number[]): number[];

  /**
   * @param {boolean=} noskew   Whether to ignore the skew amount
   * @return {number}           The offset for under and over
   */
  getDelta(noskew?: boolean): number;

  /**
   * Handle horizontal stretching of children to match greatest width
   *  of all children
   */
  stretchChildren(): void;

}

export interface CommonScriptbaseClass extends AnyWrapperClass {
  /**
   * Set to true for munderover/munder/mover/msup (Appendix G 13)
   */
  useIC: boolean;
}

/**
 * Shorthand for the CommonScriptbase constructor
 *
 * @template W  The child-node Wrapper class
 */
export type ScriptbaseConstructor<W extends AnyWrapper> = Constructor<CommonScriptbase<W>>;

/*****************************************************************/
/**
 * A base class for msup/msub/msubsup and munder/mover/munderover
 * wrapper mixin implementations
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonScriptbaseMixin<
  W extends AnyWrapper,
  T extends WrapperConstructor
>(Base: T): ScriptbaseConstructor<W> & T {

  return class extends Base {

    /**
     * Set to true for munderover/munder/mover/msup (Appendix G 13)
     */
    public static useIC: boolean = false;

    /**
     * The core mi or mo of the base (or the base itself if there isn't one)
     */
    public baseCore: W;

    /**
     * The base element's wrapper
     */
    public baseScale: number = 1;

    /**
     * The relative scaling of the base compared to the munderover/msubsup
     */
    public baseIc: number = 0;

    /**
     * True if the base is a single character
     */
    public baseIsChar: boolean = false;

    /**
     * True if this is an msup with script that is a math accent
     */
    public isMathAccent: boolean = false;

    /**
     * @return {W}  The base element's wrapper
     */
    public get baseChild(): W {
      return this.childNodes[(this.node as MmlMsubsup).base];
    }

    /**
     * @return {W}  The script element's wrapper (overridden in subclasses)
     */
    public get scriptChild(): W {
      return this.childNodes[1];
    }

    /**
     * @override
     */
    constructor(...args: any[]) {
      super(...args);
      //
      //  Determine if we are setting a mathaccent
      //
      this.isMathAccent = (this.scriptChild && !!this.scriptChild.coreMO().node.getProperty('mathaccent')) as boolean;
      //
      //  Find the base core
      //
      const core = this.baseCore = this.getBaseCore();
      if (!core) return;
      //
      //  Check if the base is a mi or mo that needs italic correction removed
      //
      if (('noIC' in core) && !(this.constructor as CommonScriptbaseClass).useIC) {
        (core as unknown as CommonMo).noIC = true;
      }
      //
      // Get information about the base element
      //
      this.baseScale = this.getBaseScale();
      this.baseIc = this.getBaseIc();
      this.baseIsChar = this.isCharBase();
    }

    /***************************************************************************/
    /*
     *  Methods for information about the core element for the base
     */

    /**
     * @return {W}    The wrapper for the base core mi or mo (or whatever)
     */
    public getBaseCore(): W {
      let core = this.getSemanticBase() || this.childNodes[0];
      while (core &&
             ((core.childNodes.length === 1 &&
               (core.node.isKind('mrow') || core.node.isKind('TeXAtom') ||
                core.node.isKind('mstyle') || core.node.isKind('mpadded') ||
                core.node.isKind('mphantom') || core.node.isKind('semantics'))) ||
              (core.node.isKind('mover') && core.isMathAccent)))  {
        core = core.childNodes[0];
      }
      return core || this.childNodes[0];
    }

    /**
     * @return {W}    The base fence item or null
     */
    public getSemanticBase(): W {
      let fence = this.node.attributes.getExplicit('data-semantic-fencepointer') as string;
      return this.getBaseFence(this.baseChild, fence);
    }

    /**
     * Recursively retrieves an element for a given fencepointer.
     *
     * @param {W} fence The potential fence.
     * @param {string} id The fencepointer id.
     * @return {W} The original fence the scripts belong to.
     */
    public getBaseFence(fence: W, id: string): W {
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
     * @return {number}   The scaling factor for the base core relative to the munderover/msubsup
     */
    public getBaseScale(): number {
      let child = this.baseCore as any;
      let scale = 1;
      while (child && child !== this) {
        const bbox = child.getBBox();
        scale *= bbox.rscale;
        child = child.parent;
      }
      return scale;
    }

    /**
     * The base's italic correction (properly scaled)
     */
    public getBaseIc(): number {
      return (this.baseCore.bbox.ic ? 1.05 * this.baseCore.bbox.ic + .05 : 0) * this.baseScale;
    }

    /**
     * @return {boolean}  True if the base is an mi, mn, or mo (not a largeop) consisting of a single character
     */
    public isCharBase(): boolean {
      let base = this.baseCore;
      return (((base.node.isKind('mo') && (base as any).size === null) ||
               base.node.isKind('mi') || base.node.isKind('mn')) &&
              base.bbox.rscale === 1 && Array.from(base.getText()).length === 1 &&
              !base.node.attributes.get('largeop'));
    }

    /**
     * This gives the common bbox for msub and msup.  It is overridden
     * for all the others (msubsup, munder, mover, munderover).
     *
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      const [x, y] = this.getOffset();
      bbox.append(this.baseChild.getBBox());
      bbox.combine(this.scriptChild.getBBox(), bbox.w + x, y);
      bbox.w += this.font.params.scriptspace;
      bbox.clean();
      this.setChildPWidths(recompute);
    }

    /***************************************************************************/
    /*
     *  Methods for sub-sup nodes
     */

    /**
     * Get the shift for the script (implemented in subclasses)
     *
     * @return {[number, number]}   The horizontal and vertical offsets for the script
     */
    public getOffset(): [number, number] {
      return [0, 0];
    }

    /**
     * Get the shift for a subscript (TeXBook Appendix G 18ab)
     *
     * @return {number}     The vertical offset for the script
     */
    public getV(): number {
      const bbox = this.baseCore.getBBox();
      const sbox = this.scriptChild.getBBox();
      const tex = this.font.params;
      const subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub1);
      const scale = this.baseScale;
      return Math.max(
        this.baseIsChar && scale === 1 ? 0 : bbox.d * scale + tex.sub_drop * sbox.rscale,
        subscriptshift,
        sbox.h * sbox.rscale - (4 / 5) * tex.x_height
      );
    }

    /**
     * Get the shift for a superscript (TeXBook Appendix G 18acd)
     *
     * @return {number}     The vertical offset for the script
     */
    public getU(): number {
      const bbox = this.baseCore.getBBox();
      const sbox = this.scriptChild.getBBox();
      const tex = this.font.params;
      const attr = this.node.attributes.getList('displaystyle', 'superscriptshift');
      const prime = this.node.getProperty('texprimestyle');
      const p = prime ? tex.sup3 : (attr.displaystyle ? tex.sup1 : tex.sup2);
      const superscriptshift = this.length2em(attr.superscriptshift, p);
      const scale = this.baseScale;
      return Math.max(
        this.baseIsChar && scale === 1 ? 0 : bbox.h * scale - tex.sup_drop * sbox.rscale,
        superscriptshift,
        sbox.d * sbox.rscale + (1 / 4) * tex.x_height
      );
    }

    /***************************************************************************/
    /*
     *  Methods for under-over nodes
     */

    /**
     * @return {boolean}  True if the base has movablelimits (needed by munderover)
     */
    public hasMovableLimits(): boolean {
      const display = this.node.attributes.get('displaystyle');
      const mo = this.baseChild.coreMO().node;
      return (!display && !!mo.attributes.get('movablelimits'));
    }

    /**
     * Get the separation and offset for overscripts (TeXBoox Appendix G 13, 13a)
     *
     * @param {BBox} basebox  The bounding box of the base
     * @param {BBox} overbox  The bounding box of the overscript
     * @return {[number, number]}     The separation between their boxes, and the offset of the overscript
     */
    public getOverKU(basebox: BBox, overbox: BBox): [number, number] {
      const accent = this.node.attributes.get('accent') as boolean;
      const tex = this.font.params;
      const d = overbox.d * overbox.rscale;
      const k = (accent ? tex.rule_thickness :
                 Math.max(tex.big_op_spacing1, tex.big_op_spacing3 - Math.max(0, d))) -
        (this.baseChild.node.isKind('munderover') ? .1 : 0);
      return [k, basebox.h * basebox.rscale + k + d];
    }

    /**
     * Get the separation and offset for underscripts (TeXBoox Appendix G 13, 13a)
     *
     * @param {BBox} basebox   The bounding box of the base
     * @param {BBox} underbox  The bounding box of the underscript
     * @return {[number, number]}      The separation between their boxes, and the offset of the underscript
     */
    public getUnderKV(basebox: BBox, underbox: BBox): [number, number] {
      const accent = this.node.attributes.get('accentunder') as boolean;
      const tex = this.font.params;
      const h = underbox.h * underbox.rscale;
      const k = (accent ? tex.rule_thickness :
                 Math.max(tex.big_op_spacing2, tex.big_op_spacing4 - h)) -
        (this.baseChild.node.isKind('munderover') ? .1 : 0);
      return [k, -(basebox.d * basebox.rscale + k + h)];
    }

    /**
     * @param {BBox[]} boxes     The bounding boxes whose offsets are to be computed
     * @param {number[]=} delta  The initial x offsets of the boxes
     * @return {number[]}        The actual offsets needed to center the boxes in the stack
     */
    public getDeltaW(boxes: BBox[], delta: number[] = [0, 0, 0]): number[] {
      const align = this.node.attributes.get('align');
      const widths = boxes.map(box => box.w * box.rscale);
      const w = Math.max(...widths);
      const dw = [];
      let m = 0;
      for (const i of widths.keys()) {
        dw[i] = (align === 'center' ? (w - widths[i]) / 2 :
                 align === 'right' ? w - widths[i] : 0) + delta[i];
        if (dw[i] < m) {
          m = -dw[i];
        }
      }
      if (m) {
        for (const i of dw.keys()) {
          dw[i] += m;
        }
      }
      return dw;
    }

    /**
     * @param {boolean=} noskew   Whether to ignore the skew amount
     * @return {number}           The offset for under and over
     */
    public getDelta(noskew: boolean = false): number {
      const accent = this.node.attributes.get('accent');
      const {sk, ic} = this.baseCore.getBBox();
      return ((accent && !noskew ? sk : 0) + this.font.skewIcFactor * ic) * this.baseScale;
    }

    /**
     * Handle horizontal stretching of children to match greatest width
     *  of all children
     */
    public stretchChildren() {
      let stretchy: AnyWrapper[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const child of this.childNodes) {
        if (child.canStretch(DIRECTION.Horizontal)) {
          stretchy.push(child);
        }
      }
      let count = stretchy.length;
      let nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        let W = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the width of the non-stretchy children.
        //
        let all = (count > 1 && count === nodeCount);
        for (const child of this.childNodes) {
          const noStretch = (child.stretch.dir === DIRECTION.None);
          if (all || noStretch) {
            const {w, rscale} = child.getBBox(noStretch);
            if (w * rscale > W) W = w * rscale;
          }
        }
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          (child.coreMO() as CommonMo).getStretchedVariant([W / child.bbox.rscale]);
        }
      }
    }

  };

}
