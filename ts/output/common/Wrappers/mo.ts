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
 * @file  Implements the CommonMo wrapper mixin for the MmlMo object
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
import { MmlNode, TEXCLASS } from '../../../core/MmlTree/MmlNode.js';
import { MmlMo } from '../../../core/MmlTree/MmlNodes/mo.js';
import { BBox } from '../../../util/BBox.js';
import { LineBBox } from '../LineBBox.js';
import { unicodeChars } from '../../../util/string.js';
import { DIRECTION, NOSTRETCH } from '../FontData.js';

/*****************************************************************/
/**
 * The CommonMo interface
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
export interface CommonMo<
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
   * The font size that a stretched operator uses.
   * If -1, then stretch arbitrarily, and bbox gives the actual height, depth, width
   */
  size: number;

  /**
   * True if used as an accent in an munderover construct
   */
  isAccent: boolean;

  /**
   * The linebreak style
   */
  breakStyle: string;

  /**
   * The linebreakmultchar used for breaking an invisible times
   */
  multChar: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;

  /**
   * Value is 1 if this embellished mo is a breakpoint, 0 otherwise
   */
  embellishedBreakCount: number;

  /**
   * The break style string for this embellished operator
   */
  embellishedBreakStyle: string;

  /**
   * Get the (unmodified) bbox of the contents (before centering or setting accents to width 0)
   *
   * @param {BBox} bbox   The bbox to fill
   */
  protoBBox(bbox: BBox): void;

  /**
   * @param {number} i       The line to get the LineBBox for
   * @param {string} style   The linebreakstyle to use
   * @param {BBox} obox      The bounding box of the embellished operator that is breaking
   */
  moLineBBox(i: number, style: string, obox?: BBox): LineBBox;

  /**
   * @returns {number}    Offset to the left by half the actual width of the accent
   */
  getAccentOffset(): number;

  /**
   * @param {BBox} bbox   The bbox to center, or null to compute the bbox
   * @returns {number}     The offset to move the glyph to center it
   */
  getCenterOffset(bbox?: BBox): number;

  /**
   * Determint variant for vertically/horizontally stretched character
   *
   * @param {number[]} WH    Size to stretch to, either [W] or [H, D]
   * @param {boolean} exact  True if not allowed to use delimiter factor and shortfall
   */
  getStretchedVariant(WH: number[], exact?: boolean): void;

  /**
   * @param {string} name   The name of the attribute to get
   * @param {number} value  The default value to use
   * @returns {number}       The size in em's of the attribute (or the default value)
   */
  getSize(name: string, value: number): number;

  /**
   * @param {number[]} WH  Either [W] for width, [H, D] for height and depth, or [] for min/max size
   * @returns {number}      Either the width or the total height of the character
   */
  getWH(WH: number[]): number;

  /**
   * @param {number[]} WHD     The [W] or [H, D] being requested from the parent mrow
   * @param {number} D         The full dimension (including symmetry, etc)
   * @param {DelimiterData} C  The delimiter data for the stretchy character
   */
  getStretchBBox(WHD: number[], D: number, C: DelimiterData): void;

  /**
   * @param {number[]} WHD     The [H, D] being requested from the parent mrow
   * @param {number} HD        The full height (including symmetry, etc)
   * @param {DelimiterData} C  The delimiter data for the stretchy character
   * @returns {number[]}        The height and depth for the vertically stretched delimiter
   */
  getBaseline(WHD: number[], HD: number, C: DelimiterData): number[];

  /**
   * Determine the size of the delimiter based on whether full extenders should be used or not.
   *
   * @param {number} D          The requested size of the delimiter
   * @param {DelimiterData} C   The data for the delimiter
   * @returns {number}           The final size of the assembly
   */
  checkExtendedHeight(D: number, C: DelimiterData): number;

  /**
   * Set a breakpoint to the given type
   *
   * @param {string} linebreak   The type of linebreak to set
   */
  setBreakStyle(linebreak?: string): void;

  /**
   * Get the breakstyle of the mo
   *
   * @param {string} linebreak   Force style to be the given one
   * @returns {string}            The linebreak style of the node
   */
  getBreakStyle(linebreak?: string): string;

  /**
   * Create the mo wrapper for the linebreakmultchar
   */
  getMultChar(): void;
}

/**
 * The CommonMoClass interface
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
export interface CommonMoClass<
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
 * The CommomMo wrapper mixin for the MmlMo object
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
export function CommonMoMixin<
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
  return class CommonMoMixin
    extends Base
    implements CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public size: number = null;

    /**
     * @override
     */
    public isAccent: boolean;

    /**
     * @override
     */
    public breakStyle: string;

    /**
     * The linebreakmultchar used for breaking an invisible times
     */
    public multChar: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;

    /**
     * @override
     */
    get breakCount() {
      return this.breakStyle ? 1 : 0;
    }

    /**
     * @override
     */
    get embellishedBreakCount() {
      return this.embellishedBreakStyle ? 1 : 0;
    }

    /**
     * @override
     */
    get embellishedBreakStyle() {
      return this.breakStyle || this.getBreakStyle();
    }

    /**
     * @override
     */
    public protoBBox(bbox: BBox) {
      const stretchy = this.stretch.dir !== DIRECTION.None;
      if (stretchy && this.size === null) {
        this.getStretchedVariant([0]);
      }
      if (stretchy && this.size < 0) return;
      super.computeBBox(bbox);
      //
      //  Check for a null delimiter and add the null-delimiter space
      //
      if (
        bbox.w === 0 &&
        this.node.attributes.hasExplicit('fence') &&
        (this.node as MmlMo).getText() === '' &&
        (this.node.texClass === TEXCLASS.OPEN ||
          this.node.texClass === TEXCLASS.CLOSE) &&
        !this.jax.options.mathmlSpacing
      ) {
        bbox.R = this.font.params.nulldelimiterspace;
      }
      this.copySkewIC(bbox);
    }

    /**
     * @override
     */
    public getAccentOffset(): number {
      const bbox = BBox.empty();
      this.protoBBox(bbox);
      return -bbox.w / 2;
    }

    /**
     * @override
     */
    public getCenterOffset(bbox: BBox = null): number {
      if (!bbox) {
        bbox = BBox.empty();
        super.computeBBox(bbox);
      }
      return (bbox.h + bbox.d) / 2 + this.font.params.axis_height - bbox.h;
    }

    /**
     * @override
     */
    public getStretchedVariant(WH: number[], exact: boolean = false) {
      if (this.stretch.dir !== DIRECTION.None) {
        let D = this.getWH(WH);
        const min = this.getSize('minsize', 0);
        const max = this.getSize('maxsize', Infinity);
        const mathaccent = this.node.getProperty('mathaccent');
        //
        //  Clamp the dimension to the max and min
        //  then get the target size via TeX rules
        //
        D = Math.max(min, Math.min(max, D));
        const df = this.font.params.delimiterfactor / 1000;
        const ds = this.font.params.delimitershortfall;
        const m =
          min || exact
            ? D
            : mathaccent
              ? Math.min(D / df, D + ds)
              : Math.max(D * df, D - ds);
        //
        //  Look through the delimiter sizes for one that matches
        //
        const delim = this.stretch;
        const c = delim.c || this.getText().codePointAt(0);
        let i = 0;
        if (delim.sizes) {
          for (const d of delim.sizes) {
            if (d >= m) {
              if (mathaccent && i) {
                i--;
              }
              this.setDelimSize(c, i);
              return;
            }
            i++;
          }
        }
        //
        //  No size matches, so if we can make multi-character delimiters,
        //  record the data for that, otherwise, use the largest fixed size.
        //
        if (delim.stretch) {
          this.size = -1;
          this.invalidateBBox();
          this.getStretchBBox(WH, this.checkExtendedHeight(D, delim), delim);
        } else {
          this.setDelimSize(c, i - 1);
        }
      }
    }

    /**
     * @param {number} c     The character being set
     * @param {number} i     The size for that character
     */
    protected setDelimSize(c: number, i: number) {
      const delim = this.stretch;
      this.variant = this.font.getSizeVariant(c, i);
      this.size = i;
      const schar = delim.schar
        ? delim.schar[Math.min(i, delim.schar.length - 1)] || c
        : c;
      this.stretch = { ...delim, c: schar };
      this.childNodes[0].invalidateBBox();
    }

    /**
     * @override
     */
    public getSize(name: string, value: number): number {
      const attributes = this.node.attributes;
      if (attributes.isSet(name)) {
        value = this.length2em(attributes.get(name), 1, 1); // FIXME: should use height of actual character
      }
      return value;
    }

    /**
     * @override
     */
    public getWH(WH: number[]): number {
      if (WH.length === 0) return 0;
      if (WH.length === 1) return WH[0];
      const [H, D] = WH;
      const a = this.font.params.axis_height;
      return this.node.attributes.get('symmetric')
        ? 2 * Math.max(H - a, D + a)
        : H + D;
    }

    /**
     * @override
     */
    public getStretchBBox(WHD: number[], D: number, C: DelimiterData) {
      if (Object.hasOwn(C, 'min') && C.min > D) {
        D = C.min;
      }
      let [h, d, w] = C.HDW;
      if (this.stretch.dir === DIRECTION.Vertical) {
        [h, d] = this.getBaseline(WHD, D, C);
      } else {
        w = D;
        if (this.stretch.hd && !this.jax.options.mathmlSpacing) {
          //
          // Interpolate between full character height/depth and that of the extender,
          //   which is what TeX uses, but TeX's fonts are set up to have extra height
          //   or depth for some extenders, so this factor helps get spacing that is closer
          //   to TeX spacing.
          //
          const t = this.font.params.extender_factor;
          h = h * (1 - t) + this.stretch.hd[0] * t;
          d = d * (1 - t) + this.stretch.hd[1] * t;
        }
      }
      this.bbox.h = h;
      this.bbox.d = d;
      this.bbox.w = w;
    }

    /**
     * @override
     */
    public getBaseline(
      WHD: number[],
      HD: number,
      C: DelimiterData
    ): [number, number] {
      const hasWHD = WHD.length === 2 && WHD[0] + WHD[1] === HD;
      const symmetric = this.node.attributes.get('symmetric');
      const [H, D] = hasWHD ? WHD : [HD, 0];
      let [h, d] = [H + D, 0];
      if (symmetric) {
        //
        //  Center on the math axis
        //
        const a = this.font.params.axis_height;
        if (hasWHD) {
          h = 2 * Math.max(H - a, D + a);
        }
        d = h / 2 - a;
      } else if (hasWHD) {
        //
        //  Use the given depth (from mrow)
        //
        d = D;
      } else {
        //
        //  Use depth proportional to the normal-size character
        //  (when stretching for minsize or maxsize by itself)
        //
        const [ch, cd] = C.HDW || [0.75, 0.25];
        d = cd * (h / (ch + cd));
      }
      return [h - d, d];
    }

    /**
     * @override
     */
    public checkExtendedHeight(D: number, C: DelimiterData): number {
      if (C.fullExt) {
        const [extSize, endSize] = C.fullExt;
        const n = Math.ceil(Math.max(0, D - endSize) / extSize);
        D = endSize + n * extSize;
      }
      return D;
    }

    /**
     * @override
     */
    public setBreakStyle(linebreak: string = '') {
      this.breakStyle =
        this.node.parent.isEmbellished && !linebreak
          ? ''
          : this.getBreakStyle(linebreak);
      if (!this.breakCount) return;
      if (this.multChar) {
        //
        //  Update the spacing between the multchar and the next item
        //
        const i = this.parent.node.childIndex(this.node);
        const next = this.parent.node.childNodes[i + 1];
        if (next) {
          next.setTeXclass(this.multChar.node);
        }
      }
    }

    /**
     * @override
     */
    public getBreakStyle(linebreak: string = '') {
      const attributes = this.node.attributes;
      let style =
        linebreak ||
        (attributes.get('linebreak') === 'newline' ||
        this.node.getProperty('forcebreak')
          ? (attributes.get('linebreakstyle') as string)
          : '');
      if (style === 'infixlinebreakstyle') {
        style = attributes.get(style) as string;
      }
      return style;
    }

    /**
     * @override
     */
    getMultChar() {
      const multChar = this.node.attributes.get('linebreakmultchar') as string;
      if (multChar && this.getText() === '\u2062' && multChar !== '\u2062') {
        this.multChar = this.createMo(multChar);
      }
    }

    /***************************************************/

    /**
     * @override
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      this.isAccent = (this.node as MmlMo).isAccent;
      this.getMultChar();
      this.setBreakStyle();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      this.protoBBox(bbox);
      if (
        this.node.attributes.get('symmetric') &&
        this.stretch.dir !== DIRECTION.Horizontal
      ) {
        const d = this.getCenterOffset(bbox);
        bbox.h += d;
        bbox.d -= d;
      }
      if (
        this.node.getProperty('mathaccent') &&
        (this.stretch.dir === DIRECTION.None || this.size >= 0)
      ) {
        bbox.w = 0;
      }
    }

    /**
     * @override
     */
    public computeLineBBox(i: number): LineBBox {
      return this.moLineBBox(i, this.breakStyle);
    }

    /**
     * @override
     */
    public moLineBBox(i: number, style: string, obox: BBox = null) {
      const leadingString = this.node.attributes.get('lineleading') as string;
      const leading = this.length2em(
        leadingString,
        this.linebreakOptions.lineleading
      );
      if (i === 0 && style === 'before') {
        const bbox = LineBBox.from(BBox.zero(), leading);
        bbox.originalL = this.bbox.L;
        this.bbox.L = 0;
        return bbox;
      }
      let bbox = LineBBox.from(obox || this.getOuterBBox(), leading);
      if (i === 1) {
        if (style === 'after') {
          bbox.w = bbox.h = bbox.d = 0;
          bbox.isFirst = true;
          this.bbox.R = 0;
        } else if (style === 'duplicate') {
          bbox.L = 0;
        } else if (this.multChar) {
          bbox = LineBBox.from(this.multChar.getOuterBBox(), leading);
        }
        bbox.getIndentData(this.node);
      }
      return bbox;
    }

    /**
     * @override
     */
    public canStretch(direction: string) {
      if (this.stretch.dir !== DIRECTION.None) {
        return this.stretch.dir === direction;
      }
      const attributes = this.node.attributes;
      if (!attributes.get('stretchy')) return false;
      const c = this.getText();
      if (Array.from(c).length !== 1) return false;
      const delim = this.font.getDelimiter(c.codePointAt(0));
      this.stretch = (
        delim && delim.dir === direction ? delim : NOSTRETCH
      ) as DD;
      return this.stretch.dir !== DIRECTION.None;
    }

    /**
     * @override
     */
    public getVariant() {
      if (this.node.attributes.get('largeop')) {
        this.variant = this.node.attributes.get('displaystyle')
          ? '-largeop'
          : '-smallop';
        return;
      }
      if (
        !this.node.attributes.hasExplicit('mathvariant') &&
        this.node.getProperty('pseudoscript') === false
      ) {
        this.variant = '-tex-variant';
        return;
      }
      super.getVariant();
    }

    /**
     * @override
     */
    public remapChars(chars: number[]) {
      const primes = this.node.getProperty('primes') as string;
      if (primes) {
        return unicodeChars(primes);
      }
      if (chars.length === 1) {
        const parent = (this.node as MmlMo).coreParent().parent;
        const isAccent = this.isAccent && !parent.isKind('mrow');
        const map = isAccent ? 'accent' : 'mo';
        const text = this.font.getRemappedChar(map, chars[0]);
        if (text) {
          chars = this.unicodeChars(text, this.variant);
        }
      }
      return chars;
    }
  } as any as B;
}
