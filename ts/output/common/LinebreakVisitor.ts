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
import {CommonMsub, CommonMsup, CommonMsubsup} from './Wrappers/msubsup.js';
import {CommonMmultiscripts} from './Wrappers/mmultiscripts.js';
import {CommonMfenced} from './Wrappers/mfenced.js';
import {CommonMaction} from './Wrappers/maction.js';
import {BBox} from '../../util/BBox.js';

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
   * The lsit of best breakpoint so far, their penalties, the width of the break node, and the width up to the next break
   */
  protected breaks: [WW, number, number, number][];

  /**
   * The maximum width for the lines
   */
  protected width: number;

  /**
   * The accumulated with since the last best breakpoint
   */
  protected w: number;

  /**
   * Break a line to the given width
   *
   * @param {WW} wrapper   The mrow to break
   * @param {number} i     The line within that node to break
   * @param {number} W     The width to break to
   */
  public breakToWidth(wrapper: WW, i: number, W: number) {
    this.breaks = [];
    this.width = W;
    this.w = 0;
    this.visitNode(wrapper, i);
  }

  /**
   * @param {BBox} bbox   The BBox of the width to be added
   * @param {number} w    The width to add (defaults to full wifth of bbox)
   */
  protected addWidth(bbox: BBox, w: number = (bbox.L + bbox.w + bbox.R)) {
    w *= bbox.rscale;
    this.w += w;
    if (this.breaks.length) {
      this.breaks[0][3] += w;
    }
    this.processBreak();
  }

  /**
   * Mark the breakpoint(s) and get the current width
   */
  protected processBreak() {
    while (this.breaks.length && this.w > this.width) {
      const [ww, , dw, w] = this.breaks.pop();
      (ww as any).setBreakStyle(ww.node.attributes.get('linebreakstyle') || 'before');
      ww.invalidateBBox();
      this.w = this.breaks.reduce((w, brk) => w + brk[3], dw + w);
      console.log(this.w);
    }
  }

  /**
   * @param {WW} wrapper   The MmlMo wrapper
   * @param {number} _i    The line within that node to break
   */
  public visitMoNode(wrapper: WW, _i: number) {
    const mo = wrapper as any as CommonMo<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;
    const bbox = mo.getOuterBBox();
    let w = bbox.rscale * (bbox.L + bbox.w + bbox.R);
    const style = mo.getBreakStyle(mo.node.attributes.get('linebreakstyle') as string);
    (style !== 'before' || this.w + w <= this.width) && this.addWidth(bbox);
    w = (style === 'after' ? 0 : mo.multChar ? mo.multChar.getBBox().w : bbox.w);
    this.breaks = [[wrapper, 0, w, 0]];
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
      this.breaks.push([wrapper, 0, 0, 0]);
    }
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
