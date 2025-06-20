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
 * @file  Implements the SvgWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { OptionList } from '../../util/Options.js';
import { split } from '../../util/string.js';
import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../common/Wrapper.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from './FontData.js';
import { SVG, XLINKNS } from '../svg.js';
import { SvgWrapperFactory } from './WrapperFactory.js';

export { Constructor, StringMap } from '../common/Wrapper.js';

/*****************************************************************/

/**
 * Shorthand for makeing an SvgWrapper constructor
 */
export type SvgConstructor<N, T, D> = CommonWrapperConstructor<
  //
  // The HTMLElement, TextNode, and Document classes (for the DOM implementation in use)
  //
  N,
  T,
  D,
  //
  // The Wrapper type and its Factory and Class (these need to know N, T, and D)
  //
  SVG<N, T, D>,
  SvgWrapper<N, T, D>,
  SvgWrapperFactory<N, T, D>,
  SvgWrapperClass<N, T, D>,
  //
  // These are font-related objects that depend on the output jax; e,g. the character options
  //   for CHTML and SVG output differ (CHTML contains font information, while SVG has path data)
  //
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass
>;

/*****************************************************************/
/**
 *  The type of the SvgWrapper class (used when creating the wrapper factory for this class)
 */
export interface SvgWrapperClass<N, T, D>
  extends CommonWrapperClass<
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

/*****************************************************************/
/**
 *  The base SvgWrapper class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SvgWrapper<N, T, D> extends CommonWrapper<
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
  /**
   * The kind of wrapper
   */
  public static kind: string = 'unknown';

  /**
   * A fuzz factor for borders to avoid anti-alias problems at the edges
   */
  public static borderFuzz = 0.005;

  /**
   * Offset due to border/padding
   */
  public dx: number = 0;

  /**
   * buffered unknown text
   */
  protected utext: string = '';

  /**
   * @override
   */
  public font: SvgFontData;

  /*******************************************************************/

  /**
   * Create the HTML for the wrapped node.
   *
   * @param {N[]} parents  The HTML nodes where the output is to be added
   */
  public toSVG(parents: N[]) {
    if (this.toEmbellishedSVG(parents)) return;
    this.addChildren(this.standardSvgNodes(parents));
  }

  /**
   * Create the HTML for an embellished mo, if this is one.
   *
   * @param {N[]} parents  The HTML nodes where the output is to be added
   * @returns {boolean}     True when embellished output is produced, false if not
   */
  public toEmbellishedSVG(parents: N[]): boolean {
    if (parents.length <= 1 || !this.node.isEmbellished) return false;
    const style = this.coreMO().embellishedBreakStyle;
    //
    // At the end of the first line or beginning of the second,
    //   either typeset the embellished op, or create a placeholder
    //   and keep track of the created DOM nodes.
    //
    const dom = [];
    for (const [parent, STYLE] of [
      [parents[0], 'before'],
      [parents[1], 'after'],
    ] as [N, string][]) {
      if (style !== STYLE) {
        this.toSVG([parent]);
        dom.push(this.dom[0]);
        this.place(0, 0);
      } else {
        dom.push(this.createSvgNodes([parent])[0]);
      }
    }
    this.dom = dom;
    return true;
  }

  /**
   * @param {N[]} parents  The element in which to add the children
   */
  public addChildren(parents: N[]) {
    let x = 0;
    for (const child of this.childNodes) {
      child.toSVG(parents);
      const bbox = child.getOuterBBox();
      if (child.dom) {
        child.place(x + bbox.L * bbox.rscale, 0);
      }
      x += (bbox.L + bbox.w + bbox.R) * bbox.rscale;
    }
  }

  /*******************************************************************/

  /**
   * Create the standard SVG element for the given wrapped node.
   *
   * @param {N[]} parents  The HTML elements in which the node is to be created
   * @returns {N[]}  The roots of the HTML trees for the wrapped node's output
   */
  protected standardSvgNodes(parents: N[]): N[] {
    const svg = this.createSvgNodes(parents);
    this.handleStyles();
    this.handleScale();
    this.handleBorder();
    this.handleColor();
    this.handleAttributes();
    return svg;
  }

  /**
   * @param {N[]} parents  The HTML elements in which the node is to be created
   * @returns {N[]}  The roots of the HTML tree for the wrapped node's output
   */
  protected createSvgNodes(parents: N[]): N[] {
    this.dom = parents.map((_parent) =>
      this.svg('g', { 'data-mml-node': this.node.kind })
    ); // FIXME: add segment id
    parents = this.handleHref(parents);
    for (const i of parents.keys()) {
      this.adaptor.append(parents[i], this.dom[i]);
    }
    return this.dom;
  }

  /**
   * Add an anchor for hrefs and insert hot boxes into the DOM containers
   *
   * @param {N[]} parents   The HTML nodes in which the output is to be placed
   * @returns {N[]}          The roots of the HTML tree for the node's output
   */
  protected handleHref(parents: N[]) {
    const href = this.node.attributes.get('href');
    if (!href) return parents;
    let i = 0;
    const isEmbellished = this.node.isEmbellished && !this.node.isKind('mo');
    return parents.map((parent) => {
      parent = this.adaptor.append(parent, this.svg('a', { href: href })) as N;
      const { h, d, w } = isEmbellished
        ? this.getOuterBBox()
        : this.getLineBBox(i);
      this.adaptor.append(
        this.dom[i++],
        this.svg('rect', {
          'data-hitbox': true,
          fill: 'none',
          stroke: 'none',
          'pointer-events': 'all',
          width: this.fixed(w),
          height: this.fixed(h + d),
          x: i === 1 || isEmbellished ? this.fixed(-this.dx) : 0,
          y: this.fixed(-d),
        })
      );
      return parent;
    });
  }

  /**
   * Set the CSS styles for the svg element
   */
  protected handleStyles() {
    if (!this.styles) return;
    const styles = this.styles.cssText;
    if (styles) {
      this.dom.forEach((node) =>
        this.adaptor.setAttribute(node, 'style', styles)
      );
    }
    const padding = (this.styleData?.padding || [0, 0, 0, 0])[3];
    const border = (this.styleData?.border?.width || [0, 0, 0, 0])[3];
    if (padding || border) {
      this.dx = padding + border;
    }
  }

  /**
   * Set the (relative) scaling factor for the node
   */
  protected handleScale() {
    if (this.bbox.rscale !== 1) {
      const scale = 'scale(' + this.fixed(this.bbox.rscale / 1000, 3) + ')';
      this.dom.forEach((node) =>
        this.adaptor.setAttribute(node, 'transform', scale)
      );
    }
  }

  /**
   * Add the foreground and background colors
   * (Only look at explicit attributes, since inherited ones will
   *  be applied to a parent element, and we will inherit from that)
   */
  protected handleColor() {
    const adaptor = this.adaptor;
    const attributes = this.node.attributes;
    const color = (attributes.getExplicit('mathcolor') ||
      attributes.getExplicit('color')) as string;
    const background = (attributes.getExplicit('mathbackground') ||
      attributes.getExplicit('background') ||
      this.styles?.get('background-color')) as string;
    if (color) {
      this.dom.forEach((node) => {
        adaptor.setAttribute(node, 'fill', color);
        adaptor.setAttribute(node, 'stroke', color);
      });
    }
    if (background) {
      let i = 0;
      const isEmbellished = this.node.isEmbellished && !this.node.isKind('mo');
      this.dom.forEach((node) => {
        const { h, d, w } = isEmbellished
          ? this.getOuterBBox()
          : this.getLineBBox(i++);
        const rect = this.svg('rect', {
          fill: background,
          x: i === 1 || isEmbellished ? this.fixed(-this.dx) : 0,
          y: this.fixed(-d),
          width: this.fixed(w),
          height: this.fixed(h + d),
          'data-bgcolor': true,
        });
        const child = adaptor.firstChild(node);
        if (child) {
          adaptor.insert(rect, child);
        } else {
          adaptor.append(node, rect);
        }
      });
    }
  }

  /**
   * Create the borders, if any are requested.
   */
  protected handleBorder() {
    const border = this.styleData?.border;
    if (!border) return;
    const f = SvgWrapper.borderFuzz;
    const adaptor = this.adaptor;
    let k = 0;
    const n = this.dom.length - 1;
    const isEmbellished = this.node.isEmbellished && !this.node.isKind('mo');
    for (const dom of this.dom) {
      const L = !n || !k ? 1 : 0;
      const R = !n || k === n ? 1 : 0;
      const bbox = isEmbellished ? this.getOuterBBox() : this.getLineBBox(k++);
      const [h, d, w] = [bbox.h + f, bbox.d + f, bbox.w + f];
      const outerRT = [w, h];
      const outerLT = [-f, h];
      const outerRB = [w, -d];
      const outerLB = [-f, -d];
      const innerRT = [w - R * border.width[1], h - border.width[0]];
      const innerLT = [-f + L * border.width[3], h - border.width[0]];
      const innerRB = [w - R * border.width[1], -d + border.width[2]];
      const innerLB = [-f + L * border.width[3], -d + border.width[2]];
      const paths: number[][][] = [
        [outerLT, outerRT, innerRT, innerLT],
        [outerRB, outerRT, innerRT, innerRB],
        [outerLB, outerRB, innerRB, innerLB],
        [outerLB, outerLT, innerLT, innerLB],
      ];
      const child = adaptor.firstChild(dom) as N;
      const dx = L * this.dx;
      for (const i of [0, 1, 2, 3]) {
        if (!border.width[i] || (i === 3 && !L) || (i === 1 && !R)) continue;
        const path = paths[i];
        if (border.style[i] === 'dashed' || border.style[i] === 'dotted') {
          this.addBorderBroken(
            path,
            border.color[i],
            border.style[i],
            border.width[i],
            i,
            dom,
            dx
          );
        } else {
          this.addBorderSolid(path, border.color[i], child, dom, dx);
        }
      }
    }
  }

  /**
   * Create a solid border piece with the given color
   *
   * @param {[number, number][]} path    The points for the border segment
   * @param {string} color               The color to use
   * @param {N} child                    Insert the border before this child, if any
   * @param {N} parent                   The parent container
   * @param {number} dx                  The offset of the node
   */
  protected addBorderSolid(
    path: number[][],
    color: string,
    child: N,
    parent: N,
    dx: number
  ) {
    const border = this.svg('polygon', {
      points: path
        .map(([x, y]) => `${this.fixed(x - dx)},${this.fixed(y)}`)
        .join(' '),
      stroke: 'none',
    });
    if (color) {
      this.adaptor.setAttribute(border, 'fill', color);
    }
    if (child) {
      this.adaptor.insert(border, child);
    } else {
      this.adaptor.append(parent, border);
    }
  }

  /**
   * Create a dashed or dotted border line with the given width and color
   *
   * @param {[number, number][]} path   The points for the border segment
   * @param {string} color              The color to use
   * @param {string} style              Either 'dotted' or 'dashed'
   * @param {number} t                  The thickness for the border line
   * @param {number} i                  The side being drawn
   * @param {N} parent                  The parent container
   * @param {number} dx                  The offset of the node
   */
  protected addBorderBroken(
    path: number[][],
    color: string,
    style: string,
    t: number,
    i: number,
    parent: N,
    dx: number
  ) {
    const dot = style === 'dotted';
    const t2 = t / 2;
    const [tx1, ty1, tx2, ty2] = [
      [t2, -t2, -t2, -t2],
      [-t2, t2, -t2, -t2],
      [t2, t2, -t2, t2],
      [t2, t2, t2, -t2],
    ][i];
    const [A, B] = path;
    const x1 = A[0] + tx1 - dx;
    const y1 = A[1] + ty1;
    const x2 = B[0] + tx2 - dx;
    const y2 = B[1] + ty2;
    const W = Math.abs(i % 2 ? y2 - y1 : x2 - x1);
    const n = dot ? Math.ceil(W / (2 * t)) : Math.ceil((W - t) / (4 * t));
    const m = W / (4 * n + 1);
    const line = this.svg('line', {
      x1: this.fixed(x1),
      y1: this.fixed(y1),
      x2: this.fixed(x2),
      y2: this.fixed(y2),
      'stroke-width': this.fixed(t),
      stroke: color,
      'stroke-linecap': dot ? 'round' : 'square',
      'stroke-dasharray': dot
        ? [1, this.fixed(W / n - 0.002)].join(' ')
        : [this.fixed(m), this.fixed(3 * m)].join(' '),
    });
    const adaptor = this.adaptor;
    const child = adaptor.firstChild(parent);
    if (child) {
      adaptor.insert(line, child);
    } else {
      adaptor.append(parent, line);
    }
  }

  /**
   * Copy RDFa, aria, and other tags from the MathML to the SVG output nodes.
   * Don't copy those in the skipAttributes list, or anything that already exists
   * as a property of the node (e.g., no "onlick", etc.).  If a name in the
   * skipAttributes object is set to false, then the attribute WILL be copied.
   * Add the class to any other classes already in use.
   */
  protected handleAttributes() {
    const adaptor = this.adaptor;
    const attributes = this.node.attributes;
    const defaults = attributes.getAllDefaults();
    const skip = SvgWrapper.skipAttributes;
    for (const name of attributes.getExplicitNames()) {
      if (
        skip[name] === false ||
        (!(name in defaults) &&
          !skip[name] &&
          !adaptor.hasAttribute(this.dom[0], name))
      ) {
        this.dom.forEach((dom) =>
          adaptor.setAttribute(
            dom,
            name,
            attributes.getExplicit(name) as string
          )
        );
      }
    }
    if (attributes.get('class')) {
      for (const name of split(attributes.get('class') as string)) {
        this.dom.forEach((node) => adaptor.addClass(node, name));
      }
    }
  }

  /*******************************************************************/

  /**
   * @param {number} x   The x-offset for the element
   * @param {number} y   The y-offset for the element
   * @param {N} element  The element to be placed
   */
  public place(x: number, y: number, element: N = null) {
    if (!element) {
      x += this.dx * this.bbox.rscale;
    }
    if (!(x || y)) return;
    if (!element) {
      element = this.dom[0]; // FIXME:  DOM tree
      y = this.handleId(y);
    }
    const translate = `translate(${this.fixed(x)},${this.fixed(y)})`;
    const transform = this.adaptor.getAttribute(element, 'transform') || '';
    this.adaptor.setAttribute(
      element,
      'transform',
      translate + (transform ? ' ' + transform : '')
    );
  }

  /**
   * Firefox and Safari don't scroll to the top of the element with an Id, so
   *   we shift the element up and then translate its contents down in order to
   *   correct for their positioning.  Also, Safari will go to the baseline of
   *   a <text> element (e.g., when mtextInheritFont is true), so add a text
   *   element to help Safari get the right location.
   *
   * @param {number} y     The current offset of the element
   * @returns {number}      The new offset for the element if it has an id
   */
  protected handleId(y: number): number {
    if (!this.node.attributes || !this.node.attributes.get('id')) {
      return y;
    }
    const adaptor = this.adaptor;
    const { h, rscale } = this.getBBox();
    //
    //  Remove the element's children and put them into a <g> with transform
    //
    const children = adaptor.childNodes(this.dom[0]);
    children.forEach((child) => adaptor.remove(child));
    const g = this.svg(
      'g',
      { 'data-idbox': true, transform: `translate(0,${this.fixed(-h)})` },
      children
    );
    //
    //  Add the text element (not transformed) and the transformed <g>
    //
    adaptor.append(
      this.dom[0],
      this.svg('text', { 'data-id-align': true }, [this.text('')])
    );
    adaptor.append(this.dom[0], g);
    return y + h * rscale;
  }

  /**
   * Return the first child element, skipping id align boxes and href hit boxes
   *
   * @param {N} dom The dom element
   * @returns {N}   The first "real" child element
   */
  public firstChild(dom: N = this.dom[0]): N {
    const adaptor = this.adaptor;
    let child = adaptor.firstChild(dom);
    if (
      child &&
      adaptor.kind(child) === 'text' &&
      adaptor.getAttribute(child as N, 'data-id-align')
    ) {
      child = adaptor.firstChild(adaptor.next(child) as N);
    }
    if (
      child &&
      adaptor.kind(child) === 'rect' &&
      adaptor.getAttribute(child as N, 'data-hitbox')
    ) {
      child = adaptor.next(child);
    }
    return child as N;
  }

  /**
   * @param {number} n        The character number
   * @param {number} x        The x-position of the character
   * @param {number} y        The y-position of the character
   * @param {N} parent        The container for the character
   * @param {string} variant  The variant to use for the character
   * @param {boolean} buffer  True to collect unknown characters into one text element
   * @returns {number}         The width of the character
   */
  public placeChar(
    n: number,
    x: number,
    y: number,
    parent: N,
    variant: string = null,
    buffer: boolean = false
  ): number {
    if (variant === null) {
      variant = this.variant;
    }
    const C = n.toString(16).toUpperCase();
    const [, , w, data] = this.getVariantChar(variant, n);
    if (data.unknown) {
      this.utext += String.fromCodePoint(n);
      return buffer ? 0 : this.addUtext(x, y, parent, variant);
    }
    const dx = this.addUtext(x, y, parent, variant);
    if ('p' in data) {
      x += dx;
      const path = data.p ? 'M' + data.p + 'Z' : '';
      this.place(
        x,
        y,
        this.adaptor.append(parent, this.charNode(variant, C, path)) as N
      );
      return w + dx;
    }
    if ('c' in data) {
      const g = this.adaptor.append(
        parent,
        this.svg('g', { 'data-c': C })
      ) as N;
      this.place(x + dx, y, g);
      x = 0;
      for (const n of this.unicodeChars(data.c, variant)) {
        x += this.placeChar(n, x, y, g, variant);
      }
      return x + dx;
    }
    return w;
  }

  /**
   * @param {number} x         The x-position of the text
   * @param {number} y         The y-position of the text
   * @param {N} parent         The container for the text
   * @param {string} variant   The variant to use for the string
   * @returns {number}         The computed width of the text
   */
  protected addUtext(x: number, y: number, parent: N, variant: string): number {
    const c = this.utext;
    if (!c) {
      return 0;
    }
    this.utext = '';
    const text = this.adaptor.append(
      parent,
      this.jax.unknownText(c, variant)
    ) as N;
    this.place(x, y, text);
    return this.jax.measureTextNodeWithCache(text, c, variant).w;
  }

  /**
   * @param {string} variant    The name of the variant being used
   * @param {string} C          The hex string for the character code
   * @param {string} path       The data from the character
   * @returns {N}                The <path> or <use> node for the glyph
   */
  protected charNode(variant: string, C: string, path: string): N {
    const cache = this.jax.options.fontCache;
    return cache !== 'none'
      ? this.useNode(variant, C, path)
      : this.pathNode(C, path);
  }

  /**
   * @param {string} C          The hex string for the character code
   * @param {string} path       The data from the character
   * @returns {N}                The <path> for the glyph
   */
  protected pathNode(C: string, path: string): N {
    return this.svg('path', { 'data-c': C, d: path });
  }

  /**
   * @param {string} variant    The name of the variant being used
   * @param {string} C          The hex string for the character code
   * @param {string} path       The data from the character
   * @returns {N}                The <use> node for the glyph
   */
  protected useNode(variant: string, C: string, path: string): N {
    const use = this.svg('use', { 'data-c': C });
    const id = '#' + this.jax.fontCache.cachePath(variant, C, path);
    this.adaptor.setAttribute(
      use,
      'href',
      id,
      this.jax.options.useXlink ? XLINKNS : null
    );
    return use;
  }

  /*******************************************************************/
  /**
   * For debugging
   */

  public drawBBox() {
    const { w, h, d } = this.getOuterBBox();
    const L = (this.styleData?.border?.width || [0, 0, 0, 0])[3];
    const def = { style: { opacity: 0.25 } } as OptionList;
    if (L) {
      def.transform = `translate(${this.fixed(-L)}, 0)`;
    }
    const box = this.svg('g', def, [
      this.svg('rect', {
        fill: 'red',
        height: this.fixed(h),
        width: this.fixed(w),
      }),
      this.svg('rect', {
        fill: 'green',
        height: this.fixed(d),
        width: this.fixed(w),
        y: this.fixed(-d),
      }),
    ] as N[]);
    const node = this.dom[0] || this.parent.dom[0];
    this.adaptor.append(node, box);
  }

  /*******************************************************************/
  /*
   * Easy access to some utility routines
   */

  /**
   * @param {string} type      The tag name of the HTML node to be created
   * @param {OptionList} def   The properties to set for the created node
   * @param {(N|T)[]} content  The child nodes for the created HTML node
   * @returns {N}               The generated HTML tree
   */
  public html(type: string, def: OptionList = {}, content: (N | T)[] = []): N {
    return this.jax.html(type, def, content);
  }

  /**
   * @param {string} type      The tag name of the svg node to be created
   * @param {OptionList} def   The properties to set for the created node
   * @param {(N|T)[]} content  The child nodes for the created SVG node
   * @returns {N}               The generated SVG tree
   */
  public svg(type: string, def: OptionList = {}, content: (N | T)[] = []): N {
    return this.jax.svg(type, def, content);
  }

  /**
   * @param {string} text  The text from which to create an HTML text node
   * @returns {T}  The generated text node with the given text
   */
  public text(text: string): T {
    return this.jax.text(text);
  }

  /**
   * @param {number} x   The dimension to display
   * @param {number=} n  The number of digits to display
   * @returns {string}    The dimension with the given number of digits (minus trailing zeros)
   */
  public fixed(x: number, n: number = 1): string {
    return this.jax.fixed(x * 1000, n);
  }
}
