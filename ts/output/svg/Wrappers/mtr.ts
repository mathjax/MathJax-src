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
 * @file  Implements the SvgMtr wrapper for the MmlMtr object
 *                and SVGmlabeledtr for MmlMlabeledtr
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
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMtrNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonMtr<
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
  placeCell(cell: SvgMtdNTD<N, T, D>, sizes: SizeData): number;
}

/**
 * The SvgMtrClass interface for the SVG Mtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMtrClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonMtrClass<
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
  ): SvgMtrNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMtr wrapper class for the MmlMtr class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export const SvgMtr = (function <N, T, D>(): SvgMtrClass<N, T, D> {
  const Base = CommonMtrMixin<
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
    SvgMtrClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMtr extends Base implements SvgMtrNTD<N, T, D> {
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
    public placeCell(cell: SvgMtdNTD<N, T, D>, sizes: SizeData): number {
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
    protected placeCells(svg: N[]) {
      const parent = this.parent as SvgMtableNTD<N, T, D>;
      const cSpace = parent.getColumnHalfSpacing();
      const cLines = [parent.fLine, ...parent.cLines, parent.fLine];
      const cWidth = parent.getComputedWidths();
      const scale = 1 / this.getBBox().rscale;
      let x = cLines[0];
      for (let i = 0; i < this.numCells; i++) {
        const child = this.getChild(i) as SvgMtdNTD<N, T, D>;
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
          this.fixed((this.parent as SvgMtableNTD<N, T, D>).getWidth() * scale)
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
    public toSVG(parents: N[]) {
      const svg = this.standardSvgNodes(parents);
      this.placeCells(svg);
      this.placeColor();
    }
  };
})<any, any, any>();

/*****************************************************************/
/**
 * The SvgMlabeledtr interface for the SVG Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMlabeledtrNTD<N, T, D>
  extends SvgMtrNTD<N, T, D>,
    CommonMlabeledtr<
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
 * The SvgMlabeledtrClass interface for the SVG Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMlabeledtrClass<N, T, D>
  extends SvgMtrClass<N, T, D>,
    CommonMlabeledtrClass<
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
  ): SvgMlabeledtrNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMlabeledtr wrapper class for the MmlMlabeledtr class
 */
export const SvgMlabeledtr = (function <N, T, D>(): SvgMlabeledtrClass<
  N,
  T,
  D
> {
  const Base = CommonMlabeledtrMixin<
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
    SvgMlabeledtrClass<N, T, D>
  >(SvgMtr);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMlabeledtr extends Base implements SvgMlabeledtrNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMlabeledtr.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      super.toSVG(parents);
      const child = this.childNodes[0];
      if (child) {
        child.toSVG([(this.parent as SvgMtableNTD<N, T, D>).labels]);
      }
    }
  };
})<any, any, any>();
