/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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
 * @file  Implements the CommonWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { Metrics } from '../../core/MathItem.js';
import { AbstractWrapper, WrapperClass } from '../../core/Tree/Wrapper.js';
import { PropertyList } from '../../core/Tree/Node.js';
import {
  MmlNode,
  MmlNodeClass,
  TextNode,
  AbstractMmlNode,
} from '../../core/MmlTree/MmlNode.js';
import { MmlMo } from '../../core/MmlTree/MmlNodes/mo.js';
import { Property } from '../../core/Tree/Node.js';
import { unicodeChars, unicodeString } from '../../util/string.js';
import * as LENGTHS from '../../util/lengths.js';
import { rtlRanges } from '../../util/string.js';
import { Styles } from '../../util/Styles.js';
import { StyleJson, StyleJsonSheet } from '../../util/StyleJson.js';
import { OptionList, lookup } from '../../util/Options.js';
import { CommonOutputJax } from '../common.js';
import { CommonWrapperFactory } from './WrapperFactory.js';
import { CommonMo } from './Wrappers/mo.js';
import { CommonMrow } from './Wrappers/mrow.js';
import { BBox } from '../../util/BBox.js';
import { LineBBox } from './LineBBox.js';
import { Linebreaks } from './LinebreakVisitor.js';
import { LINEBREAKS as LINEBREAK_OPTIONS } from '../common.js';
import {
  FontData,
  FontDataClass,
  DelimiterData,
  VariantData,
  CharOptions,
  CharDataArray,
  DIRECTION,
  NOSTRETCH,
} from './FontData.js';
import { Locale } from '../../util/Locale.js';
import { COMPONENT } from '../../core/__locales__/Component.js';

export { Constructor } from '../../types/Types.js';

/*****************************************************************/

/**
 * Shorthand for a dictionary object (an object of key:value pairs)
 */
export type StringMap = { [key: string]: string };

/**
 * MathML spacing rules
 */
const SMALLSIZE = 2 / 18;
const MOSPACE = 5 / 18;

/**
 * @param {boolean} script   The scriptlevel
 * @param {boolean} nodict   True if the mo text is not in the operator dictionary
 * @param {number} size      The space size
 * @returns {number}         The size clamped to SMALLSIZE when scriptlevel > 0
 */
function MathMLSpace(script: boolean, nodict: boolean, size: number): number {
  return nodict
    ? script
      ? SMALLSIZE
      : MOSPACE
    : script
      ? size < SMALLSIZE
        ? 0
        : SMALLSIZE
      : size;
}

/**
 * The standard space sizes
 */
/* prettier-ignore */
export const SPACE: StringMap = {
  [LENGTHS.em(0)]:    '0',
  [LENGTHS.em(2/18)]: '1',
  [LENGTHS.em(3/18)]: '2',
  [LENGTHS.em(4/18)]: '3',
  [LENGTHS.em(5/18)]: '4',
  [LENGTHS.em(6/18)]: '5'
};

/**
 * Padding and border data from the style attribute
 */
export type StyleData = {
  margin: [number, number, number, number];
  padding: [number, number, number, number];
  border: {
    width: [number, number, number, number];
    style: [string, string, string, string];
    color: [string, string, string, string];
  };
};

/*********************************************************/

/**
 * Generic CommonWrapper constructor
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
export type CommonWrapperConstructor<
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
  /* prettier-ignore */
  CW extends CommonWrapper<
    N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
  > = CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
> = new (factory: WF, node: MmlNode, parent?: WW) => CW;

/*********************************************************/
/**
 *  The CommonWrapper class interface
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
export interface CommonWrapperClass<
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
> extends WrapperClass<MmlNode, MmlNodeClass, WW> {
  /**
   * The wrapper kind
   */
  kind: string;

  /**
   * Any styles needed for the class
   */
  styles: StyleJson;

  /**
   * Styles that should not be passed on from style attribute
   */
  removeStyles: string[];

  /**
   * Non-MathML attributes on MathML elements NOT to be copied to the
   * corresponding DOM elements.  If set to false, then the attribute
   * WILL be copied.  Most of these (like the font attributes) are handled
   * in other ways.
   */
  skipAttributes: { [name: string]: boolean };

  /**
   * The translation of mathvariant to bold styles, or to remove
   * bold from a mathvariant.
   */
  BOLDVARIANTS: { [name: string]: StringMap };

  /**
   * The translation of mathvariant to italic styles, or to remove
   * italic from a mathvariant.
   */
  ITALICVARIANTS: { [name: string]: StringMap };

  /**
   * The patterns to check for RTL, number, symbol, and space groups.
   */
  letterChar: RegExp;
  spaceChars: RegExp;
  symChars: RegExp;
  numChars: RegExp;
  rtlRange: RegExp;
  rtlSplit: RegExp;

  /**
   * Add any styles for this wrapper class
   *
   * @param {StyleJsonSheet} styles  The styles object to extend
   * @param {JX} jax                 The output jax whose style sheet is being modified
   *                                   (in case options are needed)
   */
  addStyles<JX>(styles: StyleJsonSheet, jax: JX): void;

  /**
   * override
   */
  new (factory: WF, node: MmlNode, parent?: WW): WW;
}

/*****************************************************************/
/**
 * The base CommonWrapper class
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
export class CommonWrapper<
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
> extends AbstractWrapper<MmlNode, MmlNodeClass, WW> {
  /**
   * The wrapper kind
   */
  public static kind: string = 'unknown';

  /**
   * Any styles needed for the class
   */
  public static styles: StyleJson = {};

  /**
   * Styles that should not be passed on from style attribute
   */
  public static removeStyles: string[] = [
    'fontSize',
    'fontFamily',
    'fontWeight',
    'fontStyle',
    'fontVariant',
    'font',
  ];

  /**
   * Non-MathML attributes on MathML elements NOT to be copied to the
   * corresponding DOM elements.  If set to false, then the attribute
   * WILL be copied.  Most of these (like the font attributes) are handled
   * in other ways.
   */
  public static skipAttributes: { [name: string]: boolean } = {
    fontfamily: true,
    fontsize: true,
    fontweight: true,
    fontstyle: true,
    color: true,
    background: true,
    class: true,
    href: true,
    style: true,
    xmlns: true,
  };

  /**
   * The translation of mathvariant to bold styles, or to remove
   * bold from a mathvariant.
   */
  public static BOLDVARIANTS: { [name: string]: StringMap } = {
    bold: {
      normal: 'bold',
      italic: 'bold-italic',
      fraktur: 'bold-fraktur',
      script: 'bold-script',
      'sans-serif': 'bold-sans-serif',
      'sans-serif-italic': 'sans-serif-bold-italic',
    },
    normal: {
      bold: 'normal',
      'bold-italic': 'italic',
      'bold-fraktur': 'fraktur',
      'bold-script': 'script',
      'bold-sans-serif': 'sans-serif',
      'sans-serif-bold-italic': 'sans-serif-italic',
    },
  };

  /**
   * The translation of mathvariant to italic styles, or to remove
   * italic from a mathvariant.
   */
  public static ITALICVARIANTS: { [name: string]: StringMap } = {
    italic: {
      normal: 'italic',
      bold: 'bold-italic',
      'sans-serif': 'sans-serif-italic',
      'bold-sans-serif': 'sans-serif-bold-italic',
    },
    normal: {
      italic: 'normal',
      'bold-italic': 'bold',
      'sans-serif-italic': 'sans-serif',
      'sans-serif-bold-italic': 'bold-sans-serif',
    },
  };

  /**
   * @override
   */
  public static addStyles<JX>(styles: StyleJsonSheet, _jax: JX) {
    styles.addStyles(this.styles);
  }

  /**
   * The factory used to create more wrappers
   */
  public factory: WF;

  /**
   * The parent of this node
   */
  public parent: WW = null;

  /**
   * The children of this node
   */
  public childNodes: WW[];

  /**
   * The DOM tree generated for this wrapper
   */
  public dom: N[] = null;

  /**
   * Styles that must be handled directly by the wrappers (mostly having to do with fonts)
   */
  public removedStyles: StringMap = null;

  /**
   * The explicit styles set by the node
   */
  public styles: Styles = null;

  /**
   * The padding and border information from the style attribute
   */
  public styleData: StyleData = null;

  /**
   * The mathvariant for this node
   */
  public variant: string = '';

  /**
   * The bounding box for this node
   */
  public bbox: BBox;
  /**
   * Whether the bounding box has been computed yet
   */
  protected bboxComputed: boolean = false;

  /**
   * The cached number of linebreaks
   */
  protected _breakCount: number = -1;

  /**
   * Sizes of lines into which the element is broken
   */
  public lineBBox: LineBBox[] = [];

  /**
   * Delimiter data for stretching this node (NOSTRETCH means not yet determined)
   */
  public stretch: DD = NOSTRETCH as DD;

  /**
   * Easy access to the font parameters
   */
  public font: FD = null;

  /**
   * Easy access to the output jax for this node
   *
   * @returns {JX} The output jax for this node
   */
  get jax(): JX {
    return this.factory.jax;
  }

  /**
   * Easy access to the DOMAdaptor object
   *
   * @returns {DOMAdaptor} The DOMAdaptor object
   */
  get adaptor(): DOMAdaptor<N, T, D> {
    return this.factory.jax.adaptor;
  }

  /**
   * Easy access to the metric data for this node
   *
   * @returns {Metrics} The metric data for this node
   */
  get metrics(): Metrics {
    return this.factory.jax.math.metrics;
  }

  /**
   * Easy access to the container width
   *
   * @returns {number} The container width
   */
  get containerWidth(): number {
    return this.parent ? this.parent.containerWidth : this.jax.containerWidth;
  }

  /**
   * Easy access to the linebreak visitor
   *
   * @returns {Linebreaks} The linebreak visitor
   */
  /* prettier-ignore */
  get linebreaks(): Linebreaks<
    N, T, D,
    CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
    WW, WF, WC, CC, VV, DD, FD, FC
  > {
    return this.jax.linebreaks;
  }

  /**
   * Easy access to the linebreak options
   *
   * @returns {LINEBREAK_OPTIONS}   The linebreak options
   */
  get linebreakOptions(): LINEBREAK_OPTIONS {
    return this.jax.options.linebreaks;
  }

  /**
   * @returns {boolean} True if children with percentage widths should be
   *                    resolved by this container
   */
  get fixesPWidth(): boolean {
    return !this.node.notParent && !this.node.isToken;
  }

  /**
   * @returns {number} The number of breakpoints in the node
   */
  get breakCount(): number {
    if (this._breakCount < 0) {
      const node = this.node;
      this._breakCount = node.isEmbellished
        ? this.coreMO().embellishedBreakCount
        : node.arity < 0 &&
            !node.linebreakContainer &&
            /* prettier-ignore */
            (this.childNodes[0] as any as
              CommonMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>)
              .isStack
          ? this.childNodes[0].breakCount
          : 0;
    }
    return this._breakCount;
  }

  /**
   * @param {WW} mrow     The first mrow below this node
   * @param {WW} _child   The child containing the mrow
   * @returns {WW}        The linebreak container for the child
   */
  public breakTop(mrow: WW, _child: WW): WW {
    return this.node.linebreakContainer || !this.parent
      ? mrow
      : this.parent.breakTop(mrow, this as any as WW);
  }

  /*******************************************************************/

  /**
   * @override
   */
  constructor(factory: WF, node: MmlNode, parent: WW = null) {
    super(factory, node);
    this.parent = parent;
    this.font = factory.jax.font;
    this.bbox = BBox.zero();
    this.getStyles();
    this.getStyleData();
    this.getVariant();
    this.getScale();
    this.getSpace();
    this.childNodes = node.childNodes.map((child: MmlNode) => {
      const wrapped = this.wrap(child);
      if (wrapped.bbox.pwidth && (node.notParent || node.isKind('math'))) {
        this.bbox.pwidth = BBox.fullWidth;
      }
      return wrapped;
    });
  }

  /**
   * @param {MmlNode} node  The node to the wrapped
   * @param {WW} parent     The wrapped parent node
   * @returns {WW}          The newly wrapped node
   */
  public wrap<TT = WW>(node: MmlNode, parent: WW = null): TT {
    const wrapped = this.factory.wrap(node, parent || this);
    if (parent) {
      parent.childNodes.push(wrapped);
    }
    this.jax.nodeMap.set(node, wrapped);
    return wrapped as any as TT;
  }

  /*******************************************************************/
  /**
   * Return the wrapped node's bounding box, either the cached one, if it exists,
   *   or computed directly if not.
   *
   * @param {boolean} save   Whether to cache the bbox or not (used for stretchy elements)
   * @returns {BBox}         The computed bounding box
   */
  public getBBox(save: boolean = true): BBox {
    if (this.bboxComputed) {
      return this.bbox;
    }
    const bbox = save ? this.bbox : BBox.zero();
    this.computeBBox(bbox);
    this.bboxComputed = save;
    return bbox;
  }

  /**
   * Return the wrapped node's bounding box that includes borders and padding
   *
   * @param {boolean} save  Whether to cache the bbox or not (used for stretchy elements)
   * @returns {BBox}        The computed bounding box
   */
  public getOuterBBox(save: boolean = true): BBox {
    const bbox = this.getBBox(save);
    if (!this.styleData) return bbox;
    const padding = this.styleData.padding;
    const border = this.styleData.border?.width || [0, 0, 0, 0];
    const margin = this.styleData.margin || [0, 0, 0, 0];
    const obox = bbox.copy();
    for (const [, i, side] of BBox.boxSides) {
      (obox as any)[side] += padding[i] + border[i] + margin[i];
    }
    return obox;
  }

  /**
   * The height and depth without linebreaks
   *
   * @returns {[number, number]}   The height and depth
   */
  public getUnbrokenHD(): [number, number] {
    const n = this.breakCount + 1;
    let H = 0;
    let D = 0;
    for (let i = 0; i < n; i++) {
      const { h, d } = this.getLineBBox(i);
      if (h > H) {
        H = h;
      }
      if (d > D) {
        D = d;
      }
    }
    return [H, D];
  }

  /**
   * @param {BBox} bbox           The bounding box to modify (either this.bbox, or an empty one)
   * @param {boolean} recompute   True if we are recomputing due to changes in children that have percentage widths
   */
  protected computeBBox(bbox: BBox, recompute: boolean = false) {
    bbox.empty();
    for (const child of this.childNodes) {
      bbox.append(child.getOuterBBox());
    }
    bbox.clean();
    if (this.fixesPWidth && this.setChildPWidths(recompute)) {
      this.computeBBox(bbox, true);
    }
  }

  /**
   * Get the bounding box for the i-th line (first and last may be part of a surrounding line).
   * Get the bbox from the lineBBox cache, or compute it, as needed.
   *
   * @param {number} i    The number of the segment whose sizes are to be obtained
   * @returns {LineBBox}  The bounding box of the specified segment
   */
  public getLineBBox(i: number): LineBBox {
    if (!this.lineBBox[i]) {
      const n = this.breakCount;
      if (n) {
        const line = this.embellishedBBox(i) || this.computeLineBBox(i);
        this.lineBBox[i] = line;
        if (i === 0) {
          if (!this.node.isKind('mo') && this.node.isEmbellished) {
            line.originalL = this.getBBox().L;
          } else {
            line.L = this.getBBox().L;
          }
        }
        if (i === n) {
          line.R = this.getBBox().R;
        }
      } else {
        const obox = this.getOuterBBox();
        this.lineBBox[i] = LineBBox.from(
          obox,
          this.linebreakOptions.lineleading
        );
      }
    }
    return this.lineBBox[i];
  }

  /**
   * Get the bounding box for the i-th line of an embellished mo
   *
   * @param {number} i    The line number
   * @returns {LineBBox}  The bounding box for that line
   */
  protected embellishedBBox(i: number): LineBBox {
    if (!this.node.isEmbellished || this.node.isKind('mo')) return null;
    const mo = this.coreMO();
    return mo.moLineBBox(i, mo.embellishedBreakStyle, this.getOuterBBox());
  }

  /**
   * Compute the bounding box for the i-th line (for when it is not in the cache).
   *
   * @param {number} i    The number of the line whose sizes are to be obtained
   * @returns {LineBBox}  The bounding box of the specified segment
   */
  protected computeLineBBox(i: number): LineBBox {
    return this.getChildLineBBox(this.childNodes[0], i);
  }

  /**
   * Find the (embellished) mo or mspace where a break occurs
   *
   * @param {LineBBox} bbox    The LineBBox for the line whose initial breakpoint is needed
   * @returns {[WW, WW]}       The embellished mo node and its core mo
   */
  public getBreakNode(bbox: LineBBox): [WW, WW] {
    if (!bbox.start) {
      return [this, null] as any as [WW, WW];
    }
    const [i, j] = bbox.start;
    if (this.node.isEmbellished) {
      return [this, this.coreMO()] as any as [WW, WW];
    }
    const childNodes =
      this.childNodes[0]?.node?.isInferred || this.node.isKind('semantics')
        ? this.childNodes[0].childNodes
        : this.childNodes;
    if (this.node.isToken || !childNodes[i]) {
      return [this, null] as any as [WW, WW];
    }
    return childNodes[i].getBreakNode(childNodes[i].getLineBBox(j));
  }

  /**
   * @param {WW} child    The child node whose i-th line bbox is to be obtained
   * @param {number} i    The number of the line whose bbox is to be obtained
   * @returns {LineBBox}  The bounding box of the specified line
   */
  protected getChildLineBBox(child: WW, i: number): LineBBox {
    const n = this.breakCount;
    let cbox = child.getLineBBox(i);
    if (this.styleData || this.bbox.L || this.bbox.R) {
      cbox = cbox.copy();
    }
    this.addMiddleBorders(cbox);
    if (i === 0) {
      cbox.L += this.bbox.L;
      this.addLeftBorders(cbox);
    } else if (i === n) {
      cbox.R += this.bbox.R;
      this.addRightBorders(cbox);
    }
    return cbox;
  }

  /**
   * @param {number} n   The side number (0 to 3) whose size is needed
   * @returns {number}   The side's size in ems
   */
  protected sideStyleSize(n: number): number {
    const border = this.styleData.border;
    const padding = this.styleData.padding;
    const margin = this.styleData.margin;
    return (border?.width?.[n] || 0) + (padding?.[n] || 0) + (margin?.[n] || 0);
  }

  /**
   * @param {BBox} bbox   The bounding box where left borders are to be added
   */
  protected addLeftBorders(bbox: BBox) {
    if (!this.styleData) return;
    bbox.w += this.sideStyleSize(3);
  }

  /**
   * @param {BBox} bbox   The bounding box where top and bottom borders are to be added
   */
  protected addMiddleBorders(bbox: BBox) {
    if (!this.styleData) return;
    bbox.h += this.sideStyleSize(0);
    bbox.d += this.sideStyleSize(2);
  }

  /**
   * @param {BBox} bbox   The bounding box where right borders are to be added
   */
  protected addRightBorders(bbox: BBox) {
    if (!this.styleData) return;
    bbox.w += this.sideStyleSize(1);
  }

  /**
   * Recursively resolve any percentage widths in the child nodes using the given
   *   container width (or the child width, if none was passed).
   *   Overriden for mtables in order to compute the width.
   *
   * @param {boolean} recompute  True if we are recomputing due to changes in children
   * @param {(number|null)=} w   The width of the container (from which percentages are computed)
   * @param {boolean=} clear     True if pwidth marker is to be cleared
   * @returns {boolean}          True if a percentage width was found
   */
  public setChildPWidths(
    recompute: boolean,
    w: number | null = null,
    clear: boolean = true
  ): boolean {
    if (recompute) {
      return false;
    }
    if (clear) {
      this.bbox.pwidth = '';
    }
    let changed = false;
    for (const child of this.childNodes) {
      const cbox = child.getBBox();
      if (
        cbox.pwidth &&
        child.setChildPWidths(recompute, w === null ? cbox.w : w, clear)
      ) {
        changed = true;
      }
    }
    return changed;
  }

  /**
   * @param {number} _W   The width to use for linebreaking
   */
  public breakToWidth(_W: number) {
    // implemented in subclasses
  }

  /**
   * Mark BBox to be computed again (e.g., when an mo has stretched)
   *
   * @param {boolean} bubble   True to invalidate parent BBoxes
   */
  public invalidateBBox(bubble: boolean = true) {
    if (this.bboxComputed || this._breakCount >= 0) {
      this.bboxComputed = false;
      this.lineBBox = [];
      this._breakCount = -1;
      if (this.parent && bubble) {
        this.parent.invalidateBBox();
      }
    }
  }

  /**
   * Copy child skew and italic correction
   *
   * @param {BBox} bbox  The bounding box to modify
   */
  protected copySkewIC(bbox: BBox) {
    const first = this.childNodes[0];
    if (first?.bbox?.sk) {
      bbox.sk = first.bbox.sk;
    }
    if (first?.bbox?.dx) {
      bbox.dx = first.bbox.dx;
    }
    const last = this.childNodes[this.childNodes.length - 1];
    if (last?.bbox?.ic) {
      bbox.ic = last.bbox.ic;
      bbox.w += bbox.ic;
    }
  }

  /*******************************************************************/

  /**
   * Add the style attribute, but remove any font-related styles
   *   (since these are handled separately by the variant)
   */
  protected getStyles() {
    const styleString = this.node.attributes.getExplicit('style') as string;
    if (!styleString) return;
    const style = (this.styles = new Styles(styleString));
    for (let i = 0, m = CommonWrapper.removeStyles.length; i < m; i++) {
      const id = CommonWrapper.removeStyles[i];
      if (style.get(id)) {
        if (!this.removedStyles) this.removedStyles = {};
        this.removedStyles[id] = style.get(id);
        style.set(id, '');
      }
    }
  }

  /**
   * Gather the data about borders and padding from the styles attribute
   */
  protected getStyleData() {
    if (!this.styles) return;
    const padding = Array(4).fill(0);
    const margin = Array(4).fill(0);
    const width = Array(4).fill(0);
    const style = Array(4);
    const color = Array(4);
    let hasPadding = false;
    let hasBorder = false;
    let hasMargin = false;
    for (const [name, i] of BBox.boxSides) {
      const key = 'border' + name;
      const w = this.styles.get(key + 'Width');
      if (w) {
        hasBorder = true;
        width[i] = Math.max(0, this.length2em(w, 1));
        style[i] = this.styles.get(key + 'Style') || 'solid';
        color[i] = this.styles.get(key + 'Color');
      }
      const p = this.styles.get('padding' + name);
      if (p) {
        hasPadding = true;
        padding[i] = Math.max(0, this.length2em(p, 1));
      }
      const m = this.styles.get('margin' + name);
      if (m) {
        hasMargin = true;
        margin[i] = this.length2em(m, 1);
      }
    }
    this.styleData =
      hasPadding || hasBorder || hasMargin
        ? ({
            padding,
            margin,
            border: hasBorder ? { width, style, color } : null,
          } as StyleData)
        : null;
  }

  /**
   * Get the mathvariant (or construct one, if needed).
   */
  protected getVariant() {
    if (!this.node.isToken) return;
    const attributes = this.node.attributes;
    let variant = attributes.get('mathvariant') as string;
    if (attributes.hasExplicit('mathvariant')) {
      if (!this.font.getVariant(variant)) {
        Locale.warn(COMPONENT, 'MML/BadVariant', variant);
        variant = 'normal';
      }
    } else {
      const values = attributes.getList(
        'fontfamily',
        'fontweight',
        'fontstyle'
      ) as StringMap;
      if (this.removedStyles) {
        const style = this.removedStyles;
        if (style.fontFamily) values.family = style.fontFamily;
        if (style.fontWeight) values.weight = style.fontWeight;
        if (style.fontStyle) values.style = style.fontStyle;
      }
      if (values.fontfamily) values.family = values.fontfamily;
      if (values.fontweight) values.weight = values.fontweight;
      if (values.fontstyle) values.style = values.fontstyle;
      if (values.weight && values.weight.match(/^\d+$/)) {
        values.weight = parseInt(values.weight) > 600 ? 'bold' : 'normal';
      }
      if (values.family) {
        variant = this.explicitVariant(
          values.family,
          values.weight,
          values.style
        );
      } else {
        if (this.node.getProperty('variantForm')) variant = '-tex-variant';
        variant =
          (CommonWrapper.BOLDVARIANTS[values.weight] || {})[variant] || variant;
        variant =
          (CommonWrapper.ITALICVARIANTS[values.style] || {})[variant] ||
          variant;
      }
    }
    this.variant = variant;
  }

  /**
   * Set the CSS for a token element having an explicit font (rather than regular mathvariant).
   *
   * @param {string} fontFamily  The font family to use
   * @param {string} fontWeight  The font weight to use
   * @param {string} fontStyle   The font style to use
   * @returns {string}           The explicit font marker
   */
  protected explicitVariant(
    fontFamily: string,
    fontWeight: string,
    fontStyle: string
  ): string {
    let style = this.styles;
    if (!style) style = this.styles = new Styles();
    style.set('fontFamily', fontFamily);
    if (fontWeight) style.set('fontWeight', fontWeight);
    if (fontStyle) style.set('fontStyle', fontStyle);
    return '-explicitFont';
  }

  /**
   * Determine the scaling factor to use for this wrapped node, and set the styles for it.
   */
  protected getScale() {
    let scale = 1;
    const parent = this.parent;
    const pscale = parent ? parent.bbox.scale : 1;
    const attributes = this.node.attributes;
    const scriptlevel = Math.min(attributes.get('scriptlevel') as number, 2);
    let fontsize = attributes.get('fontsize');
    let mathsize =
      this.node.isToken || this.node.isKind('mstyle')
        ? attributes.get('mathsize')
        : attributes.getInherited('mathsize');
    //
    // If scriptsize is non-zero, set scale based on scriptsizemultiplier
    //
    if (scriptlevel !== 0) {
      scale = Math.pow(
        attributes.get('scriptsizemultiplier') as number,
        scriptlevel
      );
    }
    //
    // If there is style="font-size:...", and not fontsize attribute, use that as fontsize
    //
    if (this.removedStyles && this.removedStyles.fontSize && !fontsize) {
      fontsize = this.removedStyles.fontSize;
    }
    //
    // If there is a fontsize and no mathsize attribute, is that
    //
    if (fontsize && !attributes.hasExplicit('mathsize')) {
      mathsize = fontsize;
    }
    //
    //  Incorporate the mathsize, if any
    //
    if (mathsize !== '1') {
      scale *= this.length2em(mathsize, 1, 1);
    }
    //
    // Use scriptminsize as minimum size for scripts
    //
    if (scriptlevel !== 0) {
      const scriptminsize = this.length2em(
        attributes.get('scriptminsize'),
        0.4,
        1
      );
      if (scale < scriptminsize) scale = scriptminsize;
    }
    //
    // Record the scaling factors and set the element's CSS
    //
    this.bbox.scale = scale;
    this.bbox.rscale = scale / pscale;
  }

  /**
   * Sets the spacing based on TeX or MathML algorithm
   */
  protected getSpace() {
    const isTop = this.isTopEmbellished();
    const hasSpacing = this.node.hasSpacingAttributes();
    if (this.jax.options.mathmlSpacing || hasSpacing) {
      if (isTop) {
        this.getMathMLSpacing();
      }
    } else {
      this.getTeXSpacing(isTop, hasSpacing);
    }
  }

  /**
   * Get the spacing using MathML rules based on the core MO
   */
  protected getMathMLSpacing() {
    const node = this.node.coreMO() as MmlMo;
    //
    // If the mo is not within a multi-node mrow, don't add space
    //
    const child = node.coreParent();
    const parent = child.parent;
    if (!parent || !parent.isKind('mrow') || parent.childNodes.length === 1) {
      return;
    }
    const n = parent.childIndex(child);
    if (n === null) return;
    //
    // Get the lspace and rspace
    //
    const noDictDef = node.getProperty('noDictDef');
    const attributes = node.attributes;
    const isScript = (attributes.get('scriptlevel') as number) > 0;
    this.bbox.L = attributes.isSet('lspace')
      ? Math.max(0, this.length2em(attributes.get('lspace')))
      : MathMLSpace(isScript, noDictDef as boolean, node.lspace);
    this.bbox.R = attributes.isSet('rspace')
      ? Math.max(0, this.length2em(attributes.get('rspace')))
      : MathMLSpace(isScript, noDictDef as boolean, node.rspace);
    //
    // If there are two adjacent <mo>, use enough left space to make it
    //   the maximum of the rspace of the first and lspace of the second
    //
    if (!n) return;
    const prev = parent.childNodes[n - 1] as AbstractMmlNode;
    if (!prev.isEmbellished) return;
    const bbox = this.jax.nodeMap.get(prev).getBBox();
    if (bbox.R) {
      this.bbox.L = Math.max(0, this.bbox.L - bbox.R);
    }
  }

  /**
   * Get the spacing using the TeX rules
   *
   * @param {boolean} isTop       True when this is a top-level embellished operator
   * @param {boolean} hasSpacing  True when there is an explicit or inherited 'form' attribute
   */
  protected getTeXSpacing(isTop: boolean, hasSpacing: boolean) {
    if (!hasSpacing) {
      const space = this.node.texSpacing();
      if (space) {
        this.bbox.L = this.length2em(space);
      }
    }
    if (isTop || hasSpacing) {
      const attributes = this.node.coreMO().attributes;
      if (attributes.isSet('lspace')) {
        this.bbox.L = Math.max(0, this.length2em(attributes.get('lspace')));
      }
      if (attributes.isSet('rspace')) {
        this.bbox.R = Math.max(0, this.length2em(attributes.get('rspace')));
      }
    }
  }

  /**
   * @returns {boolean}   True if this is the top-most container of an embellished operator that is
   *                      itself an embellished operator (the maximal embellished operator for its core)
   */
  protected isTopEmbellished(): boolean {
    return (
      this.node.isEmbellished &&
      !(this.node.parent && this.node.parent.isEmbellished)
    );
  }

  /*******************************************************************/

  /**
   * @returns {WW}   The wrapper for this node's core node
   */
  public core(): WW {
    return this.jax.nodeMap.get(this.node.core());
  }

  /**
   * @returns {CommonMo}   The wrapper for this node's core <mo> node
   */
  public coreMO(): CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
    /* prettier-ignore */
    return this.jax.nodeMap.get(this.node.coreMO()) as any as CommonMo<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
  }

  /**
   * @returns {number}   The cumulative relative scaling for an embellised mo's core mo
   */
  public coreRScale(): number {
    let rscale = this.bbox.rscale;
    let node = this.coreMO() as any as WW;
    while (node !== (this as any as WW) && node) {
      rscale *= node.bbox.rscale;
      node = node.parent;
    }
    return rscale;
  }

  /**
   * @returns {number}   The cumulative relative scale from the root to the current node
   */
  public getRScale(): number {
    let rscale = 1;
    let node = this as any as WW;
    while (node) {
      rscale *= node.bbox.rscale;
      node = node.parent;
    }
    return rscale;
  }

  /**
   * @returns {string}   For a token node, the combined text content of the node's children
   */
  public getText(): string {
    let text = '';
    if (this.node.isToken) {
      for (const child of this.node.childNodes) {
        if (child instanceof TextNode) {
          text += child.getText();
        }
      }
    }
    return text;
  }

  /**
   * @param {string} direction  The direction to stretch this node
   * @returns {boolean}         Whether the node can stretch in that direction
   */
  public canStretch(direction: string): boolean {
    this.stretch = NOSTRETCH as DD;
    if (this.node.isEmbellished) {
      const core = this.core();
      if (core && core.node !== this.node) {
        if (core.canStretch(direction)) {
          this.stretch = core.stretch;
        }
      }
    }
    return this.stretch.dir !== DIRECTION.None;
  }

  /**
   * @returns {[string, number]}  The alignment and indentation shift for the expression
   */
  protected getAlignShift(): [string, number] {
    let { indentalign, indentshift, indentalignfirst, indentshiftfirst } =
      this.node.attributes.getAllAttributes() as StringMap;
    if (indentalignfirst !== 'indentalign') {
      indentalign = indentalignfirst;
    }
    if (indentshiftfirst !== 'indentshift') {
      indentshift = indentshiftfirst;
    }
    return this.processIndent(indentalign, indentshift);
  }

  /**
   * @param {string} indentalign    The indentalign to process
   * @param {string} indentshift    The indentshift to process
   * @param {string} align          The default alignment for 'auto'
   * @param {string} shift          The default indentshift for 'auto'
   * @param {number} width          The container width for relative shifts
   * @returns {[string, number][]}  The alignment and indentation shift (normal and last) for the Mo
   */
  public processIndent(
    indentalign: string,
    indentshift: string,
    align: string = '',
    shift: string = '',
    width: number = this.metrics.containerWidth
  ): [string, number] {
    if (!this.jax.math.display) {
      return ['left', 0];
    }
    if (!align || align === 'auto') {
      align = this.jax.math.root.getProperty('inlineMarked')
        ? 'left'
        : this.jax.options.displayAlign;
    }
    if (!shift || shift === 'auto') {
      shift = this.jax.math.root.getProperty('inlineMarked')
        ? '0'
        : this.jax.options.displayIndent;
    }
    if (indentalign === 'auto') {
      indentalign = align;
    }
    if (indentshift === 'auto') {
      indentshift = shift;
      if (indentalign === 'right' && !indentshift.match(/^\s*0[a-z]*\s*$/)) {
        indentshift = ('-' + indentshift.trim()).replace(/^--/, '');
      }
    }
    const indent = this.length2em(indentshift, width);
    return [indentalign, indent] as [string, number];
  }

  /**
   * @param {number} W       The total width
   * @param {BBox} bbox      The bbox to be aligned
   * @param {string} align   How to align (left, center, right)
   * @returns {number}       The x position of the aligned width
   */
  protected getAlignX(W: number, bbox: BBox, align: string): number {
    return align === 'right'
      ? W - (bbox.w + bbox.R) * bbox.rscale
      : align === 'left'
        ? bbox.L * bbox.rscale
        : (W - bbox.w * bbox.rscale) / 2;
  }

  /**
   * @param {number} H        The total height
   * @param {number} D        The total depth
   * @param {number} h        The height to be aligned
   * @param {number} d        The depth to be aligned
   * @param {string} align    How to align (top, bottom, center, axis, baseline)
   * @returns {number}        The y position of the aligned baseline
   */
  protected getAlignY(
    H: number,
    D: number,
    h: number,
    d: number,
    align: string
  ): number {
    return align === 'top'
      ? H - h
      : align === 'bottom'
        ? d - D
        : align === 'center'
          ? (H - h - (D - d)) / 2
          : 0; // baseline and axis
  }

  /**
   * @param {number} i   The index of the child element whose container is needed
   * @returns {number}   The inner width as a container (for percentage widths)
   */
  public getWrapWidth(i: number): number {
    return this.childNodes[i].getBBox().w;
  }

  /**
   * @param {number} _i   The index of the child element whose alignment is needed
   * @returns {string}    The alignment child element
   */
  public getChildAlign(_i: number): string {
    return 'left';
  }

  /*******************************************************************/
  /*
   * Easy access to some utility routines
   */

  /**
   * @param {number} m  A number to be shown as a percent
   * @returns {string}  The number m as a percent
   */
  protected percent(m: number): string {
    return LENGTHS.percent(m);
  }

  /**
   * @param {number} m  A number to be shown in ems
   * @returns {string}  The number with units of ems
   */
  protected em(m: number): string {
    return LENGTHS.em(m);
  }

  /**
   * @param {number} m   A number of em's to be shown as pixels
   * @param {number} M   The minimum number of pixels to allow
   * @returns {string}   The number with units of px
   */
  protected px(m: number, M: number = -LENGTHS.BIGDIMEN): string {
    return LENGTHS.px(m, M, this.metrics.em);
  }

  /**
   * @param {Property} length  A dimension (giving number and units) or number to be converted to ems
   * @param {number} size      The default size of the dimension (for percentage values)
   * @param {number} scale     The current scaling factor (to handle absolute units)
   * @returns {number}         The dimension converted to ems
   */
  protected length2em(
    length: Property,
    size: number = 1,
    scale: number = null
  ): number {
    if (scale === null) {
      scale = this.bbox.scale;
    }
    const t = this.font.params.rule_thickness;
    const factor = lookup(
      length as string,
      { medium: 1, thin: 2 / 3, thick: 5 / 3 },
      0
    );
    return factor
      ? factor * t
      : LENGTHS.length2em(length as string, size, scale, this.jax.pxPerEm);
  }

  /**
   * @param {string} text   The text to turn into unicode locations
   * @param {string} name   The name of the variant for the characters
   * @returns {number[]}    Array of numbers represeting the string's unicode character positions
   */
  protected unicodeChars(text: string, name: string = this.variant): number[] {
    let chars = unicodeChars(text);
    //
    //  Remap to Math Alphanumerics block
    //
    const variant = this.font.getVariant(name);
    if (variant && variant.chars) {
      const map = variant.chars;
      //
      //  Is map[n] doesn't exist, (map[n] || []) still gives an CharData array.
      //  If the array doesn't have a CharOptions element use {} instead.
      //  Then check if the options has an smp property, which gives
      //    the Math Alphabet mapping for this character.
      //  Otherwise use the original code point, n.
      //
      chars = chars.map((n) => (map[n] as CharDataArray<CC>)?.[3]?.smp || n);
    }
    return chars;
  }

  /**
   * The patterns to check for RTL and number groups.
   */
  public static letterChar = /\p{L}/u;
  public static spaceChars = /^\s+$/;
  public static symChars = /[\p{P}\p{Sm}\p{Sc}\p{Sk}\p{M}]/u;
  public static numChars = RegExp(
    '[\\p{Sc}%]*(?:\\p{N}(?:[\\p{N}\\p{Sc},./;:%]*[-+])*[\\p{N}\\p{Sc},./;:%]*)*\\p{N}[\\p{Sc}%]*',
    'u'
  );
  public static rtlRange = RegExp(
    `(?:${rtlRanges.source}\\s+)*${rtlRanges.source}`,
    'u'
  );
  public static rtlSplit = RegExp(
    `(${this.rtlRange.source}|${this.numChars.source}|${this.symChars.source}+|\\s+)`,
    'u'
  );

  /**
   * @param {number[]} chars    The array of unicode character numbers to remap
   * @returns {number[]}        The converted array
   */
  public remapChars(chars: number[]): number[] {
    //
    // If the string has no RTL characters, nothing needs to be done.
    // Otherwsie, split the string into LTR, RTL, number, and space
    // ranges and call the proper handler for the current direction.
    //
    // (This is not the actual unicode bidi algorithm, which would
    // require much more data to implement, but this should cover
    // most of the practical situations.  For complete support, set
    // the mtextInheritFont to true and use <mtext> or \text{} for
    // the content.)
    //
    const text = unicodeString(chars);
    if (!text.match(rtlRanges)) {
      return chars;
    }
    const ranges = text.split(CommonWrapper.rtlSplit);
    return this.node.getProperty('reverse-text')
      ? this.remapRTL(ranges)
      : this.remapLTR(ranges);
  }

  /**
   * Processes a sequence of character ranges in the LTR direction.
   *
   * @param {string[]} ranges   The LTR/RTL/number/space ranges
   * @returns {number[]}        The reordered character array
   */
  protected remapLTR(ranges: string[]): number[] {
    const CLASS = this.constructor as typeof CommonWrapper;
    let i = 0;
    while (i < ranges.length) {
      //
      // Find LTR/space/number sequences that can start with
      // numbers or letters, and not ending in spaces.  Then combine
      // into one range.
      //
      if (!ranges[i].match(CLASS.spaceChars)) {
        let j = i + 1;
        while (j < ranges.length && !ranges[j].match(CLASS.rtlRange)) j += 2;
        if (j > i && ranges[j - 2]?.match(CLASS.spaceChars)) j -= 2;
        if (j > i + 1) {
          ranges.splice(i, j - i, ranges.slice(i, j).join(''));
        }
      }
      i++;
      //
      // Find RTL/space/number sequences that start with RTL and end
      // with RLT or number, then reverse any non-number ranges, then
      // combine into one range.
      //
      if (ranges[i]?.match(CLASS.rtlRange)) {
        let j = i + 1;
        while (j < ranges.length && ranges[j] === '') j += 2;
        while (
          !ranges[j - 1]?.match(CLASS.rtlRange) &&
          !ranges[j - 1]?.match(CLASS.numChars)
        ) {
          j -= 2;
        }
        for (let k = i; k < j; k += 2) {
          if (!ranges[k].match(CLASS.numChars)) {
            ranges[k] = unicodeString(
              unicodeChars(ranges[k])
                .reverse()
                .map((c) => this.mirrored(c))
            );
          }
        }
        ranges.splice(i, j - i, ranges.slice(i, j).reverse().join(''));
      }
      i++;
    }
    return unicodeChars(ranges.join(''));
  }

  /**
   * Processes a sequence of character ranges in the RTL direction.
   *
   * @param {string[]} ranges   The LTR/RTL/number/space ranges
   * @returns {number[]}        The reordered character array
   */
  protected remapRTL(ranges: string[]): number[] {
    const CLASS = this.constructor as typeof CommonWrapper;
    let i = 0;
    let rtlFound = false;
    while (i < ranges.length) {
      //
      // Find LTR/space/number sequences that start with letters, and
      // not ending in spaces.  Then combine into one range.  Record
      // whether we have found RTL yet (in case there are symbol
      // ranges before the first one).
      //
      if (ranges[i].match(CLASS.letterChar)) {
        let j = i + 1;
        while (j < ranges.length) {
          if (ranges[j].match(CLASS.rtlRange)) {
            rtlFound = true;
            break;
          }
          j += 2;
        }
        while (
          j > i &&
          !ranges[j - 1]?.match(CLASS.letterChar) &&
          !ranges[j - 2]?.match(CLASS.numChars)
        ) {
          j -= 2;
        }
        if (j > i + 1) {
          ranges.splice(i, j - i, ranges.slice(i, j).join(''));
        }
      }
      i++;
      //
      // Find RTL/space/number sequences that don't start or end with
      // spaces, then reverse any non-number ranges, and finally
      // combine into one range.
      //
      if (i < ranges.length && !ranges[i]?.match(CLASS.spaceChars)) {
        if (!rtlFound) {
          if (!ranges[i].match(CLASS.numChars)) {
            ranges[i] = unicodeString(
              unicodeChars(ranges[i])
                .reverse()
                .map((c) => this.mirrored(c))
            );
          }
        } else {
          let j = i + 1;
          while (j < ranges.length - 1 && ranges[j] === '') j += 2;
          while (ranges[j - 1]?.match(CLASS.spaceChars)) j -= 2;
          for (let k = i; k < j; k += 2) {
            if (!ranges[k].match(CLASS.numChars)) {
              ranges[k] = unicodeString(
                unicodeChars(ranges[k])
                  .reverse()
                  .map((c) => this.mirrored(c))
              );
            }
          }
          ranges.splice(i, j - i, ranges.slice(i, j).reverse().join(''));
        }
      }
      i++;
    }
    //
    // Reverse the groupings before recombining into a single string
    //
    return unicodeChars(ranges.reverse().join(''));
  }

  /**
   * @param {number} n   The character code to be reversed
   * @returns {number}   The reversed code, or negative code for a char the
   *                       needs to be mirrored on output, or n if not reversible
   */
  protected mirrored(n: number): number {
    return reverseMap.get(n) ?? (mirrorSet.has(n) ? -n : n);
  }

  /**
   * @param {string} text   The text from which to create a TextNode object
   * @returns {TextNode}    The TextNode with the given text
   */
  public mmlText(text: string): TextNode {
    return (
      (this.node as AbstractMmlNode).factory.create('text') as TextNode
    ).setText(text);
  }

  /**
   * @param {string} kind             The kind of MmlNode to create
   * @param {PropertyList} properties The properties to set initially
   * @param {MmlNode[]} children      The child nodes to add to the created node
   * @returns {MmlNode}               The newly created MmlNode
   */
  public mmlNode(
    kind: string,
    properties: PropertyList = {},
    children: MmlNode[] = []
  ): MmlNode {
    return (this.node as AbstractMmlNode).factory.create(
      kind,
      properties,
      children
    );
  }

  /**
   * Create an mo wrapper with the given text,
   *   link it in, and give it the right defaults.
   *
   * @param {string} text   The text for the wrapped element
   * @returns {CommonMo}    The wrapped MmlMo node
   */
  protected createMo(
    text: string
  ): CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
    const mmlFactory = (this.node as AbstractMmlNode).factory;
    const textNode = (mmlFactory.create('text') as TextNode).setText(text);
    const mml = mmlFactory.create('mo', { stretchy: true }, [textNode]);
    mml.inheritAttributesFrom(this.node);
    mml.parent = this.node.parent;
    const node = this.wrap(mml);
    node.parent = this as any as WW;
    return node as any as CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
  }

  /**
   * @param {string} variant   The variant in which to look for the character
   * @param {number} n         The number of the character to look up
   * @returns {CharDataArray}  The full CharData object, with CharOptions guaranteed to be defined
   */
  protected getVariantChar(variant: string, n: number): CharDataArray<CC> {
    const char = this.font.getChar(variant, n) || [0, 0, 0, { unknown: true }];
    if (char.length === 3) {
      (char as any)[3] = {};
    }
    return char as [number, number, number, CC];
  }

  /*******************************************************************/
  /*
   * Easy access to some utility routines
   */

  /**
   * @param {string} type      The tag name of the HTML node to be created
   * @param {OptionList} def   The properties to set for the created node
   * @param {(N|T)[]} content  The child nodes for the created HTML node
   * @returns {N}              The generated HTML tree
   */
  public html(type: string, def: OptionList = {}, content: (N | T)[] = []): N {
    return this.jax.html(type, def, content);
  }

  /**
   * @param {string} text  The text from which to create an HTML text node
   * @returns {T}          The generated text node with the given text
   */
  public text(text: string): T {
    return this.jax.text(text);
  }
}

/**
 * The mapping of characters to reversed characters
 * from https://www.unicode.org/Public/UNIDATA/BidiMirroring.txt
 */
export const reverseMap = new Map<number, number>([
  [0x0028, 0x0029], // LEFT PARENTHESIS
  [0x0029, 0x0028], // RIGHT PARENTHESIS
  [0x003c, 0x003e], // LESS-THAN SIGN
  [0x003e, 0x003c], // GREATER-THAN SIGN
  [0x005b, 0x005d], // LEFT SQUARE BRACKET
  [0x005d, 0x005b], // RIGHT SQUARE BRACKET
  [0x007b, 0x007d], // LEFT CURLY BRACKET
  [0x007d, 0x007b], // RIGHT CURLY BRACKET
  [0x00ab, 0x00bb], // LEFT-POINTING DOUBLE ANGLE QUOTATION MARK
  [0x00bb, 0x00ab], // RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK
  [0x0f3a, 0x0f3b], // TIBETAN MARK GUG RTAGS GYON
  [0x0f3b, 0x0f3a], // TIBETAN MARK GUG RTAGS GYAS
  [0x0f3c, 0x0f3d], // TIBETAN MARK ANG KHANG GYON
  [0x0f3d, 0x0f3c], // TIBETAN MARK ANG KHANG GYAS
  [0x169b, 0x169c], // OGHAM FEATHER MARK
  [0x169c, 0x169b], // OGHAM REVERSED FEATHER MARK
  [0x2039, 0x203a], // SINGLE LEFT-POINTING ANGLE QUOTATION MARK
  [0x203a, 0x2039], // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
  [0x2045, 0x2046], // LEFT SQUARE BRACKET WITH QUILL
  [0x2046, 0x2045], // RIGHT SQUARE BRACKET WITH QUILL
  [0x207d, 0x207e], // SUPERSCRIPT LEFT PARENTHESIS
  [0x207e, 0x207d], // SUPERSCRIPT RIGHT PARENTHESIS
  [0x208d, 0x208e], // SUBSCRIPT LEFT PARENTHESIS
  [0x208e, 0x208d], // SUBSCRIPT RIGHT PARENTHESIS
  [0x2208, 0x220b], // ELEMENT OF
  [0x2209, 0x220c], // [BEST FIT] NOT AN ELEMENT OF
  [0x220a, 0x220d], // SMALL ELEMENT OF
  [0x220b, 0x2208], // CONTAINS AS MEMBER
  [0x220c, 0x2209], // [BEST FIT] DOES NOT CONTAIN AS MEMBER
  [0x220d, 0x220a], // SMALL CONTAINS AS MEMBER
  [0x2215, 0x29f5], // DIVISION SLASH
  [0x221d, 0x1db10], // PROPORTIONAL TO
  [0x221f, 0x2bfe], // RIGHT ANGLE
  [0x2220, 0x29a3], // ANGLE
  [0x2221, 0x299b], // MEASURED ANGLE
  [0x2222, 0x29a0], // SPHERICAL ANGLE
  [0x2224, 0x2aee], // DOES NOT DIVIDE
  [0x223c, 0x223d], // TILDE OPERATOR
  [0x223d, 0x223c], // REVERSED TILDE
  [0x2243, 0x22cd], // ASYMPTOTICALLY EQUAL TO
  [0x2245, 0x224c], // APPROXIMATELY EQUAL TO
  [0x224c, 0x2245], // ALL EQUAL TO
  [0x2252, 0x2253], // APPROXIMATELY EQUAL TO OR THE IMAGE OF
  [0x2253, 0x2252], // IMAGE OF OR APPROXIMATELY EQUAL TO
  [0x2254, 0x2255], // COLON EQUALS
  [0x2255, 0x2254], // EQUALS COLON
  [0x2264, 0x2265], // LESS-THAN OR EQUAL TO
  [0x2265, 0x2264], // GREATER-THAN OR EQUAL TO
  [0x2266, 0x2267], // LESS-THAN OVER EQUAL TO
  [0x2267, 0x2266], // GREATER-THAN OVER EQUAL TO
  [0x2268, 0x2269], // [BEST FIT] LESS-THAN BUT NOT EQUAL TO
  [0x2269, 0x2268], // [BEST FIT] GREATER-THAN BUT NOT EQUAL TO
  [0x226a, 0x226b], // MUCH LESS-THAN
  [0x226b, 0x226a], // MUCH GREATER-THAN
  [0x226e, 0x226f], // [BEST FIT] NOT LESS-THAN
  [0x226f, 0x226e], // [BEST FIT] NOT GREATER-THAN
  [0x2270, 0x2271], // [BEST FIT] NEITHER LESS-THAN NOR EQUAL TO
  [0x2271, 0x2270], // [BEST FIT] NEITHER GREATER-THAN NOR EQUAL TO
  [0x2272, 0x2273], // [BEST FIT] LESS-THAN OR EQUIVALENT TO
  [0x2273, 0x2272], // [BEST FIT] GREATER-THAN OR EQUIVALENT TO
  [0x2274, 0x2275], // [BEST FIT] NEITHER LESS-THAN NOR EQUIVALENT TO
  [0x2275, 0x2274], // [BEST FIT] NEITHER GREATER-THAN NOR EQUIVALENT TO
  [0x2276, 0x2277], // LESS-THAN OR GREATER-THAN
  [0x2277, 0x2276], // GREATER-THAN OR LESS-THAN
  [0x2278, 0x2279], // [BEST FIT] NEITHER LESS-THAN NOR GREATER-THAN
  [0x2279, 0x2278], // [BEST FIT] NEITHER GREATER-THAN NOR LESS-THAN
  [0x227a, 0x227b], // PRECEDES
  [0x227b, 0x227a], // SUCCEEDS
  [0x227c, 0x227d], // PRECEDES OR EQUAL TO
  [0x227d, 0x227c], // SUCCEEDS OR EQUAL TO
  [0x227e, 0x227f], // [BEST FIT] PRECEDES OR EQUIVALENT TO
  [0x227f, 0x227e], // [BEST FIT] SUCCEEDS OR EQUIVALENT TO
  [0x2280, 0x2281], // [BEST FIT] DOES NOT PRECEDE
  [0x2281, 0x2280], // [BEST FIT] DOES NOT SUCCEED
  [0x2282, 0x2283], // SUBSET OF
  [0x2283, 0x2282], // SUPERSET OF
  [0x2284, 0x2285], // [BEST FIT] NOT A SUBSET OF
  [0x2285, 0x2284], // [BEST FIT] NOT A SUPERSET OF
  [0x2286, 0x2287], // SUBSET OF OR EQUAL TO
  [0x2287, 0x2286], // SUPERSET OF OR EQUAL TO
  [0x2288, 0x2289], // [BEST FIT] NEITHER A SUBSET OF NOR EQUAL TO
  [0x2289, 0x2288], // [BEST FIT] NEITHER A SUPERSET OF NOR EQUAL TO
  [0x228a, 0x228b], // [BEST FIT] SUBSET OF WITH NOT EQUAL TO
  [0x228b, 0x228a], // [BEST FIT] SUPERSET OF WITH NOT EQUAL TO
  [0x228f, 0x2290], // SQUARE IMAGE OF
  [0x2290, 0x228f], // SQUARE ORIGINAL OF
  [0x2291, 0x2292], // SQUARE IMAGE OF OR EQUAL TO
  [0x2292, 0x2291], // SQUARE ORIGINAL OF OR EQUAL TO
  [0x2298, 0x29b8], // CIRCLED DIVISION SLASH
  [0x22a2, 0x22a3], // RIGHT TACK
  [0x22a3, 0x22a2], // LEFT TACK
  [0x22a6, 0x2ade], // ASSERTION
  [0x22a8, 0x2ae4], // TRUE
  [0x22a9, 0x2ae3], // FORCES
  [0x22ab, 0x2ae5], // DOUBLE VERTICAL BAR DOUBLE RIGHT TURNSTILE
  [0x22b0, 0x22b1], // PRECEDES UNDER RELATION
  [0x22b1, 0x22b0], // SUCCEEDS UNDER RELATION
  [0x22b2, 0x22b3], // NORMAL SUBGROUP OF
  [0x22b3, 0x22b2], // CONTAINS AS NORMAL SUBGROUP
  [0x22b4, 0x22b5], // NORMAL SUBGROUP OF OR EQUAL TO
  [0x22b5, 0x22b4], // CONTAINS AS NORMAL SUBGROUP OR EQUAL TO
  [0x22b6, 0x22b7], // ORIGINAL OF
  [0x22b7, 0x22b6], // IMAGE OF
  [0x22b8, 0x27dc], // MULTIMAP
  [0x22c9, 0x22ca], // LEFT NORMAL FACTOR SEMIDIRECT PRODUCT
  [0x22ca, 0x22c9], // RIGHT NORMAL FACTOR SEMIDIRECT PRODUCT
  [0x22cb, 0x22cc], // LEFT SEMIDIRECT PRODUCT
  [0x22cc, 0x22cb], // RIGHT SEMIDIRECT PRODUCT
  [0x22cd, 0x2243], // REVERSED TILDE EQUALS
  [0x22d0, 0x22d1], // DOUBLE SUBSET
  [0x22d1, 0x22d0], // DOUBLE SUPERSET
  [0x22d6, 0x22d7], // LESS-THAN WITH DOT
  [0x22d7, 0x22d6], // GREATER-THAN WITH DOT
  [0x22d8, 0x22d9], // VERY MUCH LESS-THAN
  [0x22d9, 0x22d8], // VERY MUCH GREATER-THAN
  [0x22da, 0x22db], // LESS-THAN EQUAL TO OR GREATER-THAN
  [0x22db, 0x22da], // GREATER-THAN EQUAL TO OR LESS-THAN
  [0x22dc, 0x22dd], // EQUAL TO OR LESS-THAN
  [0x22dd, 0x22dc], // EQUAL TO OR GREATER-THAN
  [0x22de, 0x22df], // EQUAL TO OR PRECEDES
  [0x22df, 0x22de], // EQUAL TO OR SUCCEEDS
  [0x22e0, 0x22e1], // [BEST FIT] DOES NOT PRECEDE OR EQUAL
  [0x22e1, 0x22e0], // [BEST FIT] DOES NOT SUCCEED OR EQUAL
  [0x22e2, 0x22e3], // [BEST FIT] NOT SQUARE IMAGE OF OR EQUAL TO
  [0x22e3, 0x22e2], // [BEST FIT] NOT SQUARE ORIGINAL OF OR EQUAL TO
  [0x22e4, 0x22e5], // [BEST FIT] SQUARE IMAGE OF OR NOT EQUAL TO
  [0x22e5, 0x22e4], // [BEST FIT] SQUARE ORIGINAL OF OR NOT EQUAL TO
  [0x22e6, 0x22e7], // [BEST FIT] LESS-THAN BUT NOT EQUIVALENT TO
  [0x22e7, 0x22e6], // [BEST FIT] GREATER-THAN BUT NOT EQUIVALENT TO
  [0x22e8, 0x22e9], // [BEST FIT] PRECEDES BUT NOT EQUIVALENT TO
  [0x22e9, 0x22e8], // [BEST FIT] SUCCEEDS BUT NOT EQUIVALENT TO
  [0x22ea, 0x22eb], // [BEST FIT] NOT NORMAL SUBGROUP OF
  [0x22eb, 0x22ea], // [BEST FIT] DOES NOT CONTAIN AS NORMAL SUBGROUP
  [0x22ec, 0x22ed], // [BEST FIT] NOT NORMAL SUBGROUP OF OR EQUAL TO
  [0x22ed, 0x22ec], // [BEST FIT] DOES NOT CONTAIN AS NORMAL SUBGROUP OR EQUAL
  [0x22f0, 0x22f1], // UP RIGHT DIAGONAL ELLIPSIS
  [0x22f1, 0x22f0], // DOWN RIGHT DIAGONAL ELLIPSIS
  [0x22f2, 0x22fa], // ELEMENT OF WITH LONG HORIZONTAL STROKE
  [0x22f3, 0x22fb], // ELEMENT OF WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
  [0x22f4, 0x22fc], // SMALL ELEMENT OF WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
  [0x22f6, 0x22fd], // ELEMENT OF WITH OVERBAR
  [0x22f7, 0x22fe], // SMALL ELEMENT OF WITH OVERBAR
  [0x22fa, 0x22f2], // CONTAINS WITH LONG HORIZONTAL STROKE
  [0x22fb, 0x22f3], // CONTAINS WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
  [0x22fc, 0x22f4], // SMALL CONTAINS WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
  [0x22fd, 0x22f6], // CONTAINS WITH OVERBAR
  [0x22fe, 0x22f7], // SMALL CONTAINS WITH OVERBAR
  [0x2308, 0x2309], // LEFT CEILING
  [0x2309, 0x2308], // RIGHT CEILING
  [0x230a, 0x230b], // LEFT FLOOR
  [0x230b, 0x230a], // RIGHT FLOOR
  [0x2329, 0x232a], // LEFT-POINTING ANGLE BRACKET
  [0x232a, 0x2329], // RIGHT-POINTING ANGLE BRACKET
  [0x2768, 0x2769], // MEDIUM LEFT PARENTHESIS ORNAMENT
  [0x2769, 0x2768], // MEDIUM RIGHT PARENTHESIS ORNAMENT
  [0x276a, 0x276b], // MEDIUM FLATTENED LEFT PARENTHESIS ORNAMENT
  [0x276b, 0x276a], // MEDIUM FLATTENED RIGHT PARENTHESIS ORNAMENT
  [0x276c, 0x276d], // MEDIUM LEFT-POINTING ANGLE BRACKET ORNAMENT
  [0x276d, 0x276c], // MEDIUM RIGHT-POINTING ANGLE BRACKET ORNAMENT
  [0x276e, 0x276f], // HEAVY LEFT-POINTING ANGLE QUOTATION MARK ORNAMENT
  [0x276f, 0x276e], // HEAVY RIGHT-POINTING ANGLE QUOTATION MARK ORNAMENT
  [0x2770, 0x2771], // HEAVY LEFT-POINTING ANGLE BRACKET ORNAMENT
  [0x2771, 0x2770], // HEAVY RIGHT-POINTING ANGLE BRACKET ORNAMENT
  [0x2772, 0x2773], // LIGHT LEFT TORTOISE SHELL BRACKET ORNAMENT
  [0x2773, 0x2772], // LIGHT RIGHT TORTOISE SHELL BRACKET ORNAMENT
  [0x2774, 0x2775], // MEDIUM LEFT CURLY BRACKET ORNAMENT
  [0x2775, 0x2774], // MEDIUM RIGHT CURLY BRACKET ORNAMENT
  [0x27c3, 0x27c4], // OPEN SUBSET
  [0x27c4, 0x27c3], // OPEN SUPERSET
  [0x27c5, 0x27c6], // LEFT S-SHAPED BAG DELIMITER
  [0x27c6, 0x27c5], // RIGHT S-SHAPED BAG DELIMITER
  [0x27c8, 0x27c9], // REVERSE SOLIDUS PRECEDING SUBSET
  [0x27c9, 0x27c8], // SUPERSET PRECEDING SOLIDUS
  [0x27cb, 0x27cd], // MATHEMATICAL RISING DIAGONAL
  [0x27cd, 0x27cb], // MATHEMATICAL FALLING DIAGONAL
  [0x27d5, 0x27d6], // LEFT OUTER JOIN
  [0x27d6, 0x27d5], // RIGHT OUTER JOIN
  [0x27dc, 0x22b8], // LEFT MULTIMAP
  [0x27dd, 0x27de], // LONG RIGHT TACK
  [0x27de, 0x27dd], // LONG LEFT TACK
  [0x27e2, 0x27e3], // WHITE CONCAVE-SIDED DIAMOND WITH LEFTWARDS TICK
  [0x27e3, 0x27e2], // WHITE CONCAVE-SIDED DIAMOND WITH RIGHTWARDS TICK
  [0x27e4, 0x27e5], // WHITE SQUARE WITH LEFTWARDS TICK
  [0x27e5, 0x27e4], // WHITE SQUARE WITH RIGHTWARDS TICK
  [0x27e6, 0x27e7], // MATHEMATICAL LEFT WHITE SQUARE BRACKET
  [0x27e7, 0x27e6], // MATHEMATICAL RIGHT WHITE SQUARE BRACKET
  [0x27e8, 0x27e9], // MATHEMATICAL LEFT ANGLE BRACKET
  [0x27e9, 0x27e8], // MATHEMATICAL RIGHT ANGLE BRACKET
  [0x27ea, 0x27eb], // MATHEMATICAL LEFT DOUBLE ANGLE BRACKET
  [0x27eb, 0x27ea], // MATHEMATICAL RIGHT DOUBLE ANGLE BRACKET
  [0x27ec, 0x27ed], // MATHEMATICAL LEFT WHITE TORTOISE SHELL BRACKET
  [0x27ed, 0x27ec], // MATHEMATICAL RIGHT WHITE TORTOISE SHELL BRACKET
  [0x27ee, 0x27ef], // MATHEMATICAL LEFT FLATTENED PARENTHESIS
  [0x27ef, 0x27ee], // MATHEMATICAL RIGHT FLATTENED PARENTHESIS
  [0x2983, 0x2984], // LEFT WHITE CURLY BRACKET
  [0x2984, 0x2983], // RIGHT WHITE CURLY BRACKET
  [0x2985, 0x2986], // LEFT WHITE PARENTHESIS
  [0x2986, 0x2985], // RIGHT WHITE PARENTHESIS
  [0x2987, 0x2988], // Z NOTATION LEFT IMAGE BRACKET
  [0x2988, 0x2987], // Z NOTATION RIGHT IMAGE BRACKET
  [0x2989, 0x298a], // Z NOTATION LEFT BINDING BRACKET
  [0x298a, 0x2989], // Z NOTATION RIGHT BINDING BRACKET
  [0x298b, 0x298c], // LEFT SQUARE BRACKET WITH UNDERBAR
  [0x298c, 0x298b], // RIGHT SQUARE BRACKET WITH UNDERBAR
  [0x298d, 0x2990], // LEFT SQUARE BRACKET WITH TICK IN TOP CORNER
  [0x298e, 0x298f], // RIGHT SQUARE BRACKET WITH TICK IN BOTTOM CORNER
  [0x298f, 0x298e], // LEFT SQUARE BRACKET WITH TICK IN BOTTOM CORNER
  [0x2990, 0x298d], // RIGHT SQUARE BRACKET WITH TICK IN TOP CORNER
  [0x2991, 0x2992], // LEFT ANGLE BRACKET WITH DOT
  [0x2992, 0x2991], // RIGHT ANGLE BRACKET WITH DOT
  [0x2993, 0x2994], // LEFT ARC LESS-THAN BRACKET
  [0x2994, 0x2993], // RIGHT ARC GREATER-THAN BRACKET
  [0x2995, 0x2996], // DOUBLE LEFT ARC GREATER-THAN BRACKET
  [0x2996, 0x2995], // DOUBLE RIGHT ARC LESS-THAN BRACKET
  [0x2997, 0x2998], // LEFT BLACK TORTOISE SHELL BRACKET
  [0x2998, 0x2997], // RIGHT BLACK TORTOISE SHELL BRACKET
  [0x299b, 0x2221], // MEASURED ANGLE OPENING LEFT
  [0x29a0, 0x2222], // SPHERICAL ANGLE OPENING LEFT
  [0x29a3, 0x2220], // REVERSED ANGLE
  [0x29a4, 0x29a5], // ANGLE WITH UNDERBAR
  [0x29a5, 0x29a4], // REVERSED ANGLE WITH UNDERBAR
  [0x29a8, 0x29a9], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING UP AND RIGHT
  [0x29a9, 0x29a8], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING UP AND LEFT
  [0x29aa, 0x29ab], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING DOWN AND RIGHT
  [0x29ab, 0x29aa], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING DOWN AND LEFT
  [0x29ac, 0x29ad], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING RIGHT AND UP
  [0x29ad, 0x29ac], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING LEFT AND UP
  [0x29ae, 0x29af], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING RIGHT AND DOWN
  [0x29af, 0x29ae], // MEASURED ANGLE WITH OPEN ARM ENDING IN ARROW POINTING LEFT AND DOWN
  [0x29b8, 0x2298], // CIRCLED REVERSE SOLIDUS
  [0x29c0, 0x29c1], // CIRCLED LESS-THAN
  [0x29c1, 0x29c0], // CIRCLED GREATER-THAN
  [0x29c4, 0x29c5], // SQUARED RISING DIAGONAL SLASH
  [0x29c5, 0x29c4], // SQUARED FALLING DIAGONAL SLASH
  [0x29cf, 0x29d0], // LEFT TRIANGLE BESIDE VERTICAL BAR
  [0x29d0, 0x29cf], // VERTICAL BAR BESIDE RIGHT TRIANGLE
  [0x29d1, 0x29d2], // BOWTIE WITH LEFT HALF BLACK
  [0x29d2, 0x29d1], // BOWTIE WITH RIGHT HALF BLACK
  [0x29d4, 0x29d5], // TIMES WITH LEFT HALF BLACK
  [0x29d5, 0x29d4], // TIMES WITH RIGHT HALF BLACK
  [0x29d8, 0x29d9], // LEFT WIGGLY FENCE
  [0x29d9, 0x29d8], // RIGHT WIGGLY FENCE
  [0x29da, 0x29db], // LEFT DOUBLE WIGGLY FENCE
  [0x29db, 0x29da], // RIGHT DOUBLE WIGGLY FENCE
  [0x29e8, 0x29e9], // DOWN-POINTING TRIANGLE WITH LEFT HALF BLACK
  [0x29e9, 0x29e8], // DOWN-POINTING TRIANGLE WITH RIGHT HALF BLACK
  [0x29f5, 0x2215], // REVERSE SOLIDUS OPERATOR
  [0x29f8, 0x29f9], // BIG SOLIDUS
  [0x29f9, 0x29f8], // BIG REVERSE SOLIDUS
  [0x29fc, 0x29fd], // LEFT-POINTING CURVED ANGLE BRACKET
  [0x29fd, 0x29fc], // RIGHT-POINTING CURVED ANGLE BRACKET
  [0x2a2b, 0x2a2c], // MINUS SIGN WITH FALLING DOTS
  [0x2a2c, 0x2a2b], // MINUS SIGN WITH RISING DOTS
  [0x2a2d, 0x2a2e], // PLUS SIGN IN LEFT HALF CIRCLE
  [0x2a2e, 0x2a2d], // PLUS SIGN IN RIGHT HALF CIRCLE
  [0x2a34, 0x2a35], // MULTIPLICATION SIGN IN LEFT HALF CIRCLE
  [0x2a35, 0x2a34], // MULTIPLICATION SIGN IN RIGHT HALF CIRCLE
  [0x2a3c, 0x2a3d], // INTERIOR PRODUCT
  [0x2a3d, 0x2a3c], // RIGHTHAND INTERIOR PRODUCT
  [0x2a64, 0x2a65], // Z NOTATION DOMAIN ANTIRESTRICTION
  [0x2a65, 0x2a64], // Z NOTATION RANGE ANTIRESTRICTION
  [0x2a79, 0x2a7a], // LESS-THAN WITH CIRCLE INSIDE
  [0x2a7a, 0x2a79], // GREATER-THAN WITH CIRCLE INSIDE
  [0x2a7b, 0x2a7c], // [BEST FIT] LESS-THAN WITH QUESTION MARK ABOVE
  [0x2a7c, 0x2a7b], // [BEST FIT] GREATER-THAN WITH QUESTION MARK ABOVE
  [0x2a7d, 0x2a7e], // LESS-THAN OR SLANTED EQUAL TO
  [0x2a7e, 0x2a7d], // GREATER-THAN OR SLANTED EQUAL TO
  [0x2a7f, 0x2a80], // LESS-THAN OR SLANTED EQUAL TO WITH DOT INSIDE
  [0x2a80, 0x2a7f], // GREATER-THAN OR SLANTED EQUAL TO WITH DOT INSIDE
  [0x2a81, 0x2a82], // LESS-THAN OR SLANTED EQUAL TO WITH DOT ABOVE
  [0x2a82, 0x2a81], // GREATER-THAN OR SLANTED EQUAL TO WITH DOT ABOVE
  [0x2a83, 0x2a84], // LESS-THAN OR SLANTED EQUAL TO WITH DOT ABOVE RIGHT
  [0x2a84, 0x2a83], // GREATER-THAN OR SLANTED EQUAL TO WITH DOT ABOVE LEFT
  [0x2a85, 0x2a86], // [BEST FIT] LESS-THAN OR APPROXIMATE
  [0x2a86, 0x2a85], // [BEST FIT] GREATER-THAN OR APPROXIMATE
  [0x2a87, 0x2a88], // [BEST FIT] LESS-THAN AND SINGLE-LINE NOT EQUAL TO
  [0x2a88, 0x2a87], // [BEST FIT] GREATER-THAN AND SINGLE-LINE NOT EQUAL TO
  [0x2a89, 0x2a8a], // [BEST FIT] LESS-THAN AND NOT APPROXIMATE
  [0x2a8a, 0x2a89], // [BEST FIT] GREATER-THAN AND NOT APPROXIMATE
  [0x2a8b, 0x2a8c], // LESS-THAN ABOVE DOUBLE-LINE EQUAL ABOVE GREATER-THAN
  [0x2a8c, 0x2a8b], // GREATER-THAN ABOVE DOUBLE-LINE EQUAL ABOVE LESS-THAN
  [0x2a8d, 0x2a8e], // [BEST FIT] LESS-THAN ABOVE SIMILAR OR EQUAL
  [0x2a8e, 0x2a8d], // [BEST FIT] GREATER-THAN ABOVE SIMILAR OR EQUAL
  [0x2a8f, 0x2a90], // [BEST FIT] LESS-THAN ABOVE SIMILAR ABOVE GREATER-THAN
  [0x2a90, 0x2a8f], // [BEST FIT] GREATER-THAN ABOVE SIMILAR ABOVE LESS-THAN
  [0x2a91, 0x2a92], // LESS-THAN ABOVE GREATER-THAN ABOVE DOUBLE-LINE EQUAL
  [0x2a92, 0x2a91], // GREATER-THAN ABOVE LESS-THAN ABOVE DOUBLE-LINE EQUAL
  [0x2a93, 0x2a94], // LESS-THAN ABOVE SLANTED EQUAL ABOVE GREATER-THAN ABOVE SLANTED EQUAL
  [0x2a94, 0x2a93], // GREATER-THAN ABOVE SLANTED EQUAL ABOVE LESS-THAN ABOVE SLANTED EQUAL
  [0x2a95, 0x2a96], // SLANTED EQUAL TO OR LESS-THAN
  [0x2a96, 0x2a95], // SLANTED EQUAL TO OR GREATER-THAN
  [0x2a97, 0x2a98], // SLANTED EQUAL TO OR LESS-THAN WITH DOT INSIDE
  [0x2a98, 0x2a97], // SLANTED EQUAL TO OR GREATER-THAN WITH DOT INSIDE
  [0x2a99, 0x2a9a], // DOUBLE-LINE EQUAL TO OR LESS-THAN
  [0x2a9a, 0x2a99], // DOUBLE-LINE EQUAL TO OR GREATER-THAN
  [0x2a9b, 0x2a9c], // DOUBLE-LINE SLANTED EQUAL TO OR LESS-THAN
  [0x2a9c, 0x2a9b], // DOUBLE-LINE SLANTED EQUAL TO OR GREATER-THAN
  [0x2a9d, 0x2a9e], // [BEST FIT] SIMILAR OR LESS-THAN
  [0x2a9e, 0x2a9d], // [BEST FIT] SIMILAR OR GREATER-THAN
  [0x2a9f, 0x2aa0], // [BEST FIT] SIMILAR ABOVE LESS-THAN ABOVE EQUALS SIGN
  [0x2aa0, 0x2a9f], // [BEST FIT] SIMILAR ABOVE GREATER-THAN ABOVE EQUALS SIGN
  [0x2aa1, 0x2aa2], // DOUBLE NESTED LESS-THAN
  [0x2aa2, 0x2aa1], // DOUBLE NESTED GREATER-THAN
  [0x2aa6, 0x2aa7], // LESS-THAN CLOSED BY CURVE
  [0x2aa7, 0x2aa6], // GREATER-THAN CLOSED BY CURVE
  [0x2aa8, 0x2aa9], // LESS-THAN CLOSED BY CURVE ABOVE SLANTED EQUAL
  [0x2aa9, 0x2aa8], // GREATER-THAN CLOSED BY CURVE ABOVE SLANTED EQUAL
  [0x2aaa, 0x2aab], // SMALLER THAN
  [0x2aab, 0x2aaa], // LARGER THAN
  [0x2aac, 0x2aad], // SMALLER THAN OR EQUAL TO
  [0x2aad, 0x2aac], // LARGER THAN OR EQUAL TO
  [0x2aaf, 0x2ab0], // PRECEDES ABOVE SINGLE-LINE EQUALS SIGN
  [0x2ab0, 0x2aaf], // SUCCEEDS ABOVE SINGLE-LINE EQUALS SIGN
  [0x2ab1, 0x2ab2], // [BEST FIT] PRECEDES ABOVE SINGLE-LINE NOT EQUAL TO
  [0x2ab2, 0x2ab1], // [BEST FIT] SUCCEEDS ABOVE SINGLE-LINE NOT EQUAL TO
  [0x2ab3, 0x2ab4], // PRECEDES ABOVE EQUALS SIGN
  [0x2ab4, 0x2ab3], // SUCCEEDS ABOVE EQUALS SIGN
  [0x2ab5, 0x2ab6], // [BEST FIT] PRECEDES ABOVE NOT EQUAL TO
  [0x2ab6, 0x2ab5], // [BEST FIT] SUCCEEDS ABOVE NOT EQUAL TO
  [0x2ab7, 0x2ab8], // [BEST FIT] PRECEDES ABOVE ALMOST EQUAL TO
  [0x2ab8, 0x2ab7], // [BEST FIT] SUCCEEDS ABOVE ALMOST EQUAL TO
  [0x2ab9, 0x2aba], // [BEST FIT] PRECEDES ABOVE NOT ALMOST EQUAL TO
  [0x2aba, 0x2ab9], // [BEST FIT] SUCCEEDS ABOVE NOT ALMOST EQUAL TO
  [0x2abb, 0x2abc], // DOUBLE PRECEDES
  [0x2abc, 0x2abb], // DOUBLE SUCCEEDS
  [0x2abd, 0x2abe], // SUBSET WITH DOT
  [0x2abe, 0x2abd], // SUPERSET WITH DOT
  [0x2abf, 0x2ac0], // SUBSET WITH PLUS SIGN BELOW
  [0x2ac0, 0x2abf], // SUPERSET WITH PLUS SIGN BELOW
  [0x2ac1, 0x2ac2], // SUBSET WITH MULTIPLICATION SIGN BELOW
  [0x2ac2, 0x2ac1], // SUPERSET WITH MULTIPLICATION SIGN BELOW
  [0x2ac3, 0x2ac4], // SUBSET OF OR EQUAL TO WITH DOT ABOVE
  [0x2ac4, 0x2ac3], // SUPERSET OF OR EQUAL TO WITH DOT ABOVE
  [0x2ac5, 0x2ac6], // SUBSET OF ABOVE EQUALS SIGN
  [0x2ac6, 0x2ac5], // SUPERSET OF ABOVE EQUALS SIGN
  [0x2ac7, 0x2ac8], // [BEST FIT] SUBSET OF ABOVE TILDE OPERATOR
  [0x2ac8, 0x2ac7], // [BEST FIT] SUPERSET OF ABOVE TILDE OPERATOR
  [0x2ac9, 0x2aca], // [BEST FIT] SUBSET OF ABOVE ALMOST EQUAL TO
  [0x2aca, 0x2ac9], // [BEST FIT] SUPERSET OF ABOVE ALMOST EQUAL TO
  [0x2acb, 0x2acc], // [BEST FIT] SUBSET OF ABOVE NOT EQUAL TO
  [0x2acc, 0x2acb], // [BEST FIT] SUPERSET OF ABOVE NOT EQUAL TO
  [0x2acd, 0x2ace], // SQUARE LEFT OPEN BOX OPERATOR
  [0x2ace, 0x2acd], // SQUARE RIGHT OPEN BOX OPERATOR
  [0x2acf, 0x2ad0], // CLOSED SUBSET
  [0x2ad0, 0x2acf], // CLOSED SUPERSET
  [0x2ad1, 0x2ad2], // CLOSED SUBSET OR EQUAL TO
  [0x2ad2, 0x2ad1], // CLOSED SUPERSET OR EQUAL TO
  [0x2ad3, 0x2ad4], // SUBSET ABOVE SUPERSET
  [0x2ad4, 0x2ad3], // SUPERSET ABOVE SUBSET
  [0x2ad5, 0x2ad6], // SUBSET ABOVE SUBSET
  [0x2ad6, 0x2ad5], // SUPERSET ABOVE SUPERSET
  [0x2ade, 0x22a6], // SHORT LEFT TACK
  [0x2ae3, 0x22a9], // DOUBLE VERTICAL BAR LEFT TURNSTILE
  [0x2ae4, 0x22a8], // VERTICAL BAR DOUBLE LEFT TURNSTILE
  [0x2ae5, 0x22ab], // DOUBLE VERTICAL BAR DOUBLE LEFT TURNSTILE
  [0x2aec, 0x2aed], // DOUBLE STROKE NOT SIGN
  [0x2aed, 0x2aec], // REVERSED DOUBLE STROKE NOT SIGN
  [0x2aee, 0x2224], // DOES NOT DIVIDE WITH REVERSED NEGATION SLASH
  [0x2af7, 0x2af8], // TRIPLE NESTED LESS-THAN
  [0x2af8, 0x2af7], // TRIPLE NESTED GREATER-THAN
  [0x2af9, 0x2afa], // DOUBLE-LINE SLANTED LESS-THAN OR EQUAL TO
  [0x2afa, 0x2af9], // DOUBLE-LINE SLANTED GREATER-THAN OR EQUAL TO
  [0x2bfe, 0x221f], // REVERSED RIGHT ANGLE
  [0x2e02, 0x2e03], // LEFT SUBSTITUTION BRACKET
  [0x2e03, 0x2e02], // RIGHT SUBSTITUTION BRACKET
  [0x2e04, 0x2e05], // LEFT DOTTED SUBSTITUTION BRACKET
  [0x2e05, 0x2e04], // RIGHT DOTTED SUBSTITUTION BRACKET
  [0x2e09, 0x2e0a], // LEFT TRANSPOSITION BRACKET
  [0x2e0a, 0x2e09], // RIGHT TRANSPOSITION BRACKET
  [0x2e0c, 0x2e0d], // LEFT RAISED OMISSION BRACKET
  [0x2e0d, 0x2e0c], // RIGHT RAISED OMISSION BRACKET
  [0x2e1c, 0x2e1d], // LEFT LOW PARAPHRASE BRACKET
  [0x2e1d, 0x2e1c], // RIGHT LOW PARAPHRASE BRACKET
  [0x2e20, 0x2e21], // LEFT VERTICAL BAR WITH QUILL
  [0x2e21, 0x2e20], // RIGHT VERTICAL BAR WITH QUILL
  [0x2e22, 0x2e23], // TOP LEFT HALF BRACKET
  [0x2e23, 0x2e22], // TOP RIGHT HALF BRACKET
  [0x2e24, 0x2e25], // BOTTOM LEFT HALF BRACKET
  [0x2e25, 0x2e24], // BOTTOM RIGHT HALF BRACKET
  [0x2e26, 0x2e27], // LEFT SIDEWAYS U BRACKET
  [0x2e27, 0x2e26], // RIGHT SIDEWAYS U BRACKET
  [0x2e28, 0x2e29], // LEFT DOUBLE PARENTHESIS
  [0x2e29, 0x2e28], // RIGHT DOUBLE PARENTHESIS
  [0x2e55, 0x2e56], // LEFT SQUARE BRACKET WITH STROKE
  [0x2e56, 0x2e55], // RIGHT SQUARE BRACKET WITH STROKE
  [0x2e57, 0x2e58], // LEFT SQUARE BRACKET WITH DOUBLE STROKE
  [0x2e58, 0x2e57], // RIGHT SQUARE BRACKET WITH DOUBLE STROKE
  [0x2e59, 0x2e5a], // TOP HALF LEFT PARENTHESIS
  [0x2e5a, 0x2e59], // TOP HALF RIGHT PARENTHESIS
  [0x2e5b, 0x2e5c], // BOTTOM HALF LEFT PARENTHESIS
  [0x2e5c, 0x2e5b], // BOTTOM HALF RIGHT PARENTHESIS
  [0x2e62, 0x2e63], // LEFT PARENTHESIS WITH MIDDLE RING
  [0x2e63, 0x2e62], // RIGHT PARENTHESIS WITH MIDDLE RING
  [0x3008, 0x3009], // LEFT ANGLE BRACKET
  [0x3009, 0x3008], // RIGHT ANGLE BRACKET
  [0x300a, 0x300b], // LEFT DOUBLE ANGLE BRACKET
  [0x300b, 0x300a], // RIGHT DOUBLE ANGLE BRACKET
  [0x300c, 0x300d], // [BEST FIT] LEFT CORNER BRACKET
  [0x300d, 0x300c], // [BEST FIT] RIGHT CORNER BRACKET
  [0x300e, 0x300f], // [BEST FIT] LEFT WHITE CORNER BRACKET
  [0x300f, 0x300e], // [BEST FIT] RIGHT WHITE CORNER BRACKET
  [0x3010, 0x3011], // LEFT BLACK LENTICULAR BRACKET
  [0x3011, 0x3010], // RIGHT BLACK LENTICULAR BRACKET
  [0x3014, 0x3015], // LEFT TORTOISE SHELL BRACKET
  [0x3015, 0x3014], // RIGHT TORTOISE SHELL BRACKET
  [0x3016, 0x3017], // LEFT WHITE LENTICULAR BRACKET
  [0x3017, 0x3016], // RIGHT WHITE LENTICULAR BRACKET
  [0x3018, 0x3019], // LEFT WHITE TORTOISE SHELL BRACKET
  [0x3019, 0x3018], // RIGHT WHITE TORTOISE SHELL BRACKET
  [0x301a, 0x301b], // LEFT WHITE SQUARE BRACKET
  [0x301b, 0x301a], // RIGHT WHITE SQUARE BRACKET
  [0xfe59, 0xfe5a], // SMALL LEFT PARENTHESIS
  [0xfe5a, 0xfe59], // SMALL RIGHT PARENTHESIS
  [0xfe5b, 0xfe5c], // SMALL LEFT CURLY BRACKET
  [0xfe5c, 0xfe5b], // SMALL RIGHT CURLY BRACKET
  [0xfe5d, 0xfe5e], // SMALL LEFT TORTOISE SHELL BRACKET
  [0xfe5e, 0xfe5d], // SMALL RIGHT TORTOISE SHELL BRACKET
  [0xfe64, 0xfe65], // SMALL LESS-THAN SIGN
  [0xfe65, 0xfe64], // SMALL GREATER-THAN SIGN
  [0xff08, 0xff09], // FULLWIDTH LEFT PARENTHESIS
  [0xff09, 0xff08], // FULLWIDTH RIGHT PARENTHESIS
  [0xff1c, 0xff1e], // FULLWIDTH LESS-THAN SIGN
  [0xff1e, 0xff1c], // FULLWIDTH GREATER-THAN SIGN
  [0xff3b, 0xff3d], // FULLWIDTH LEFT SQUARE BRACKET
  [0xff3d, 0xff3b], // FULLWIDTH RIGHT SQUARE BRACKET
  [0xff5b, 0xff5d], // FULLWIDTH LEFT CURLY BRACKET
  [0xff5d, 0xff5b], // FULLWIDTH RIGHT CURLY BRACKET
  [0xff5f, 0xff60], // FULLWIDTH LEFT WHITE PARENTHESIS
  [0xff60, 0xff5f], // FULLWIDTH RIGHT WHITE PARENTHESIS
  [0xff62, 0xff63], // [BEST FIT] HALFWIDTH LEFT CORNER BRACKET
  [0xff63, 0xff62], // [BEST FIT] HALFWIDTH RIGHT CORNER BRACKET
  [0x1db10, 0x221d], // CARTESIAN EQUALS SIGN
  [0x1db03, 0x1db04], // LEIBNIZIAN GREATER-THAN
  [0x1db04, 0x1db03], // LEIBNIZIAN LESS-THAN
  [0x1db05, 0x1db06], // LEIBNIZIAN GREATER-THAN WITH SMALL P
  [0x1db06, 0x1db05], // LEIBNIZIAN LESS-THAN WITH SMALL P
  [0x1db08, 0x1db09], // INVERTED SQUARE LEFT OPEN BOX OPERATOR
  [0x1db09, 0x1db08], // INVERTED SQUARE RIGHT OPEN BOX OPERATOR
]);

/**
 * The glpyhs that must be mirrored by hand (no available reflected glyph)
 * from https://www.unicode.org/Public/UNIDATA/BidiMirroring.txt
 */
export const mirrorSet = new Set<number>([
  0x2140, // DOUBLE-STRUCK N-ARY SUMMATION
  0x2201, // COMPLEMENT
  0x2202, // PARTIAL DIFFERENTIAL
  0x2203, // THERE EXISTS
  0x2204, // THERE DOES NOT EXIST
  0x2211, // N-ARY SUMMATION
  0x2216, // SET MINUS
  0x221a, // SQUARE ROOT
  0x221b, // CUBE ROOT
  0x221c, // FOURTH ROOT
  0x2226, // NOT PARALLEL TO
  0x222b, // INTEGRAL
  0x222c, // DOUBLE INTEGRAL
  0x222d, // TRIPLE INTEGRAL
  0x222e, // CONTOUR INTEGRAL
  0x222f, // SURFACE INTEGRAL
  0x2230, // VOLUME INTEGRAL
  0x2231, // CLOCKWISE INTEGRAL
  0x2232, // CLOCKWISE CONTOUR INTEGRAL
  0x2233, // ANTICLOCKWISE CONTOUR INTEGRAL
  0x2239, // EXCESS
  0x223b, // HOMOTHETIC
  0x223e, // INVERTED LAZY S
  0x223f, // SINE WAVE
  0x2240, // WREATH PRODUCT
  0x2241, // NOT TILDE
  0x2242, // MINUS TILDE
  0x2244, // NOT ASYMPTOTICALLY EQUAL TO
  0x2246, // APPROXIMATELY BUT NOT ACTUALLY EQUAL TO
  0x2247, // NEITHER APPROXIMATELY NOR ACTUALLY EQUAL TO
  0x2248, // ALMOST EQUAL TO
  0x2249, // NOT ALMOST EQUAL TO
  0x224a, // ALMOST EQUAL OR EQUAL TO
  0x224b, // TRIPLE TILDE
  0x225f, // QUESTIONED EQUAL TO
  0x2260, // NOT EQUAL TO
  0x2262, // NOT IDENTICAL TO
  0x226d, // NOT EQUIVALENT TO
  0x228c, // MULTISET
  0x22a7, // MODELS
  0x22aa, // TRIPLE VERTICAL BAR RIGHT TURNSTILE
  0x22ac, // DOES NOT PROVE
  0x22ad, // NOT TRUE
  0x22ae, // DOES NOT FORCE
  0x22af, // NEGATED DOUBLE VERTICAL BAR DOUBLE RIGHT TURNSTILE
  0x22be, // RIGHT ANGLE WITH ARC
  0x22bf, // RIGHT TRIANGLE
  0x22f5, // ELEMENT OF WITH DOT ABOVE
  0x22f8, // ELEMENT OF WITH UNDERBAR
  0x22f9, // ELEMENT OF WITH TWO HORIZONTAL STROKES
  0x22ff, // Z NOTATION BAG MEMBERSHIP
  0x2320, // TOP HALF INTEGRAL
  0x2321, // BOTTOM HALF INTEGRAL
  0x27c0, // THREE DIMENSIONAL ANGLE
  0x27cc, // LONG DIVISION
  0x27d3, // LOWER RIGHT CORNER WITH DOT
  0x27d4, // UPPER LEFT CORNER WITH DOT
  0x299c, // RIGHT ANGLE VARIANT WITH SQUARE
  0x299d, // MEASURED RIGHT ANGLE WITH DOT
  0x299e, // ANGLE WITH S INSIDE
  0x299f, // ACUTE ANGLE
  0x29a2, // TURNED ANGLE
  0x29a6, // OBLIQUE ANGLE OPENING UP
  0x29a7, // OBLIQUE ANGLE OPENING DOWN
  0x29c2, // CIRCLE WITH SMALL CIRCLE TO THE RIGHT
  0x29c3, // CIRCLE WITH TWO HORIZONTAL STROKES TO THE RIGHT
  0x29c9, // TWO JOINED SQUARES
  0x29ce, // RIGHT TRIANGLE ABOVE LEFT TRIANGLE
  0x29dc, // INCOMPLETE INFINITY
  0x29e1, // INCREASES AS
  0x29e3, // EQUALS SIGN AND SLANTED PARALLEL
  0x29e4, // EQUALS SIGN AND SLANTED PARALLEL WITH TILDE ABOVE
  0x29e5, // IDENTICAL TO AND SLANTED PARALLEL
  0x29f4, // RULE-DELAYED
  0x29f6, // SOLIDUS WITH OVERBAR
  0x29f7, // REVERSE SOLIDUS WITH HORIZONTAL STROKE
  0x2a0a, // MODULO TWO SUM
  0x2a0b, // SUMMATION WITH INTEGRAL
  0x2a0c, // QUADRUPLE INTEGRAL OPERATOR
  0x2a0d, // FINITE PART INTEGRAL
  0x2a0e, // INTEGRAL WITH DOUBLE STROKE
  0x2a0f, // INTEGRAL AVERAGE WITH SLASH
  0x2a10, // CIRCULATION FUNCTION
  0x2a11, // ANTICLOCKWISE INTEGRATION
  0x2a12, // LINE INTEGRATION WITH RECTANGULAR PATH AROUND POLE
  0x2a13, // LINE INTEGRATION WITH SEMICIRCULAR PATH AROUND POLE
  0x2a14, // LINE INTEGRATION NOT INCLUDING THE POLE
  0x2a15, // INTEGRAL AROUND A POINT OPERATOR
  0x2a16, // QUATERNION INTEGRAL OPERATOR
  0x2a17, // INTEGRAL WITH LEFTWARDS ARROW WITH HOOK
  0x2a18, // INTEGRAL WITH TIMES SIGN
  0x2a19, // INTEGRAL WITH INTERSECTION
  0x2a1a, // INTEGRAL WITH UNION
  0x2a1b, // INTEGRAL WITH OVERBAR
  0x2a1c, // INTEGRAL WITH UNDERBAR
  0x2a1e, // LARGE LEFT TRIANGLE OPERATOR
  0x2a1f, // Z NOTATION SCHEMA COMPOSITION
  0x2a20, // Z NOTATION SCHEMA PIPING
  0x2a21, // Z NOTATION SCHEMA PROJECTION
  0x2a24, // PLUS SIGN WITH TILDE ABOVE
  0x2a26, // PLUS SIGN WITH TILDE BELOW
  0x2a29, // MINUS SIGN WITH COMMA ABOVE
  0x2a3e, // Z NOTATION RELATIONAL COMPOSITION
  0x2a57, // SLOPING LARGE OR
  0x2a58, // SLOPING LARGE AND
  0x2a6a, // TILDE OPERATOR WITH DOT ABOVE
  0x2a6b, // TILDE OPERATOR WITH RISING DOTS
  0x2a6c, // SIMILAR MINUS SIMILAR
  0x2a6d, // CONGRUENT WITH DOT ABOVE
  0x2a6f, // ALMOST EQUAL TO WITH CIRCUMFLEX ACCENT
  0x2a70, // APPROXIMATELY EQUAL OR EQUAL TO
  0x2a73, // EQUALS SIGN ABOVE TILDE OPERATOR
  0x2a74, // DOUBLE COLON EQUAL
  0x2aa3, // DOUBLE NESTED LESS-THAN WITH UNDERBAR
  0x2adc, // FORKING
  0x2ae2, // VERTICAL BAR TRIPLE RIGHT TURNSTILE
  0x2ae6, // LONG DASH FROM LEFT MEMBER OF DOUBLE VERTICAL
  0x2af3, // PARALLEL WITH TILDE OPERATOR
  0x2afb, // TRIPLE SOLIDUS BINARY RELATION
  0x2afd, // DOUBLE SOLIDUS OPERATOR
  0x1d6db, // MATHEMATICAL BOLD PARTIAL DIFFERENTIAL
  0x1d715, // MATHEMATICAL ITALIC PARTIAL DIFFERENTIAL
  0x1d74f, // MATHEMATICAL BOLD ITALIC PARTIAL DIFFERENTIAL
  0x1d789, // MATHEMATICAL SANS-SERIF BOLD PARTIAL DIFFERENTIAL
  0x1d7c3, // MATHEMATICAL SANS-SERIF BOLD ITALIC PARTIAL DIFFERENTIAL
  0x1db17, // LEIBNIZIAN COINCIDENCE
  0x1db18, // INVERTED LAZY S OVER LAZY S
  0x1db1b, // LEIBNIZIAN DISSIMILARITY
]);
