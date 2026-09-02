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
 * @file  Implements the SvgMglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMglyph,
  CommonMglyphClass,
  CommonMglyphMixin,
} from '../../common/Wrappers/mglyph.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMglyph } from '../../../core/MmlTree/MmlNodes/mglyph.js';
import { SvgTextNodeNTD } from './TextNode.js';
import { OptionList } from '../../../util/Options.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMglyph interface for the SVG Mglyph wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMglyphNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMglyph<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMglyphClass interface for the SVG Mglyph wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMglyphClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMglyphClass<
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
  ): SvgMglyphNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMglyph wrapper class for the MmlMglyph class
 */
export const SvgMglyph = (function (): SvgMglyphClass<DOM> {
  const Base = CommonMglyphMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMglyphClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMglyph extends Base implements SvgMglyphNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMglyph.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      const svg = this.standardSvgNodes(parents);
      if (this.charWrapper) {
        (this.charWrapper as SvgTextNodeNTD<DOM>).toSVG(svg);
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
})();
