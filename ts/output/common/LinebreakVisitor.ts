/*************************************************************
 *
 *  Copyright (c) 2022 The MathJax Consortium
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
 * @fileoverview  A visitor class for determaining automatic linebreaks
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractVisitor} from '../../core/Tree/Visitor.js';
import {CommonOutputJax} from '../common.js';
import {CommonWrapperFactory} from './WrapperFactory.js';
import {FontData, FontDataClass, DelimiterData, VariantData, CharOptions} from './FontData.js';
import {CommonWrapper, CommonWrapperClass, LineBBox} from './Wrapper.js';
import {CommonMo} from './Wrappers/mo.js';
import {CommonMspace} from './Wrappers/mspace.js';
import {CommonMfrac} from './Wrappers/mfrac.js';
import {CommonMsub, CommonMsup, CommonMsubsup} from './Wrappers/msubsup.js';
import {CommonMmultiscripts} from './Wrappers/mmultiscripts.js';
import {CommonMfenced} from './Wrappers/mfenced.js';
import {CommonMaction} from './Wrappers/maction.js';
import {CommonMsqrt} from './Wrappers/msqrt.js';
import {BBox} from '../../util/BBox.js';
import {TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import {OPTABLE} from '../../core/MmlTree/OperatorDictionary.js';

/************************************************************************************/

/**
 * The mo/mspace for a break, its penalty, the width before the break,
 * the width + indent of the node after the break, and the width up to
 * the next break.
 */
export type BreakData<WW> = [WW, number, number, number, number];

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
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>
> extends AbstractVisitor<WW> {

  /**
   * Break a line to the given width
   *
   * @param {WW} _wrapper   The mrow to break
   * @param {number} _W     The width to break to
   */
  public breakToWidth(_wrapper: WW, _W: number) {
  }

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
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>
> extends Linebreaks<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

  /**
   * Penalties for the various line breaks: [p] for fixed penalty, [ , p] for cumulative penalty
   */
  protected PENALTY: {[key: string]: number[]} = {
    newline:         [0],
    nobreak:   [1000000],
    goodbreak: [ , -200],
    badbreak:  [ , +200],
    auto:         [ , 0],
  };

  /**
   * Penalties for other factors
   */
  protected FACTORS = {
    widthFactor:  2500,        // multiplier for uncovered width ratio
    nestFactor:    800,        // multiplier for nesting depth
    open:         -500,        // boost for an open fence
    close:         500,        // boost for a close fence
    separator:     500,        // boost for a separator (TeX doesn't break at commas, for example)
    fuzzFactor:    .99         // fuzz factor for comparing penalties
  };

  /**
   * The list of best breakpoints so far
   */
  protected potential: BreakData<WW>[];

  /**
   * The breakpoints to use
   */
  protected breaks: Set<WW>;

  /**
   * The maximum width for the lines
   */
  protected width: number;

  /**
   * The accumulated width since the last best breakpoint
   */
  protected w: number;

  /**
   * The width of the porevious line
   */
  protected prevWidth: number;

  /**
   * The most recent breakpoint used
   */
  protected prevBreak: WW;

  /**
   * the nesting depth of the active node
   */
  protected depth: number;

  /******************************************************************************/
  /**
   * Break a line to the given width
   *
   * @param {WW} wrapper   The mrow to break
   * @param {number} W     The width to break to
   */
  public breakToWidth(wrapper: WW, W: number) {
    this.breaks = new Set();
    this.width = W;
    const n = wrapper.breakCount;
    for (let i = 0; i <= n; i++) {
      const line = wrapper.lineBBox[i] || wrapper.getLineBBox(i);
      line.w > W && this.breakLineToWidth(wrapper, i);
    }
    this.breaks.forEach(ww => {
      (ww as any).setBreakStyle(ww.node.attributes.get('linebreakstyle') || 'before');
      ww.invalidateBBox();
    });
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The mrow to break
   * @param {number} W     The width to break to
   */
  protected subBreakToWidth(wrapper: WW, W: number) {
    const data = {
      breaks: this.breaks,
      width: this.width,
      potential: this.potential,
      w: this.w,
      prevWidth: this.prevWidth,
      prevBreak: this.prevBreak,
      depth: this.depth
    };
    this.breakToWidth(wrapper, W);
    this.prevWidth = data.prevWidth;
    this.prevBreak = data.prevBreak;
    this.breaks = data.breaks;
    this.width = data.width;
    this.potential = data.potential;
    this.w = data.w;
    this.depth = data.depth;
  }

  /**
   * Break a line to the given width
   *
   * @param {WW} wrapper   The mrow to break
   * @param {number} i     The line within that node to break
   */
  protected breakLineToWidth(wrapper: WW, i: number) {
    this.potential = [];
    this.w = 0;
    this.prevWidth = 0;
    this.prevBreak = null;
    this.depth = 0;
    this.visitNode(wrapper, i);
  }

  /**
   * @param {BBox} bbox       The BBox of the width to be added
   * @param {number} w        The width to add (defaults to full width of bbox)
   */
  protected addWidth(bbox: BBox, w: number = null) {
    if (w === null) {
      w = (bbox.L + bbox.w + bbox.R);
    }
    if (!w) return;
    w *= bbox.rscale;
    this.w += w;
    if (this.potential.length) {
      this.potential[0][3] += w;
    }
    this.processBreak();
  }

  /**
   * Mark the breakpoint(s) and get the current width
   */
  protected processBreak() {
    while (this.potential.length && this.w > this.width) {
      const [ww, p, pw, dw, w] = this.potential.pop();
//console.log('@@ break at', ww.node.toString(), p, pw, this.prevWidth);
      this.breaks.add(ww);
      this.w = this.potential.reduce((w, brk) => w + brk[3], dw + w);
      if (this.prevBreak && this.prevWidth + pw <= this.width) {
//console.log('>> unbreak', this.prevBreak ? this.prevBreak.node.toString() : 'none');
        this.breaks.delete(this.prevBreak);
        this.prevWidth += pw;
      } else {
        this.prevWidth = pw;
      }
      this.potential.forEach(data => data[2] -= pw);
      this.prevBreak = ww;
//console.log('>> potential', '[' + this.potential.map(data => data[0].node.toString()).reverse().join(', ') + ']');
//console.log('>> prev width', this.prevWidth);
    }
  }

  /**
   * Update the break list to include this break
   * @param {WW} wrapper        The mo/mspace that might be a breakpoint
   * @param {number} penalty    The penalty for that break
   * @param {number} w          The width+indent of the node after the break
   */
  protected pushBreak(wrapper: WW, penalty: number, w: number) {
//console.log('**', wrapper.node.toString()
//            .replace(/[\u2061-\u2064]/g, (c) => '\\u' + c.codePointAt(0).toString(16).toUpperCase()), penalty);
    if (penalty >= this.PENALTY.nobreak[0]) return;
    while (this.potential.length && this.potential[0][1] > this.FACTORS.fuzzFactor * penalty) {
      const data = this.potential.shift();
//console.log('-- dropping', data[0].node.toString());
      if (this.potential.length) {
        this.potential[0][3] += data[3];
      }
    }
//console.log('-- keeping', wrapper.node.toString(), penalty);
    this.potential.unshift([wrapper, penalty, this.w, w, 0]);
  }

  /**
   * @param {WW} wrapper          The node whose border/padding is needed
   * @return {[number, number]}   The left and right border+padding values
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
   * @override
   */
  public visitNode(wrapper: WW, i: number) {
    this.depth++;
    super.visitNode(wrapper, i);
    this.depth--;
  }

  /**
   * @override
   */
  public visitDefault(wrapper: WW, i: number) {
    const bbox = wrapper.getLineBBox(i);
    if (wrapper.node.isToken || wrapper.node.linebreakContainer) {
      this.addWidth(bbox);
    } else {
      const [L, R] = this.getBorderLR(wrapper);
      i === 0 && this.addWidth(bbox, bbox.L + L);
      this.visitNode(wrapper.childNodes[0], i);
      i === wrapper.breakCount && this.addWidth(bbox, bbox.R + R);
    }
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMo wrapper
   * @param {number} _i    The line within that node to break
   */
  public visitMoNode(wrapper: WW, _i: number) {
    const mo = wrapper as any as CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const bbox = LineBBox.from(mo.getOuterBBox());
    bbox.getIndentData(mo.node);
    const style = mo.getBreakStyle(mo.node.attributes.get('linebreakstyle') as string);
    const dw = mo.processIndent('', bbox.indentData[1][1], '', bbox.indentData[0][1], this.width)[1];
    const penalty = this.moPenalty(mo);
    if (style === 'before') {
      this.pushBreak(wrapper, penalty, dw);
      this.addWidth(bbox);
    } else {
      this.addWidth(bbox);
      const w = (style === 'after' ? 0 : mo.multChar ? mo.multChar.getBBox().w : bbox.w) + dw;
      this.pushBreak(wrapper, penalty, w);
    }
// console.log(wrapper.node.toString(), penalty, this.w);
  }

  /**
   * @param {CommonMo} mo    The mo whose penalty is to be computed
   * @return {number}        The computed penalty
   */
  protected moPenalty(mo: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>): number {
    const {linebreak, fence, form} = mo.node.attributes.getList('linebreak', 'fence', 'form');
    const FACTORS = this.FACTORS;
    let penalty = Math.floor((this.width - this.w) / this.width * FACTORS.widthFactor)
                + this.depth * FACTORS.nestFactor;
    const isOpen = (fence && form === 'prefix') || mo.node.texClass === TEXCLASS.OPEN;
    const isClose = (fence && form === 'postfix') || mo.node.texClass === TEXCLASS.CLOSE;
    if (isOpen) {
      if (mo.node.prevClass === TEXCLASS.BIN || mo.node.prevClass === TEXCLASS.REL) {
        penalty += FACTORS.open;
      }
      this.depth++;
    }
    if (isClose) {
      penalty += FACTORS.close;
      this.depth--;
    }
    const lpenalty = this.PENALTY[linebreak as string] || [ , 0];
    return (lpenalty.length === 1 ? lpenalty[0] : Math.max(1, penalty + lpenalty[1]));
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMspace wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMspaceNode(wrapper: WW, i: number) {
    const bbox = wrapper.getLineBBox(i);
    this.addWidth(bbox);
    const attributes = wrapper.node.attributes;
    if (attributes.getExplicit('width') === undefined &&
        attributes.getExplicit('height') === undefined &&
        attributes.getExplicit('depth') === undefined) {
      const penalty = this.mspacePenalty(wrapper as any as CommonMspace<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>);
      bbox.getIndentData(wrapper.node);
      const dw = wrapper.processIndent('', bbox.indentData[1][1], '', bbox.indentData[0][1], this.width)[1];
      this.pushBreak(wrapper, penalty, dw);
// console.log(wrapper.node.toString(), penalty, this.w);
    }
  }

  /**
   * @param {CommonMspace} mspace   The mspace whose penalty is to be computed
   * @return {number}               The computed penalty
   */
  protected mspacePenalty(mspace: CommonMspace<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>): number {
    const linebreak = mspace.node.attributes.get('linebreak');
    const FACTORS = this.FACTORS;
    let penalty = Math.floor(this.width - this.w / this.width * FACTORS.widthFactor)
                + this.depth * FACTORS.nestFactor;
    const lpenalty = this.PENALTY[linebreak as string] || [ , 0];
    return (lpenalty.length === 1 ? lpenalty[0] : Math.max(1, penalty + lpenalty[1]));
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMrow wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMrowNode(wrapper: WW, i: number) {
    const line = wrapper.lineBBox[i] || wrapper.getLineBBox(i);
    const [start, startL] = line.start || [0, 0];
    const [end, endL]  = line.end || [wrapper.childNodes.length - 1, 0];
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(line, line.L + L);
    for (let i = start; i <= end; i++) {
      this.visitNode(wrapper.childNodes[i], i === start ? startL : i === end ? endL : 0);
    }
    this.addWidth(line, line.R + R);
  }

  /**
   * @param {WW} wrapper   The MmlInferredMrow wrapper
   * @param {number} i     The line within that node to break
   */
  public visitInferredMrowNode(wrapper: WW, i: number) {
    this.depth--;  // don't add depth for inferred rows
    this.visitMrowNode(wrapper, i);
    this.depth++;
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMFrac wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMfracNode(wrapper: WW, i: number) {
    const mfrac = wrapper as any as CommonMfrac<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    if (!mfrac.node.attributes.get('bevelled') && mfrac.getOuterBBox().w > this.width) {
      this.subBreakToWidth(mfrac.childNodes[0], this.width);
      this.subBreakToWidth(mfrac.childNodes[1], this.width);
    }
    this.visitDefault(wrapper, i);
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMsqrt wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsqrtNode(wrapper: WW, i: number) {
    if (wrapper.getOuterBBox().w > this.width) {
      const msqrt = wrapper as any as CommonMsqrt<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
      const base = msqrt.childNodes[msqrt.base];
      this.subBreakToWidth(base, this.width - msqrt.rootWidth());
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
    const msub = wrapper as any as CommonMsub<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const x = msub.getOffset()[0];
    const sbox = msub.scriptChild.getOuterBBox();
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(msub.getLineBBox(i), x + L + sbox.rscale * sbox.w + msub.font.params.scriptspace + R);
  }

  /**
   * @param {WW} wrapper   The MmlMsup wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsupNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    const msup = wrapper as any as CommonMsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const x = msup.getOffset()[0];
    const sbox = msup.scriptChild.getOuterBBox();
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(msup.getLineBBox(i), x + L + sbox.rscale * sbox.w + msup.font.params.scriptspace + R);
  }

  /**
   * @param {WW} wrapper   The MmlMsubsup wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsubsupNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    const msubsup = wrapper as any as CommonMsubsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const subbox = msubsup.subChild.getOuterBBox();
    const supbox = msubsup.supChild.getOuterBBox();
    const x = msubsup.getAdjustedIc();
    const w = Math.max(subbox.rscale * subbox.w, x + supbox.rscale * supbox.w) + msubsup.font.params.scriptspace;
    const [L, R] = this.getBorderLR(wrapper);
    this.addWidth(wrapper.getLineBBox(i), L + w + R);
  }

  /**
   * @param {WW} wrapper   The MmlMmultiscripts wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMmultiscriptsNode(wrapper: WW, i: number) {
    const mmultiscripts = wrapper as any as CommonMmultiscripts<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const data = mmultiscripts.scriptData;
    if (data.numPrescripts) {
      const w = Math.max(data.psup.rscale * data.psup.w, data.psub.rscale * data.psub.w);
      this.addWidth(wrapper.getLineBBox(i), w + mmultiscripts.font.params.scriptspace);
    }
    this.visitDefault(wrapper, i);
    if (data.numScripts) {
      const w = Math.max(data.sup.rscale * data.sup.w, data.sub.rscale * data.sub.w);
      this.addWidth(wrapper.getLineBBox(i), w + mmultiscripts.font.params.scriptspace);
    }
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMfenced wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMfencedNode(wrapper: WW, i: number) {
    const mfenced = wrapper as any as CommonMfenced<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const bbox = wrapper.getLineBBox(i);
    const [L, R] = this.getBorderLR(wrapper);
    i === 0 && this.addWidth(bbox, bbox.L + L);
    this.visitNode(mfenced.mrow as any as WW, i);
    i === wrapper.breakCount && this.addWidth(bbox, bbox.R + R);
  }

  /******************************************************************************/

  /**
   * @param {WW} wrapper   The MmlMaction wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMactionNode(wrapper: WW, i: number) {
    const maction = wrapper as any as CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const bbox = wrapper.getLineBBox(i);
    const [L, R] = this.getBorderLR(wrapper);
    i === 0 && this.addWidth(bbox, bbox.L + L);
    this.visitNode(maction.selected, i);
    i === wrapper.breakCount && this.addWidth(bbox, bbox.R + R);
  }

}


/**
 * Make closing fences default to breaking after them (not sure why that isn't the default)
 */
(function () {
  for (const op of Object.keys(OPTABLE.postfix)) {
    const data = OPTABLE.postfix[op][3];
    if (data && data.fence) {
      data.linebreakstyle = 'after';
    }
  }
  OPTABLE.infix['\u2061'] = [...OPTABLE.infix['\u2061']];
  OPTABLE.infix['\u2061'][3] = {linebreak: 'nobreak'};
})();
