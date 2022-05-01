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
 * @fileoverview  Implements the SVGmpadded wrapper for the MmlMpadded object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMpadded, CommonMpaddedClass, CommonMpaddedMixin} from '../../common/Wrappers/mpadded.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMpadded} from '../../../core/MmlTree/MmlNodes/mpadded.js';

/*****************************************************************/
/**
 * The SVGMpadded interface for the SVG Mpadded wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMpaddedNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMpadded<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMpaddedClass interface for the SVG Mpadded wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMpaddedClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMpaddedClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMpaddedNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMpadded wrapper class for the MmlMpadded class
 */
export const SVGMpadded = (function <N, T, D>(): SVGMpaddedClass<N, T, D> {

  const Base = CommonMpaddedMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMpaddedClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMpadded extends Base implements SVGMpaddedaNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMpadded.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      let svg = this.standardSVGnode(parent);
      const [ , , , , , dw, x, y, dx] = this.getDimens();
      const align = (this.node.attributes.get('data-align') as string) || 'left';
      const X = x + dx - (dw < 0 && align !== 'left' ? align === 'center' ? dw / 2 : dw : 0);
      //
      // If there is a horizontal or vertical shift,
      //   use relative positioning to move the contents
      //
      if (X || y) {
        svg = this.adaptor.append(svg, this.svg('g')) as N;
        this.place(X, y, svg);
      }
      this.addChildren(svg);
    }

  };

})<any, any, any>();
