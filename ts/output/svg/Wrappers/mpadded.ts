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
 * @file  Implements the SvgMpadded wrapper for the MmlMpadded object
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
  CommonMpadded,
  CommonMpaddedClass,
  CommonMpaddedMixin,
} from '../../common/Wrappers/mpadded.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMpadded } from '../../../core/MmlTree/MmlNodes/mpadded.js';

/*****************************************************************/
/**
 * The SvgMpadded interface for the SVG Mpadded wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMpaddedNTD<N, T, D>
  extends
    SvgWrapper<N, T, D>,
    CommonMpadded<
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
 * The SvgMpaddedClass interface for the SVG Mpadded wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMpaddedClass<N, T, D>
  extends
    SvgWrapperClass<N, T, D>,
    CommonMpaddedClass<
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
  ): SvgMpaddedNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMpadded wrapper class for the MmlMpadded class
 */
export const SvgMpadded = (function <N, T, D>(): SvgMpaddedClass<N, T, D> {
  const Base = CommonMpaddedMixin<
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
    SvgMpaddedClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be SvgWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class SvgMpadded extends Base implements SvgMpaddedaNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMpadded.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      let svg = this.standardSvgNodes(parents);
      const [, , , , , dw, x, y, dx] = this.getDimens();
      const align =
        (this.node.attributes.get('data-align') as string) || 'left';
      const dW =
        dw < 0 && align !== 'left' ? (align === 'center' ? dw / 2 : dw) : 0;
      const X = x + dx - dW;
      //
      // If there is a horizontal or vertical shift,
      //   use relative positioning to move the contents
      //
      if (X || y) {
        svg = [this.adaptor.append(svg[0], this.svg('g')) as N];
        this.place(X, y, svg[0]);
      }
      this.addChildren(svg);
    }
  };
})<any, any, any>();
