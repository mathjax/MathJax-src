/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from '../FontData.js';
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

/*****************************************************************/
/**
 * The SvgMrow interface for the SVG Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMrowNTD<N, T, D>
  extends
    SvgWrapper<N, T, D>,
    CommonMrow<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgMrowClass interface for the SVG Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMrowClass<N, T, D>
  extends
    SvgWrapperClass<N, T, D>,
    CommonMrowClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMrowNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMrow wrapper for the MmlMrow type
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export const SvgMrow = (function <N, T, D>(): SvgMrowClass<N, T, D> {
  const Base = CommonMrowMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgMrowClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMrow extends Base implements SvgMrowNTD<N, T, D> {
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
    public toSVG(parents: N[]) {
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
    protected getSvgNodes(parents: N[]) {
      if (this.dh) {
        const g = this.svg('g', {
          transform: `translate(0 ${this.fixed(this.dh)})`,
        });
        parents = [this.adaptor.append(parents[0], g) as N];
      }
      this.dom = parents;
      return parents;
    }

    /**
     * @param {N[]} parents  The HTML nodes in which to place the lines
     */
    protected placeLines(parents: N[]) {
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
    protected createSvgNodes(parents: N[]): N[] {
      const n = this.linebreakCount;
      if (!n) return super.createSvgNodes(parents);
      //
      // Create a linestack/mrow node for the lines
      //
      const adaptor = this.adaptor;
      const def = this.node.isInferred
        ? { 'data-mjx-linestack': true }
        : { 'data-mml-node': this.node.kind };
      this.dom = [adaptor.append(parents[0], this.svg('g', def)) as N];
      //
      // Add an href anchor, if needed, and insert the linestack/mrow
      //
      this.dom = [
        adaptor.append(this.handleHref(parents)[0], this.dom[0]) as N,
      ];
      //
      //  Add the line boxes
      //
      const svg = Array(n) as N[];
      for (let i = 0; i <= n; i++) {
        svg[i] = adaptor.append(
          this.dom[0],
          this.svg('g', { 'data-mjx-linebox': true, 'data-mjx-lineno': i })
        ) as N;
      }
      //
      //  Return the line boxes as the parent nodes for their contents
      //
      return svg;
    }

    /**
     * @override
     */
    public addChildren(parents: N[]) {
      let x = 0;
      let i = 0;
      for (const child of this.childNodes) {
        const n = child.breakCount;
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
})<any, any, any>();

/*****************************************************************/
/*****************************************************************/

/**
 * The SvgInferredMrow interface for the SVG InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgInferredMrowNTD<N, T, D>
  extends
    SvgMrowNTD<N, T, D>,
    CommonInferredMrow<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgInferredMrowClass interface for the SVG InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgInferredMrowClass<N, T, D>
  extends
    SvgMrowClass<N, T, D>,
    CommonInferredMrowClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapper<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgInferredMrowNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgInferredMrow wrapper for the MmlInferredMrow class
 */
export const SvgInferredMrow = (function <N, T, D>(): SvgInferredMrowClass<
  N,
  T,
  D
> {
  const Base = CommonInferredMrowMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgInferredMrowClass<N, T, D>
  >(SvgMrow);

  return class SvgInferredMrowNTD
    // @ts-expect-error Avoid message about base constructors not having the
    // same type (they should both be SvgWrapper<N, T, D>, but are thought of as
    // different by typescript)
    extends Base
    // @ts-expect-error Avoid messages of use of typeof
    implements SvgInferredMrow<N, T, D>
  {
    /**
     * The inferred-mrow wrapper
     */
    public static kind = MmlInferredMrow.prototype.kind;
  };
})<any, any, any>();
