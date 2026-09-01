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
 * @file  Implements the SvgMmultiscripts wrapper for the MmlMmultiscripts object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMmultiscripts,
  CommonMmultiscriptsClass,
  CommonMmultiscriptsMixin,
} from '../../common/Wrappers/mmultiscripts.js';
import { SvgMsubsup, SvgMsubsupNTD, SvgMsubsupClass } from './msubsup.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMmultiscripts } from '../../../core/MmlTree/MmlNodes/mmultiscripts.js';
import { split } from '../../../util/string.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/

/**
 * A function taking two widths and returning an offset of the first in the second
 */
export type AlignFunction = (w: number, W: number) => number;

/**
 * Get the function for aligning scripts horizontally (left, center, right)
 *
 * @param {string} align Alignment value (left, center, right)
 * @returns {AlignFunction} The constructred alignment function
 */
export function AlignX(align: string): AlignFunction {
  return (
    (
      {
        left: (_w, _W) => 0,
        center: (w, W) => (W - w) / 2,
        right: (w, W) => W - w,
      } as { [name: string]: AlignFunction }
    )[align] || (((_w, _W) => 0) as AlignFunction)
  );
}

/*****************************************************************/
/**
 * The SvgMmultiscripts interface for the SVG Mmultiscripts wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMmultiscriptsNTD<DOM extends DOM_TYPES>
  extends
    SvgMsubsupNTD<DOM>,
    CommonMmultiscripts<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMmultiscriptsClass interface for the SVG Mmultiscripts wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMmultiscriptsClass<DOM extends DOM_TYPES>
  extends
    SvgMsubsupClass<DOM>,
    CommonMmultiscriptsClass<
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
  ): SvgMmultiscriptsNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMmultiscripts wrapper class for the MmlMmultiscripts class
 */
export const SvgMmultiscripts = (function (): SvgMmultiscriptsClass<DOM> {
  const Base = CommonMmultiscriptsMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMmultiscriptsClass<DOM>
  >(SvgMsubsup);

  return class SvgMmultiscripts
    // @ts-expect-error Avoid message about base constructors not having the same type
    extends Base
    implements SvgMmultiscriptsNTD<DOM>
  {
    /**
     * @override
     */
    public static kind = MmlMmultiscripts.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      if (this.toEmbellishedSVG(parents)) return;
      const svg = this.standardSvgNodes(parents);
      const data = this.scriptData;
      //
      //  Get the alignment for the scripts
      //
      const scriptalign = this.node.getProperty('scriptalign') || 'right left';
      const [preAlign, postAlign] = split(scriptalign + ' ' + scriptalign);
      const [u, v] = this.getCombinedUV();
      //
      //  Place the pre-scripts, then the base, then the post-scripts
      //
      let x = 0;
      if (data.numPrescripts) {
        x = this.addScripts(
          this.dom[0],
          this.font.params.scriptspace,
          u,
          v,
          this.firstPrescript,
          data.numPrescripts,
          preAlign
        );
      }
      const base = this.baseChild;
      base.toSVG(svg);
      base.place(x, 0);
      if (this.breakCount) x = 0;
      x += base.getLineBBox(base.breakCount).w;
      if (data.numScripts) {
        this.addScripts(
          this.dom[this.dom.length - 1],
          x,
          u,
          v,
          1,
          data.numScripts,
          postAlign
        );
      }
    }

    /**
     * Create a table with the super and subscripts properly separated and aligned.
     *
     * @param {N} svg          The SVG node
     * @param {number} x       The x offset of the scripts
     * @param {number} u       The baseline offset for the superscripts
     * @param {number} v       The baseline offset for the subscripts
     * @param {number} i       The starting index for the scripts
     * @param {number} n       The number of sub/super-scripts
     * @param {string} align   The alignment for the scripts
     * @returns {number}        The right-hand offset of the scripts
     */
    protected addScripts(
      svg: N<DOM>,
      x: number,
      u: number,
      v: number,
      i: number,
      n: number,
      align: string
    ): number {
      const adaptor = this.adaptor;
      const alignX = AlignX(align);
      const supRow = adaptor.append(svg, this.svg('g')) as N<DOM>;
      const subRow = adaptor.append(svg, this.svg('g')) as N<DOM>;
      this.place(x, u, supRow);
      this.place(x, v, subRow);
      const m = i + 2 * n;
      let dx = 0;
      while (i < m) {
        const [sub, sup] = [this.childNodes[i++], this.childNodes[i++]];
        const [subbox, supbox] = [sub.getOuterBBox(), sup.getOuterBBox()];
        const [subr, supr] = [subbox.rscale, supbox.rscale];
        const w = Math.max(subbox.w * subr, supbox.w * supr);
        sub.toSVG([subRow]);
        sup.toSVG([supRow]);
        sub.place(dx + alignX(subbox.w * subr, w), 0);
        sup.place(dx + alignX(supbox.w * supr, w), 0);
        dx += w;
      }
      return x + dx;
    }
  };
})();
