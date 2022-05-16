/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CommonMrow wrapper minin for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CommonWrapper, CommonWrapperClass, CommonWrapperConstructor, LineBBox} from '../Wrapper.js';
import {CommonWrapperFactory} from '../WrapperFactory.js';
import {CharOptions, VariantData, DelimiterData, FontData, FontDataClass} from '../FontData.js';
import {CommonOutputJax} from '../../common.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CommonMrow interface
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
export interface CommonMrow<
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
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

  /**
   * Handle vertical stretching of children to match height of
   *  other nodes in the row.
   */
  stretchChildren(): void;

}

/**
 * The CommonMrowClass interface
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
export interface CommonMrowClass<
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
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMrow wrapper mixin for the MmlMrow object
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
 *
 * @template B   The mixin interface to create
 */
export function CommonMrowMixin<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
>(Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>): B {

  return class CommonMrowMixin extends Base
  implements CommonMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

    /**
     * @override
     */
    public stretchChildren() {
      let stretchy: WW[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const child of this.childNodes) {
        if (child.canStretch(DIRECTION.Vertical)) {
          stretchy.push(child);
        }
      }
      let count = stretchy.length;
      let nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        let H = 0, D = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the height and depth of the non-stretchy
        //  children.
        //
        let all = (count > 1 && count === nodeCount);
        for (const child of this.childNodes) {
          const noStretch = (child.stretch.dir === DIRECTION.None);
          if (all || noStretch) {
            const rscale = child.getBBox().rscale;
            let [h, d] = child.getUnbrokenHD();
            h *= rscale;
            d *= rscale;
            if (h > H) H = h;
            if (d > D) D = d;
          }
        }
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          child.coreMO().getStretchedVariant([H, D]);
        }
      }
    }

    /*******************************************************/

    /**
     * @override
     */
    get fixesPWidth() {
      return false;
    }

    /**
     * @override
     */
    get breakCount() {
      if (this._breakCount < 0) {
        this._breakCount = (!this.childNodes.length ?  0 :
                            this.childNodes.reduce((n, child) => n + child.breakCount, 0));
      }
      return this._breakCount;
    }

    /**
     * @override
     * @constructor
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      this.stretchChildren();
      for (const child of this.childNodes) {
        if (child.bbox.pwidth) {
          this.bbox.pwidth = BBox.fullWidth;
          break;
        }
      }
    }

    /**
     * @override
     */
    protected computeBBox(bbox: BBox, recompute: boolean = false) {
      const breaks = this.breakCount;
      this.lineBBox = (breaks ? [new LineBBox({h: .75, d: .25, w: 0})] : []);
      bbox.empty();
      for (const child of this.childNodes) {
        bbox.append(child.getOuterBBox());
        breaks && this.computeChildLineBBox(child);
      }
      bbox.clean();
      breaks && this.computeLinebreakBBox(bbox);
      if (this.fixesPWidth && this.setChildPWidths(recompute)) {
        this.computeBBox(bbox, true);
      }
    }

    /**
     *  Compute bbox of of all the lines
     *
     * @param {BBox} bbox   The bbox to be adjusted
     */
    protected computeLinebreakBBox(bbox: BBox) {
      bbox.empty();
      const isStack = !this.parent.node.linebreakContainer;
      const lines = this.lineBBox;
      const n = lines.length - 1;
      let y = lines[0].h + .1;  // start just above the first line
      let k = 0;
      for (const line of lines) {
        if (isStack) {
          this.addMiddleBorders(line);
          k === 0 && this.addLeftBorders(line);
          k === n && this.addRightBorders(line);
        }
        bbox.combine(line, 0, y - .1 - line.h);
        y = -bbox.d;
        k++;
      }
      if (isStack) {
        lines[0].L = this.bbox.L;
        lines[n].R = this.bbox.R;
      } else {
        bbox. w = this.shiftLines();
      }
      bbox.clean();
    }

    /**
     * @param {WW} child   The child whose linebreak sizes should be added to those of the mrow
     */
    protected computeChildLineBBox(child: WW) {
      this.lineBBox[this.lineBBox.length - 1].append(child.getLineBBox(0));
      const parts = child.breakCount + 1;
      if (parts === 1) return;
      for (let i = 1; i < parts; i++) {
        const bbox = new LineBBox({h: .75, d: .25, w: 0});
        bbox.isFirst = true;
        bbox.append(child.getLineBBox(i));
        this.lineBBox.push(bbox);
      }
    }

    /**
     * @override
     */
    public computeLineBBox(i: number) {
      return (this.parent.node.linebreakContainer ? LineBBox.from(this.getOuterBBox()) : super.getLineBBox(i));
    }

    /**
     * Handle alignment and shifting if lines
     */
    protected shiftLines() {
      const alignfirst = (this.parent.node.attributes.get('data-align') as string) || 'left';
      const shiftfirst = (this.parent.node.attributes.get('data-indent') as string) || '0';
      const W = Math.max(...this.lineBBox.map(bbox => bbox.w));
      const n = this.lineBBox.length - 1;
      const align: string[] = [];
      const shift: number[] = [];
      for (let i = 0; i <= n; i++) {
        let [ialign, ishift] = (i === 0 ? [alignfirst, shiftfirst] : this.lineBBox[i].indentData[i === n ? 1 : 0]);
        [align[i], shift[i]] = this.processIndent(ialign, ishift, alignfirst, shiftfirst, W);
      }
      let w = W;
      for (let i = 0; i <= n; i++) {
        const bbox = this.lineBBox[i];
        bbox.L = this.getAlignX(W, bbox, align[i]) + shift[i];
        if (bbox.L + bbox.w + bbox.R > w) {
          w = bbox.L + bbox.w + bbox.R;
        }
      }
      return w;
    }

  } as any as B;

}

/*****************************************************************/
/*****************************************************************/
/**
 * The CommonInferredMrow interface
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
export interface CommonInferredMrow<
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
> extends CommonMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/**
 * The CommonInferredMrowClass interface
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
export interface CommonInferredMrowClass<
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
> extends CommonMrowClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonInferredMrow wrapper mixin for the MmlInferredMrow object
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
 *
 * @template B   The mixin interface to create
 */
export function CommonInferredMrowMixin<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonMrowClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
>(Base: CommonWrapperConstructor<
  N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC,
  CommonMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
>): B {

  return class CommonInferredMrowMixin extends Base
  implements CommonInferredMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

    /**
     * Since inferred rows don't produce a container node, we can't
     * set a font-size for it, so we inherit the parent scale
     *
     * @override
     */
    public getScale() {
      this.bbox.scale = this.parent.bbox.scale;
      this.bbox.rscale = 1;
    }

  } as any as B;

}
