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
 * @file  Implements the SvgMglyph wrapper for the MmlMglyph object
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
  CommonMglyph,
  CommonMglyphClass,
  CommonMglyphMixin,
} from '../../common/Wrappers/mglyph.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMglyph } from '../../../core/MmlTree/MmlNodes/mglyph.js';
import { SvgTextNodeNTD } from './TextNode.js';
import { OptionList } from '../../../util/Options.js';

/*****************************************************************/
/**
 * The SvgMglyph interface for the SVG Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMglyphNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonMglyph<
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
 * The SvgMglyphClass interface for the SVG Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMglyphClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonMglyphClass<
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
  ): SvgMglyphNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMglyph wrapper class for the MmlMglyph class
 */
export const SvgMglyph = (function <N, T, D>(): SvgMglyphClass<N, T, D> {
  const Base = CommonMglyphMixin<
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
    SvgMglyphClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMglyph extends Base implements SvgMglyphNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMglyph.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const svg = this.standardSvgNodes(parents);
      if (this.charWrapper) {
        (this.charWrapper as SvgTextNodeNTD<N, T, D>).toSVG(svg);
        return;
      }
      const { src, alt } = this.node.attributes.getList('src', 'alt');
      const h = this.fixed(this.height);
      const w = this.fixed(this.width);
      const y = this.fixed(this.height + (this.valign || 0));
      const properties: OptionList = {
        width: w,
        height: h,
        transform: 'translate(0 ' + y + ') matrix(1 0 0 -1 0 0)',
        preserveAspectRatio: 'none',
        'aria-label': alt,
        href: src,
      };
      const img = this.svg('image', properties);
      this.adaptor.append(svg[0], img);
    }
  };
})<any, any, any>();
