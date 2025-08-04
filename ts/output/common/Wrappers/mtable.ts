/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the CommonMtable wrapper mixin for the MmlMtable object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import { CommonMtr } from './mtr.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { BBox } from '../../../util/BBox.js';
import { DIRECTION } from '../FontData.js';
import { split, isPercent } from '../../../util/string.js';
import { sum, max } from '../../../util/numeric.js';
import { Styles, TRBL } from '../../../util/Styles.js';

/*****************************************************************/
/**
 * The heights, depths, and widths of the rows and columns
 * Plus the natural height and depth (i.e., without the labels)
 * Plus the label column width
 */
export type TableData = {
  H: number[];
  D: number[];
  W: number[];
  NH: number[];
  ND: number[];
  L: number;
};

/**
 * An array of table dimensions
 */
export type ColumnWidths = (string | number | null)[];

/**
 * The acceptable portion needed to shrink a column for line breaking
 * (when the needed shrinkage for a collection of columns is less than
 * this portion of their total width, no smaller columns are broken)
 */
export const BREAK_BELOW = 0.333;

/*****************************************************************/
/**
 * The CommonMtable interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 *
 * @template R   The class for table rows
 */
export interface CommonMtable<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  R extends CommonMtr<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * The number of columns in the table
   */
  numCols: number;
  /**
   * The number of rows in the table
   */
  numRows: number;

  /**
   * True if there are labeled rows
   */
  hasLabels: boolean;

  /**
   * True if this mtable is the top element, or in a top-most mrow
   */
  isTop: boolean;

  /**
   * The parent node of this table (skipping non-parents and mrows)
   */
  container: WW;
  /**
   * The position of the table as a child node of its container
   */
  containerI: number;

  /**
   * True if there is a frame
   */
  frame: boolean;
  /**
   * True if there is a frame or data-frame-styles
   */
  fframe: boolean;
  /**
   * The size of the frame line (or 0 if none)
   */
  fLine: number;
  /**
   * frame spacing on the left and right
   */
  fSpace: number[];
  /**
   * The spacing between columns
   */
  cSpace: number[];
  /**
   * The spacing between rows
   */
  rSpace: number[];
  /**
   * The width of columns lines (or 0 if no line for the column)
   */
  cLines: number[];
  /**
   * The width of row lines (or 0 if no lone for that row)
   */
  rLines: number[];
  /**
   * The column widths (or percentages, etc.)
   */
  cWidths: (number | string)[];

  /**
   * The bounding box information for the table rows and columns
   */
  data: TableData;

  /**
   * The table cells that have percentage-width content and the column numbers for them
   */
  pwidthCells: [WW, number][];

  /**
   * The full width of a percentage-width table
   */
  pWidth: number;

  /**
   * The rows of the table
   */
  readonly tableRows: R[];

  /**
   * Find the container and the child position of the table
   */
  findContainer(): void;

  /**
   * If the table has a precentage width or has labels, set the pwidth of the bounding box
   */
  getPercentageWidth(): void;

  /**
   * Stretch the rows to the equal height or natural height
   */
  stretchRows(): void;

  /**
   * Stretch the columns to their proper widths
   */
  stretchColumns(): void;

  /**
   * Handle horizontal stretching within the ith column
   *
   * @param {number} i   The column number
   * @param {number} W   The computed width of the column (or null of not computed)
   */
  stretchColumn(i: number, W: number): void;

  /**
   * Do linebreaking on the cells of a column
   *
   * @param {number} i      The number of the column to break
   * @param {number} W      The width to break to
   * @param {string} type   The column width type (fit, auto, dimen, percentage)
   */
  breakColumn(i: number, W: number, type: string): void;

  /**
   * Determine the row heights and depths, the column widths,
   * and the natural width and height of the table.
   *
   * @returns {TableData}  The dimensions of the rows and columns
   */
  getTableData(): TableData;

  /**
   * @param {WW} cell        The cell whose height, depth, and width are to be added into the H, D, W arrays
   * @param {number} i       The column number for the cell
   * @param {number} j       The row number for the cell
   * @param {string} align   The row alignment
   * @param {number[]} H     The maximum height for each of the rows
   * @param {number[]} D     The maximum depth for each of the rows
   * @param {number[]} W     The maximum width for each column
   * @param {number} M       The current height for items aligned top and bottom
   * @returns {number}        The updated value for M
   */
  updateHDW(
    cell: WW,
    i: number,
    j: number,
    align: string,
    H: number[],
    D: number[],
    W: number[],
    M: number
  ): number;

  /**
   * Extend the H and D of a row to cover the maximum height needed by top/bottom aligned items
   *
   * @param {number} i     The row whose hight and depth should be adjusted
   * @param {number[]} H   The row heights
   * @param {number[]} D   The row depths
   * @param {number} M     The maximum height of top/bottom aligned items
   */
  extendHD(i: number, H: number[], D: number[], M: number): void;

  /**
   * @param {WW} cell    The cell to check for percentage widths
   * @param {number} i   The column index of the cell
   */
  recordPWidthCell(cell: WW, i: number): void;

  /**
   * Set cell widths for columns with percentage width children
   */
  setColumnPWidths(): void;

  /**
   * @param {number} height   The total height of the table
   * @returns {number[]}       The [height, depth] for the aligned table
   */
  getBBoxHD(height: number): number[];

  /**
   * Get bbox left and right amounts to cover labels
   */
  getBBoxLR(): number[];

  /**
   * @param {string} side                 The side for the labels
   * @returns {[number, string, number]}   The padding, alignment, and shift amounts
   */
  getPadAlignShift(side: string): [number, string, number];

  /**
   * @returns {number}    The true width of the table (without labels)
   */
  getWidth(): number;

  /**
   * Adjust column widths for tables that are too wide
   */
  adjustWideTable(): void;

  /**
   * @returns {number}   The natural width of the table (without automatic lienbreaks).
   */
  naturalWidth(): number;

  /**
   * @returns {number}   The maximum height of a row
   */
  getEqualRowHeight(): number;

  /**
   * @returns {number[]}   The array of computed widths
   */
  getComputedWidths(): number[];

  /**
   * Determine the column widths that can be computed (and need to be set).
   * The resulting arrays will have numbers for fixed-size arrays,
   *   strings for percentage sizes that can't be determined now,
   *   and null for stretchy columns tht will expand to fill the extra space.
   * Depending on the width specified for the table, different column
   *  values can be determined.
   *
   * @returns {ColumnWidths}  The array of widths
   */
  getColumnWidths(): ColumnWidths;

  /**
   * For tables with equal columns, get the proper amount per row.
   *
   * @param {string} width   The width of the table
   * @returns {ColumnWidths}  The array of widths
   */
  getEqualColumns(width: string): ColumnWidths;

  /**
   * For tables with width="auto", auto and fit columns
   * will end up being natural width, so don't need to
   * set those explicitly.
   *
   * @param {string[]} swidths  Strings giving the widths
   * @returns {ColumnWidths}     The array of widths
   */
  getColumnWidthsAuto(swidths: string[]): ColumnWidths;

  /**
   * For tables with percentage widths, the 'fit' columns (or 'auto'
   * columns if there are not 'fit' ones) will stretch automatically,
   * but for 'auto' columns (when there are 'fit' ones), set the size
   * to the natural size of the column.
   *
   * @param {string[]} swidths  Strings giving the widths
   * @returns {ColumnWidths}     The array of widths
   */
  getColumnWidthsPercent(swidths: string[]): ColumnWidths;

  /**
   * For fixed-width tables, compute the column widths of all columns.
   *
   * @param {string[]} swidths  Strings giving the widths
   * @param {string} width      The width of the table
   * @returns {ColumnWidths}     The array of widths
   */
  getColumnWidthsFixed(swidths: string[], width: number): ColumnWidths;

  /**
   * For fixed-width tables, compute the column widths of all columns.
   *
   * @param {string} width       The width of the table
   */
  adjustColumnWidths(width: number): void;

  /**
   * @param {number} i      The row number (starting at 0)
   * @param {string} align  The alignment on that row
   * @returns {number}       The offest of the alignment position from the top of the table
   */
  getVerticalPosition(i: number, align: string): number;

  /**
   * @returns {number[]}   The x and y frame spacing [left, top-and-bottom, right]
   */
  getFrameSpacing(): number[];

  /**
   * @param {number[]} fspace   The frame spacing to use
   * @param {number[]} space    The array of spacing values to convert to strings
   * @param {number} scale      A scaling factor to use for the sizes
   * @returns {string[]}         The half-spacing as stings with units of "em"
   *                             with frame spacing at the beginning and end
   */
  getEmHalfSpacing(fspace: number[], space: number[], scale?: number): string[];

  /**
   * @returns {number[]}   The half-spacing for rows with frame spacing at the ends
   */
  getRowHalfSpacing(): number[];

  /**
   * @returns {number[]}   The half-spacing for columns with frame spacing at the ends
   */
  getColumnHalfSpacing(): number[];

  /**
   * @returns {[string,number|null]}  The alignment and row number (based at 0) or null
   */
  getAlignmentRow(): [string, number | null];

  /**
   * @param {string} name           The name of the attribute to get as an array
   * @param {number=} i             Return this many fewer than numCols entries
   * @returns {string[]}             The array of values in the given attribute, split at spaces,
   *                                 padded to the number of table columns (minus 1) by repeating the last entry
   */
  getColumnAttributes(name: string, i?: number): string[];

  /**
   * @param {string} name           The name of the attribute to get as an array
   * @param {number=} i             Return this many fewer than numRows entries
   * @returns {string[]}             The array of values in the given attribute, split at spaces,
   *                                 padded to the number of table rows (minus 1) by repeating the last entry
   */
  getRowAttributes(name: string, i?: number): string[];

  /**
   * @param {string} name           The name of the attribute to get as an array
   * @returns {string[]}             The array of values in the given attribute, split at spaces
   *                                 (after leading and trailing spaces are removed, and multiple
   *                                  spaces have been collapsed to one).
   */
  getAttributeArray(name: string): string[];

  /**
   * Adds "em" to a list of dimensions, after dividing by n (defaults to 1).
   *
   * @param {string[]} list   The array of dimensions (in em's)
   * @param {number=} n       The number to divide each dimension by after converted
   * @returns {string[]}       The array of values with "em" added
   */
  addEm(list: number[], n?: number): string[];

  /**
   * Converts an array of dimensions (with arbitrary units) to an array of numbers
   *   representing the dimensions in units of em's.
   *
   * @param {string[]} list   The array of dimensions to be turned into em's
   * @returns {number[]}       The array of values converted to em's
   */
  convertLengths(list: string[]): number[];
}

/**
 * The CommonMtableClass interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonMtableClass<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMtable wrapper mixin for the MmlMtable object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 *
 * @template R   The table row class
 * @template B   The mixin interface to create
 */
export function CommonMtableMixin<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  R extends CommonMtr<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMtableMixin
    extends Base
    implements CommonMtable<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC, R>
  {
    /**
     * @override
     */
    public numCols: number = 0;
    /**
     * @override
     */
    public numRows: number = 0;

    /**
     * @override
     */
    public hasLabels: boolean;

    /**
     * @override
     */
    public isTop: boolean;

    /**
     * @override
     */
    public container: WW;
    /**
     * @override
     */
    public containerI: number;

    /**
     * @override
     */
    public frame: boolean;
    /**
     * @override
     */
    public fframe: boolean;
    /**
     * @override
     */
    public fLine: number;
    /**
     * @override
     */
    public fSpace: number[];
    /**
     * @override
     */
    public cSpace: number[];
    /**
     * @override
     */
    public rSpace: number[];
    /**
     * @override
     */
    public cLines: number[];
    /**
     * @override
     */
    public rLines: number[];
    /**
     * @override
     */
    public cWidths: (number | string)[];

    /**
     * @override
     */
    public data: TableData = null;

    /**
     * @override
     */
    public pwidthCells: [WW, number][] = [];

    /**
     * @override
     */
    public pWidth: number = 0;

    /**
     * @override
     */
    get tableRows(): R[] {
      return this.childNodes as any as R[];
    }

    /******************************************************************/

    /**
     * @override
     */
    public findContainer() {
      let node = this as any as WW;
      let parent = node.parent as any as WW;
      while (parent && (parent.node.notParent || parent.node.isKind('mrow'))) {
        node = parent;
        parent = parent.parent;
      }
      this.container = parent;
      this.containerI = node.node.childPosition();
    }

    /**
     * @override
     */
    public getPercentageWidth() {
      if (this.hasLabels) {
        this.bbox.pwidth = BBox.fullWidth;
      } else {
        const width = this.node.attributes.get('width') as string;
        if (isPercent(width)) {
          this.bbox.pwidth = width;
        }
      }
    }

    /**
     * @override
     */
    public stretchRows() {
      const equal = this.node.attributes.get('equalrows') as boolean;
      const HD = equal ? this.getEqualRowHeight() : 0;
      const { H, D } = equal ? this.getTableData() : { H: [0], D: [0] };
      const rows = this.tableRows;
      for (let i = 0; i < this.numRows; i++) {
        const hd = equal
          ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i]) / 2]
          : null;
        rows[i].stretchChildren(hd);
      }
    }

    /**
     * @override
     */
    public stretchColumns() {
      const swidths = this.getColumnAttributes('columnwidth', 0);
      for (let i = 0; i < this.numCols; i++) {
        const width =
          typeof this.cWidths[i] === 'number'
            ? (this.cWidths[i] as number)
            : null;
        this.stretchColumn(i, width);
        if (width !== null) {
          this.breakColumn(i, width, swidths[i]);
        }
      }
    }

    /**
     * @override
     */
    public stretchColumn(i: number, W: number | null) {
      const stretchy: WW[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const row of this.tableRows) {
        const cell = row.getChild(i);
        if (cell) {
          const child = cell.childNodes[0];
          if (
            child.stretch.dir === DIRECTION.None &&
            child.canStretch(DIRECTION.Horizontal)
          ) {
            stretchy.push(child);
          }
        }
      }
      const count = stretchy.length;
      const nodeCount = this.childNodes.length;
      if (count && nodeCount > 1 && W === null) {
        W = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the width of the non-stretchy children.
        //
        const all = count > 1 && count === nodeCount;
        for (const row of this.tableRows) {
          const cell = row.getChild(i);
          if (cell) {
            const child = cell.childNodes[0];
            const noStretch = child.stretch.dir === DIRECTION.None;
            if (all || noStretch) {
              const { w } = child.getBBox(noStretch);
              if (w > W) {
                W = w;
              }
            }
          }
        }
      }
      if (W !== null) {
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          child
            .coreMO()
            .getStretchedVariant([
              Math.max(W, child.getBBox().w) / child.coreRScale(),
            ]);
        }
      }
    }

    /**
     * @override
     */
    public breakColumn(i: number, W: number, type: string) {
      if (
        this.jax.math.root.attributes.get('overflow') !== 'linebreak' ||
        !this.jax.math.display
      )
        return;
      const { D } = this.getTableData();
      let j = 0;
      let w = 0;
      for (const row of this.tableRows) {
        const cell = row.getChild(i);
        if (cell && cell.getBBox().w > W) {
          cell.childNodes[0].breakToWidth(W);
          const bbox = cell.getBBox();
          D[j] = Math.max(D[j], bbox.d);
          if (bbox.w > w) {
            w = bbox.w;
          }
        }
        j++;
      }
      //
      // Make sure cWidth reflects the size of the broken columns
      //
      if (
        type === 'fit' ||
        type === 'auto' ||
        isPercent(type) ||
        w > (this.cWidths[i] as number)
      ) {
        this.cWidths[i] = w;
      }
    }

    /******************************************************************/

    /**
     * @override
     */
    public getTableData(): TableData {
      if (this.data) {
        return this.data;
      }
      const H = new Array(this.numRows).fill(0);
      const D = new Array(this.numRows).fill(0);
      const W = new Array(this.numCols).fill(0);
      const NH = new Array(this.numRows);
      const ND = new Array(this.numRows);
      const LW = [0];
      const rows = this.tableRows;
      for (let j = 0; j < rows.length; j++) {
        let M = 0;
        const row = rows[j];
        const align = row.node.attributes.get('rowalign') as string;
        for (let i = 0; i < row.numCells; i++) {
          const cell = row.getChild(i);
          M = this.updateHDW(cell, i, j, align, H, D, W, M);
          this.recordPWidthCell(cell, i);
        }
        NH[j] = H[j];
        ND[j] = D[j];
        if (row.labeled) {
          M = this.updateHDW(row.childNodes[0], 0, j, align, H, D, LW, M);
        }
        this.extendHD(j, H, D, M);
        this.extendHD(j, NH, ND, M);
      }
      const L = LW[0];
      this.data = { H, D, W, NH, ND, L };
      return this.data;
    }

    /**
     * @override
     */
    public updateHDW(
      cell: WW,
      i: number,
      j: number,
      align: string,
      H: number[],
      D: number[],
      W: number[],
      M: number
    ): number {
      let { h, d, w } = cell.getBBox();
      const scale = cell.parent.bbox.rscale;
      if (cell.parent.bbox.rscale !== 1) {
        h *= scale;
        d *= scale;
        w *= scale;
      }
      if (this.node.getProperty('useHeight')) {
        if (h < 0.75) h = 0.75;
        if (d < 0.25) d = 0.25;
      }
      let m = 0;
      align = (cell.node.attributes.get('rowalign') as string) || align;
      if (align !== 'baseline' && align !== 'axis') {
        m = h + d;
        h = d = 0;
      }
      if (h > H[j]) H[j] = h;
      if (d > D[j]) D[j] = d;
      if (m > M) M = m;
      if (W && w > W[i]) W[i] = w;
      return M;
    }

    /**
     * @override
     */
    public extendHD(i: number, H: number[], D: number[], M: number) {
      const d = (M - (H[i] + D[i])) / 2;
      if (d < 0.00001) return;
      H[i] += d;
      D[i] += d;
    }

    /**
     * @override
     */
    public recordPWidthCell(cell: WW, i: number) {
      if (cell.childNodes[0] && cell.childNodes[0].getBBox().pwidth) {
        this.pwidthCells.push([cell, i]);
      }
    }

    /**
     * @override
     */
    public setColumnPWidths() {
      const W = this.cWidths as number[];
      for (const [cell, i] of this.pwidthCells) {
        if (cell.setChildPWidths(false, W[i])) {
          cell.invalidateBBox();
          cell.getBBox();
        }
      }
    }

    /**
     * @override
     */
    public getBBoxHD(height: number): [number, number] {
      const [align, row] = this.getAlignmentRow();
      if (row === null) {
        const a = this.font.params.axis_height;
        const h2 = height / 2;
        const HD: { [key: string]: [number, number] } = {
          top: [0, height],
          center: [h2, h2],
          bottom: [height, 0],
          baseline: [h2, h2],
          axis: [h2 + a, h2 - a],
        };
        return HD[align] || [h2, h2];
      } else {
        const y = this.getVerticalPosition(row, align);
        return [y, height - y];
      }
    }

    /**
     * @override
     */
    public getBBoxLR() {
      if (this.hasLabels) {
        const attributes = this.node.attributes;
        const side = attributes.get('side') as string;
        let [pad, align] = this.getPadAlignShift(side);
        //
        // If labels are included in the width,
        //   remove the frame spacing if there is no frame line (added by multline)
        //   and use left or right justification rather than centering so that
        //   there is no extra space reserved for the label on the opposite side,
        //   (as there usually is to center the equation).
        //
        const labels =
          this.hasLabels && !!attributes.get('data-width-includes-label');
        if (labels && this.frame && this.fSpace[0]) {
          pad -= this.fSpace[0];
        }
        return align === 'center' && !labels
          ? [pad, pad]
          : side === 'left'
            ? [pad, 0]
            : [0, pad];
      }
      return [this.bbox?.L || 0, 0];
    }

    /**
     * @override
     */
    public getPadAlignShift(side: string): [number, string, number] {
      //
      //  Make sure labels don't overlap table
      //
      const { L } = this.getTableData();
      const sep = this.length2em(this.node.attributes.get('minlabelspacing'));
      let pad = L + sep;
      const [lpad, rpad] =
        this.styles == null
          ? ['', '']
          : [this.styles.get('padding-left'), this.styles.get('padding-right')];
      if (lpad || rpad) {
        pad = Math.max(
          pad,
          this.length2em(lpad || '0'),
          this.length2em(rpad || '0')
        );
      }
      //
      //  Handle indentation
      //
      let [align, shift] = this.getAlignShift();
      if (align === side) {
        shift =
          side === 'left'
            ? Math.max(pad, shift) - pad
            : Math.min(-pad, shift) + pad;
      }
      return [pad, align, shift] as [number, string, number];
    }

    /**
     * @override
     */
    public getWidth(): number {
      return this.pWidth || this.getBBox().w;
    }

    /******************************************************************/

    /**
     * @override
     */
    public adjustWideTable() {
      const attributes = this.node.attributes;
      if (attributes.get('width') !== 'auto') return;
      const [pad, align] = this.getPadAlignShift(
        attributes.get('side') as string
      );
      const W = Math.max(
        this.containerWidth / 10,
        this.containerWidth - pad - (align === 'center' ? pad : 0)
      );
      if (this.naturalWidth() > W) {
        this.adjustColumnWidths(W);
      }
    }

    /**
     * @override
     */
    public naturalWidth(): number {
      const CW = this.getComputedWidths();
      return (
        sum(CW.concat(this.cLines, this.cSpace)) +
        2 * this.fLine +
        this.fSpace[0] +
        this.fSpace[2]
      );
    }

    /**
     * @override
     */
    public getEqualRowHeight(): number {
      const { H, D } = this.getTableData();
      const HD = Array.from(H.keys()).map((i) => H[i] + D[i]);
      return Math.max(...HD);
    }

    /**
     * @override
     */
    public getComputedWidths(): number[] {
      const W = this.getTableData().W;
      let CW = Array.from(W.keys()).map((i) => {
        return typeof this.cWidths[i] === 'number'
          ? (this.cWidths[i] as number)
          : W[i];
      });
      if (this.node.attributes.get('equalcolumns') as boolean) {
        CW = Array(CW.length).fill(max(CW));
      }
      return CW;
    }

    /**
     * @override
     */
    public getColumnWidths(): (string | number | null)[] {
      const width = this.node.attributes.get('width') as string;
      if (this.node.attributes.get('equalcolumns') as boolean) {
        return this.getEqualColumns(width);
      }
      const swidths = this.getColumnAttributes('columnwidth', 0);
      if (width === 'auto') {
        return this.getColumnWidthsAuto(swidths);
      }
      if (isPercent(width)) {
        return this.getColumnWidthsPercent(swidths);
      }
      return this.getColumnWidthsFixed(swidths, this.length2em(width));
    }

    /**
     * @override
     */
    public getEqualColumns(width: string): (string | number | null)[] {
      const n = Math.max(1, this.numCols);
      let cwidth;
      if (width === 'auto') {
        const { W } = this.getTableData();
        cwidth = max(W);
      } else if (isPercent(width)) {
        cwidth = this.percent(1 / n);
      } else {
        const w =
          sum([].concat(this.cLines, this.cSpace)) +
          this.fSpace[0] +
          this.fSpace[2];
        cwidth = Math.max(0, this.length2em(width) - w) / n;
      }
      return Array(this.numCols).fill(cwidth);
    }

    /**
     * @override
     */
    public getColumnWidthsAuto(swidths: string[]): ColumnWidths {
      return swidths.map((x) => {
        if (x === 'auto' || x === 'fit') return null;
        if (isPercent(x)) return x;
        return this.length2em(x);
      });
    }

    /**
     * @override
     */
    public getColumnWidthsPercent(swidths: string[]): ColumnWidths {
      const hasFit = swidths.includes('fit');
      const { W } = hasFit ? this.getTableData() : { W: null };
      return Array.from(swidths.keys()).map((i) => {
        const x = swidths[i];
        if (x === 'fit') return null;
        if (x === 'auto') return hasFit ? W[i] : null;
        if (isPercent(x)) return x;
        return this.length2em(x);
      });
    }

    /**
     * @override
     */
    public getColumnWidthsFixed(
      swidths: string[],
      width: number
    ): ColumnWidths {
      //
      // Get the indices of the fit and auto columns, and the number of fit or auto entries.
      // If there are fit or auto columns, get the column widths.
      //
      const indices = Array.from(swidths.keys());
      const fit = indices.filter((i) => swidths[i] === 'fit');
      const auto = indices.filter((i) => swidths[i] === 'auto');
      const n = fit.length || auto.length;
      const { W } = n ? this.getTableData() : { W: null };
      //
      // Determine the space remaining from the fixed width after the
      //   separation and lines have been removed (cwidth), and
      //   after the width of the columns have been removed (dw).
      //
      const cwidth =
        width -
        sum([].concat(this.cLines, this.cSpace)) -
        this.fSpace[0] -
        this.fSpace[2];
      let dw = cwidth;
      indices.forEach((i) => {
        const x = swidths[i];
        dw -= x === 'fit' || x === 'auto' ? W[i] : this.length2em(x, cwidth);
      });
      //
      // Get the amount of extra space per column, or 0 (fw)
      //
      const fw = n && dw > 0 ? dw / n : 0;
      //
      // Return the column widths (plus extra space for those that are stretching
      //
      return indices.map((i) => {
        const x = swidths[i];
        if (x === 'fit') return W[i] + fw;
        if (x === 'auto') return W[i] + (fit.length === 0 ? fw : 0);
        return this.length2em(x, cwidth);
      });
    }

    /**
     * @override
     */
    public adjustColumnWidths(width: number) {
      //
      // Sort the columns by width, fit first, then auto, then percentage, then fixed.
      // This is the order in which the columns should break, depending on how much
      // shrinkage is needed.  This keeps small columns from breaking unnecessarily,
      // and takes all the shrinkage from fit columns, if possible, then auto, then
      // percentage widths, and fixed sizes last.
      //
      const { W } = this.getTableData();
      const swidths = this.getColumnAttributes('columnwidth', 0);
      const indices = Array.from(swidths.keys());
      const fit = indices
        .filter((i) => swidths[i] === 'fit')
        .sort((a, b) => W[b] - W[a]);
      const auto = indices
        .filter((i) => swidths[i] === 'auto')
        .sort((a, b) => W[b] - W[a]);
      const percent = indices
        .filter((i) => isPercent(swidths[i]))
        .sort((a, b) => W[b] - W[a]);
      const fixed = indices
        .filter(
          (i) =>
            swidths[i] !== 'fit' &&
            swidths[i] !== 'auto' &&
            !isPercent(swidths[i])
        )
        .sort((a, b) => W[b] - W[a]);
      const columns = [...fit, ...auto, ...percent, ...fixed];
      if (!columns.length) return;
      //
      //  Get the current widths of all the columns
      //
      this.cWidths = indices.map((i) =>
        typeof this.cWidths[i] === 'number' ? (this.cWidths[i] as number) : W[i]
      );
      //
      // Determine the space remaining from the fixed width after the
      //   separation and lines have been removed (cwidth), and
      //   after the width of the columns have been removed (dw).
      //
      const cwidth =
        width -
        sum([].concat(this.cLines, this.cSpace)) -
        this.fSpace[0] -
        this.fSpace[2];
      let dw = sum(this.cWidths as number[]) - cwidth;
      //
      // Get the columns needed to get dw as a small enough portion of the total width
      //
      let w = 0;
      let n = 0;
      while (n < columns.length) {
        w += W[columns[n++]];
        if (w && dw / w < BREAK_BELOW) break;
      }
      //
      // Adjust the columns by the proportional amount of dw;
      //
      dw = 1 - dw / w;
      columns.slice(0, n).forEach((i) => ((this.cWidths[i] as number) *= dw));
    }

    /**
     * @override
     */
    public getVerticalPosition(i: number, align: string): number {
      const equal = this.node.attributes.get('equalrows') as boolean;
      const { H, D } = this.getTableData();
      const HD = equal ? this.getEqualRowHeight() : 0;
      const space = this.getRowHalfSpacing();
      //
      //  Start with frame size and add in spacing, height and depth,
      //    and line thickness for each row.
      //
      let y = this.fLine;
      for (let j = 0; j < i; j++) {
        y +=
          space[j] + (equal ? HD : H[j] + D[j]) + space[j + 1] + this.rLines[j];
      }
      //
      //  For equal rows, get updated height and depth
      //
      const [h, d] = equal
        ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i]) / 2]
        : [H[i], D[i]];
      //
      //  Add the offset into the specified row
      //
      const offset: { [name: string]: number } = {
        top: 0,
        center: space[i] + (h + d) / 2,
        bottom: space[i] + h + d + space[i + 1],
        baseline: space[i] + h,
        axis: space[i] + h - 0.25,
      };
      y += offset[align] || 0;
      //
      //  Return the final result
      //
      return y;
    }

    /******************************************************************/

    /**
     * @override
     */
    public getFrameSpacing(): number[] {
      const fspace = this.fframe
        ? this.convertLengths(this.getAttributeArray('framespacing'))
        : [0, 0];
      fspace[2] = fspace[0];
      const padding = this.node.attributes.get('data-array-padding') as string;
      if (padding) {
        const [L, R] = this.convertLengths(split(padding));
        fspace[0] = L;
        fspace[2] = R;
      }
      return fspace;
    }

    /**
     * @override
     */
    public getEmHalfSpacing(
      fspace: number[],
      space: number[],
      scale: number = 1
    ): string[] {
      //
      //  Get the column spacing values, and add the frame spacing values at the left and right
      //
      const spaceEm = this.addEm(space, 2 / scale);
      spaceEm.unshift(this.em(fspace[0] * scale));
      spaceEm.push(this.em(fspace[1] * scale));
      return spaceEm;
    }

    /**
     * @override
     */
    public getRowHalfSpacing(): number[] {
      const space = this.rSpace.map((x) => x / 2);
      space.unshift(this.fSpace[1]);
      space.push(this.fSpace[1]);
      return space;
    }

    /**
     * @override
     */
    public getColumnHalfSpacing(): number[] {
      const space = this.cSpace.map((x) => x / 2);
      space.unshift(this.fSpace[0]);
      space.push(this.fSpace[2]);
      return space;
    }

    /**
     * @override
     */
    public getAlignmentRow(): [string, number] {
      const [align, row] = split(this.node.attributes.get('align') as string);
      if (row == null) return [align, null];
      let i = parseInt(row);
      if (i < 0) i += this.numRows + 1;
      return [align, i < 1 || i > this.numRows ? null : i - 1];
    }

    /**
     * @override
     */
    public getColumnAttributes(name: string, i: number = 1): string[] | null {
      const n = this.numCols - i;
      const columns = this.getAttributeArray(name);
      if (columns.length === 0) return null;
      while (columns.length < n) {
        columns.push(columns[columns.length - 1]);
      }
      if (columns.length > n) {
        columns.splice(n);
      }
      return columns;
    }

    /**
     * @override
     */
    public getRowAttributes(name: string, i: number = 1): string[] | null {
      const n = this.numRows - i;
      const rows = this.getAttributeArray(name);
      if (rows.length === 0) return null;
      while (rows.length < n) {
        rows.push(rows[rows.length - 1]);
      }
      if (rows.length > n) {
        rows.splice(n);
      }
      return rows;
    }

    /**
     * @override
     */
    public getAttributeArray(name: string): string[] {
      const value = this.node.attributes.get(name) as string;
      if (!value) return [this.node.attributes.getDefault(name) as string];
      return split(value);
    }

    /**
     * @override
     */
    public addEm(list: number[], n: number = 1): string[] | null {
      if (!list) return null;
      return list.map((x) => this.em(x / n));
    }

    /**
     * @override
     */
    public convertLengths(list: string[]): number[] | null {
      if (!list) return null;
      return list.map((x) => this.length2em(x));
    }

    /*****************************************************/

    /**
     * @override
     * @class
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      //
      // Determine the number of columns and rows, and whether the table is stretchy
      //
      this.numCols = max(this.tableRows.map((row) => row.numCells));
      this.numRows = this.childNodes.length;
      this.hasLabels = this.childNodes.reduce(
        (value, row) => value || row.node.isKind('mlabeledtr'),
        false
      );
      this.findContainer();
      this.isTop =
        !this.container ||
        (this.container.node.isKind('math') && !this.container.parent);
      if (this.isTop) {
        this.jax.table = this as any as WW;
      }
      this.getPercentageWidth();
      //
      // Get the frame, row, and column parameters
      //
      const attributes = this.node.attributes;
      const frame = attributes.get('frame');
      this.frame = frame !== 'none';
      this.fframe =
        this.frame || attributes.get('data-frame-styles') !== undefined;
      this.fLine = this.frame ? 0.07 : 0;
      this.fSpace = this.getFrameSpacing();
      this.cSpace = this.convertLengths(
        this.getColumnAttributes('columnspacing')
      );
      this.rSpace = this.convertLengths(this.getRowAttributes('rowspacing'));
      this.cLines = this.getColumnAttributes('columnlines').map((x) =>
        x === 'none' ? 0 : 0.07
      );
      this.rLines = this.getRowAttributes('rowlines').map((x) =>
        x === 'none' ? 0 : 0.07
      );
      this.cWidths = this.getColumnWidths();
      this.adjustWideTable();
      //
      // Stretch the rows and columns
      //
      this.stretchColumns();
      this.stretchRows();
    }

    /**
     * Turn data-frame-styles into actual border styles
     *
     * @override
     */
    public getStyles() {
      super.getStyles();
      const frame = this.node.attributes.get('data-frame-styles') as string;
      if (!frame) return;
      if (!this.styles) {
        this.styles = new Styles('');
      }
      const fstyles = frame.split(/ /);
      for (const i of TRBL.keys()) {
        const style = fstyles[i];
        if (style === 'none') continue;
        this.styles.set(`border-${TRBL[i]}`, `.07em ${style}`);
      }
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const { H, D } = this.getTableData();
      let height, width;
      //
      // For equal rows, use the common height and depth for all rows
      // Otherwise, use the height and depths for each row separately.
      // Add in the spacing, line widths, and frame size.
      //
      if (this.node.attributes.get('equalrows') as boolean) {
        const HD = this.getEqualRowHeight();
        height = sum([].concat(this.rLines, this.rSpace)) + HD * this.numRows;
      } else {
        height = sum(H.concat(D, this.rLines, this.rSpace));
      }
      height += 2 * (this.fLine + this.fSpace[1]);
      //
      //  Get the expected width of the table
      //
      width = this.naturalWidth();
      //
      //  If the table width is not 'auto', determine the specified width
      //    and pick the larger of the specified and computed widths.
      //
      const w = this.node.attributes.get('width') as string;
      if (w !== 'auto') {
        width = Math.max(this.length2em(w, 0) + 2 * this.fLine, width);
      }
      //
      //  Return the bounding box information
      //
      const [h, d] = this.getBBoxHD(height);
      bbox.h = h;
      bbox.d = d;
      bbox.w = width;
      const [L, R] = this.getBBoxLR();
      bbox.L = L;
      bbox.R = R;
      //
      //  Handle cell widths if width is not a percentage
      //
      if (!isPercent(w)) {
        this.setColumnPWidths();
      }
    }

    /**
     * @override
     */
    public setChildPWidths(
      _recompute: boolean,
      cwidth: number,
      _clear: boolean
    ) {
      const width = this.node.attributes.get('width') as string;
      if (!isPercent(width)) return false;
      if (!this.hasLabels) {
        this.bbox.pwidth = '';
        this.container.bbox.pwidth = '';
      }
      const { w, L, R } = this.bbox;
      const labelInWidth = this.node.attributes.get(
        'data-width-includes-label'
      ) as boolean;
      const W =
        Math.max(w, this.length2em(width, Math.max(cwidth, L + w + R))) -
        (labelInWidth ? L + R : 0);
      const cols = (this.node.attributes.get('equalcolumns') as boolean)
        ? Array(this.numCols).fill(this.percent(1 / Math.max(1, this.numCols)))
        : this.getColumnAttributes('columnwidth', 0);
      this.cWidths = this.getColumnWidthsFixed(cols, W);
      this.pWidth = this.naturalWidth();
      if (this.isTop) {
        this.bbox.w = this.pWidth;
      }
      this.setColumnPWidths();
      if (this.pWidth !== w) {
        this.parent.invalidateBBox();
      }
      return this.pWidth !== w;
    }

    /**
     * @override
     */
    public getAlignShift() {
      return this.isTop
        ? super.getAlignShift()
        : ([this.container.getChildAlign(this.containerI), 0] as [
            string,
            number,
          ]);
    }
  } as any as B;
}
