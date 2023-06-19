/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the SvgMsqrt wrapper for the MmlMsqrt object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SvgWrapper, SvgWrapperClass} from '../Wrapper.js';
import {SvgWrapperFactory} from '../WrapperFactory.js';
import {SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass} from '../FontData.js';
import {CommonMsqrt, CommonMsqrtClass, CommonMsqrtMixin} from '../../common/Wrappers/msqrt.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMsqrt} from '../../../core/MmlTree/MmlNodes/msqrt.js';
import {SvgMoNTD} from './mo.js';
import {BBox} from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The SvgMsqrt interface for the SVG Msqrt wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsqrtNTD<N, T, D> extends SvgWrapper<N, T, D>, CommonMsqrt<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {

  /**
   * Indent due to root
   */
  dx: number;

}

/**
 * The SvgMsqrtClass interface for the SVG Msqrt wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsqrtClass<N, T, D> extends SvgWrapperClass<N, T, D>, CommonMsqrtClass<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {
  new(factory: SvgWrapperFactory<N, T, D>, node: MmlNode, parent?: SvgWrapper<N, T, D>): SvgMsqrtNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SvgMsqrt wrapper for the MmlMsqrt class
 */
export const SvgMsqrt = (function <N, T, D>(): SvgMsqrtClass<N, T, D> {

  const Base = CommonMsqrtMixin<
      N, T, D,
      SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
      SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass,
      SvgMsqrtClass<N, T, D>
    >(SvgWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SvgWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SvgMsqrt extends Base implements SvgMsqrtNTD<N, T, D> {

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
     * @param {N[]} ROOT         The container for the root
     * @param {SvgWrapper} root  The wrapped MML root content
     * @param {BBox} sbox        The bounding box of the surd
     * @param {number} H         The height of the root as a whole
     * @param {number}           The offset required by the root
     */
    protected addRoot(_ROOT: N[], _root: SvgWrapper<N, T, D>, _sbox: BBox, _H: number): number {
      return 0;
    }

    /**************************************************************/

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const surd = this.surd as SvgMoNTD<N, T, D>;
      const base = this.childNodes[this.base];
      const root = (this.root ? this.childNodes[this.root] : null);
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
      const BASE = this.adaptor.append(SVG[0], this.svg('g')) as N;
      //
      //  Place the children
      //
      const dx = this.addRoot(SVG, root, sbox, H);
      surd.toSVG(SVG);
      surd.place(dx, H - sbox.h);
      base.toSVG([BASE]);
      base.place(dx + sbox.w, 0);
      this.adaptor.append(SVG[SVG.length - 1], this.svg('rect', {
        width: this.fixed(bbox.w), height: this.fixed(t),
        x: this.fixed(dx + sbox.w), y: this.fixed(H - t)
      }));
    }

  };

})<any, any, any>();
