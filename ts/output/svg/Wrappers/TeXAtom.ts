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
 * @file  Implements the SvgTeXAtom wrapper for the MmlTeXAtom object
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
  CommonTeXAtom,
  CommonTeXAtomClass,
  CommonTeXAtomMixin,
} from '../../common/Wrappers/TeXAtom.js';
import { TeXAtom } from '../../../core/MmlTree/MmlNodes/TeXAtom.js';
import { MmlNode, TEXCLASSNAMES } from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The SvgTeXAtom interface for the SVG TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgTeXAtomNTD<N, T, D>
  extends
    SvgWrapper<N, T, D>,
    CommonTeXAtom<
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
 * The SvgTeXAtomClass interface for the SVG TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgTeXAtomClass<N, T, D>
  extends
    SvgWrapperClass<N, T, D>,
    CommonTeXAtomClass<
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
  ): SvgTeXAtomNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgTeXAtom wrapper for the MmlTeXAtom class
 */
export const SvgTeXAtom = (function <N, T, D>(): SvgTeXAtomClass<N, T, D> {
  const Base = CommonTeXAtomMixin<
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
    SvgTeXAtomClass<N, T, D>
  >(SvgWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SvgWrapper<N, T, D>, but are thought of as different by typescript)
  return class SvgTeXAtom extends Base implements SvgTeXAtomNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = TeXAtom.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      super.toSVG(parents);
      this.adaptor.setAttribute(
        this.dom[0],
        'data-mjx-texclass',
        TEXCLASSNAMES[this.node.texClass]
      );
    }
  } as any as SvgTeXAtomClass<N, T, D>;
})<any, any, any>();
