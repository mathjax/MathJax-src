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
 * @file  Implements the CommonMrow wrapper minin for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { BBox } from '../../../util/BBox.js';
import { LineBBox } from '../LineBBox.js';
import { DIRECTION } from '../FontData.js';

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
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * True if this mrow is not the top-level linebreak mrow
   */
  isStack: boolean;

  /**
   * The vertical adjustment for when the row has linebreaks (e.g., for \vcenter and \vbox)
   */
  dh: number;

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
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMrow wrapper mixin for the MmlMrow object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
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
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMrowMixin
    extends Base
    implements CommonMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public isStack: boolean;

    /**
     * @override
     */
    public dh: number = 0;

    /**
     * @override
     */
    public stretchChildren() {
      const stretchy: WW[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const child of this.childNodes) {
        if (child.canStretch(DIRECTION.Vertical)) {
          stretchy.push(child);
        }
      }
      const count = stretchy.length;
      const nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        let H = 0;
        let D = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the height and depth of the non-stretchy
        //  children.
        //
        const all = count > 1 && count === nodeCount;
        for (const child of this.childNodes) {
          const noStretch = child.stretch.dir === DIRECTION.None;
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
          const rscale = child.coreRScale();
          child.coreMO().getStretchedVariant([H / rscale, D / rscale]);
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
        this._breakCount = !this.childNodes.length
          ? 0
          : this.childNodes.reduce((n, child) => n + child.breakCount, 0);
      }
      return this._breakCount;
    }

    /**
     * @override
     */
    public breakTop(_mrow: WW, _child: WW): WW {
      const node = this as any as WW;
      return this.isStack ? this.parent.breakTop(node, node) : node;
    }

    /**
     * @override
     * @class
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      const self = this as any as WW;
      this.isStack =
        !this.parent ||
        this.parent.node.isInferred ||
        this.parent.breakTop(self, self) !== self;
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
      this.lineBBox = breaks
        ? [new LineBBox({ h: 0.75, d: 0.25, w: 0 }, [0, 0])]
        : [];
      bbox.empty();
      for (const i of this.childNodes.keys()) {
        const child = this.childNodes[i];
        bbox.append(child.getOuterBBox());
        if (breaks) {
          this.computeChildLineBBox(child, i);
        }
      }
      bbox.clean();
      if (breaks && !this.coreMO().node.isEmbellished) {
        this.computeLinebreakBBox(bbox);
      }
      if (this.fixesPWidth && this.setChildPWidths(recompute)) {
        this.computeBBox(bbox, true);
      }
      this.vboxAdjust(bbox);
    }

    /**
     *  Compute bbox of of all the lines
     *
     * @param {BBox} bbox   The bbox to be adjusted
     */
    protected computeLinebreakBBox(bbox: BBox) {
      bbox.empty();
      const isStack = this.isStack;
      const lines = this.lineBBox;
      const n = lines.length - 1;
      if (isStack) {
        for (const k of lines.keys()) {
          const line = lines[k];
          this.addMiddleBorders(line);
          if (k === 0) {
            this.addLeftBorders(line);
          }
          if (k === n) {
            this.addRightBorders(line);
          }
        }
      }
      let y = 0;
      for (const k of lines.keys()) {
        const line = lines[k];
        bbox.combine(line, 0, y);
        y -=
          Math.max(0.25, line.d) +
          line.lineLeading +
          Math.max(0.75, lines[k + 1]?.h || 0);
      }
      if (isStack) {
        lines[0].L = this.bbox.L;
        lines[n].R = this.bbox.R;
      } else {
        bbox.w = Math.max(...this.lineBBox.map((bbox) => bbox.w)); // natural width
        this.shiftLines(bbox);
        if (!this.jax.math.display && !this.linebreakOptions.inline) {
          bbox.pwidth = BBox.fullWidth;
          if (this.node.isInferred) {
            this.parent.bbox.pwidth = BBox.fullWidth;
          }
        }
      }
      bbox.clean();
    }

    /**
     * Adjust bbox vertical alignment. (E.g., for \vbox, \vcenter.)
     *
     * @param {BBox} bbox The adjusted bounding box.
     */
    protected vboxAdjust(bbox: BBox) {
      if (!this.parent) return;
      const n = this.breakCount;
      const valign = this.parent.node.attributes.get('data-vertical-align');
      if (n && valign === 'bottom') {
        this.dh = n ? bbox.d - this.lineBBox[n - 1].d : 0;
      } else if (valign === 'center' || (n && valign === 'middle')) {
        const { h, d } = bbox;
        const a = this.font.params.axis_height;
        this.dh = (h + d) / 2 + a - h; // new height minus old height
      } else {
        this.dh = 0;
        return;
      }
      bbox.h += this.dh;
      bbox.d -= this.dh;
    }

    /**
     * @param {WW} child   The child whose linebreak sizes should be added to those of the mrow
     * @param {number} i   The index of the child in the childNodes array
     */
    protected computeChildLineBBox(child: WW, i: number) {
      const lbox = this.lineBBox[this.lineBBox.length - 1];
      lbox.end = [i, 0];
      lbox.append(child.getLineBBox(0));
      const parts = child.breakCount + 1;
      if (parts === 1) return;
      for (let l = 1; l < parts; l++) {
        const bbox = new LineBBox({ h: 0.75, d: 0.25, w: 0 });
        bbox.start = bbox.end = [i, l];
        bbox.isFirst = true;
        bbox.append(child.getLineBBox(l));
        this.lineBBox.push(bbox);
      }
    }

    /**
     * @override
     */
    public getLineBBox(i: number) {
      this.getBBox(); // make sure line bboxes are available
      return this.isStack
        ? super.getLineBBox(i)
        : LineBBox.from(this.getOuterBBox(), this.linebreakOptions.lineleading);
    }

    /**
     * Handle alignment and shifting of lines
     *
     * @param {BBox} BBOX   The bounding box of the container
     */
    protected shiftLines(BBOX: BBox) {
      const W = BBOX.w;
      const lines = this.lineBBox;
      const n = lines.length - 1;
      const [alignfirst, shiftfirst] = lines[1].indentData?.[0] || [
        'left',
        '0',
      ];
      for (const i of lines.keys()) {
        const bbox = lines[i];
        const [indentalign, indentshift] =
          i === 0
            ? [alignfirst, shiftfirst]
            : bbox.indentData?.[i === n ? 2 : 1] || ['left', '0'];
        const [align, shift] = this.processIndent(
          indentalign,
          indentshift,
          alignfirst,
          shiftfirst,
          W
        );
        bbox.L = 0;
        bbox.L = this.getAlignX(W, bbox, align) + shift;
        const w = bbox.L + bbox.w;
        if (w > BBOX.w) {
          BBOX.w = w;
        }
      }
    }

    /**
     * @override
     */
    public setChildPWidths(
      recompute: boolean,
      w: number | null = null,
      clear: boolean = true
    ): boolean {
      if (!this.breakCount) return super.setChildPWidths(recompute, w, clear);
      if (recompute) return false;
      if (w !== null && this.bbox.w !== w) {
        this.bbox.w = w;
        this.shiftLines(this.bbox);
      }
      return true;
    }

    /**
     * @override
     */
    public breakToWidth(W: number) {
      this.linebreaks.breakToWidth(this as any as WW, W);
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
> extends CommonMrowClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonInferredMrow wrapper mixin for the MmlInferredMrow object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
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
  B extends CommonMrowClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  /* prettier-ignore */
  Base: CommonWrapperConstructor<
    N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC,
    CommonMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  >
): B {
  return class CommonInferredMrowMixin
    extends Base
    implements CommonInferredMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
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
