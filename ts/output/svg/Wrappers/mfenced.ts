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
 * @file  Implements the SvgMfenced wrapper for the MmlMfenced object
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
  CommonMfenced,
  CommonMfencedClass,
  CommonMfencedMixin,
} from '../../common/Wrappers/mfenced.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMfenced } from '../../../core/MmlTree/MmlNodes/mfenced.js';
import { SvgInferredMrowNTD } from './mrow.js';

/*****************************************************************/
/**
 * The SvgMfenced interface for the SVG mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMfencedNTD<N, T, D>
  extends
    SvgWrapper<N, T, D>,
    CommonMfenced<
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
 * The SvgMfencedClass interface for the SVG mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMfencedClass<N, T, D>
  extends
    SvgWrapperClass<N, T, D>,
    CommonMfencedClass<
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
  ): SvgMfencedNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMfenced wrapper class for the MmlMfenced class
 */
export const SvgMfenced = (function <N, T, D>(): SvgMfencedClass<N, T, D> {
  const Base = CommonMfencedMixin<
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
    SvgMfencedClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be SvgWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class SvgMfenced extends Base implements SvgMfencedNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMfenced.prototype.kind;

    /**
     * An mrow used to render the result
     */
    public mrow: SvgInferredMrowNTD<N, T, D>;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const svg = this.standardSvgNodes(parents);
      this.setChildrenParent(this.mrow); // temporarily change parents to the mrow
      this.mrow.toSVG(svg);
      this.setChildrenParent(this); // put back the correct parents
    }

    /**
     * @param {SvgWrapper} parent   The parent to use for the fenced children
     */
    protected setChildrenParent(parent: SvgWrapper<N, T, D>) {
      for (const child of this.childNodes) {
        child.parent = parent;
      }
    }
  };
})<any, any, any>();
