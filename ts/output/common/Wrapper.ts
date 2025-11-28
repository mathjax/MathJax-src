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
import { unicodeChars } from '../../util/string.js';
import * as LENGTHS from '../../util/lengths.js';
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
  padding: [number, number, number, number];
  border: {
    width: [number, number, number, number];
    style: [string, string, string, string];
    color: [string, string, string, string];
  };
};

/*********************************************************/
/**
 * Generic constructor type
 */
export type Constructor<T> = new (...args: any[]) => T;

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
    WW, WF, WC, CC, VV, DD, FD, FC> {
    return this.jax.linebreaks;
  }

  /**
   * Easy access to the linebreak options
   *
   * @returns {{inline: boolean,
   *   width: string,
   *   lineleading: number,
   *   LinebreakVisitor: null}} The linebreak options
   */
  get linebreakOptions(): {
    inline: boolean;
    width: string;
    lineleading: number;
    LinebreakVisitor: null;
  } {
    return this.jax.options.linebreaks;
  }

  /**
   * @returns {boolean} True if children with percentage widths should be
   *     resolved by this container
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
   * @returns {WW}         The linebreak container for the child
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
   * @returns {WW}           The newly wrapped node
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
   * @returns {BBox}          The computed bounding box
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
   * @returns {BBox}  The computed bounding box
   */
  public getOuterBBox(save: boolean = true): BBox {
    const bbox = this.getBBox(save);
    if (!this.styleData) return bbox;
    const padding = this.styleData.padding;
    const border = this.styleData.border?.width || [0, 0, 0, 0];
    const obox = bbox.copy();
    for (const [, i, side] of BBox.boxSides) {
      (obox as any)[side] += padding[i] + border[i];
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
   * @param {number} i   The number of the segment whose sizes are to be obtained
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
   * @param {number} i The line number
   * @returns {LineBBox} The bounding box for that line
   */
  protected embellishedBBox(i: number): LineBBox {
    if (!this.node.isEmbellished || this.node.isKind('mo')) return null;
    const mo = this.coreMO();
    return mo.moLineBBox(i, mo.embellishedBreakStyle, this.getOuterBBox());
  }

  /**
   * Compute the bounding box for the i-th line (for when it is not in the cache).
   *
   * @param {number} i   The number of the line whose sizes are to be obtained
   * @returns {LineBBox}  The bounding box of the specified segment
   */
  protected computeLineBBox(i: number): LineBBox {
    return this.getChildLineBBox(this.childNodes[0], i);
  }

  /**
   * Find the (embellished) mo or mspace where a break occurs
   *
   * @param {LineBBox} bbox    The LineBBox for the line whose initial breakpoint is needed
   * @returns {[WW, WW]}        The embellished mo node and its core mo
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
   * @param {WW} child   The child node whose i-th line bbox is to be obtained
   * @param {number} i   The number of the line whose bbox is to be obtained
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
   * @param {BBox} bbox   The bounding box where left borders are to be added
   */
  protected addLeftBorders(bbox: BBox) {
    if (!this.styleData) return;
    const border = this.styleData.border;
    const padding = this.styleData.padding;
    bbox.w += (border?.width?.[3] || 0) + (padding?.[3] || 0);
  }

  /**
   * @param {BBox} bbox   The bounding box where top and bottom borders are to be added
   */
  protected addMiddleBorders(bbox: BBox) {
    if (!this.styleData) return;
    const border = this.styleData.border;
    const padding = this.styleData.padding;
    bbox.h += (border?.width?.[0] || 0) + (padding?.[0] || 0);
    bbox.d += (border?.width?.[2] || 0) + (padding?.[2] || 0);
  }

  /**
   * @param {BBox} bbox   The bounding box where right borders are to be added
   */
  protected addRightBorders(bbox: BBox) {
    if (!this.styleData) return;
    const border = this.styleData.border;
    const padding = this.styleData.padding;
    bbox.w += (border?.width?.[1] || 0) + (padding?.[1] || 0);
  }

  /**
   * Recursively resolve any percentage widths in the child nodes using the given
   *   container width (or the child width, if none was passed).
   *   Overriden for mtables in order to compute the width.
   *
   * @param {boolean} recompute  True if we are recomputing due to changes in children
   * @param {(number|null)=} w   The width of the container (from which percentages are computed)
   * @param {boolean=} clear     True if pwidth marker is to be cleared
   * @returns {boolean}           True if a percentage width was found
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
    const width = Array(4).fill(0);
    const style = Array(4);
    const color = Array(4);
    let hasPadding = false;
    let hasBorder = false;
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
    }
    this.styleData =
      hasPadding || hasBorder
        ? ({
            padding,
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
        console.warn(`Invalid variant: ${variant}`);
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
   * @returns {string} The explicit font marker
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
   *                       itself an embellished operator (the maximal embellished operator for its core)
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
   * @returns {boolean}          Whether the node can stretch in that direction
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
   * @param {string} indentalign   The indentalign to process
   * @param {string} indentshift   The indentshift to process
   * @param {string} align         The default alignment for 'auto'
   * @param {string} shift         The default indentshift for 'auto'
   * @param {number} width         The container width for relative shifts
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
   * @returns {number}        The x position of the aligned width
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
   * @returns {number}         The y position of the aligned baseline
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
   * @returns {number}    The inner width as a container (for percentage widths)
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
   * @returns {string}   The number m as a percent
   */
  protected percent(m: number): string {
    return LENGTHS.percent(m);
  }

  /**
   * @param {number} m  A number to be shown in ems
   * @returns {string}   The number with units of ems
   */
  protected em(m: number): string {
    return LENGTHS.em(m);
  }

  /**
   * @param {number} m   A number of em's to be shown as pixels
   * @param {number} M   The minimum number of pixels to allow
   * @returns {string}    The number with units of px
   */
  protected px(m: number, M: number = -LENGTHS.BIGDIMEN): string {
    return LENGTHS.px(m, M, this.metrics.em);
  }

  /**
   * @param {Property} length  A dimension (giving number and units) or number to be converted to ems
   * @param {number} size      The default size of the dimension (for percentage values)
   * @param {number} scale     The current scaling factor (to handle absolute units)
   * @returns {number}          The dimension converted to ems
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
   * @returns {number[]}     Array of numbers represeting the string's unicode character positions
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
   * @param {number[]} chars    The array of unicode character numbers to remap
   * @returns {number[]}         The converted array
   */
  public remapChars(chars: number[]): number[] {
    return chars;
  }

  /**
   * @param {string} text   The text from which to create a TextNode object
   * @returns {TextNode}     The TextNode with the given text
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
   * @returns {MmlNode}                The newly created MmlNode
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
   * @returns {CommonMo}     The wrapped MmlMo node
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
   * @returns {N}               The generated HTML tree
   */
  public html(type: string, def: OptionList = {}, content: (N | T)[] = []): N {
    return this.jax.html(type, def, content);
  }
}
