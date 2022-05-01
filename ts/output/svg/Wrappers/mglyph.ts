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
 * @fileoverview  Implements the SVGmglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMglyph, CommonMglyphClass, CommonMglyphMixin} from '../../common/Wrappers/mglyph.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMglyph} from '../../../core/MmlTree/MmlNodes/mglyph.js';
import {SVGTextNodeNTD} from './TextNode.js';
import {OptionList} from '../../../util/Options.js';

/*****************************************************************/
/**
 * The SVGMglyph interface for the SVG Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMglyphNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMglyph<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMglyphClass interface for the SVG Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMglyphClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMglyphClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMglyphNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMglyph wrapper class for the MmlMglyph class
 */
export const SVGMglyph = (function <N, T, D>(): SVGMglyphClass<N, T, D> {

  const Base = CommonMglyphMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMglyphClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMglyph extends Base implements SVGMglyphNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMglyph.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      const svg = this.standardSVGnode(parent);
      if (this.charWrapper) {
        (this.charWrapper as SVGTextNodeNTD<N, T, D>).toSVG(svg);
        return;
      }
      const {src, alt} = this.node.attributes.getList('src', 'alt');
      const h = this.fixed(this.height);
      const w = this.fixed(this.width);
      const y = this.fixed(this.height + (this.valign || 0));
      const properties: OptionList = {
        width: w, height: h,
        transform: 'translate(0 ' + y + ') matrix(1 0 0 -1 0 0)',
        preserveAspectRatio: 'none',
        'aria-label': alt,
        href: src
      };
      const img = this.svg('image', properties);
      this.adaptor.append(svg, img);
    }

  };

})<any, any, any>();
