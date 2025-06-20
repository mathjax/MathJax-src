/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  Implements the SvgMo wrapper for the MmlMo object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from '../FontData.js';
import {
  CommonMo,
  CommonMoClass,
  CommonMoMixin,
} from '../../common/Wrappers/mo.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMo } from '../../../core/MmlTree/MmlNodes/mo.js';
import { BBox } from '../../../util/BBox.js';
import { DIRECTION, SvgCharData } from '../FontData.js';

/*****************************************************************/

const VFUZZ = 0.1; // overlap for vertical stretchy glyphs
const HFUZZ = 0.1; // overlap for horizontal stretchy glyphs

/*****************************************************************/
/**
 * The SvgMo interface for the SVG Mo wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMoNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonMo<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgMoClass interface for the SVG Mo wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMoClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonMoClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMoNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMo wrapper class for the MmlMo class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export const SvgMo = (function <N, T, D>(): SvgMoClass<N, T, D> {
  const Base = CommonMoMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgMoClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMo extends Base implements SvgMoNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMo.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const attributes = this.node.attributes;
      const symmetric =
        (attributes.get('symmetric') as boolean) &&
        this.stretch.dir !== DIRECTION.Horizontal;
      const stretchy = this.stretch.dir !== DIRECTION.None;
      if (stretchy && this.size === null) {
        this.getStretchedVariant([]);
      }
      const svg = this.standardSvgNodes(parents);
      if (svg.length > 1 && this.breakStyle !== 'duplicate') {
        const i = this.breakStyle === 'after' ? 1 : 0;
        this.adaptor.remove(svg[i]);
        svg[i] = null;
      }
      if (stretchy && this.size < 0) {
        this.stretchSvg();
      } else {
        const u =
          symmetric || attributes.get('largeop')
            ? this.fixed(this.getCenterOffset())
            : '0';
        const v = this.node.getProperty('mathaccent')
          ? this.fixed(this.getAccentOffset())
          : '0';
        if (u !== '0' || v !== '0') {
          if (svg[0]) {
            this.adaptor.setAttribute(
              svg[0],
              'transform',
              `translate(${v} ${u})`
            );
          }
          if (svg[1]) {
            this.adaptor.setAttribute(
              svg[1],
              'transform',
              `translate(${v} ${u})`
            );
          }
        }
        if (svg[0]) {
          this.addChildren([svg[0]]);
        }
        if (svg[1]) {
          ((this.multChar || this) as SvgMo).addChildren([svg[1]]);
        }
      }
    }

    /**
     * Create the SVG for a multi-character stretchy delimiter
     */
    protected stretchSvg() {
      const stretch = this.stretch.stretch;
      const variants = this.getStretchVariants();
      const bbox = this.getBBox();
      if (this.stretch.dir === DIRECTION.Vertical) {
        this.stretchVertical(stretch, variants, bbox);
      } else {
        this.stretchHorizontal(stretch, variants, bbox);
      }
    }

    /**
     * Get the variant array for the assembly pieces
     *
     * @returns {string[]} The variants array
     */
    protected getStretchVariants() {
      const c = this.stretch.c || this.getText().codePointAt(0);
      const variants = [] as string[];
      for (const i of this.stretch.stretch.keys()) {
        variants[i] = this.font.getStretchVariant(c, i);
      }
      return variants;
    }

    /**
     * @param {number[]} stretch    The characters to use for stretching
     * @param {string[]} variant    The variants for the parts to use for stretching
     * @param {BBox} bbox           The full size of the stretched character
     */
    protected stretchVertical(
      stretch: number[],
      variant: string[],
      bbox: BBox
    ) {
      const { h, d, w } = bbox;
      const T = this.addTop(stretch[0], variant[0], h, w);
      const B = this.addBot(stretch[2], variant[2], d, w);
      if (stretch.length === 4) {
        const [H, D] = this.addMidV(stretch[3], variant[3], w);
        this.addExtV(stretch[1], variant[1], h, -H, T, 0, w);
        this.addExtV(stretch[1], variant[1], -D, d, 0, B, w);
      } else {
        this.addExtV(stretch[1], variant[1], h, d, T, B, w);
      }
    }

    /**
     * @param {number[]} stretch    The characters to use for stretching
     * @param {string[]} variant    The variants for the parts to use for stretching
     * @param {BBox} bbox           The full size of the stretched character
     */
    protected stretchHorizontal(
      stretch: number[],
      variant: string[],
      bbox: BBox
    ) {
      const w = bbox.w;
      const L = this.addLeft(stretch[0], variant[0]);
      const R = this.addRight(stretch[2], variant[2], w);
      if (stretch.length === 4) {
        const [x1, x2] = this.addMidH(stretch[3], variant[3], w);
        const w2 = w / 2;
        this.addExtH(stretch[1], variant[1], w2, L, w2 - x1);
        this.addExtH(stretch[1], variant[1], w2, x2 - w2, R, w2);
      } else {
        this.addExtH(stretch[1], variant[1], w, L, R);
      }
    }

    /***********************************************************/

    /**
     * @param {number} n         The number of the character to look up
     * @param {string} variant   The variant for the character to look up
     * @returns {SvgCharData}     The full CharData object, with CharOptions guaranteed to be defined
     */
    protected getChar(n: number, variant: string): SvgCharData {
      const char = this.font.getChar(variant, n) || [0, 0, 0, null];
      return [char[0], char[1], char[2], char[3] || {}] as [
        number,
        number,
        number,
        SvgCharOptions,
      ];
    }

    /**
     * @param {number} n         The character code for the glyph
     * @param {string} variant   The variant for the glyph
     * @param {number} x         The x position of the glyph
     * @param {number} y         The y position of the glyph
     * @param {N} parent         The container for the glyph
     * @returns {number}          The width of the character placed
     */
    protected addGlyph(
      n: number,
      variant: string,
      x: number,
      y: number,
      parent: N = null
    ): number {
      if (parent) {
        return this.placeChar(n, x, y, parent, variant);
      }
      if (this.dom[0]) {
        const dx = this.placeChar(n, x, y, this.dom[0], variant);
        if (!this.dom[1]) {
          return dx;
        }
      }
      return this.placeChar(n, x, y, this.dom[1], variant);
    }

    /***********************************************************/

    /**
     * @param {number} n    The character number for the top glyph
     * @param {string} v    The variant for the top glyph
     * @param {number} H    The height of the stretched delimiter
     * @param {number} W    The width of the stretched delimiter
     * @returns {number}     The total height of the top glyph
     */
    protected addTop(n: number, v: string, H: number, W: number): number {
      if (!n) return 0;
      const [h, d, w] = this.getChar(n, v);
      this.addGlyph(n, v, (W - w) / 2, H - h);
      return h + d;
    }

    /**
     * @param {number} n    The character number for the extender glyph
     * @param {string} v    The variant for the extender glyph
     * @param {number} H    The height of the stretched delimiter
     * @param {number} D    The depth of the stretched delimiter
     * @param {number} T    The height of the top glyph in the delimiter
     * @param {number} B    The height of the bottom glyph in the delimiter
     * @param {number} W    The width of the stretched delimiter
     */
    /* prettier-ignore */
    protected addExtV(n: number, v: string, H: number, D: number, T: number, B: number, W: number) {
      if (!n) return;
      T = Math.max(0, T - VFUZZ);              // A little overlap on top
      B = Math.max(0, B - VFUZZ);              // A little overlap on bottom
      const adaptor = this.adaptor;
      const [h, d, w] = this.getChar(n, v);
      const Y = H + D - T - B;                 // The height of the extender
      const s = 1.5 * Y / (h + d);             // Scale height by 1.5 to avoid bad ends
                                               //   (glyphs with rounded or anti-aliased ends don't stretch well,
                                               //    so this makes for sharper ends)
      const y = (s * (h - d) - Y) / 2;         // The bottom point to clip the extender
      if (Y <= 0) return;
      const svg = this.svg('svg', {
        width: this.fixed(w), height: this.fixed(Y),
        y: this.fixed(B - D), x: this.fixed((W - w) / 2),
        viewBox: [0, y, w, Y].map(x => this.fixed(x)).join(' ')
      });
      this.addGlyph(n, v, 0, 0, svg);
      const glyph = adaptor.lastChild(svg);
      adaptor.setAttribute(glyph as N, 'transform', `scale(1,${this.jax.fixed(s)})`);
      if (this.dom[0]) {
        adaptor.append(this.dom[0], svg);
      }
      if (this.dom[1]) {
        adaptor.append(this.dom[1], this.dom[0] ? adaptor.clone(svg) : svg);
      }
    }

    /**
     * @param {number} n    The character number for the bottom glyph
     * @param {string} v    The variant for the bottom glyph
     * @param {number} D    The depth of the stretched delimiter
     * @param {number} W    The width of the stretched delimiter
     * @returns {number}     The total height of the bottom glyph
     */
    protected addBot(n: number, v: string, D: number, W: number): number {
      if (!n) return 0;
      const [h, d, w] = this.getChar(n, v);
      this.addGlyph(n, v, (W - w) / 2, d - D);
      return h + d;
    }

    /**
     * @param {number} n    The character number for the middle glyph
     * @param {string} v    The variant for the middle glyph
     * @param {number} W    The width of the stretched delimiter
     * @returns {[number, number]}   The top and bottom positions of the middle glyph
     */
    protected addMidV(n: number, v: string, W: number): [number, number] {
      if (!n) return [0, 0];
      const [h, d, w] = this.getChar(n, v);
      const y = (d - h) / 2 + this.font.params.axis_height;
      this.addGlyph(n, v, (W - w) / 2, y);
      return [h + y, d - y];
    }

    /***********************************************************/

    /**
     * @param {number} n   The character number for the left glyph of the stretchy character
     * @param {string} v   The variant for the left glyph
     * @returns {number}    The width of the left glyph
     */
    protected addLeft(n: number, v: string): number {
      return n ? this.addGlyph(n, v, 0, 0) : 0;
    }

    /**
     * @param {number} n   The character number for the extender glyph of the stretchy character
     * @param {string} v   The variant for the extender glyph
     * @param {number} W   The width of the stretched character
     * @param {number} L   The width of the left glyph of the stretchy character
     * @param {number} R   The width of the right glyph of the stretchy character
     * @param {number} x   The x-position of the extender (needed for ones with two extenders)
     */
    protected addExtH(
      n: number,
      v: string,
      W: number,
      L: number,
      R: number,
      x: number = 0
    ) {
      if (!n) return;
      R = Math.max(0, R - HFUZZ); // A little less than the width of the right glyph
      L = Math.max(0, L - HFUZZ); // A little less than the width of the left glyph
      const adaptor = this.adaptor;
      const [h, d, w] = this.getChar(n, v);
      const X = W - L - R; // The width of the extender
      const Y = h + d + 2 * VFUZZ; // The height (plus some fuzz) of the extender
      const s = 1.5 * (X / w); // Scale the width so that left- and right-bearing won't hurt us
      const D = -(d + VFUZZ); // The bottom position of the glyph
      if (X <= 0) return;
      const svg = this.svg('svg', {
        width: this.fixed(X),
        height: this.fixed(Y),
        x: this.fixed(x + L),
        y: this.fixed(D),
        viewBox: [(s * w - X) / 2, D, X, Y].map((x) => this.fixed(x)).join(' '),
      });
      this.addGlyph(n, v, 0, 0, svg);
      const glyph = adaptor.lastChild(svg);
      adaptor.setAttribute(
        glyph as N,
        'transform',
        `scale(${this.jax.fixed(s)},1)`
      );
      if (this.dom[0]) {
        adaptor.append(this.dom[0], svg);
      }
      if (this.dom[1]) {
        adaptor.append(this.dom[1], this.dom[0] ? adaptor.clone(svg) : svg);
      }
    }

    /**
     * @param {number} n   The character number for the right glyph of the stretchy character
     * @param {string} v   The variant for the right glyph
     * @param {number} W   The width of the stretched character
     * @returns {number}    The width of the right glyph
     */
    protected addRight(n: number, v: string, W: number): number {
      if (!n) return 0;
      const w = this.getChar(n, v)[2];
      return this.addGlyph(n, v, W - w, 0);
    }

    /**
     * @param {number} n   The character number for the middle glyph of the stretchy character
     * @param {string} v   The variant for the middle glyph
     * @param {number} W   The width of the stretched character
     * @returns {[number, number]}  The positions of the left and right edges of the middle glyph
     */
    protected addMidH(n: number, v: string, W: number): [number, number] {
      if (!n) return [0, 0];
      const w = this.getChar(n, v)[2];
      this.addGlyph(n, v, (W - w) / 2, 0);
      return [(W - w) / 2, (W + w) / 2];
    }
  };
})<any, any, any>();
