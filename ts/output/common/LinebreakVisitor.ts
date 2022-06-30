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
import {CommonWrapper, CommonWrapperClass} from './Wrapper.js';
import {CommonMo} from './Wrappers/mo.js';
import {CommonMspace} from './Wrappers/mspace.js';
import {CommonMsub, CommonMsup, CommonMsubsup} from './Wrappers/msubsup.js';
import {CommonMmultiscripts} from './Wrappers/mmultiscripts.js';
import {CommonMfenced} from './Wrappers/mfenced.js';
import {CommonMaction} from './Wrappers/maction.js';
import {BBox} from '../../util/BBox.js';
import {TEXCLASS} from '../../core/MmlTree/MmlNode.js';

/************************************************************************************/

/**
 * The mo/mspace for a break, its penalty, the width + indent of the node after the break,
 * the width up to the next break, and the list of breaks that should be undone if this one
 * is used.
 */
export type BreakData<WW> = [WW, number, number, number, WW[]];

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
> extends AbstractVisitor<WW> {

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
    widthFactor:   800,
    nestFactor:    400,
    open:         -500,
    close:         500
  }

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
   * The accumulated with since the last best breakpoint
   */
  protected w: number;

  /**
   * the nesting depth of the active node
   */
  protected depth: number;

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
      (ww as any).setBreakStyle(ww.node.attributes.get('linebreakstyle') || 'before')
      ww.invalidateBBox();
    });

  }

  /**
   * Break a line to the given width
   *
   * @param {WW} wrapper   The mrow to break
   * @param {number} i     The line within that node to break
   */
  public breakLineToWidth(wrapper: WW, i: number) {
    this.potential = [];
    this.w = 0;
    this.depth = 0;
    this.visitNode(wrapper, i);
  }

  /**
   * @param {BBox} bbox     The BBox of the width to be added
   * @param {number} w      The width to add (defaults to full wifth of bbox)
   * @param {boolean} add   True if add width into break array
   */
  protected addWidth(bbox: BBox, w: number = null, add: boolean = true) {
    if (w === null) {
      w = (bbox.L + bbox.w + bbox.R);
    }
    if (!w) return;
    w *= bbox.rscale;
    this.w += w;
    if (this.potential.length && add) {
      this.potential[0][3] += w;
    }
    this.processBreak();
  }

  /**
   * Mark the breakpoint(s) and get the current width
   */
  protected processBreak() {
    while (this.potential.length && this.w > this.width) {
      const [ww, , dw, w, list] = this.potential.pop();
      this.breaks.add(ww);
      this.w = this.potential.reduce((w, brk) => w + brk[3], dw + w);
      this.potential.forEach(([, , , , list]) => list.push(ww));
      list.forEach(ww => this.breaks.delete(ww));
    }
  }

  /**
   * Update the break list to inclkude this break
   * @param {WW} wrapper        The mo/mspace that might be a breakpoint
   * @param {number} penalty    The penalty for that break
   * @param {number} w          The width+indent of the node after the break
   */
  protected pushBreak(wrapper: WW, penalty: number, w: number) {
    if (penalty >= this.PENALTY.nobreak[0]) return;
    while (this.potential.length && this.potential[0][1] > penalty) {
      const data = this.potential.shift();
      if (this.potential.length) {
        this.potential[0][3] += data[3];
      }
    }
    this.potential.unshift([wrapper, penalty, w, 0, []]);
  }

  /**
   * @override
   */
  public visitNode(wrapper: WW, i: number) {
    this.depth++;
    super.visitNode(wrapper, i);
    this.depth--;
  }

  /**
   * @param {WW} wrapper   The MmlMo wrapper
   * @param {number} _i    The line within that node to break
   */
  public visitMoNode(wrapper: WW, _i: number) {
    const mo = wrapper as any as CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const bbox = mo.getOuterBBox();
    const style = mo.getBreakStyle(mo.node.attributes.get('linebreakstyle') as string);
    const w = (style === 'after' ? 0 : mo.multChar ? mo.multChar.getBBox().w : bbox.w);
    const penalty = this.moPenalty(mo);
    if (style === 'before') {
      this.pushBreak(wrapper, penalty, w - (bbox.L + bbox.w + bbox.R));
      this.addWidth(bbox);
    } else {
      this.addWidth(bbox);
      this.pushBreak(wrapper, penalty, w);
    }
//console.log(wrapper.node.toString(), penalty, this.w);
  }

  /**
   * @param {CommonMo} mo    The mo whose penalty is to be computed
   * @return {number}        The computed penalty
   */
  protected moPenalty(mo: CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>): number {
    const {linebreak, fence, form} = mo.node.attributes.getList('linebreak', 'fence', 'form');
    const FACTORS = this.FACTORS;
    let penalty = Math.floor(this.width - this.w / this.width * FACTORS.widthFactor)
                + this.depth * FACTORS.nestFactor;
    const isOpen = (fence && form === 'prefix') || mo.node.texClass === TEXCLASS.OPEN;
    const isClose = (fence && form === 'prefix') || mo.node.texClass === TEXCLASS.CLOSE;
    if (isOpen) {
      penalty += FACTORS.open;  // should depend on previous class?
      this.depth++;
    }
    if (isClose) {
      penalty += FACTORS.close;
      this.depth--;
    }
    const lpenalty = this.PENALTY[linebreak as string] || [ , 0];
    return (lpenalty.length === 1 ? lpenalty[0] : Math.max(1, penalty + lpenalty[1]));
  }

  /**
   * @param {WW} wrapper   The MmlMspace wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMspaceNode(wrapper: WW, i: number) {
    this.addWidth(wrapper.getLineBBox(i));
    const attributes = wrapper.node.attributes;
    if (attributes.getExplicit('width') === undefined &&
        attributes.getExplicit('height') === undefined &&
        attributes.getExplicit('depth') === undefined) {
      const penalty = this.mspacePenalty(wrapper as any as CommonMspace<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>);
      this.pushBreak(wrapper, penalty, 0);
//console.log(wrapper.node.toString(), penalty, this.w);
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

  /**
   * @param {WW} wrapper   The MmlMrow wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMrowNode(wrapper: WW, i: number) {
    const line = wrapper.lineBBox[i] || wrapper.getLineBBox(i);
    const [start, startL] = line.start || [0,0];
    const [end, endL]  = line.end || [wrapper.childNodes.length - 1, 0];
    this.addWidth(line, line.L);
    for (let i = start; i <= end; i++) {
      this.visitNode(wrapper.childNodes[i], i === start ? startL : i === end ? endL : 0);
    }
  }

  /**
   * @param {WW} wrapper   The MmlInferredMrow wrapper
   * @param {number} i     The line within that node to break
   */
  public visitInferredMrowNode(wrapper: WW, i: number) {
    this.visitMrowNode(wrapper, i);
  }

  /**
   * @param {WW} wrapper   The MmlNode wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsubNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    const msub = wrapper as any as CommonMsub<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const x = msub.getOffset()[0];
    const sbox = msub.scriptChild.getOuterBBox();
    this.addWidth(wrapper.getLineBBox(i), x + sbox.rscale * sbox.w + msub.font.params.scriptspace);
  }

  /**
   * @param {WW} wrapper   The MmlNode wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsupNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    const msup = wrapper as any as CommonMsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const x = msup.getOffset()[0];
    const sbox = msup.scriptChild.getOuterBBox();
    this.addWidth(wrapper.getLineBBox(i), x + sbox.rscale * sbox.w + msup.font.params.scriptspace);
  }

  /**
   * @param {WW} wrapper   The MmlNode wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMsubsupNode(wrapper: WW, i: number) {
    this.visitDefault(wrapper, i);
    const msubsup = wrapper as any as CommonMsubsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const subbox = msubsup.subChild.getOuterBBox();
    const supbox = msubsup.supChild.getOuterBBox();
    const x = msubsup.getAdjustedIc();
    const w = Math.max(subbox.rscale * subbox.w, x + supbox.rscale * supbox.w) + msubsup.font.params.scriptspace;
    this.addWidth(wrapper.getLineBBox(i), w);
  }

  /**
   * @param {WW} wrapper   The MmlNode wrapper
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

  /**
   * @param {WW} wrapper   The MmlNode wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMfencedNode(wrapper: WW, i: number) {
    const mfenced = wrapper as any as CommonMfenced<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const bbox = wrapper.getLineBBox(i);
    i === 0 && this.addWidth(bbox, bbox.L);
    this.visitNode(mfenced.mrow as any as WW, i);
    i === wrapper.breakCount && this.addWidth(bbox, bbox.R);
  }

  /**
   * @param {WW} wrapper   The MmlNode wrapper
   * @param {number} i     The line within that node to break
   */
  public visitMactionNode(wrapper: WW, i: number) {
    const maction = wrapper as any as CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const bbox = wrapper.getLineBBox(i);
    i === 0 && this.addWidth(bbox, bbox.L);
    this.visitNode(maction.selected, i);
    i === wrapper.breakCount && this.addWidth(bbox, bbox.R);
  }

  /**
   * @param {WW} wrapper   The MmlNode wrapper
   * @param {number} i     The line within that node to break
   */
  public visitDefault(wrapper: WW, i: number) {
    const bbox = wrapper.getLineBBox(i);
    if (wrapper.node.isToken || wrapper.node.linebreakContainer) {
      this.addWidth(bbox);
    } else {
      i === 0 && this.addWidth(bbox, bbox.L);
      this.visitNode(wrapper.childNodes[0], i);
      i === wrapper.breakCount && this.addWidth(bbox, bbox.R);
    }
  }

}
