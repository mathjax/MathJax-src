/*************************************************************
 *
 *  Copyright (c) 2022-2025 The MathJax Consortium
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
 * @file  A visitor class for determaning automatic linebreaks
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractVisitor } from '../../core/Tree/Visitor.js';
import { CommonOutputJax } from '../common.js';
import { CommonWrapperFactory } from './WrapperFactory.js';
import {
  FontData,
  FontDataClass,
  DelimiterData,
  VariantData,
  CharOptions,
} from './FontData.js';
import { CommonWrapper, CommonWrapperClass } from './Wrapper.js';
import { CommonMo } from './Wrappers/mo.js';
import { CommonMspace } from './Wrappers/mspace.js';
import { CommonMfrac } from './Wrappers/mfrac.js';
import { CommonMsub, CommonMsup, CommonMsubsup } from './Wrappers/msubsup.js';
import { CommonMmultiscripts } from './Wrappers/mmultiscripts.js';
import { CommonMfenced } from './Wrappers/mfenced.js';
import { CommonMaction } from './Wrappers/maction.js';
import { CommonMsqrt } from './Wrappers/msqrt.js';
import { CommonMtext } from './Wrappers/mtext.js';
import { BBox } from '../../util/BBox.js';
import { LineBBox } from './LineBBox.js';
import { TEXCLASS } from '../../core/MmlTree/MmlNode.js';
import { OPTABLE } from '../../core/MmlTree/OperatorDictionary.js';
import { MmlNode, TextNode } from '../../core/MmlTree/MmlNode.js';

/************************************************************************************/

/**
 * Breaks with penalties above this are ignored
 */
export const NOBREAK = 1000000;

/**
 * The child index and character index for a break in an mtext element
 */
export type IndexData = [number, number] | null;

/**
 * The mo/mspace for a break, its penalty, the width before the break,
 * the width + indent of the node after the break, the width up to
 * the next break, and the index for the break (for mtext)
 */
export type BreakData<WW> = [[WW, IndexData], number, number, number, number];

/**
 * The data used for a line-breaking operation
 */
/* prettier-ignore */
export interface StateData<WW> {
  breaks: Set<[WW, IndexData]>;  // The breakpoints to use and the break index (for mtext)
  potential: BreakData<WW>[];    // The list of best breakpoints so far
  width: number;                 // The maximum width for the lines
  w: number;                     // The accumulated width since the last best breakpoint
  prevWidth: number;             // The width of the previous line
  prevBreak: BreakData<WW>;      // The most recent breakpoint used
  depth: number;                 // The nesting depth of the active node
  mathWidth: number;             // The full width of the unbroken math
  mathLeft: number;              // The amount of width left after the most recent break
}

/************************************************************************************/

/**
 * A do-nothing linebreaker for use when automatic linebreaks are not requested
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
export class Linebreaks<
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
> extends AbstractVisitor<WW> {
  /**
   * Break a line to the given width
   *
   * @param {WW} _wrapper   The mrow to break
   * @param {number} _W     The width to break to
   */
  public breakToWidth(_wrapper: WW, _W: number) {}
}

/************************************************************************************/
/*
 * The basic linebreak visitor for automatic line breaks.
 */

/**
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
export class LinebreakVisitor<
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
> extends Linebreaks<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * Penalty functions for the various linebreak values
   */
  protected PENALTY: { [key: string]: (p: number) => number } = {
    newline: (_p) => 0,
    nobreak: (_p) => NOBREAK,
    goodbreak: (p) => p - 200 * this.state.depth,
    badbreak: (p) => p + 200 * this.state.depth,
    auto: (p) => p,
  };

  /**
   * Penalties for other factors
   */
  protected FACTORS: {
    [key: string]: (
      p: number,
      mo?: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
    ) => number;
  } = {
    //
    // Adjust for nesting depth
    //
    depth: (p) => p + 800 * this.state.depth,
    //
    // Adjust for width (avoids short lines)
    //
    width: (p) =>
      p +
      Math.floor(((this.state.width - this.state.w) / this.state.width) * 2500),
    //
    // Adjust for ratio of width to remainder (avoids short last lines)
    //
    tail: (p) =>
      p +
      Math.floor(
        (this.state.width /
          Math.max(0.0001, this.state.mathLeft - this.state.w)) *
          500
      ),
    //
    // Adjust for an open fence
    //
    open: (p, mo) => {
      const prevClass = mo.node.prevClass;
      if (
        prevClass === TEXCLASS.BIN ||
        prevClass === TEXCLASS.REL ||
        prevClass === TEXCLASS.OP
      ) {
        return p + 5000;
      }
      const prev = this.getPrevious(mo);
      if (
        prev &&
        (prev.attributes.get('form') !== 'postfix' ||
          prev.attributes.get('linebreak') === 'nobreak')
      ) {
        return p + 5000;
      }
      const parent = mo.node.Parent;
      if (
        parent?.isKind('mmultiscripts') &&
        mo.node === this.getFirstToken(parent)
      ) {
        const prescripts = !!parent.childNodes.filter((node) =>
          node.isKind('mprescripts')
        ).length;
        if (prescripts) return NOBREAK;
      }
      return p - 500;
    },
    //
    // Adjust for a close fence
    //
    close: (p, mo) => {
      const parent = mo.node.Parent;
      if (
        parent?.isKind('msubsup') &&
        !(
          parent.isKind('mmultiscripts') &&
          parent.childNodes[1]?.isKind('mprescripts')
        ) &&
        mo.node === this.getLastToken(parent.childNodes[0])
      ) {
        return NOBREAK;
      }
      return p + 500;
    },
    //
    // Adjust for mspace width
    //
    space: (p, node) => {
      /* prettier-ignore */
      const mspace = node as any as CommonMspace<
        N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
      >;
      if (!mspace.canBreak) return NOBREAK;
      const w = mspace.getBBox().w;
      return w < 0 ? NOBREAK : w < 1 ? p : p - 100 * (w + 4);
    },
    //
    // Adjust for a separator (TeX doesn't break at commas, for example)
    //
    separator: (p) => p + 500,
    //
    // Fuzz factor for comparing penalties
    //
    fuzz: (p) => p * 0.99,
  };

  /**
   * Penalties for tex classes
   */
  protected TEXCLASS: { [key: string]: (p: number) => number } = {
    [TEXCLASS.BIN]: (p) => p - 250, // binary operators are good breakpoints
    [TEXCLASS.REL]: (p) => p - 500, // relations are better breakpoints
  };

  /**
   * The state of the linebreaking process
   */
  protected state: StateData<WW>;

  /******************************************************************************/
  /**
   * Break a line to the given width
   *
   * @param {WW} wrapper   The mrow to break
   * @param {number} W     The width to break to
   */
  public breakToWidth(wrapper: WW, W: number) {
    const state = this.state;
    this.state = this.createState(wrapper);
    this.state.width = W;
    const n = wrapper.breakCount;
    for (let i = 0; i <= n; i++) {
      const line = wrapper.lineBBox[i] || wrapper.getLineBBox(i);
      if (line.w > W) {
        this.breakLineToWidth(wrapper, i);
      }
    }
    for (const [ww, ij] of this.state.breaks) {
      if (ij === null) {
        const mo = (ww as any).coreMO();
        mo.setBreakStyle(mo.node.attributes.get('linebreakstyle') || 'before');
      } else {
        (ww as any).setBreakAt(ij);
      }
      ww.invalidateBBox();
    }
    this.state = state;
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper The wrapper object
   * @returns {StateData<WW>}  The new state object
   */
  protected createState(wrapper: WW): StateData<WW> {
    const mathWidth = wrapper.getBBox().w;
    return {
      breaks: new Set<[WW, IndexData]>(),
      potential: [],
      width: 0,
      w: 0,
      prevWidth: 0,
      prevBreak: null,
      depth: 0,
      mathWidth: mathWidth,
      mathLeft: mathWidth,
    };
  }

  /**
   * Break a line to the given width
   *
   * @param {WW} wrapper   The mrow to break
   * @param {number} i     The line within that node to break
   */
  protected breakLineToWidth(wrapper: WW, i: number) {
    const state = this.state;
    state.potential = [];
    state.w = 0;
    state.prevWidth = 0;
    state.prevBreak = null;
    state.depth = 0;
    this.visitNode(wrapper, i);
  }

  /******************************************************************************/

  /**
   * @param {BBox} bbox       The BBox of the width to be added
   * @param {number} w        The width to add (defaults to full width of bbox)
   */
  protected addWidth(bbox: BBox, w: number = null) {
    if (w === null) {
      w = bbox.L + bbox.w + bbox.R;
    }
    if (!w) return;
    w *= bbox.rscale;
    this.state.w += w;
    if (this.state.potential.length) {
      this.state.potential[0][4] += w;
    }
    this.processBreak();
  }

  /**
   * Mark the breakpoint(s) and get the current width
   */
  protected processBreak() {
    const state = this.state;
    while (state.potential.length && state.w > this.state.width) {
      const br = state.potential.pop();
      const [ww, , pw, dw, w] = br;
      state.breaks.add(ww);
      state.w = state.potential.reduce((w, brk) => w + brk[4], dw + w);
      if (state.prevBreak && state.prevWidth + pw <= state.width) {
        state.breaks.delete(state.prevBreak[0]);
        state.prevWidth += pw;
      } else {
        state.prevWidth = pw + dw;
      }
      state.potential.forEach((data) => (data[2] -= pw));
      state.prevBreak = br;
      state.mathLeft -= pw;
    }
  }

  /**
   * Update the break list to include this break
   *
   * @param {WW} wrapper        The mo/mspace that might be a breakpoint
   * @param {number} penalty    The penalty for that break
   * @param {number} w          The width+indent of the node after the break
   * @param {IndexData} ij      The child and character index, or null
   */
  protected pushBreak(wrapper: WW, penalty: number, w: number, ij: IndexData) {
    const state = this.state;
    if (penalty >= NOBREAK || (state.w === 0 && state.prevWidth === 0)) return;
    while (
      state.potential.length &&
      state.potential[0][1] > this.FACTORS.fuzz(penalty)
    ) {
      const data = state.potential.shift();
      if (state.potential.length) {
        state.potential[0][4] += data[4];
      }
    }
    state.potential.unshift([
      [wrapper, ij],
      penalty,
      state.w - (state.prevBreak?.[3] || 0),
      w,
      0,
    ]);
  }

  /**
   * @param {WW} wrapper          The node whose border/padding is needed
   * @returns {[number, number]}   The left and right border+padding values
   */
  protected getBorderLR(wrapper: WW): [number, number] {
    const data = wrapper.styleData;
    if (!data) return [0, 0];
    const border = data?.border?.width || [0, 0, 0, 0];
    const padding = data?.padding || [0, 0, 0, 0];
    return [border[3] + padding[3], border[1] + padding[1]];
  }

  /******************************************************************************/

  /**
   * @param {MmlNode} node   The node to find the first token child for
   * @returns {MmlNode}       The first token child (at any depth) for the node
   */
  protected getFirstToken(node: MmlNode): MmlNode {
    return node.isToken ? node : this.getFirstToken(node.childNodes[0]);
  }

  /**
   * @param {MmlNode} node   The node to find the last token child for
   * @returns {MmlNode}       The last token child (at any depth) for the node
   */
  protected getLastToken(node: MmlNode): MmlNode {
    return node.isToken
      ? node
      : this.getLastToken(node.childNodes[node.childNodes.length - 1]);
  }

  /******************************************************************************/

  /**
   * @override
   */
  public visitNode(wrapper: WW, i: number) {
    if (!wrapper) return;
    this.state.depth++;
    if (wrapper.node.isEmbellished && !wrapper.node.isKind('mo')) {
      this.visitEmbellishedOperator(wrapper, i);
    } else {
      super.visitNode(wrapper, i);
    }
    this.state.depth--;
  }

  /**
   * @override
   */
  public visitDefault(wrapper: WW, i: number) {
    const bbox = wrapper.getLineBBox(i);
    if (
      wrapper.node.isToken ||
      wrapper.node.linebreakContainer ||
      !wrapper.childNodes?.[0]
    ) {
      this.addWidth(bbox);
    } else {
      const [L, R] = this.getBorderLR(wrapper);
      if (i === 0) {
        this.addWidth(bbox, bbox.L + L);
      }
      this.visitNode(wrapper.childNodes[0], i);
      if (i === wrapper.breakCount) {
        this.addWidth(bbox, bbox.R + R);
      }
    }
  }

  public visitEmbellishedOperator(wrapper: WW, _i: number) {
    const mo = wrapper.coreMO();
    const bbox = LineBBox.from(
      wrapper.getOuterBBox(),
      wrapper.linebreakOptions.lineleading
    );
    bbox.getIndentData(mo.node);
    const style = mo.getBreakStyle(
      mo.node.attributes.get('linebreakstyle') as string
    );
    const dw = mo.processIndent(
      '',
      bbox.indentData[1][1],
      '',
      bbox.indentData[0][1],
      this.state.width
    )[1];
    const penalty = this.moPenalty(mo);
    if (style === 'before') {
      this.pushBreak(wrapper, penalty, dw - bbox.L, null);
      this.addWidth(bbox);
    } else {
      this.addWidth(bbox);
      const w =
        (style === 'after'
          ? 0
          : mo.multChar
            ? mo.multChar.getBBox().w
            : bbox.w) + dw;
      this.pushBreak(wrapper, penalty, w, null);
    }
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMo wrapper
   * @param {number} _i    The line within that node to break
   */
  public visitMoNode(wrapper: WW, _i: number) {
    /* prettier-ignore */
    const mo = wrapper as any as CommonMo<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    const bbox = LineBBox.from(
      mo.getOuterBBox(),
      mo.linebreakOptions.lineleading
    );
    bbox.getIndentData(mo.node);
    const style = mo.getBreakStyle(
      mo.node.attributes.get('linebreakstyle') as string
    );
    const dw = mo.processIndent(
      '',
      bbox.indentData[1][1],
      '',
      bbox.indentData[0][1],
      this.state.width
    )[1];
    const penalty = this.moPenalty(mo);
    if (style === 'before') {
      this.pushBreak(wrapper, penalty, dw - bbox.L, null);
      this.addWidth(bbox);
    } else {
      this.addWidth(bbox);
      const w =
        (style === 'after'
          ? 0
          : mo.multChar
            ? mo.multChar.getBBox().w
            : bbox.w) + dw;
      this.pushBreak(wrapper, penalty, w, null);
    }
  }

  /**
   * @param {CommonMo} mo    The mo whose penalty is to be computed
   * @returns {number}        The computed penalty
   */
  protected moPenalty(
    mo: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  ): number {
    const { linebreak, fence, form } = mo.node.attributes.getList(
      'linebreak',
      'fence',
      'form'
    );
    const FACTORS = this.FACTORS;
    let penalty = FACTORS.tail(FACTORS.width(0));
    const isOpen =
      (fence && form === 'prefix') || mo.node.texClass === TEXCLASS.OPEN;
    const isClose =
      (fence && form === 'postfix') || mo.node.texClass === TEXCLASS.CLOSE;
    if (isOpen) {
      penalty = FACTORS.open(penalty, mo);
      this.state.depth++;
    }
    if (isClose) {
      penalty = FACTORS.close(penalty, mo);
      this.state.depth--;
    }
    penalty = (this.TEXCLASS[mo.node.texClass] || ((p) => p))(penalty);
    return (this.PENALTY[linebreak as string] || ((p) => p))(
      FACTORS.depth(penalty)
    );
  }

  /**
   * @param {CommonMo} mo   The mo whose preceeding mo node is needed
   * @returns {MmlNode | null} The core mo if it exists
   */
  protected getPrevious(
    mo: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  ): MmlNode | null {
    let child = mo.node;
    let parent = child.parent;
    let i = parent.childIndex(child);
    while (parent && (parent.notParent || parent.isKind('mrow')) && i === 0) {
      child = parent;
      parent = child.parent;
      i = parent.childIndex(child);
    }
    if (!parent || !i) return null;
    const prev = parent.childNodes[i - 1];
    return prev.isEmbellished ? prev.coreMO() : null;
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMspace wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMspaceNode(wrapper: WW, i: number) {
    const bbox = wrapper.getLineBBox(i);
    /* prettier-ignore */
    const mspace = wrapper as any as CommonMspace<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    if (mspace.canBreak) {
      const penalty = this.mspacePenalty(mspace);
      bbox.getIndentData(wrapper.node);
      const dw = wrapper.processIndent(
        '',
        bbox.indentData[1][1],
        '',
        bbox.indentData[0][1],
        this.state.width
      )[1];
      this.pushBreak(wrapper, penalty, dw - bbox.w, null);
    }
    this.addWidth(bbox);
  }

  /**
   * @param {CommonMspace} mspace   The mspace whose penalty is to be computed
   * @returns {number}               The computed penalty
   */
  protected mspacePenalty(
    mspace: CommonMspace<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  ): number {
    const linebreak = mspace.node.attributes.get('linebreak');
    const FACTORS = this.FACTORS;
    const penalty = FACTORS.space(
      FACTORS.tail(FACTORS.width(0)),
      mspace as any
    );
    return (this.PENALTY[linebreak as string] || ((p) => p))(
      FACTORS.depth(penalty)
    );
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMspace wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMtextNode(wrapper: WW, i: number) {
    if (!wrapper.getText().match(/ /)) {
      this.visitDefault(wrapper, i);
      return;
    }
    /* prettier-ignore */
    const mtext = wrapper as any as CommonMtext<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    mtext.clearBreakPoints();
    const space = mtext.textWidth(' ');
    const bbox = wrapper.getBBox();
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(bbox, bbox.L + L);
    //
    // Loop through the mtext children...
    //
    const children = mtext.childNodes;
    for (const j of children.keys()) {
      const child = children[j];
      //
      //  If the child is a text node:
      //    Break it into words and loop thorugh them, adding their width
      //    and inserting breakpoints for the spaces
      //  Otherwise (child is mglyph or embedded HTML)
      //    Add the child's width
      //
      if (child.node.isKind('text')) {
        const words = (child.node as TextNode).getText().split(/ /);
        const last = words.pop();
        for (const k of words.keys()) {
          this.addWidth(bbox, mtext.textWidth(words[k]));
          this.pushBreak(wrapper, this.mtextPenalty(), -space, [j, k + 1]);
          this.addWidth(bbox, space);
        }
        this.addWidth(bbox, mtext.textWidth(last));
      } else {
        this.addWidth(child.getBBox());
      }
    }
    this.addWidth(bbox, bbox.R + R);
  }

  /**
   * @returns {number}   The computed penalty
   */
  protected mtextPenalty(): number {
    const FACTORS = this.FACTORS;
    return FACTORS.depth(FACTORS.tail(FACTORS.width(0)));
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMrow wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMrowNode(wrapper: WW, i: number) {
    const line = wrapper.lineBBox[i] || wrapper.getLineBBox(i);
    const [start, startL] = line.start || [0, 0];
    const [end, endL] = line.end || [wrapper.childNodes.length - 1, 0];
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(line, line.L + L);
    for (let i = start; i <= end; i++) {
      this.visitNode(
        wrapper.childNodes[i],
        i === start ? startL : i === end ? endL : 0
      );
    }
    this.addWidth(line, line.R + R);
  }

  /**
   * @param {WW} wrapper   The MmlInferredMrow wrapper
   * @param {number} i     The line within that node to break
   */
  public visitInferredMrowNode(wrapper: WW, i: number) {
    this.state.depth--; // don't add depth for inferred rows
    this.visitMrowNode(wrapper, i);
    this.state.depth++;
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMFrac wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMfracNode(wrapper: WW, i: number) {
    /* prettier-ignore */
    const mfrac = wrapper as any as CommonMfrac<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    if (
      !mfrac.node.attributes.get('bevelled') &&
      mfrac.getOuterBBox().w > this.state.width
    ) {
      this.breakToWidth(mfrac.childNodes[0], this.state.width);
      this.breakToWidth(mfrac.childNodes[1], this.state.width);
    }
    this.visitDefault(wrapper, i);
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMsqrt wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsqrtNode(wrapper: WW, i: number) {
    if (wrapper.getOuterBBox().w > this.state.width) {
      /* prettier-ignore */
      const msqrt = wrapper as any as CommonMsqrt<
        N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
      >;
      const base = msqrt.childNodes[msqrt.base];
      this.breakToWidth(base, this.state.width - msqrt.rootWidth());
      msqrt.getStretchedSurd();
    }
    this.visitDefault(wrapper, i);
  }

  /**
   * @param {WW} wrapper   The MmlMroot wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMrootNode(wrapper: WW, i: number) {
    this.visitMsqrtNode(wrapper, i);
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMsub wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsubNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    /* prettier-ignore */
    const msub = wrapper as any as CommonMsub<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    const x = msub.getOffset()[0];
    const sbox = msub.scriptChild.getOuterBBox();
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(
      msub.getLineBBox(i),
      x + L + sbox.rscale * sbox.w + msub.font.params.scriptspace + R
    );
  }

  /**
   * @param {WW} wrapper   The MmlMsup wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsupNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    /* prettier-ignore */
    const msup = wrapper as any as CommonMsup<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    const x = msup.getOffset()[0];
    const sbox = msup.scriptChild.getOuterBBox();
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(
      msup.getLineBBox(i),
      x + L + sbox.rscale * sbox.w + msup.font.params.scriptspace + R
    );
  }

  /**
   * @param {WW} wrapper   The MmlMsubsup wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsubsupNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    /* prettier-ignore */
    const msubsup = wrapper as any as CommonMsubsup<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    const subbox = msubsup.subChild.getOuterBBox();
    const supbox = msubsup.supChild.getOuterBBox();
    const x = msubsup.getAdjustedIc();
    const w =
      Math.max(subbox.rscale * subbox.w, x + supbox.rscale * supbox.w) +
      msubsup.font.params.scriptspace;
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(wrapper.getLineBBox(i), L + w + R);
  }

  /**
   * @param {WW} wrapper   The MmlMmultiscripts wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMmultiscriptsNode(wrapper: WW, i: number) {
    /* prettier-ignore */
    const mmultiscripts = wrapper as any as CommonMmultiscripts<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    const data = mmultiscripts.scriptData;
    if (data.numPrescripts) {
      const w = Math.max(
        data.psup.rscale * data.psup.w,
        data.psub.rscale * data.psub.w
      );
      this.addWidth(
        wrapper.getLineBBox(i),
        w + mmultiscripts.font.params.scriptspace
      );
    }
    this.visitDefault(wrapper, i);
    if (data.numScripts) {
      const w = Math.max(
        data.sup.rscale * data.sup.w,
        data.sub.rscale * data.sub.w
      );
      this.addWidth(
        wrapper.getLineBBox(i),
        w + mmultiscripts.font.params.scriptspace
      );
    }
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMfenced wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMfencedNode(wrapper: WW, i: number) {
    /* prettier-ignore */
    const mfenced = wrapper as any as CommonMfenced<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    const bbox = wrapper.getLineBBox(i);
    const [L, R] = this.getBorderLR(wrapper);
    if (i === 0) {
      this.addWidth(bbox, bbox.L + L);
    }
    this.visitNode(mfenced.mrow as any as WW, i);
    if (i === wrapper.breakCount) {
      this.addWidth(bbox, bbox.R + R);
    }
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMaction wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMactionNode(wrapper: WW, i: number) {
    /* prettier-ignore */
    const maction = wrapper as any as CommonMaction<
      N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC
    >;
    const bbox = wrapper.getLineBBox(i);
    const [L, R] = this.getBorderLR(wrapper);
    if (i === 0) {
      this.addWidth(bbox, bbox.L + L);
    }
    this.visitNode(maction.selected, i);
    if (i === wrapper.breakCount) {
      this.addWidth(bbox, bbox.R + R);
    }
  }
}

/******************************************************************************/
/******************************************************************************/

(function () {
  //
  // Make closing fences default to breaking after them (not sure why that isn't the default)
  //
  for (const op of Object.keys(OPTABLE.postfix)) {
    const data = OPTABLE.postfix[op][3];
    if (data && data.fence) {
      data.linebreakstyle = 'after';
    }
  }
  //
  // Make function apply be non-breaking by default
  //
  OPTABLE.infix['\u2061'] = [...OPTABLE.infix['\u2061']];
  OPTABLE.infix['\u2061'][3] = { linebreak: 'nobreak' };
})();
