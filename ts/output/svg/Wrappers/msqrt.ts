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
 * @file  Implements the SvgMsqrt wrapper for the MmlMsqrt object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMsqrt,
  CommonMsqrtClass,
  CommonMsqrtMixin,
} from '../../common/Wrappers/msqrt.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMsqrt } from '../../../core/MmlTree/MmlNodes/msqrt.js';
import { SvgMoNTD } from './mo.js';
import { BBox } from '../../../util/BBox.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMsqrt interface for the SVG Msqrt wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsqrtNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMsqrt<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  /**
   * Indent due to root
   */
  dx: number;
}

/**
 * The SvgMsqrtClass interface for the SVG Msqrt wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsqrtClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMsqrtClass<
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
  ): SvgMsqrtNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMsqrt wrapper for the MmlMsqrt class
 */
export const SvgMsqrt = (function (): SvgMsqrtClass<DOM> {
  const Base = CommonMsqrtMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMsqrtClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMsqrt extends Base implements SvgMsqrtNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMsqrt.prototype.kind;

    /**
     * @override
     */
    public dx: number = 0;

    /**
     * Add root HTML (overridden in mroot)
     *
     * @param {N[]} _ROOT         The container for the root
     * @param {SvgWrapper} _root  The wrapped MML root content
     * @param {BBox} _sbox        The bounding box of the surd
     * @param {number} _H         The height of the root as a whole
     * @returns {number}          The offset required by the root
     */
    protected addRoot(
      _ROOT: N<DOM>[],
      _root: SvgWrapper<DOM>,
      _sbox: BBox,
      _H: number
    ): number {
      return 0;
    }

    /**************************************************************/

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      const surd = this.surd as SvgMoNTD<DOM>;
      const base = this.childNodes[this.base];
      const root = this.root ? this.childNodes[this.root] : null;
      //
      //  Get the parameters for the spacing of the parts
      //
      const sbox = surd.getBBox();
      const bbox = base.getOuterBBox();
      const q = this.getPQ(sbox)[1];
      const t = this.font.params.surd_height * this.bbox.scale;
      const H = bbox.h + q + t;
      //
      //  Create the SVG structure for the root
      //
      const SVG = this.standardSvgNodes(parents);
      surd.toSVG(SVG);
      const dx = this.addRoot(SVG, root, sbox, H);
      const BASE = this.adaptor.append(SVG[0], this.svg('g')) as N<DOM>;
      base.toSVG([BASE]);
      //
      //  Place the children
      //
      surd.place(dx, H - sbox.h);
      base.place(dx + sbox.w, 0);
      this.adaptor.append(
        SVG[SVG.length - 1],
        this.svg('rect', {
          width: this.fixed(bbox.w),
          height: this.fixed(t),
          x: this.fixed(dx + sbox.w),
          y: this.fixed(H - t),
        })
      );
    }
  };
})();
