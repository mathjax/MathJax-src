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
 * @file  Implements the SvgMtd wrapper for the MmlMtd object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMtd,
  CommonMtdClass,
  CommonMtdMixin,
} from '../../common/Wrappers/mtd.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMtd } from '../../../core/MmlTree/MmlNodes/mtd.js';
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMtd interface for the SVG Mtd wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMtdNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMtd<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  /**
   * @param {number} x    The x offset of the left side of the cell
   * @param {number} y    The y offset of the baseline of the cell
   * @param {number} W    The width of the cell
   * @param {number} H    The height of the cell
   * @param {number} D    The depth of the cell
   * @returns {[number, number]}   The x and y offsets used
   */
  placeCell(
    x: number,
    y: number,
    W: number,
    H: number,
    D: number
  ): [number, number];

  /**
   * @param {number} x    The x offset of the left side of the cell
   * @param {number} y    The y position of the bottom of the cell
   * @param {number} W    The width of the cell
   * @param {number} H    The height + depth of the cell
   */
  placeColor(x: number, y: number, W: number, H: number): void;
}

/**
 * The SvgMtdClass interface for the SVG Mtd wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMtdClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMtdClass<
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
  ): SvgMtdNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMtd wrapper class for the MmlMtd class
 */
export const SvgMtd = (function (): SvgMtdClass<DOM> {
  const Base = CommonMtdMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMtdClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMtd extends Base implements SvgMtdNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMtd.prototype.kind;

    /**
     * @override
     */
    public placeCell(
      x: number,
      y: number,
      W: number,
      H: number,
      D: number
    ): [number, number] {
      const bbox = this.getBBox();
      const h = Math.max(bbox.h, 0.75);
      const d = Math.max(bbox.d, 0.25);
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
      if (
        child &&
        adaptor.kind(child) === 'rect' &&
        adaptor.getAttribute(child, 'data-bgcolor')
      ) {
        adaptor.setAttribute(child, 'x', this.fixed(x));
        adaptor.setAttribute(child, 'y', this.fixed(y));
        adaptor.setAttribute(child, 'width', this.fixed(W));
        adaptor.setAttribute(child, 'height', this.fixed(H));
      }
    }
  };
})();
