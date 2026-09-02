/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  Implements the SvgMrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMrow,
  CommonMrowClass,
  CommonMrowMixin,
  CommonInferredMrow,
  CommonInferredMrowClass,
  CommonInferredMrowMixin,
} from '../../common/Wrappers/mrow.js';
import {
  MmlMrow,
  MmlInferredMrow,
} from '../../../core/MmlTree/MmlNodes/mrow.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMrow interface for the SVG Mrow wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMrowNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMrow<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMrowClass interface for the SVG Mrow wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMrowClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMrowClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgMrowNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMrow wrapper for the MmlMrow type
 */
export const SvgMrow = (function (): SvgMrowClass<DOM> {
  const Base = CommonMrowMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMrowClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMrow extends Base implements SvgMrowNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMrow.prototype.kind;

    /**
     * If this is an mrow inside a linebreakContainer, this gives the number
     *   of breaks, otherwise it is 0
     */
    protected linebreakCount: number = 0;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      this.getBBox();
      const n = (this.linebreakCount = this.isStack ? 0 : this.breakCount);
      parents =
        n || !this.node.isInferred
          ? this.standardSvgNodes(parents)
          : this.getSvgNodes(parents);
      this.addChildren(parents);
      if (n) {
        this.placeLines(parents);
      }
    }

    /**
     * @param {N[]} parents  The HTML nodes in which to place the lines
     * @returns {N[]} The augmented nodes array
     */
    protected getSvgNodes(parents: N<DOM>[]): N<DOM>[] {
      if (this.dh) {
        const g = this.svg('g', {
          transform: `translate(0 ${this.fixed(this.dh)})`,
        });
        parents = [this.adaptor.append(parents[0], g) as N<DOM>];
      }
      this.dom = parents;
      return parents;
    }

    /**
     * @param {N[]} parents  The HTML nodes in which to place the lines
     */
    protected placeLines(parents: N<DOM>[]) {
      const lines = this.lineBBox;
      const display = this.jax.math.display;
      let y = this.dh;
      for (const k of parents.keys()) {
        const lbox = lines[k];
        this.place(lbox.L || 0, y, parents[k]);
        y -=
          Math.max(0.25, lbox.d) +
          (display ? lbox.lineLeading : 0) +
          Math.max(0.75, lines[k + 1]?.h || 0);
      }
    }

    /**
     * @override
     */
    protected createSvgNodes(parents: N<DOM>[]): N<DOM>[] {
      const n = this.linebreakCount;
      if (!n) return super.createSvgNodes(parents);
      //
      // Create a linestack/mrow node for the lines
      //
      const adaptor = this.adaptor;
      const def = this.node.isInferred
        ? { 'data-mjx-linestack': true }
        : { 'data-mml-node': this.node.kind };
      this.dom = [adaptor.append(parents[0], this.svg('g', def)) as N<DOM>];
      //
      // Add an href anchor, if needed, and insert the linestack/mrow
      //
      this.dom = [
        adaptor.append(this.handleHref(parents)[0], this.dom[0]) as N<DOM>,
      ];
      //
      //  Add the line boxes
      //
      const svg = Array(n) as N<DOM>[];
      for (let i = 0; i <= n; i++) {
        svg[i] = adaptor.append(
          this.dom[0],
          this.svg('g', { 'data-mjx-linebox': true, 'data-mjx-lineno': i })
        ) as N<DOM>;
      }
      //
      //  Return the line boxes as the parent nodes for their contents
      //
      return svg;
    }

    /**
     * @override
     */
    public addChildren(parents: N<DOM>[]) {
      let x = 0;
      let i = 0;
      const isEmbellished = this.node.isEmbellished;
      for (const child of this.childNodes) {
        const n = isEmbellished ? 0 : child.breakCount;
        child.toSVG(parents.slice(i, i + n + 1));
        if (child.dom) {
          let k = 0;
          for (const dom of child.dom) {
            if (dom) {
              const dx = k ? 0 : child.dx;
              const cbox = child.getLineBBox(k++);
              x += (cbox.L + dx) * cbox.rscale;
              this.place(x, 0, dom);
              x += (cbox.w + cbox.R - dx) * cbox.rscale;
            }
            if (n) {
              x = 0;
            }
          }
          if (n) {
            const cbox = child.getLineBBox(n);
            x += (cbox.w + cbox.R) * cbox.rscale;
          }
        }
        i += n;
      }
    }
  };
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The SvgInferredMrow interface for the SVG InferredMrow wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgInferredMrowNTD<DOM extends DOM_TYPES>
  extends
    SvgMrowNTD<DOM>,
    CommonInferredMrow<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgInferredMrowClass interface for the SVG InferredMrow wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgInferredMrowClass<DOM extends DOM_TYPES>
  extends
    SvgMrowClass<DOM>,
    CommonInferredMrowClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapper<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgInferredMrowNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgInferredMrow wrapper for the MmlInferredMrow class
 */
export const SvgInferredMrow = (function (): SvgInferredMrowClass<DOM> {
  const Base = CommonInferredMrowMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgInferredMrowClass<DOM>
  >(SvgMrow);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgInferredMrowNTD extends Base implements SvgInferredMrow<DOM> {
    /**
     * The inferred-mrow wrapper
     */
    public static kind = MmlInferredMrow.prototype.kind;
  };
})();
