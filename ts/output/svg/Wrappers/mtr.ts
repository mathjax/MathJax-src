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
 * @fileoverview  Implements the SVGmtr wrapper for the MmlMtr object
 *                and SVGmlabeledtr for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMtr, CommonMtrClass, CommonMtrMixin,
        CommonMlabeledtr, CommonMlabeledtrClass, CommonMlabeledtrMixin} from '../../common/Wrappers/mtr.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {SVGMtdNTD} from './mtd.js';
import {SVGMtableNTD} from './mtable.js';
import {MmlMtr, MmlMlabeledtr} from '../../../core/MmlTree/MmlNodes/mtr.js';


/**
 * The data needed for placeCell()
 */
export type SizeData = {
  x: number,
  y: number,
  w: number,
  lSpace: number,
  rSpace: number,
  lLine: number,
  rLine: number
};

/*****************************************************************/
/**
 * The SVGMtr interface for the SVG Mtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMtrNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMtr<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
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
   * @param {SVGmtd} cell      The cell to place
   * @param {SizeData} sizes   The positioning information
   * @return {number}          The new x position
   */
  placeCell(cell: SVGMtdNTD<N, T, D>, sizes: SizeData): number;

}

/**
 * The SVGMtrClass interface for the SVG Mtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMtrClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMtrClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMtrNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMtr wrapper class for the MmlMtr class
 */
export const SVGMtr = (function <N, T, D>(): SVGMtrClass<N, T, D> {

  const Base = CommonMtrMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMtrClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMtr extends Base implements SVGMtrNTD<N, T, D> {

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
    public placeCell(cell: SVGMtdNTD<N, T, D>, sizes: SizeData): number {
      const {x, y, lSpace, w, rSpace, lLine, rLine} = sizes;
      const scale = 1 / this.getBBox().rscale;
      const [h, d] = [this.H * scale, this.D * scale];
      const [t, b] = [this.tSpace * scale, this.bSpace * scale];
      const [dx, dy] = cell.placeCell(x + lSpace, y, w, h, d);
      const W = lSpace + w + rSpace;
      cell.placeColor(-(dx + lSpace + lLine / 2), -(d + b + dy), W + (lLine + rLine) / 2, h + d + t + b);
      return W + rLine;
    }

    /**
     * Set the location of the cell contents in the row and expand the cell background colors
     *
     * @param {N} svg   The container for the table
     */
    protected placeCells(svg: N) {
      const parent = this.parent as SVGMtableNTD<N, T, D>;
      const cSpace = parent.getColumnHalfSpacing();
      const cLines = [parent.fLine, ...parent.cLines, parent.fLine];
      const cWidth = parent.getComputedWidths();
      const scale = 1 / this.getBBox().rscale;
      let x = cLines[0];
      for (let i = 0; i < this.numCells; i++) {
        const child = this.getChild(i) as SVGMtdNTD<N, T, D>;
        child.toSVG(svg);
        x += this.placeCell(child, {
          x: x, y: 0, lSpace: cSpace[i] * scale, rSpace: cSpace[i + 1] * scale, w: cWidth[i] * scale,
          lLine: cLines[i] * scale, rLine: cLines[i + 1] * scale
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
      if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-bgcolor')) {
        const [TL, BL] = [(this.tLine / 2) * scale, (this.bLine / 2) * scale];
        const [TS, BS] = [this.tSpace * scale, this.bSpace * scale];
        const [H, D] = [this.H * scale, this.D * scale];
        adaptor.setAttribute(child, 'y', this.fixed(-(D + BS + BL)));
        adaptor.setAttribute(child, 'width', this.fixed((this.parent as SVGMtableNTD<N, T, D>).getWidth() * scale));
        adaptor.setAttribute(child, 'height', this.fixed(TL + TS + H + D + BS + BL));
      }
    }

    /******************************************************************/

    /**
     * @override
     */
    public toSVG(parent: N) {
      const svg = this.standardSVGnode(parent);
      this.placeCells(svg);
      this.placeColor();
    }

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The SVGMlabeledtr interface for the SVG Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMlabeledtrNTD<N, T, D> extends SVGMtrNTD<N, T, D>, CommonMlabeledtr<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMlabeledtrClass interface for the SVG Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMlabeledtrClass<N, T, D> extends SVGMtrClass<N, T, D>, CommonMlabeledtrClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMlabeledtrNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMlabeledtr wrapper class for the MmlMlabeledtr class
 */
export const SVGMlabeledtr = (function <N, T, D>(): SVGMlabeledtrClass<N, T, D> {

  const Base = CommonMlabeledtrMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMlabeledtrClass<N, T, D>
    >(SVGMtr);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMlabeledtr extends Base implements SVGMlabeledtrNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMlabeledtr.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      super.toSVG(parent);
      const child = this.childNodes[0];
      if (child) {
        child.toSVG((this.parent as SVGMtableNTD<N, T, D>).labels);
      }
    }

  };

})<any, any, any>();
