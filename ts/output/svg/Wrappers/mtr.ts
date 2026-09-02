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
 * @file  Implements the SvgMtr wrapper for the MmlMtr object
 *                and SVGmlabeledtr for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMtr,
  CommonMtrClass,
  CommonMtrMixin,
  CommonMlabeledtr,
  CommonMlabeledtrClass,
  CommonMlabeledtrMixin,
} from '../../common/Wrappers/mtr.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { SvgMtdNTD } from './mtd.js';
import { SvgMtableNTD } from './mtable.js';
import { MmlMtr, MmlMlabeledtr } from '../../../core/MmlTree/MmlNodes/mtr.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/**
 * The data needed for placeCell()
 */
export type SizeData = {
  x: number;
  y: number;
  w: number;
  lSpace: number;
  rSpace: number;
  lLine: number;
  rLine: number;
};

/*****************************************************************/
/**
 * The SvgMtr interface for the SVG Mtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMtrNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMtr<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  /**
   * The height of the row
   */
  H: number;
  /**
   * The depth of the row
   */
  D: number;
  /**
   * The space above the row
   */
  tSpace: number;
  /**
   * The space below the row
   */
  bSpace: number;
  /**
   * The line space above the row
   */
  tLine: number;
  /**
   * The line space below the row
   */
  bLine: number;

  /**
   * @param {SvgMtdNTD} cell   The cell to place
   * @param {SizeData} sizes   The positioning information
   * @returns {number}         The new x position
   */
  placeCell(cell: SvgMtdNTD<DOM>, sizes: SizeData): number;
}

/**
 * The SvgMtrClass interface for the SVG Mtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMtrClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMtrClass<
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
  ): SvgMtrNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMtr wrapper class for the MmlMtr class
 */
export const SvgMtr = (function (): SvgMtrClass<DOM> {
  const Base = CommonMtrMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMtrClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMtr extends Base implements SvgMtrNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMtr.prototype.kind;

    /**
     * @override
     */
    public H: number;
    /**
     * @override
     */
    public D: number;
    /**
     * @override
     */
    public tSpace: number;
    /**
     * @override
     */
    public bSpace: number;
    /**
     * @override
     */
    public tLine: number;
    /**
     * @override
     */
    public bLine: number;

    /**
     * @override
     */
    public placeCell(cell: SvgMtdNTD<DOM>, sizes: SizeData): number {
      const { x, y, lSpace, w, rSpace, lLine, rLine } = sizes;
      const scale = 1 / this.getBBox().rscale;
      const [h, d] = [this.H * scale, this.D * scale];
      const [t, b] = [this.tSpace * scale, this.bSpace * scale];
      const [dx, dy] = cell.placeCell(x + lSpace, y, w, h, d);
      const W = lSpace + w + rSpace;
      cell.placeColor(
        -(dx + lSpace + lLine / 2),
        -(d + b + dy),
        W + (lLine + rLine) / 2,
        h + d + t + b
      );
      return W + rLine;
    }

    /**
     * Set the location of the cell contents in the row and expand the cell background colors
     *
     * @param {N[]} svg   The containers for the table
     */
    protected placeCells(svg: N<DOM>[]) {
      const parent = this.parent as SvgMtableNTD<DOM>;
      const cSpace = parent.getColumnHalfSpacing();
      const cLines = [parent.fLine, ...parent.cLines, parent.fLine];
      const cWidth = parent.getComputedWidths();
      const scale = 1 / this.getBBox().rscale;
      let x = cLines[0];
      for (let i = 0; i < this.numCells; i++) {
        const child = this.getChild(i) as SvgMtdNTD<DOM>;
        child.toSVG(svg);
        x += this.placeCell(child, {
          x: x,
          y: 0,
          lSpace: cSpace[i] * scale,
          rSpace: cSpace[i + 1] * scale,
          w: cWidth[i] * scale,
          lLine: cLines[i] * scale,
          rLine: cLines[i + 1] * scale,
        });
      }
    }

    /**
     * Expand the backgound color to fill the entire row
     */
    protected placeColor() {
      const scale = 1 / this.getBBox().rscale;
      const adaptor = this.adaptor;
      const child = this.firstChild();
      if (
        child &&
        adaptor.kind(child) === 'rect' &&
        adaptor.getAttribute(child, 'data-bgcolor')
      ) {
        const [TL, BL] = [(this.tLine / 2) * scale, (this.bLine / 2) * scale];
        const [TS, BS] = [this.tSpace * scale, this.bSpace * scale];
        const [H, D] = [this.H * scale, this.D * scale];
        adaptor.setAttribute(child, 'y', this.fixed(-(D + BS + BL)));
        adaptor.setAttribute(
          child,
          'width',
          this.fixed((this.parent as SvgMtableNTD<DOM>).getWidth() * scale)
        );
        adaptor.setAttribute(
          child,
          'height',
          this.fixed(TL + TS + H + D + BS + BL)
        );
      }
    }

    /******************************************************************/

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      const svg = this.standardSvgNodes(parents);
      this.placeCells(svg);
      this.placeColor();
    }
  };
})();

/*****************************************************************/
/**
 * The SvgMlabeledtr interface for the SVG Mlabeledtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMlabeledtrNTD<DOM extends DOM_TYPES>
  extends
    SvgMtrNTD<DOM>,
    CommonMlabeledtr<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMlabeledtrClass interface for the SVG Mlabeledtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMlabeledtrClass<DOM extends DOM_TYPES>
  extends
    SvgMtrClass<DOM>,
    CommonMlabeledtrClass<
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
  ): SvgMlabeledtrNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMlabeledtr wrapper class for the MmlMlabeledtr class
 */
export const SvgMlabeledtr = (function (): SvgMlabeledtrClass<DOM> {
  const Base = CommonMlabeledtrMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMlabeledtrClass<DOM>
  >(SvgMtr);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMlabeledtr extends Base implements SvgMlabeledtrNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMlabeledtr.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      super.toSVG(parents);
      const child = this.childNodes[0];
      if (child) {
        child.toSVG([(this.parent as SvgMtableNTD<DOM>).labels]);
      }
    }
  };
})();
