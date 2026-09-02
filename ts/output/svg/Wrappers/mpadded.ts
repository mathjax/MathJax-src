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
 * @file  Implements the SvgMpadded wrapper for the MmlMpadded object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMpadded,
  CommonMpaddedClass,
  CommonMpaddedMixin,
} from '../../common/Wrappers/mpadded.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMpadded } from '../../../core/MmlTree/MmlNodes/mpadded.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMpadded interface for the SVG Mpadded wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMpaddedNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMpadded<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMpaddedClass interface for the SVG Mpadded wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMpaddedClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMpaddedClass<
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
  ): SvgMpaddedNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMpadded wrapper class for the MmlMpadded class
 */
export const SvgMpadded = (function (): SvgMpaddedClass<DOM> {
  const Base = CommonMpaddedMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMpaddedClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMpadded extends Base implements SvgMpaddedaNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMpadded.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
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
        svg = [this.adaptor.append(svg[0], this.svg('g')) as N<DOM>];
        this.place(X, y, svg[0]);
      }
      this.addChildren(svg);
    }
  };
})();
