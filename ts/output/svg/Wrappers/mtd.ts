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
 * @fileoverview  Implements the SVGmtd wrapper for the MmlMtd object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMtd, CommonMtdClass, CommonMtdMixin} from '../../common/Wrappers/mtd.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMtd} from '../../../core/MmlTree/MmlNodes/mtd.js';

/*****************************************************************/
/**
 * The SVGMtd interface for the SVG Mtd wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMtdNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMtd<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {

  /**
   * @param {number} x    The x offset of the left side of the cell
   * @param {number} y    The y offset of the baseline of the cell
   * @param {number} W    The width of the cell
   * @param {number} H    The height of the cell
   * @param {number} D    The depth of the cell
   * @return {[number, number]}   The x and y offsets used
   */
  placeCell(x: number, y: number, W: number, H: number, D: number): [number, number];

  /**
   * @param {number} x    The x offset of the left side of the cell
   * @param {number} y    The y position of the bottom of the cell
   * @param {number} W    The width of the cell
   * @param {number} H    The height + depth of the cell
   */
  placeColor(x: number, y: number, W: number, H: number): void;

}

/**
 * The SVGMtdClass interface for the SVG Mtd wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMtdClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMtdClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMtdNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMtd wrapper class for the MmlMtd class
 */
export const SVGMtd = (function <N, T, D>(): SVGMtdClass<N, T, D> {

  const Base = CommonMtdMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMtdClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMtd extends Base implements SVGMtdNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMtd.prototype.kind;

    /**
     * @override
     */
    public placeCell(x: number, y: number, W: number, H: number, D: number): [number, number] {
      const bbox = this.getBBox();
      const h = Math.max(bbox.h, .75);
      const d = Math.max(bbox.d, .25);
      const calign = this.node.attributes.get('columnalign') as string;
      const ralign = this.node.attributes.get('rowalign') as string;
      const alignX = this.getAlignX(W, bbox, calign);
      const alignY = this.getAlignY(H, D, h, d, ralign);
      this.place(x + alignX, y + alignY);
      return [alignX, alignY];
    }

    /**
     * @override
     */
    public placeColor(x: number, y: number, W: number, H: number) {
      const adaptor = this.adaptor;
      const child = this.firstChild();
      if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-bgcolor')) {
        adaptor.setAttribute(child, 'x', this.fixed(x));
        adaptor.setAttribute(child, 'y', this.fixed(y));
        adaptor.setAttribute(child, 'width', this.fixed(W));
        adaptor.setAttribute(child, 'height', this.fixed(H));
      }
    }

  };

})<any, any, any>();
