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
 * @fileoverview  Implements the SVGMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMroot, CommonMrootClass, CommonMrootMixin} from '../../common/Wrappers/mroot.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMroot} from '../../../core/MmlTree/MmlNodes/mroot.js';
import {SVGMsqrt, SVGMsqrtClass, SVGMsqrtNTD} from './msqrt.js';
import {BBox} from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The SVGMroot interface for the SVG Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMrootNTD<N, T, D> extends SVGMsqrtNTD<N, T, D>, CommonMroot<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMrootClass interface for the SVG Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMrootClass<N, T, D> extends SVGMsqrtClass<N, T, D>, CommonMrootClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMrootNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMroot wrapper class for the MmlMroot class
 */
export const SVGMroot = (function <N, T, D>(): SVGMrootClass<N, T, D> {

  const Base = CommonMrootMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMrootClass<N, T, D>
    >(SVGMsqrt);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMroot extends Base implements SVGMrootNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMroot.prototype.kind;

    /**
     * @override
     */
    protected addRoot(ROOT: N, root: SVGWrapper<N, T, D>, sbox: BBox, H: number) {
      root.toSVG(ROOT);
      const [x, h, dx] = this.getRootDimens(sbox, H);
      const bbox = root.getOuterBBox();
      root.place(dx * bbox.rscale, h);
      this.dx = x;
    }

  };

})<any, any, any>();
