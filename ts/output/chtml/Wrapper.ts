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
 * @file  Implements the ChtmlWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { OptionList } from '../../util/Options.js';
import {
  CommonWrapper,
  CommonWrapperClass,
  Constructor,
  StringMap,
  SPACE,
} from '../common/Wrapper.js';
import { CHTML } from '../chtml.js';
import { ChtmlWrapperFactory } from './WrapperFactory.js';
import { BBox } from '../../util/BBox.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
} from './FontData.js';

export { Constructor, StringMap } from '../common/Wrapper.js';

/*****************************************************************/

/**
 * Some standard sizes to use in predefind CSS properties
 */
export const FONTSIZE: StringMap = {
  '70.7%': 's',
  '70%': 's',
  '50%': 'ss',
  '60%': 'Tn',
  '85%': 'sm',
  '120%': 'lg',
  '144%': 'Lg',
  '173%': 'LG',
  '207%': 'hg',
  '249%': 'HG',
};

/*****************************************************************/

/**
 * Shorthand for making a ChtmlWrapper constructor
 */
export type ChtmlConstructor<N, T, D> = Constructor<ChtmlWrapper<N, T, D>>;

/*****************************************************************/
/**
 *  The type of the ChtmlWrapper class (used when creating the wrapper factory for this class)
 */
export interface ChtmlWrapperClass<N, T, D> extends CommonWrapperClass<
  //
  // The HTMLElement, TextNode, and Document classes (for the DOM implementation in use)
  //
  N,
  T,
  D,
  //
  // The Wrapper type and its Factory and Class (these need to know N, T, and D)
  //
  CHTML<N, T, D>,
  ChtmlWrapper<N, T, D>,
  ChtmlWrapperFactory<N, T, D>,
  ChtmlWrapperClass<N, T, D>,
  //
  // These are font-related objects that depend on the output jax; e,g. the character options
  //   for CHTML and SVG output differ (CHTML contains font information, while SVG has path data)
  //
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass
> {
  /**
   * If true, this causes a style for the node type to be generated automatically
   * that sets display:inline-block (as needed for the output for MmlNodes).
   */
  autoStyle: boolean;
}

/*****************************************************************/
/**
 *  The base ChtmlWrapper class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class ChtmlWrapper<N, T, D> extends CommonWrapper<
  N,
  T,
  D,
  CHTML<N, T, D>,
  ChtmlWrapper<N, T, D>,
  ChtmlWrapperFactory<N, T, D>,
  ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass
> {
  /**
   * @override
   */
  public static kind: string = 'unknown';

  /**
   * If true, this causes a style for the node type to be generated automatically
   * that sets display:inline-block (as needed for the output for MmlNodes).
   */
  public static autoStyle = true;

  /*******************************************************************/

  /**
   * Create the HTML for the wrapped node.
   *
   * @param {N[]} parents  The HTML nodes where the output is to be added
   */
  public toCHTML(parents: N[]) {
    if (this.toEmbellishedCHTML(parents)) return;
    this.addChildren(this.standardChtmlNodes(parents));
  }

  /**
   * Create the HTML for an embellished mo, if this is one.
   *
   * @param {N[]} parents  The HTML nodes where the output is to be added
   * @returns {boolean}     True when embellished output is produced, false if not
   */
  public toEmbellishedCHTML(parents: N[]): boolean {
    if (parents.length <= 1 || !this.node.isEmbellished) return false;
    const adaptor = this.adaptor;
    parents.forEach((dom) => adaptor.append(dom, this.html('mjx-linestrut')));
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
        this.toCHTML([parent]);
        dom.push(this.dom[0]);
        if (STYLE === 'after') {
          adaptor.removeAttribute(this.dom[0], 'space');
        }
      } else {
        dom.push(this.createChtmlNodes([parent])[0]);
      }
    }
    this.dom = dom;
    return true;
  }

  /**
   * @param {N[]} parents  The HTML nodes where the children are to be added
   */
  public addChildren(parents: N[]) {
    for (const child of this.childNodes) {
      child.toCHTML(parents);
    }
  }

  /*******************************************************************/

  /**
   * Create the standard CHTML elements for the given wrapped node.
   *
   * @param {N[]} parents  The HTML elements in which the node is to be created
   * @returns {N[]}  The roots of the HTML tree for the wrapped node's output
   */
  protected standardChtmlNodes(parents: N[]): N[] {
    this.markUsed();
    const chtml = this.createChtmlNodes(parents);
    this.handleStyles();
    this.handleScale();
    this.handleBorders();
    this.handleColor();
    this.handleSpace();
    this.handleAttributes();
    this.handlePWidth();
    return chtml;
  }

  /**
   * Mark this class as having been typeset (so its styles will be output)
   */
  public markUsed() {
    this.jax.wrapperUsage.add(this.kind);
  }

  /**
   * @param {N[]} parents  The HTML elements in which the node is to be created
   * @returns {N[]}  The roots of the HTML tree for the wrapped node's output
   */
  protected createChtmlNodes(parents: N[]): N[] {
    this.dom = parents.map((_parent) => this.html('mjx-' + this.node.kind)); // FIXME: add segment id
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
  protected handleHref(parents: N[]): N[] {
    const href = this.node.attributes.get('href');
    if (!href) return parents;
    return parents.map(
      (parent) =>
        this.adaptor.append(parent, this.html('a', { href: href })) as N
    );
  }

  /**
   * Set the CSS styles for the chtml element
   */
  protected handleStyles() {
    if (!this.styles) return;
    const styles = this.styles.cssText;
    if (styles) {
      const adaptor = this.adaptor;
      this.dom.forEach((dom) => adaptor.setAttribute(dom, 'style', styles));
      const family = this.styles.get('font-family');
      if (family) {
        this.dom.forEach((dom) =>
          adaptor.setStyle(
            dom,
            'font-family',
            this.font.cssFamilyPrefix + ', ' + family
          )
        );
      }
    }
  }

  /**
   * Set the (relative) scaling factor for the node
   */
  protected handleScale() {
    this.dom.forEach((dom) => this.setScale(dom, this.bbox.rscale));
  }

  /**
   * @param {N} chtml  The HTML node to scale
   * @param {number} rscale      The relatie scale to apply
   * @returns {N}       The HTML node (for chaining)
   */
  protected setScale(chtml: N, rscale: number): N {
    const scale = Math.abs(rscale - 1) < 0.001 ? 1 : rscale;
    if (chtml && scale !== 1) {
      const size = this.percent(scale);
      if (FONTSIZE[size]) {
        this.adaptor.setAttribute(chtml, 'size', FONTSIZE[size]);
      } else {
        this.adaptor.setStyle(chtml, 'fontSize', size);
      }
    }
    return chtml;
  }

  /**
   * Add the proper spacing
   */
  protected handleSpace() {
    const adaptor = this.adaptor;
    const breakable =
      !!this.node.getProperty('breakable') && !this.node.getProperty('newline');
    const n = this.dom.length - 1;
    for (const data of [
      [this.getLineBBox(0).L, 'space', 'marginLeft', 0],
      [this.getLineBBox(n).R, 'rspace', 'marginRight', n],
    ]) {
      const [dimen, name, margin, i] = data as [number, string, string, number];
      const space = this.em(dimen);
      if (breakable && name === 'space') {
        const node = adaptor.node(
          'mjx-break',
          SPACE[space]
            ? { size: SPACE[space] }
            : { style: `letter-spacing: ${this.em(dimen - 1)}` },
          [adaptor.text(' ')]
        );
        adaptor.insert(node, this.dom[i]);
      } else if (dimen) {
        if (SPACE[space]) {
          adaptor.setAttribute(this.dom[i], name, SPACE[space]);
        } else {
          adaptor.setStyle(this.dom[i], margin, space);
        }
      }
    }
  }

  /**
   * Remove sides for multiline rows
   */
  protected handleBorders() {
    const border = this.styleData?.border;
    const padding = this.styleData?.padding;
    const n = this.dom.length - 1;
    if (!border || !n) return;
    const adaptor = this.adaptor;
    for (const k of this.dom.keys()) {
      const dom = this.dom[k];
      if (k) {
        if (border.width[3]) {
          adaptor.setStyle(dom, 'border-left', ' none');
        }
        if (padding[3]) {
          adaptor.setStyle(dom, 'padding-left', '0');
        }
      }
      if (k !== n) {
        if (border.width[1]) {
          adaptor.setStyle(dom, 'border-right', 'none');
        }
        if (padding[1]) {
          adaptor.setStyle(dom, 'padding-right', '0');
        }
      }
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
      this.dom.forEach((dom) => adaptor.setStyle(dom, 'color', color));
    }
    if (background) {
      this.dom.forEach((dom) =>
        adaptor.setStyle(dom, 'backgroundColor', background)
      );
    }
  }

  /**
   * Copy RDFa, aria, and other tags from the MathML to the CHTML output nodes.
   * Don't copy those in the skipAttributes list, or anything that already exists
   * as a property of the node (e.g., no "onlick", etc.).  If a name in the
   * skipAttributes object is set to false, then the attribute WILL be copied.
   * Add the class to any other classes already in use.
   */
  protected handleAttributes() {
    const adaptor = this.adaptor;
    const attributes = this.node.attributes;
    const defaults = attributes.getAllDefaults();
    const skip = ChtmlWrapper.skipAttributes;
    for (const name of attributes.getExplicitNames()) {
      if (
        skip[name] === false ||
        (!(name in defaults) &&
          !skip[name] &&
          !adaptor.hasAttribute(this.dom[0], name))
      ) {
        const value = attributes.getExplicit(name) as string;
        this.dom.forEach((dom) => adaptor.setAttribute(dom, name, value));
      }
    }
    if (attributes.get('class')) {
      const names = (attributes.get('class') as string).trim().split(/ +/);
      for (const name of names) {
        this.dom.forEach((dom) => adaptor.addClass(dom, name));
      }
    }
    if (this.node.getProperty('inline-breaks')) {
      this.dom.forEach((dom) =>
        adaptor.setAttribute(dom, 'inline-breaks', 'true')
      );
    }
  }

  /**
   * Handle the attributes needed for percentage widths
   */
  protected handlePWidth() {
    if (this.bbox.pwidth) {
      const adaptor = this.adaptor;
      if (this.bbox.pwidth === BBox.fullWidth) {
        this.dom.forEach((dom) => adaptor.setAttribute(dom, 'width', 'full'));
      } else {
        this.dom.forEach((dom) =>
          adaptor.setStyle(dom, 'width', this.bbox.pwidth)
        );
      }
    }
  }

  /*******************************************************************/

  /**
   * @param {N} chtml       The HTML node whose indentation is to be adjusted
   * @param {string} align  The alignment for the node
   * @param {number} shift  The indent (positive or negative) for the node
   */
  protected setIndent(chtml: N, align: string, shift: number) {
    const adaptor = this.adaptor;
    if (align === 'center' || align === 'left') {
      const L = this.getBBox().L;
      if (shift + L) {
        adaptor.setStyle(chtml, 'margin-left', this.em(shift + L));
      }
    }
    if (align === 'center' || align === 'right') {
      const R = this.getBBox().R;
      if (shift + R) {
        adaptor.setStyle(chtml, 'margin-right', this.em(-shift + R));
      }
    }
  }

  /*******************************************************************/
  /**
   * For debugging
   */

  public drawBBox() {
    const { w, h, d, R } = this.getOuterBBox();
    const box = this.html(
      'mjx-box',
      {
        style: {
          opacity: 0.25,
          'margin-left': this.em(-w - R),
        },
      },
      [
        this.html('mjx-box', {
          style: {
            height: this.em(h),
            width: this.em(w),
            'background-color': 'red',
          },
        }),
        this.html('mjx-box', {
          style: {
            height: this.em(d),
            width: this.em(w),
            'margin-left': this.em(-w),
            'vertical-align': this.em(-d),
            'background-color': 'green',
          },
        }),
      ] as N[]
    );
    const node = this.dom[0] || this.parent.dom[0];
    const size = this.adaptor.getAttribute(node, 'size');
    if (size) {
      this.adaptor.setAttribute(box, 'size', size);
    }
    const fontsize = this.adaptor.getStyle(node, 'fontSize');
    if (fontsize) {
      this.adaptor.setStyle(box, 'fontSize', fontsize);
    }
    this.adaptor.append(this.adaptor.parent(node), box);
    this.adaptor.setStyle(node, 'backgroundColor', '#FFEE00');
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
   * @param {string} text  The text from which to create an HTML text node
   * @returns {T}           The generated text node with the given text
   */
  public text(text: string): T {
    return this.jax.text(text);
  }

  /**
   * @param {number} n  A unicode code point to be converted to a character className reference.
   * @returns {string}   The className for the character
   */
  protected char(n: number): string {
    return this.font.charSelector(n).substring(1);
  }
}
