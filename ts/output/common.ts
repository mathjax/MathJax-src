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
 * @file  Implements the abstract class for the CommonOutputJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractOutputJax } from '../core/OutputJax.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem, Metrics, STATE } from '../core/MathItem.js';
import { MmlNode, TEXCLASS } from '../core/MmlTree/MmlNode.js';
import { MmlMspace } from '../core/MmlTree/MmlNodes/mspace.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import {
  FontData,
  FontDataClass,
  CharOptions,
  VariantData,
  DelimiterData,
  CssFontData,
  FontExtensionData,
} from './common/FontData.js';
import { OptionList, separateOptions } from '../util/Options.js';
import { CommonWrapper, CommonWrapperClass } from './common/Wrapper.js';
import { CommonWrapperFactory } from './common/WrapperFactory.js';
import { Linebreaks, LinebreakVisitor } from './common/LinebreakVisitor.js';
import { percent } from '../util/lengths.js';
import { length2em } from '../util/lengths.js';
import { StyleList, Styles } from '../util/Styles.js';
import { StyleJson, StyleJsonSheet } from '../util/StyleJson.js';
import { BBox } from '../util/BBox.js';

/*****************************************************************/

export interface ExtendedMetrics extends Metrics {
  family: string; // the font family for the surrounding text
}

/**
 * Maps linking a node to the test node it contains,
 *  and a map linking a node to the metrics within that node.
 */
export type MetricMap<N> = Map<N, ExtendedMetrics>;
type MetricDomMap<N> = Map<N, N>;

/**
 * Maps for unknown characters
 */
export type UnknownBBox = { w: number; h: number; d: number };
export type UnknownMap = Map<string, UnknownBBox>;
export type UnknownVariantMap = Map<string, UnknownMap>;

export const FONTPATH = '@mathjax/%%FONT%%-font';

/*****************************************************************/

/**
 *  The CommonOutputJax class on which the CHTML and SVG jax are built
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
export abstract class CommonOutputJax<
  N,
  T,
  D,
  /* prettier-ignore */
  WW extends CommonWrapper<
    N, T, D,
    CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
    WW, WF, WC, CC, VV, DD, FD, FC
  >,
  /* prettier-ignore */
  WF extends CommonWrapperFactory<
    N, T, D,
    CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
    WW, WF, WC, CC, VV, DD, FD, FC
  >,
  /* prettier-ignore */
  WC extends CommonWrapperClass<
    N, T, D,
    CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
    WW, WF, WC, CC, VV, DD, FD, FC
  >,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends AbstractOutputJax<N, T, D> {
  /**
   * The name of this output jax
   */
  public static NAME: string = 'Common';

  /**
   * @override
   */
  /* prettier-ignore */
  public static OPTIONS: OptionList = {
      ...AbstractOutputJax.OPTIONS,
    scale: 1,                      // global scaling factor for all expressions
    minScale: .5,                  // smallest scaling factor to use
    mtextInheritFont: false,       // true to make mtext elements use surrounding font
    merrorInheritFont: false,      // true to make merror text use surrounding font
    mtextFont: '',                 // font to use for mtext, if not inheriting (empty means use MathJax fonts)
    merrorFont: 'serif',           // font to use for merror, if not inheriting (empty means use MathJax fonts)
    mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
    skipAttributes: {},            // RFDa and other attributes NOT to copy to the output
    exFactor: .5,                  // default size of ex in em units
    displayAlign: 'center',        // default for indentalign when set to 'auto'
    displayIndent: '0',            // default for indentshift when set to 'auto'
    displayOverflow: 'overflow',   // default for overflow (scroll/scale/truncate/elide/linebreak/overflow)
    linebreaks: {                  // options for when overflow is linebreak
      inline: true,                // true for browser-based breaking of inline equations
      width: '100%',               // a fixed size or a percentage of the container width
      lineleading: .2,             // the default lineleading in em units
      LinebreakVisitor: null,      // The LinebreakVisitor to use
    },
    font: '',                      // the font component to load
    fontExtensions: [],            // the font extensions to load
    htmlHDW: 'auto',               // 'use', 'force', or 'ignore' data-mjx-hdw attributes
    wrapperFactory: null,          // The wrapper factory to use
    fontData: null,                // The FontData object to use
    fontPath: FONTPATH,            // The path to the font definitions
    styleJson: null                // The StyleJsonSheet object to use
  };

  /**
   *  The default styles for the output jax
   */
  public static commonStyles: StyleJson = {
    'mjx-container[overflow="scroll"][display]': {
      overflow: 'auto clip',
      'min-width': 'initial !important',
    },
    'mjx-container[overflow="truncate"][display]': {
      overflow: 'hidden clip',
      'min-width': 'initial !important',
    },
    'mjx-container[display]': {
      display: 'block',
      'text-align': 'center',
      'justify-content': 'center',
      margin: '.7em 0',
      padding: '.3em 2px',
    },
    'mjx-container[display][width="full"]': {
      display: 'flex',
    },
    'mjx-container[justify="left"]': {
      'text-align': 'left',
      'justify-content': 'left',
    },
    'mjx-container[justify="right"]': {
      'text-align': 'right',
      'justify-content': 'right',
    },
  };

  /**
   * The font to use for generic extensions
   */
  public static genericFont: FontDataClass<
    CharOptions,
    VariantData<CharOptions>,
    DelimiterData
  >;

  /**
   * Used for collecting styles needed for the output jax
   */
  public styleJson: StyleJsonSheet;

  /**
   * The MathDocument for the math we find
   */
  public document: MathDocument<N, T, D>;

  /**
   * the MathItem currently being processed
   */
  public math: MathItem<N, T, D>;

  /**
   * The container element for the math
   */
  public container: N;

  /**
   * The top-level table, if any
   */
  public table: WW;

  /**
   * The pixels per em for the math item being processed
   */
  public pxPerEm: number;

  /**
   * The data for the font in use
   */
  public font: FD;

  /**
   * The wrapper factory for the MathML nodes
   */
  public factory: WF;

  /**
   * The linebreak visitor to use for automatic linebreaks
   */
  /* prettier-ignore */
  public linebreaks: Linebreaks<
    N, T, D,
    CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
    WW, WF, WC, CC, VV, DD, FD, FC
  >;

  /**
   * @returns {boolean} True when in-line breaks need to be forced (e.g., for
   *     SVG output)
   */
  get forceInlineBreaks(): boolean {
    return false;
  }

  /**
   * The container width for linebreaking;
   */
  public containerWidth: number;

  /**
   * A map from the nodes in the expression currently being processed to the
   * wrapper nodes for them (used by functions like core() to locate the wrappers
   * from the core nodes)
   */
  public nodeMap: Map<MmlNode, WW>;

  /**
   * Node used to test for in-line metric data
   */
  public testInline: N;

  /**
   * Node used to test for display metric data
   */
  public testDisplay: N;

  /**
   * Cache of unknonw character bounding boxes for this element
   */
  protected unknownCache: UnknownVariantMap;

  /*****************************************************************/

  /**
   * Get the WrapperFactory and connect it to this output jax
   * Get the cssStyle and font objects
   *
   * @param {OptionList} options                   The configuration options
   * @param {CommonWrapperFactory} defaultFactory  The default wrapper factory class
   * @param {FC} defaultFont                       The default FontData constructor
   * @class
   */
  constructor(
    options: OptionList = {},
    defaultFactory: typeof CommonWrapperFactory = null,
    defaultFont: FC = null
  ) {
    const [fontClass, font] =
      options.fontData instanceof FontData
        ? [options.fontData.constructor as typeof FontData, options.fontData]
        : [options.fontData || defaultFont, null];
    const [jaxOptions, fontOptions] = separateOptions(
      options,
      fontClass.OPTIONS
    );
    super(jaxOptions);
    this.factory =
      this.options.wrapperFactory ||
      /* prettier-ignore */
      new defaultFactory<
        N, T, D,
        CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
        WW, WF, WC, CC, VV, DD, FD, FC
      >();
    this.factory.jax = this;
    this.styleJson = this.options.styleJson || new StyleJsonSheet();
    this.font = font || new fontClass(fontOptions);
    this.font.setOptions({ mathmlSpacing: this.options.mathmlSpacing });
    /* prettier-ignore */
    (this.constructor as typeof CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>).genericFont = fontClass;
    this.unknownCache = new Map();
    const linebreaks = (this.options.linebreaks.LinebreakVisitor ||
      LinebreakVisitor) as typeof Linebreaks;
    this.linebreaks = new linebreaks(this.factory);
  }

  /**
   * @override
   */
  public setAdaptor(adaptor: DOMAdaptor<N, T, D>) {
    super.setAdaptor(adaptor);
    //
    //  Set the htmlHDW option based on the adaptor's ability to measure nodes
    //
    if (this.options.htmlHDW === 'auto') {
      this.options.htmlHDW = adaptor.canMeasureNodes ? 'ignore' : 'force';
    }
  }

  /**
   * Add a registered font extension to the output jax's font.
   *
   * @param {FontExtensionData} font   The name of the extension to add to this output jax's font
   * @param {string} prefix            The prefix for dynamically loaded files for this extension
   * @returns {string[]}                New CSS rules needed for the font
   */
  public addExtension(
    font: FontExtensionData<CC, DD>,
    prefix: string = ''
  ): string[] {
    return this.font.addExtension(font, prefix);
  }

  /*****************************************************************/

  /**
   * Save the math document
   * Create the mjx-container node
   * Create the DOM output for the root MathML math node in the container
   * Return the container node
   *
   * @override
   */
  public typeset(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
    /* prettier-ignore */
    const CLASS = (this.constructor as typeof CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>);
    const generic = CLASS.genericFont;
    CLASS.genericFont = this.font.constructor as FontDataClass<CC, VV, DD>;
    this.setDocument(html);
    const node = this.createNode();
    try {
      this.toDOM(math, node, html);
    } finally {
      CLASS.genericFont = generic;
    }
    return node;
  }

  /**
   * @returns {N}  The container DOM node for the typeset math
   */
  protected createNode(): N {
    const jax = (this.constructor as typeof CommonOutputJax).NAME;
    return this.html('mjx-container', { class: 'MathJax', jax: jax });
  }

  /**
   * @param {N} node         The container whose scale is to be set
   * @param {WW} wrapper     The wrapper for the math element being scaled
   */
  protected setScale(node: N, wrapper: WW) {
    let scale = this.getInitialScale() * this.options.scale;
    if (
      wrapper.node.attributes.get('overflow') === 'scale' &&
      this.math.display
    ) {
      const w = wrapper.getOuterBBox().w;
      const W =
        Math.max(0, this.math.metrics.containerWidth - 4) / this.pxPerEm;
      if (w > W && w) {
        scale *= W / w;
      }
    }
    if (scale !== 1) {
      this.adaptor.setStyle(node, 'fontSize', percent(scale));
    }
  }

  /**
   * @returns {number} The initial scaling value for the math node
   */
  protected getInitialScale(): number {
    return this.math.metrics.scale;
  }

  /**
   * Set the document where HTML nodes will be created via the adaptor
   * Set up global values
   * Recursively set the TeX classes for the nodes
   * Set the scaling for the DOM node
   * Create the nodeMap (maps MathML nodes to corresponding wrappers)
   * Create the HTML output for the root MathML node in the container
   * Clear the nodeMape
   * Execute the post-filters
   *
   * @param {MathItem} math      The math item to convert
   * @param {N} node             The contaier to place the result into
   * @param {MathDocument} html  The document containing the math
   */
  public toDOM(
    math: MathItem<N, T, D>,
    node: N,
    html: MathDocument<N, T, D> = null
  ) {
    this.setDocument(html);
    this.math = math;
    this.container = node;
    this.pxPerEm = math.metrics.ex / this.font.params.x_height;
    this.executeFilters(this.preFilters, math, html, node);
    this.nodeMap = new Map<MmlNode, WW>();
    math.root.attributes.getAllInherited().overflow =
      this.options.displayOverflow;
    const overflow = math.root.attributes.get('overflow') as string;
    this.adaptor.setAttribute(node, 'overflow', overflow);
    const linebreak = overflow === 'linebreak';
    if (linebreak) {
      this.getLinebreakWidth();
    }
    const makeBreaks = this.options.linebreaks.inline && !math.display;
    let inlineMarked = !!math.root.getProperty('inlineMarked');
    if (
      inlineMarked &&
      (!makeBreaks ||
        this.forceInlineBreaks !== math.root.getProperty('inlineForced'))
    ) {
      this.unmarkInlineBreaks(math.root);
      math.root.removeProperty('inlineMarked');
      math.root.removeProperty('inlineForced');
      inlineMarked = false;
    }
    if (makeBreaks && !inlineMarked) {
      this.markInlineBreaks(math.root.childNodes?.[0]);
      math.root.setProperty('inlineMarked', true);
      math.root.setProperty('inlineForced', this.forceInlineBreaks);
    }
    math.root.setTeXclass(null);
    const wrapper = this.factory.wrap(math.root);
    this.setScale(node, wrapper);
    this.processMath(wrapper, node);
    this.nodeMap = null;
    this.executeFilters(this.postFilters, math, html, node);
  }

  /**
   * This is the actual typesetting function supplied by the subclass
   *
   * @param {WW} wrapper   The wrapped intenral MathML node of the root math element to process
   * @param {N} node       The container node where the math is to be typeset
   */
  public abstract processMath(wrapper: WW, node: N): void;

  /*****************************************************************/

  /**
   * @param {MathItem} math      The MathItem to get the bounding box for
   * @param {MathDocument} html  The MathDocument for the math
   * @returns {BBox}             The bounding box
   */
  public getBBox(math: MathItem<N, T, D>, html: MathDocument<N, T, D>): BBox {
    this.setDocument(html);
    this.math = math;
    math.root.setTeXclass(null);
    this.nodeMap = new Map<MmlNode, WW>();
    const bbox = this.factory.wrap(math.root).getOuterBBox();
    this.nodeMap = null;
    return bbox;
  }

  /*****************************************************************/

  /**
   * Determine the linebreak width
   */
  public getLinebreakWidth() {
    const W = this.math.metrics.containerWidth / this.pxPerEm;
    const width =
      this.math.root.attributes.get('maxwidth') ||
      this.options.linebreaks.width;
    this.containerWidth = length2em(width, W, 1, this.pxPerEm);
  }

  /**
   * @param {MmlNode} node   The node to check for potential inline breakpoints
   */
  public markInlineBreaks(node: MmlNode) {
    if (!node) return;
    const forcebreak = this.forceInlineBreaks;
    let postbreak = false;
    let marked = false;
    let markNext = '';
    for (const child of node.childNodes) {
      if (markNext) {
        marked = this.markInlineBreak(
          marked,
          forcebreak,
          markNext,
          node,
          child
        );
        markNext = '';
        postbreak = false;
      } else if (child.isEmbellished) {
        if (child === node.childNodes[0]) {
          continue;
        }
        const mo = child.coreMO();
        const texClass = mo.texClass;
        const linebreak = mo.attributes.get('linebreak') as string;
        const linebreakstyle = mo.attributes.get('linebreakstyle') as string;
        if (
          (texClass === TEXCLASS.BIN ||
            texClass === TEXCLASS.REL ||
            (texClass === TEXCLASS.ORD && mo.hasSpacingAttributes()) ||
            linebreak !== 'auto') &&
          linebreak !== 'nobreak'
        ) {
          if (linebreakstyle === 'before') {
            if (!postbreak || linebreak !== 'auto') {
              marked = this.markInlineBreak(
                marked,
                forcebreak,
                linebreak,
                node,
                child,
                mo
              );
            }
          } else {
            markNext = linebreak;
          }
        }
        postbreak = linebreak === 'newline' && linebreakstyle === 'after';
      } else if (child.isKind('mspace')) {
        const linebreak = child.attributes.get('linebreak') as string;
        if (linebreak !== 'nobreak' && (child as MmlMspace).canBreak) {
          marked = this.markInlineBreak(
            marked,
            forcebreak,
            linebreak,
            node,
            child
          );
        }
        postbreak = linebreak === 'newline';
      } else {
        postbreak = false;
        if (
          (child.isKind('mstyle') &&
            !child.attributes.get('style') &&
            !child.attributes.hasExplicit('mathbackground')) ||
          child.isKind('semantics')
        ) {
          this.markInlineBreaks(child.childNodes[0]);
          if (child.getProperty('process-breaks')) {
            child.setProperty('inline-breaks', true);
            child.childNodes[0].setProperty('inline-breaks', true);
            node.parent.setProperty('process-breaks', 'true');
          }
        } else if (
          child.isKind('mrow') &&
          child.attributes.get('data-semantic-added')
        ) {
          this.markInlineBreaks(child);
          if (child.getProperty('process-breaks')) {
            child.setProperty('inline-breaks', true);
            node.parent.setProperty('process-breaks', 'true');
          }
        }
      }
    }
  }

  /**
   * @param {boolean} marked      Whether the node has already been marked
   * @param {boolean} forcebreak  Whether the break is to be forced
   * @param {string} linebreak    The break type
   * @param {MmlNode} node        The parent node to mark
   * @param {MmlNode} child       The child node to mark
   * @param {MmlNode} mo          The core mo to mark
   * @returns {boolean}            The modified marked variable
   */
  protected markInlineBreak(
    marked: boolean,
    forcebreak: boolean,
    linebreak: string,
    node: MmlNode,
    child: MmlNode,
    mo: MmlNode = null
  ): boolean {
    child.setProperty('breakable', true);
    if (forcebreak && linebreak !== 'newline') {
      child.setProperty('forcebreak', true);
      mo?.setProperty('forcebreak', true);
    } else {
      //
      //  If we switched from SVG to CHTML, we need to remove the forcebreak that SVG added
      //
      child.removeProperty('forcebreak');
      mo?.removeProperty('forcebreak');
      if (linebreak === 'newline') {
        child.setProperty('newline', true);
      }
    }
    if (!marked) {
      node.setProperty('process-breaks', true);
      node.parent.setProperty('process-breaks', true);
      marked = true;
    }
    return marked;
  }

  /**
   * @param {MmlNode} node   The node where inline breaks are to be removed
   */
  public unmarkInlineBreaks(node: MmlNode) {
    if (!node) return;
    node.removeProperty('forcebreak');
    node.removeProperty('breakable');
    if (node.getProperty('process-breaks')) {
      node.removeProperty('process-breaks');
      for (const child of node.childNodes) {
        this.unmarkInlineBreaks(child);
      }
    }
  }

  /**
   * @override
   */
  public getMetrics(html: MathDocument<N, T, D>) {
    this.setDocument(html);
    const adaptor = this.adaptor;
    const maps = this.getMetricMaps(html);
    for (const math of html.math) {
      const parent = adaptor.parent(math.start.node);
      if (math.state() < STATE.METRICS && parent) {
        const map = maps[math.display ? 1 : 0];
        const { em, ex, containerWidth, scale, family } = map.get(parent);
        math.setMetrics(em, ex, containerWidth, scale);
        if (this.options.mtextInheritFont) {
          math.outputData.mtextFamily = family;
        }
        if (this.options.merrorInheritFont) {
          math.outputData.merrorFamily = family;
        }
        math.state(STATE.METRICS);
      }
    }
  }

  /**
   * @param {N} node            The container node whose metrics are to be measured
   * @param {boolean} display   True if the metrics are for displayed math
   * @returns {Metrics}          Object containing em, ex, containerWidth, etc.
   */
  public getMetricsFor(node: N, display: boolean): ExtendedMetrics {
    const getFamily =
      this.options.mtextInheritFont || this.options.merrorInheritFont;
    const test = this.getTestElement(node, display);
    const metrics = { ...this.measureMetrics(test, getFamily), display };
    this.adaptor.remove(test);
    return metrics;
  }

  /**
   * Get a MetricMap for the math list
   *
   * @param {MathDocument} html  The math document whose math list is to be processed.
   * @returns {MetricMap[]}       The node-to-metrics maps for all the containers that have math
   */
  protected getMetricMaps(html: MathDocument<N, T, D>): MetricMap<N>[] {
    const adaptor = this.adaptor;
    const domMaps = [
      new Map() as MetricDomMap<N>,
      new Map() as MetricDomMap<N>,
    ];
    //
    // Add the test elements all at once (so only one reflow)
    // Currently, we do one test for each container element for in-line and one for display math
    //   (since we need different techniques for the two forms to avoid a WebKit bug).
    //   This may need to be changed to handle floating elements better, since that has to be
    //   done at the location of the math itself, not necessarily the end of the container.
    //
    for (const math of html.math) {
      const node = adaptor.parent(math.start.node);
      if (node && math.state() < STATE.METRICS) {
        const map = domMaps[math.display ? 1 : 0];
        if (!map.has(node)) {
          map.set(node, this.getTestElement(node, math.display));
        }
      }
    }
    //
    // Measure the metrics for all the mapped elements
    //
    const getFamily =
      this.options.mtextInheritFont || this.options.merrorInheritFont;
    const maps = [new Map() as MetricMap<N>, new Map() as MetricMap<N>];
    for (const i of maps.keys()) {
      for (const node of domMaps[i].keys()) {
        maps[i].set(node, this.measureMetrics(domMaps[i].get(node), getFamily));
      }
    }
    //
    // Remove the test elements
    //
    for (const i of maps.keys()) {
      for (const node of domMaps[i].values()) {
        adaptor.remove(node);
      }
    }
    return maps;
  }

  /**
   * @param {N} node    The math element to be measured
   * @param {boolean} display Is the element in display math?
   * @returns {N}        The test elements that were added
   */
  protected getTestElement(node: N, display: boolean): N {
    const adaptor = this.adaptor;
    if (!this.testInline) {
      this.testInline = this.html(
        'mjx-test',
        {
          style: {
            display: 'inline-block',
            width: '100%',
            'font-style': 'normal',
            'font-weight': 'normal',
            'font-size': '100%',
            'font-size-adjust': 'none',
            'text-indent': 0,
            'text-transform': 'none',
            'letter-spacing': 'normal',
            'word-spacing': 'normal',
            overflow: 'hidden',
            height: '1px',
            'margin-right': '-1px',
          },
        },
        [
          this.html('mjx-left-box', {
            style: {
              display: 'inline-block',
              width: 0,
              float: 'left',
            },
          }),
          this.html('mjx-ex-box', {
            style: {
              position: 'absolute',
              overflow: 'hidden',
              width: '1px',
              height: '60ex',
            },
          }),
          this.html('mjx-right-box', {
            style: {
              display: 'inline-block',
              width: 0,
              float: 'right',
            },
          }),
        ]
      );
      this.testDisplay = adaptor.clone(this.testInline);
      adaptor.setStyle(this.testDisplay, 'display', 'table');
      adaptor.setStyle(this.testDisplay, 'margin-right', '');
      adaptor.setStyle(
        adaptor.firstChild(this.testDisplay) as N,
        'display',
        'none'
      );
      const right = adaptor.lastChild(this.testDisplay) as N;
      adaptor.setStyle(right, 'display', 'table-cell');
      adaptor.setStyle(right, 'width', '10000em');
      adaptor.setStyle(right, 'float', '');
    }
    return adaptor.append(
      node,
      adaptor.clone(display ? this.testDisplay : this.testInline) as N
    ) as N;
  }

  /**
   * @param {N} node              The test node to measure
   * @param {boolean} getFamily   True if font family of surroundings is to be determined
   * @returns {ExtendedMetrics}    The metric data for the given node
   */
  protected measureMetrics(node: N, getFamily: boolean): ExtendedMetrics {
    const adaptor = this.adaptor;
    const family = getFamily ? adaptor.fontFamily(node) : '';
    const em = adaptor.fontSize(node);
    const [w, h] = adaptor.nodeSize(adaptor.childNode(node, 1) as N);
    const ex = w ? h / 60 : em * this.options.exFactor;
    const containerWidth = !w
      ? 1000000
      : adaptor.getStyle(node, 'display') === 'table'
        ? adaptor.nodeSize(adaptor.lastChild(node) as N)[0] - 1
        : adaptor.nodeBBox(adaptor.lastChild(node) as N).left -
          adaptor.nodeBBox(adaptor.firstChild(node) as N).left -
          2;
    const scale = Math.max(
      this.options.minScale,
      this.options.matchFontHeight ? ex / this.font.params.x_height / em : 1
    );
    return { em, ex, containerWidth, scale, family };
  }

  /*****************************************************************/

  /**
   * @override
   */
  public styleSheet(html: MathDocument<N, T, D>) {
    this.setDocument(html);
    //
    // Start with the common styles
    //
    this.styleJson.clear();
    this.styleJson.addStyles(
      (this.constructor as typeof CommonOutputJax).commonStyles
    );
    //
    // Add document-specific styles
    //
    if ('getStyles' in html) {
      for (const styles of (html as any).getStyles() as StyleJson[]) {
        this.styleJson.addStyles(styles);
      }
    }
    //
    // Gather the CSS from the classes and font
    //
    this.addWrapperStyles(this.styleJson);
    this.addFontStyles(this.styleJson);
    //
    // Create the stylesheet for the CSS
    //
    const sheet = this.html('style', { id: 'MJX-styles' }, [
      this.text('\n' + this.styleJson.cssText + '\n'),
    ]);
    return sheet as N;
  }

  /**
   * @param {StyleJsonSheet} styles   The style object to add to
   */
  protected addFontStyles(styles: StyleJsonSheet) {
    styles.addStyles(this.font.styles);
  }

  /**
   * @param {StyleJsonSheet} styles   The style object to add to
   */
  protected addWrapperStyles(styles: StyleJsonSheet) {
    for (const kind of this.factory.getKinds()) {
      this.addClassStyles(this.factory.getNodeClass(kind), styles);
    }
  }

  /**
   * @param {typeof CommonWrapper} CLASS  The Wrapper class whose styles are to be added
   * @param {StyleJsonSheet} styles       The style object to add to.
   */
  protected addClassStyles(
    CLASS: typeof CommonWrapper,
    styles: StyleJsonSheet
  ) {
    CLASS.addStyles<CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>>(
      styles,
      this
    );
  }

  /**
   * Insert styles into an existing stylesheet
   *
   * @param {StyleJson} _styles  The styles to insert
   */
  public insertStyles(_styles: StyleJson) {}

  /*****************************************************************/

  /**
   * @param {MathDocument} html  The document to be used
   */
  protected setDocument(html: MathDocument<N, T, D>) {
    if (html) {
      this.document = html;
      this.adaptor.document = html.document;
    }
  }

  /**
   * @param {string} type      The type of HTML node to create
   * @param {OptionList} def   The properties to set on the HTML node
   * @param {(N|T)[]} content  Array of child nodes to set for the HTML node
   * @param {string} ns        The namespace for the element
   * @returns {N}               The newly created DOM tree
   */
  public html(
    type: string,
    def: OptionList = {},
    content: (N | T)[] = [],
    ns?: string
  ): N {
    return this.adaptor.node(type, def, content, ns);
  }

  /**
   * @param {string} text  The text string for which to make a text node
   *
   * @returns {T}  A text node with the given text
   */
  public text(text: string): T {
    return this.adaptor.text(text);
  }

  /**
   * @param {number} m    A number to be shown with a fixed number of digits
   * @param {number=} n   The number of digits to use
   * @returns {string}     The formatted number
   */
  public fixed(m: number, n: number = 3): string {
    if (Math.abs(m) < 0.0006) {
      return '0';
    }
    return m.toFixed(n).replace(/\.?0+$/, '');
  }

  /*****************************************************************/
  /*
   *  Methods for handling text that is not in the current MathJax font
   */

  /**
   * Create a DOM node for text from a specific CSS font, or that is
   *  not in the current MathJax font
   *
   * @param {string} text        The text to be displayed
   * @param {string} variant     The name of the variant for the text
   * @returns {N}                 The text element containing the text
   */
  public abstract unknownText(text: string, variant: string): N;

  /**
   * Measure text from a specific font, or that isn't in the MathJax font
   *
   * @param {string} text        The text to measure
   * @param {string} variant     The variant for the text
   * @param {CssFontData} font   The family, italic, and bold data for explicit fonts
   * @returns {UnknownBBox}       The width, height, and depth of the text (in ems)
   */
  public measureText(
    text: string,
    variant: string,
    font: CssFontData = ['', false, false]
  ): UnknownBBox {
    const node = this.unknownText(text, variant);
    if (variant === '-explicitFont') {
      const styles = this.cssFontStyles(font);
      this.adaptor.setAttributes(node, { style: styles });
    }
    return this.measureTextNodeWithCache(node, text, variant, font);
  }

  /**
   * Get the size of a text node, caching the result, and using
   *   a cached result, if there is one.
   *
   * @param {N} text             The text element to measure
   * @param {string} chars       The string contained in the text node
   * @param {string} variant     The variant for the text
   * @param {CssFontData} font   The family, italic, and bold data for explicit fonts
   * @returns {UnknownBBox}       The width, height and depth for the text
   */
  public measureTextNodeWithCache(
    text: N,
    chars: string,
    variant: string,
    font: CssFontData = ['', false, false]
  ): UnknownBBox {
    if (variant === '-explicitFont') {
      variant = [font[0], font[1] ? 'T' : 'F', font[2] ? 'T' : 'F', ''].join(
        '-'
      );
    }
    if (!this.unknownCache.has(variant)) {
      this.unknownCache.set(variant, new Map());
    }
    const map = this.unknownCache.get(variant);
    const cached = map.get(chars);
    if (cached) return cached;
    const bbox = this.measureTextNode(text);
    map.set(chars, bbox);
    return bbox;
  }

  /**
   * Measure the width of a text element by placing it in the page
   *  and looking up its size (fake the height and depth, since we can't measure that)
   *
   * @param {N} text            The text element to measure
   * @returns {UnknownBBox}      The width, height and depth for the text (in ems)
   */
  public abstract measureTextNode(text: N): UnknownBBox;

  /**
   * @param {CssFontData} font   The family, style, and weight for the given font
   * @param {StyleList} styles   The style object to add the font data to
   * @returns {StyleList}         The modified (or initialized) style object
   */
  public cssFontStyles(font: CssFontData, styles: StyleList = {}): StyleList {
    const [family, italic, bold] = font;
    styles['font-family'] = this.font.getFamily(family);
    if (italic) styles['font-style'] = 'italic';
    if (bold) styles['font-weight'] = 'bold';
    return styles;
  }

  /**
   * @param {Styles} styles   The style object to query
   * @returns {CssFontData}    The family, italic, and boolean values
   */
  public getFontData(styles: Styles): CssFontData {
    if (!styles) {
      styles = new Styles();
    }
    return [
      this.font.getFamily(styles.get('font-family')),
      styles.get('font-style') === 'italic',
      styles.get('font-weight') === 'bold',
    ] as CssFontData;
  }
}
