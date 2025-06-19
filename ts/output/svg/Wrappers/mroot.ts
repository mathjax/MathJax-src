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
 * @file  Implements the SvgMroot wrapper for the MmlMroot object
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
  CommonMroot,
  CommonMrootClass,
  CommonMrootMixin,
} from '../../common/Wrappers/mroot.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMroot } from '../../../core/MmlTree/MmlNodes/mroot.js';
import { SvgMsqrt, SvgMsqrtClass, SvgMsqrtNTD } from './msqrt.js';
import { BBox } from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The SvgMroot interface for the SVG Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMrootNTD<N, T, D>
  extends SvgMsqrtNTD<N, T, D>,
    CommonMroot<
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
 * The SvgMrootClass interface for the SVG Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMrootClass<N, T, D>
  extends SvgMsqrtClass<N, T, D>,
    CommonMrootClass<
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
  ): SvgMrootNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMroot wrapper class for the MmlMroot class
 */
export const SvgMroot = (function <N, T, D>(): SvgMrootClass<N, T, D> {
  const Base = CommonMrootMixin<
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
    SvgMrootClass<N, T, D>
  >(SvgMsqrt);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMroot extends Base implements SvgMrootNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMroot.prototype.kind;

    /**
     * @override
     */
    protected addRoot(
      ROOT: N[],
      root: SvgWrapper<N, T, D>,
      sbox: BBox,
      H: number
    ) {
      root.toSVG(ROOT);
      const [x, h, dx] = this.getRootDimens(sbox, H);
      const bbox = root.getOuterBBox();
      root.place(dx * bbox.rscale, h);
      return x;
    }
  };
})<any, any, any>();
