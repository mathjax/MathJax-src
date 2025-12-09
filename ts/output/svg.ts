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
 * @file  Implements the SVG OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CommonOutputJax, UnknownBBox } from './common.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { SvgWrapper, SvgWrapperClass } from './svg/Wrapper.js';
import { SvgWrapperFactory } from './svg/WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from './svg/FontData.js';
import { StyleJson, StyleJsonSheet } from '../util/StyleJson.js';
import { FontCache } from './svg/FontCache.js';
import { unicodeChars } from '../util/string.js';
import * as LENGTHS from '../util/lengths.js';
import { SPACE } from './common/Wrapper.js';
import { DefaultFont } from './svg/DefaultFont.js';

export const SVGNS = 'http://www.w3.org/2000/svg';
export const XLINKNS = 'http://www.w3.org/1999/xlink';

/*****************************************************************/
/**
 *  Implements the SVG class (extends AbstractOutputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVG<N, T, D> extends CommonOutputJax<
  //
  // The HTMLElement, TextNode, and Document classes (for the DOM implementation in use)
  //
  N,
  T,
  D,
  //
  // The Wrapper type and its Factory and Class (these need to know N, T, and D)
  //
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
> {
  /**
   * The name of the output jax
   */
  public static NAME: string = 'SVG';

  /**
   * @override
   */
  /* prettier-ignore */
  public static OPTIONS: OptionList = {
    ...CommonOutputJax.OPTIONS,
    blacker: 3,                     // the stroke-width to use for SVG character paths
    fontCache: 'local',             // or 'global' or 'none'
    localID: null,                  // ID to use for local font cache (for single equation processing)
    useXlink: true,                 // true to include xlink namespace for <use> hrefs, false to not
  };

  /**
   *  The default styles for SVG
   */
  public static commonStyles: StyleJson = {
    ...CommonOutputJax.commonStyles,
    'mjx-container[jax="SVG"]': {
      direction: 'ltr',
      'white-space': 'nowrap',
    },
    'mjx-container[jax="SVG"] > svg': {
      overflow: 'visible',
      'min-height': '1px',
      'min-width': '1px',
    },
    'mjx-container[jax="SVG"] > svg a': {
      fill: 'blue',
      stroke: 'blue',
    },
    [[
      'rect[data-sre-highlighter-added]:has(+ .mjx-selected)',
      'rect[data-sre-highlighter-bbox].mjx-selected',
    ].join(', ')]: {
      stroke: 'black',
      'stroke-width': '80px',
    },
    '@media (prefers-color-scheme: dark)': {
      [[
        'rect[data-sre-highlighter-added]:has(+ .mjx-selected)',
        'rect[data-sre-highlighter-bbox].mjx-selected',
      ].join(', ')]: {
        stroke: '#C8C8C8',
      },
    },
  };

  /**
   * The ID for the SVG element that stores the cached font paths
   */
  public static FONTCACHEID = 'MJX-SVG-global-cache';

  /**
   * The ID for the stylesheet element for the styles for the SVG output
   */
  public static STYLESHEETID = 'MJX-SVG-styles';

  /**
   * @override
   */
  get forceInlineBreaks() {
    return true; // We need to break up the output into several separate SVGs
  }

  /**
   * Stores the information about the cached character glyphs
   */
  public fontCache: FontCache<N, T, D>;

  /**
   * Minimum width for tables with labels,
   */
  public minwidth: number = 0;
  /**
   * The shift for the main equation
   */
  public shift: number = 0;

  /**
   * The SVG stylesheet, once it is constructed
   */
  public svgStyles: N = null;

  /**
   * @override
   * @class
   */
  constructor(options: OptionList = {}) {
    super(options, SvgWrapperFactory as any, DefaultFont);
    this.fontCache = new FontCache(this);
    this.options.matchFontHeight = true;
  }

  /**
   * @override
   */
  public initialize() {
    if (this.options.fontCache === 'global') {
      this.fontCache.clearCache();
    }
  }

  /**
   * Clear the font cache (use for resetting the global font cache)
   */
  public clearFontCache() {
    this.fontCache.clearCache();
  }

  /**
   * @override
   */
  public reset() {
    this.clearFontCache();
  }

  /**
   * @override
   */
  public escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
    this.setDocument(html);
    return this.html('span', {}, [this.text(math.math)]);
  }

  /**
   * @override
   */
  public styleSheet(html: MathDocument<N, T, D>) {
    if (this.svgStyles) {
      return this.svgStyles; // stylesheet is already added to the document
    }
    const sheet = (this.svgStyles = super.styleSheet(html));
    this.adaptor.setAttribute(sheet, 'id', SVG.STYLESHEETID);
    return sheet;
  }

  /**
   * @override
   */
  public insertStyles(styles: StyleJson) {
    if (this.svgStyles) {
      this.adaptor.insertRules(
        this.svgStyles,
        new StyleJsonSheet(styles).getStyleRules()
      );
    }
  }

  /**
   * @override
   */
  public pageElements(html: MathDocument<N, T, D>) {
    if (this.options.fontCache === 'global' && !this.findCache(html)) {
      return this.svg(
        'svg',
        {
          xmlns: SVGNS,
          id: SVG.FONTCACHEID,
          style: { display: 'none' },
        },
        [this.fontCache.getCache()]
      );
    }
    return null as N;
  }

  /**
   * Checks if there is already a font-cache element in the page
   *
   * @param {MathDocument} html   The document to search
   * @returns {boolean}            True if a font cache already exists in the page
   */
  protected findCache(html: MathDocument<N, T, D>): boolean {
    const adaptor = this.adaptor;
    const svgs = adaptor.tags(adaptor.body(html.document), 'svg');
    for (let i = svgs.length - 1; i >= 0; i--) {
      if (this.adaptor.getAttribute(svgs[i], 'id') === SVG.FONTCACHEID) {
        return true;
      }
    }
    return false;
  }

  /**
   * @override
   */
  protected getInitialScale() {
    return 1;
  }

  /**
   * @param {SvgWrapper<N, T, D>} wrapper   The MML node wrapper whose SVG is to be produced
   * @param {N} parent                      The HTML node to contain the SVG
   */
  public processMath(wrapper: SvgWrapper<N, T, D>, parent: N) {
    //
    // Cache the container (tooltips process into separate containers)
    //
    const container = this.container;
    this.container = parent;
    //
    //  Get the SVG container
    //  Then typeset the math into the SVG
    //  Mark the inline breakpoints, if applicable
    //
    const [svg, g] = this.createRoot(wrapper);
    this.typesetSvg(wrapper, svg, g);
    if (wrapper.node.getProperty('process-breaks')) {
      this.handleInlineBreaks(wrapper, svg, g);
    }
    //
    //  Put back the original container
    //
    this.container = container;
  }

  /**
   * @param {SvgWrapper} wrapper   The wrapped math to process
   * @returns {[N, N]}              The svg and g nodes for the math
   */
  protected createRoot(wrapper: SvgWrapper<N, T, D>): [N, N] {
    const { w, h, d, pwidth } = wrapper.getOuterBBox();
    const [svg, g] = this.createSVG(h, d, w);
    if (pwidth) {
      //
      // Use width 100% with no viewbox, and instead scale and translate to achieve the same result
      //
      const adaptor = this.adaptor;
      adaptor.setStyle(svg, 'min-width', adaptor.getStyle(svg, 'width'));
      adaptor.setAttribute(svg, 'width', pwidth);
      adaptor.setAttribute(
        svg,
        'data-mjx-viewBox',
        adaptor.getAttribute(svg, 'viewBox')
      );
      adaptor.removeAttribute(svg, 'viewBox');
      const scale = this.fixed(
        wrapper.metrics.ex / (this.font.params.x_height * 1000),
        6
      );
      adaptor.setAttribute(
        g,
        'transform',
        `scale(${scale},-${scale}) translate(0, ${this.fixed(-h * 1000, 1)})`
      );
    }
    return [svg, g];
  }

  /**
   * @param {number} h   The height of the SVG to create
   * @param {number} d   The depth of the SVG to create
   * @param {number} w   The width of the SVG to create
   * @returns {[N, N]}      The svg element and its initial g child
   */
  protected createSVG(h: number, d: number, w: number): [N, N] {
    const px = this.math.metrics.em / 1000;
    const W = Math.max(w, px); // make sure we are at least one px wide (needed for e.g. \llap)
    const H = Math.max(h + d, px); // make sure we are at least one px tall (needed for e.g., \smash)
    //
    //  The container that flips the y-axis and sets the colors to inherit from the surroundings
    //
    const g = this.svg('g', {
      stroke: 'currentColor',
      fill: 'currentColor',
      'stroke-width': 0,
      transform: 'scale(1,-1)',
    }) as N;
    //
    //  The svg element with its viewBox, size and alignment
    //
    const adaptor = this.adaptor;
    const svg = adaptor.append(
      this.container,
      this.svg(
        'svg',
        {
          xmlns: SVGNS,
          width: this.ex(W),
          height: this.ex(H),
          role: 'img',
          focusable: false,
          style: { 'vertical-align': this.ex(-d) },
          viewBox: [
            0,
            this.fixed(-h * 1000, 1),
            this.fixed(W * 1000, 1),
            this.fixed(H * 1000, 1),
          ].join(' '),
        },
        [g]
      )
    ) as N;
    if (W === 0.001) {
      adaptor.setAttribute(svg, 'preserveAspectRatio', 'xMidYMid slice');
      if (w < 0) {
        adaptor.setStyle(this.container, 'margin-right', this.ex(w));
      }
    }
    if (this.options.fontCache !== 'none' && this.options.useXlink) {
      adaptor.setAttribute(svg, 'xmlns:xlink', XLINKNS);
    }
    return [svg, g];
  }

  /**
   * Typeset the math and add minwidth (from mtables), or set the alignment and indentation
   * of the finalized expression.
   *
   * @param {SvgWrapper} wrapper   The wrapped math to typeset
   * @param {N} svg                The main svg element for the typeet math
   * @param {N} g                  The group in which the math is typeset
   */
  protected typesetSvg(wrapper: SvgWrapper<N, T, D>, svg: N, g: N) {
    const adaptor = this.adaptor;
    //
    //  Typeset the math and add minWidth (from mtables), or set the alignment and indentation
    //    of the finalized expression
    //
    this.minwidth = this.shift = 0;
    if (this.options.fontCache === 'local') {
      this.fontCache.clearCache();
      this.fontCache.useLocalID(this.options.localID);
      adaptor.insert(this.fontCache.getCache(), g);
    }
    wrapper.toSVG([g]);
    this.fontCache.clearLocalID();
    if (this.minwidth) {
      adaptor.setStyle(svg, 'minWidth', this.ex(this.minwidth));
      adaptor.setStyle(this.container, 'minWidth', this.ex(this.minwidth));
    } else if (this.shift) {
      const align = adaptor.getAttribute(this.container, 'justify') || 'center';
      this.setIndent(svg, align, this.shift);
    }
  }

  /**
   * @param {N} svg         The svg node whose indentation is to be adjusted
   * @param {string} align  The alignment for the node
   * @param {number} shift  The indent (positive or negative) for the node
   */
  protected setIndent(svg: N, align: string, shift: number) {
    if (align === 'center' || align === 'left') {
      this.adaptor.setStyle(svg, 'margin-left', this.ex(shift));
    }
    if (align === 'center' || align === 'right') {
      this.adaptor.setStyle(svg, 'margin-right', this.ex(-shift));
    }
  }

  /**
   * @param {SvgWrapper<N,T,D>} wrapper   The MML node wrapper whose SVG gets inline breaks
   * @param {N} svg                       The SVG node that is breaking
   * @param {N} g                         The group in which the math is typeset
   */
  protected handleInlineBreaks(wrapper: SvgWrapper<N, T, D>, svg: N, g: N) {
    const n = wrapper.childNodes[0].breakCount;
    if (!n) return;
    //
    // Find the math element and the lines that it contains
    //
    const adaptor = this.adaptor;
    const math = adaptor.firstChild(g) as N;
    const lines = adaptor.childNodes(adaptor.firstChild(math) as N) as N[];
    const lineBBox = wrapper.childNodes[0].lineBBox;
    //
    // Remove content from original SVG other than <defs>, if any
    //
    adaptor.remove(g);
    //
    // Make each line a separate SVG containing the line's children
    //
    for (let i = 0; i <= n; i++) {
      const line = lineBBox[i] || wrapper.childNodes[0].getLineBBox(i);
      const { h, d, w } = line;
      const [mml, mo] = wrapper.childNodes[0].getBreakNode(line);
      const { scale } = mml.getBBox();
      const [nsvg, ng] = this.createSVG(h * scale, d * scale, w * scale);
      const nmath = adaptor.append(ng, adaptor.clone(math, false)) as N;
      for (const child of adaptor.childNodes(lines[i])) {
        adaptor.append(nmath, child);
      }
      adaptor.insert(nsvg, svg);
      //
      // If the line is not the first one (or not a forced break), add a break node of the correct size
      //
      const forced = !!(mo && mo.node.getProperty('forcebreak'));
      if (forced && mo.node.attributes.get('linebreakstyle') === 'after') {
        const k = mml.parent.node.childIndex(mml.node) + 1;
        const next = mml.parent.childNodes[k];
        const dimen = next ? next.getLineBBox(0).originalL * scale : 0;
        if (dimen) {
          this.addInlineBreak(nsvg, dimen, forced);
        }
      } else if (forced || i) {
        const dimen = mml && i ? mml.getLineBBox(0).originalL * scale : 0;
        if (dimen || !forced) {
          this.addInlineBreak(
            nsvg,
            dimen,
            forced || !!mml.node.getProperty('forcebreak')
          );
        }
      }
    }
    //
    // Move <defs> node (if any) to first line's svg and remove the original svg node
    //
    if (adaptor.childNodes(svg).length) {
      adaptor.append(
        adaptor.firstChild(adaptor.parent(svg)) as N,
        adaptor.firstChild(svg)
      );
    }
    adaptor.remove(svg);
  }

  /**
   * @param {N} nsvg           The svg where the break is to be added
   * @param {number} dimen     The size of the break
   * @param {boolean} forced   Whether the break is forced or not
   */
  protected addInlineBreak(nsvg: N, dimen: number, forced: boolean) {
    const adaptor = this.adaptor;
    const space = LENGTHS.em(dimen);
    if (!forced) {
      adaptor.insert(
        adaptor.node('mjx-break', { prebreak: true }, [adaptor.text(' ')]),
        nsvg
      );
    }
    adaptor.insert(
      adaptor.node(
        'mjx-break',
        !forced
          ? { newline: true }
          : SPACE[space]
            ? { size: SPACE[space] }
            : { style: `letter-spacing: ${LENGTHS.em(dimen - 1)}` },
        [adaptor.text(' ')]
      ),
      nsvg
    );
  }

  /**
   * @param {number} m  A number to be shown in ex
   * @returns {string}   The number with units of ex
   */
  public ex(m: number): string {
    m /= this.font.params.x_height;
    return Math.abs(m) < 0.001
      ? '0'
      : m.toFixed(3).replace(/\.?0+$/, '') + 'ex';
  }

  /**
   * @param {string} kind             The kind of node to create
   * @param {OptionList} properties   The properties to set for the element
   * @param {(N|T)[]} children            The child nodes for this node
   * @returns {N}                      The newly created node in the SVG namespace
   */
  public svg(
    kind: string,
    properties: OptionList = {},
    children: (N | T)[] = []
  ): N {
    return this.html(kind, properties, children, SVGNS);
  }

  /**
   * @param {string} text      The text to be displayed
   * @param {string} variant   The name of the variant for the text
   * @returns {N}               The text element containing the text
   */
  public unknownText(text: string, variant: string): N {
    const metrics = this.math.metrics;
    const scale = (this.font.params.x_height / metrics.ex) * metrics.em * 1000;
    const svg = this.svg(
      'text',
      {
        'data-variant': variant,
        transform: 'scale(1,-1)',
        'font-size': this.fixed(scale, 1) + 'px',
      },
      [this.text(text)]
    );
    const adaptor = this.adaptor;
    if (variant !== '-explicitFont') {
      const c = unicodeChars(text);
      if (c.length !== 1 || c[0] < 0x1d400 || c[0] > 0x1d7ff) {
        const [family, italic, bold] = this.font.getCssFont(variant);
        adaptor.setAttribute(svg, 'font-family', family);
        if (italic) {
          adaptor.setAttribute(svg, 'font-style', 'italic');
        }
        if (bold) {
          adaptor.setAttribute(svg, 'font-weight', 'bold');
        }
      }
    }
    return svg;
  }

  /**
   * Measure the width of a text element by placing it in the page
   *  and looking up its size (fake the height and depth, since we can't measure that)
   *
   * @param {N} text         The text element to measure
   * @returns {object}        The width, height and depth for the text
   */
  public measureTextNode(text: N): UnknownBBox {
    const adaptor = this.adaptor;
    text = adaptor.clone(text);
    adaptor.removeAttribute(text, 'transform');
    const ex = this.fixed(this.font.params.x_height * 1000, 1);
    const svg = this.svg(
      'svg',
      {
        position: 'absolute',
        visibility: 'hidden',
        width: '1ex',
        height: '1ex',
        top: 0,
        left: 0,
        viewBox: [0, 0, ex, ex].join(' '),
      },
      [text]
    );
    adaptor.append(adaptor.body(adaptor.document), svg);
    const w = adaptor.nodeSize(text, 1000, true)[0];
    adaptor.remove(svg);
    return { w: w, h: 0.75, d: 0.2 };
  }
}
