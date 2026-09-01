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
 * @file  Implements the SvgMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMroot,
  CommonMrootClass,
  CommonMrootMixin,
} from '../../common/Wrappers/mroot.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMroot } from '../../../core/MmlTree/MmlNodes/mroot.js';
import { SvgMsqrt, SvgMsqrtClass, SvgMsqrtNTD } from './msqrt.js';
import { BBox } from '../../../util/BBox.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMroot interface for the SVG Mroot wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMrootNTD<DOM extends DOM_TYPES>
  extends
    SvgMsqrtNTD<DOM>,
    CommonMroot<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMrootClass interface for the SVG Mroot wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMrootClass<DOM extends DOM_TYPES>
  extends
    SvgMsqrtClass<DOM>,
    CommonMrootClass<
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
  ): SvgMrootNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMroot wrapper class for the MmlMroot class
 */
export const SvgMroot = (function (): SvgMrootClass<DOM> {
  const Base = CommonMrootMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMrootClass<DOM>
  >(SvgMsqrt);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMroot extends Base implements SvgMrootNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMroot.prototype.kind;

    /**
     * @override
     */
    protected addRoot(
      ROOT: N<DOM>[],
      root: SvgWrapper<DOM>,
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
})();
