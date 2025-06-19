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
 * @file  Implements the SvgMenclose wrapper for the MmlMenclose object
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
  CommonMenclose,
  CommonMencloseClass,
  CommonMencloseMixin,
} from '../../common/Wrappers/menclose.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMenclose } from '../../../core/MmlTree/MmlNodes/menclose.js';
import * as Notation from '../Notation.js';
import { SvgMsqrtNTD } from './msqrt.js';
import { OptionList } from '../../../util/Options.js';

/*****************************************************************/
/**
 * The SvgMenclose interface for the SVG menclose wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMencloseNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonMenclose<
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
      SvgMsqrtNTD<N, T, D>
    > {
  /**
   * Create a line element
   *
   * @param {number[]} pq   The coordinates of the endpoints, [x1, y1, x2, y2]
   * @returns {N}            The newly created line element
   */
  line(pq: [number, number, number, number]): N;

  /**
   * Create a rectangle element
   *
   * @param {number} w    The width of the rectangle
   * @param {number} h    The height of the rectangle
   * @param {number} d    The depth of the rectangle
   * @param {number=} r   The corner radius for a rounded rectangle
   * @returns {N}          The newly created line element
   */
  box(w: number, h: number, d: number, r?: number): N;

  /**
   * Create an ellipse element
   *
   * @param {number} w  The width of the ellipse
   * @param {number} h  The height of the ellipse
   * @param {number} d  The depth of the ellipse
   * @returns {N}        The newly created ellipse node
   */
  ellipse(w: number, h: number, d: number): N;

  /**
   * Create a path element from the commands that specify it
   *
   * @param {string} join           The join style for the path
   * @param {(string|number)[]} P   The list of commands and coordinates for the path
   * @returns {N}                    The newly created path
   */
  path(join: string, ...P: (string | number)[]): N;

  /**
   * Create a filled path element from the commands the specify it
   *   (same as path above, but no thickness adjustments)
   *
   * @param {(string|number)[]} P   The list of commands and coordinates for the path
   * @returns {N}                    The newly created path
   */
  fill(...P: (string | number)[]): N;
}

/**
 * The SvgMencloseClass interface for the SVG menclose wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMencloseClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonMencloseClass<
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
  ): SvgMencloseNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMenclose wrapper for the MmlMenclose class
 */
export const SvgMenclose = (function <N, T, D>(): SvgMencloseClass<N, T, D> {
  const Base = CommonMencloseMixin<
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
    SvgMsqrtNTD<N, T, D>,
    SvgMencloseClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMenclose extends Base implements SvgMencloseNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMenclose.prototype.kind;

    /**
     *  The definitions of the various notations
     */
    public static notations: Notation.DefList<SvgMenclose, N> = new Map([
      Notation.Border('top'),
      Notation.Border('right'),
      Notation.Border('bottom'),
      Notation.Border('left'),

      Notation.Border2('actuarial', 'top', 'right'),
      Notation.Border2('madruwb', 'bottom', 'right'),

      Notation.DiagonalStrike('up'),
      Notation.DiagonalStrike('down'),

      [
        'horizontalstrike',
        {
          renderer: Notation.RenderLine('horizontal', 'Y'),
          bbox: (node) => [0, node.padding, 0, node.padding],
        },
      ],

      [
        'verticalstrike',
        {
          renderer: Notation.RenderLine('vertical', 'X'),
          bbox: (node) => [node.padding, 0, node.padding, 0],
        },
      ],

      [
        'box',
        {
          renderer: (node, _child) => {
            const { w, h, d } = node.getBBox();
            node.adaptor.append(node.dom[0], node.box(w, h, d));
          },
          bbox: Notation.fullBBox,
          border: Notation.fullBorder,
          remove: 'left right top bottom',
        },
      ],

      [
        'roundedbox',
        {
          renderer: (node, _child) => {
            const { w, h, d } = node.getBBox();
            const r = node.thickness + node.padding;
            node.adaptor.append(node.dom[0], node.box(w, h, d, r));
          },
          bbox: Notation.fullBBox,
        },
      ],

      [
        'circle',
        {
          renderer: (node, _child) => {
            const { w, h, d } = node.getBBox();
            node.adaptor.append(node.dom[0], node.ellipse(w, h, d));
          },
          bbox: Notation.fullBBox,
        },
      ],

      [
        'phasorangle',
        {
          //
          // Use a bottom border and an upward strike properly angled
          //
          renderer: (node, _child) => {
            const { w, h, d } = node.getBBox();
            const a = node.getArgMod(1.75 * node.padding, h + d)[0];
            const t = node.thickness / 2;
            const HD = h + d;
            const cos = Math.cos(a);
            node.adaptor.append(
              node.dom[0],
              /* prettier-ignore */
              node.path('mitre', 'M', w, t - d, 'L',
                        t + cos * t, t - d, 'L', cos * HD + t, HD - d - t)
            );
          },
          bbox: (node) => {
            const p = node.padding / 2;
            const t = node.thickness;
            return [2 * p, p, p + t, 3 * p + t];
          },
          border: (node) => [0, 0, node.thickness, 0],
          remove: 'bottom',
        },
      ],

      Notation.Arrow('up'),
      Notation.Arrow('down'),
      Notation.Arrow('left'),
      Notation.Arrow('right'),

      Notation.Arrow('updown'),
      Notation.Arrow('leftright'),

      Notation.DiagonalArrow('updiagonal'), // backward compatibility
      Notation.DiagonalArrow('northeast'),
      Notation.DiagonalArrow('southeast'),
      Notation.DiagonalArrow('northwest'),
      Notation.DiagonalArrow('southwest'),

      Notation.DiagonalArrow('northeastsouthwest'),
      Notation.DiagonalArrow('northwestsoutheast'),

      [
        'longdiv',
        {
          //
          // Use a line along the top followed by a half ellipse at the left
          //
          renderer: (node, _child) => {
            const { w, h, d } = node.getBBox();
            const t = node.thickness / 2;
            const p = node.padding;
            node.adaptor.append(
              node.dom[0],
              /* prettier-ignore */
              node.path('round', 'M', t, t - d, 'a',
                        p - t / 2, (h + d) / 2 - 4 * t, 0, '0,1', 0,
                        h + d - 2 * t, 'L', w - t, h - t)
            );
          },
          bbox: (node) => {
            const p = node.padding;
            const t = node.thickness;
            return [p + t, p, p, 2 * p + t / 2];
          },
        },
      ],

      [
        'radical',
        {
          //
          //  Use the msqrt rendering, but remove the extra space due to the radical
          //    (it is added in at the end, so other notations overlap the root)
          //
          renderer: (node, child) => {
            node.msqrt.toSVG([child]);
            const left = node.sqrtTRBL()[3];
            node.place(-left, 0, child);
          },
          //
          //  Create the needed msqrt wrapper
          //
          init: (node) => {
            node.msqrt = node.createMsqrt(node.childNodes[0]);
          },
          //
          //  Add back in the padding for the square root
          //
          bbox: (node) => node.sqrtTRBL(),
          //
          //  This notation replaces the child
          //
          renderChild: true,
        },
      ],
    ] as Notation.DefPair<SvgMenclose, N>[]);

    /********************************************************/

    /**
     * @override
     */
    public line(pq: [number, number, number, number]): N {
      const [x1, y1, x2, y2] = pq;
      return this.svg('line', {
        x1: this.fixed(x1),
        y1: this.fixed(y1),
        x2: this.fixed(x2),
        y2: this.fixed(y2),
        'stroke-width': this.fixed(this.thickness),
      });
    }

    /**
     * @override
     */
    public box(w: number, h: number, d: number, r: number = 0): N {
      const t = this.thickness;
      const def: OptionList = {
        x: this.fixed(t / 2),
        y: this.fixed(t / 2 - d),
        width: this.fixed(w - t),
        height: this.fixed(h + d - t),
        fill: 'none',
        'stroke-width': this.fixed(t),
      };
      if (r) {
        def.rx = this.fixed(r);
      }
      return this.svg('rect', def);
    }

    /**
     * @override
     */
    public ellipse(w: number, h: number, d: number): N {
      const t = this.thickness;
      return this.svg('ellipse', {
        rx: this.fixed((w - t) / 2),
        ry: this.fixed((h + d - t) / 2),
        cx: this.fixed(w / 2),
        cy: this.fixed((h - d) / 2),
        fill: 'none',
        'stroke-width': this.fixed(t),
      });
    }

    /**
     * @override
     */
    public path(join: string, ...P: (string | number)[]): N {
      return this.svg('path', {
        d: P.map((x) => (typeof x === 'string' ? x : this.fixed(x))).join(' '),
        style: { 'stroke-width': this.fixed(this.thickness) },
        'stroke-linecap': 'round',
        'stroke-linejoin': join,
        fill: 'none',
      });
    }

    /**
     * @override
     */
    public fill(...P: (string | number)[]): N {
      return this.svg('path', {
        d: P.map((x) => (typeof x === 'string' ? x : this.fixed(x))).join(' '),
      });
    }

    /********************************************************/

    /**
     * @override
     */
    /* prettier-ignore */
    public arrow(W: number, a: number, double: boolean, offset: string = '', dist: number = 0): N {
      const {w, h, d} = this.getBBox();
      const dw = (W - w) / 2;
      const m = (h - d) / 2;
      const t = this.thickness;
      const t2 = t / 2;
      const [x, y, dx] = [t * this.arrowhead.x, t * this.arrowhead.y, t * this.arrowhead.dx];
      const arrow =
        (double ?
         this.fill(
           'M', w + dw, m,                            // point of arrow
           'l', -(x + dx), y,  'l', dx, t2 - y,       // upper right head
           'L', x - dw, m + t2,                       // upper side of shaft
           'l', dx, y - t2, 'l', -(x + dx), - y,      // left point
           'l', x + dx, -y,    'l', -dx, y - t2,      // lower left head
           'L', w + dw - x, m - t2,                   // lower side of shaft
           'l', -dx, t2 - y, 'Z'                      // lower head
         ) :
         this.fill(
           'M', w + dw, m,                            // point of arrow
           'l', -(x + dx), y,  'l', dx, t2 - y,       // upper head
           'L', -dw, m + t2, 'l', 0, -t,              // upper side of shaft
           'L', w + dw - x, m - t2,                   // lower side of shaft
           'l', -dx, t2 - y, 'Z'                      // lower head
         ));
      const transform = [];
      if (dist) {
        transform.push(offset === 'X' ? `translate(${this.fixed(-dist)} 0)` : `translate(0 ${this.fixed(dist)})`);
      }
      if (a) {
        const A = this.jax.fixed(-a * 180 / Math.PI);
        transform.push(`rotate(${A} ${this.fixed(w / 2)} ${this.fixed(m)})`);
      }
      if (transform.length) {
        this.adaptor.setAttribute(arrow, 'transform', transform.join(' '));
      }
      return arrow as N;
    }

    /********************************************************/

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const svg = this.standardSvgNodes(parents);
      //
      //  Create a box at the correct position and add the children
      //
      const left = this.getBBoxExtenders()[3];
      const def: OptionList = {};
      if (left > 0) {
        def.transform = 'translate(' + this.fixed(left) + ', 0)';
      }
      const block = this.adaptor.append(svg[0], this.svg('g', def)) as N;
      if (this.renderChild) {
        this.renderChild(this, block);
      } else {
        this.childNodes[0].toSVG([block]);
        this.childNodes[0].place(0, 0);
      }
      //
      //  Render all the notations for this menclose element
      //
      for (const name of Object.keys(this.notations)) {
        const notation = this.notations[name];
        if (!notation.renderChild) {
          notation.renderer(this, svg[0]);
        }
      }
    }
  };
})<any, any, any>();
