/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLmtable wrapper for the MmlMtable object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLmtr} from './mtr.js';
import {BBox} from '../BBox.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMtable} from '../../../core/MmlTree/MmlNodes/mtable.js';
import {StyleList} from '../CssStyles.js';
import {DIRECTION} from '../FontData.js';


/*
 * The heights, depths, and widths of the rows and columns
 */
export type TableData = {
    H: number[];
    D: number[];
    W: number[];
};

/*
 * Sum the elements of an array
 */
function SUM(A: number[]) {
    return A.reduce((a, b) => a + b, 0);
}

/*
 * Get the maximum value from an array
 */
function MAX(A: number[]) {
    return A.reduce((a, b) => Math.max(a, b), 0);
}

/*
 * Test if a value is a percentage
 */
function isPercent(x: string) {
    return x.match(/%\s*$/);
}

/*****************************************************************/
/*
 * The CHTMLmtable wrapper for the MmlMtable object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmtable<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMtable.prototype.kind;

    public static styles: StyleList = {
        'mjx-mtable': {
            'vertical-align': '.25em',
            'text-align': 'center'
        },
        'mjx-mtable > mjx-itable': {
            'vertical-align': 'middle',
            'text-align': 'left',
            'box-sizing': 'border-box'
        },
        'mjx-mtable[width] > mjx-itable': {
            width: '100%'
        }
    };

    /*
     * The number of columns and rows in the table
     */
    protected numCols: number = 0;
    protected numRows: number = 0;

    /*
     * The spacing and line data
     */
    protected frame: boolean;
    protected fSpace: number[];
    protected cSpace: number[];
    protected rSpace: number[];
    protected cLines: number[];
    protected rLines: number[];
    protected cWidths: (number | string)[];

    /*
     * The bounding box information for the table rows and columns
     */
    protected data: TableData = null;

    /******************************************************************/

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        //
        // Determine the number of columns and rows
        //
        this.numCols = MAX(this.childNodes.map(row => (row as CHTMLmtr<N, T, D>).numCells));
        this.numRows = this.childNodes.length;
        //
        // Get the frame, row, and column parameters
        //
        const attributes = node.attributes;
        this.frame = attributes.get('frame') !== 'none';
        this.fSpace = (this.frame ? this.convertLengths(this.getAttributeArray('framespacing')) : [0, 0]);
        this.cSpace = this.convertLengths(this.getColumnAttributes('columnspacing'));
        this.rSpace = this.convertLengths(this.getRowAttributes('rowspacing'));
        this.cLines = this.getColumnAttributes('columnlines').map(x => (x === 'none' ? 0 : .07));
        this.rLines = this.getColumnAttributes('rowlines').map(x => (x === 'none' ? 0 : .07));
        this.cWidths = this.getColumnWidths();
        //
        // Stretch the columns (rows are already taken care of in the CHTMLmtr wrapper)
        //
        for (let i = 0; i < this.numCols; i++) {
            this.stretchColumn(i);
        }
    }

    /*
     * Handle horizontal stretching within the ith column
     */
    protected stretchColumn(i: number) {
        let stretchy: CHTMLWrapper<N, T, D>[] = [];
        //
        //  Locate and count the stretchy children
        //
        for (const row of (this.childNodes as CHTMLmtr<N, T, D>[])) {
            const cell = row.childNodes[i + row.firstCell];
            if (cell) {
                const child = cell.childNodes[0];
                if (child.stretch.dir === DIRECTION.None &&
                    child.canStretch(DIRECTION.Horizontal)) {
                    stretchy.push(child);
                }
            }
        }
        let count = stretchy.length;
        let nodeCount = this.childNodes.length;
        if (count && nodeCount > 1) {
            let W = 0;
            //
            //  If all the children are stretchy, find the largest one,
            //  otherwise, find the width of the non-stretchy children.
            //
            let all = (count > 1 && count === nodeCount);
            for (const row of (this.childNodes as CHTMLmtr<N, T, D>[])) {
                const cell = row.childNodes[i + row.firstCell];
                if (cell) {
                    const child = cell.childNodes[0];
                    const noStretch = (child.stretch.dir === DIRECTION.None);
                    if (all || noStretch) {
                        const {w} = child.getBBox(noStretch);
                        if (w > W) {
                            W = w;
                        }
                    }
                }
            }
            //
            //  Stretch the stretchable children
            //
            for (const child of stretchy) {
                child.coreMO().getStretchedVariant([W]);
            }
        }
    }

    /******************************************************************/

    /*
     * @override
     */
    public toCHTML(parent: N) {
        //
        //  Create the rows inside an mjx-itable (which will be used to center the table on the math axis)
        //
        const chtml = this.standardCHTMLnode(parent);
        const table = this.adaptor.append(chtml, this.html('mjx-itable')) as N;
        for (const child of this.childNodes) {
            child.toCHTML(table);
        }
        //
        //  Pad the rows of the table, if needed
        //  Then set the column and row attributes for alignment, spacing, and lines
        //  Finally, add the frame, if needed
        //
        this.padRows();
        this.handleColumnSpacing();
        this.handleColumnLines();
        this.handleColumnWidths();
        this.handleRowSpacing();
        this.handleRowLines();
        this.handleEqualRows();
        this.handleFrame();
        this.handleWidth();
        this.drawBBox();
    }

    /******************************************************************/

    /*
     * Determine the row heights and depths, the column widths,
     * and the natural width and height of the table.
     */
    public getTableData() {
        if (this.data) {
            return this.data;
        }
        const H = new Array(this.numRows).fill(0);
        const D = new Array(this.numRows).fill(0);
        const W = new Array(this.numCols).fill(0);
        for (let j = 0; j < this.numRows; j++) {
            const row = this.childNodes[j] as CHTMLmtr<N, T, D>;
            for (let i = 0; i < row.childNodes.length; i++) {
                const cbox = row.childNodes[i].getBBox();
                const h = Math.max(cbox.h, .75);
                const d = Math.max(cbox.d, .25);
                if (h > H[j]) H[j] = h;
                if (d > D[j]) D[j] = d;
                if (cbox.w > W[i]) W[i] = cbox.w;
            }
        }
        const w = this.node.attributes.get('width') as string;
        this.data = {H, D, W};
        return this.data;
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        const {H, D, W} = this.getTableData();
        let height, width;
        //
        // For equal rows, use the common height and depth for all rows
        // Otherwise, use the height and depths for each row separately.
        // Add in the spacing, line widths, and frame size.
        //
        if (this.node.attributes.get('equalrows')) {
            const HD = this.getEqualRowHeight();
            height = SUM([].concat(this.rLines, this.rSpace)) + HD * this.numRows;
        } else {
            height = SUM(H.concat(D, this.rLines, this.rSpace));
        }
        height += (this.frame ? .14 + 2 * this.fSpace[1] : 0);
        //
        //  Get the widths of all columns (explicit width or computed width)
        //
        const CW = Array.from(W.keys()).map(i => {
            return (typeof this.cWidths[i] === 'number' ? this.cWidths[i] as number : W[i]);
        });
        //
        //  Get the expected width of the table
        //
        width = SUM(CW.concat(this.cLines, this.cSpace)) + (this.frame ? .14 + 2 * this.fSpace[0] : 0);
        //
        //  If the table width is not 'auto', determine the specified width
        //    and pick the larger of the specified and computed widths.
        //
        const w = this.node.attributes.get('width') as string;
        if (w !== 'auto') {
            const cwidth = this.metrics.containerWidth / this.metrics.em;
            width = Math.max(this.length2em(w, cwidth) + (this.frame ? .14 : 0), width);
        }
        //
        //  Return the bbounding box information
        //
        const a = this.font.params.axis_height;
        bbox.h = height / 2 + a;
        bbox.d = height / 2 - a;
        bbox.w = width;
    }

    /******************************************************************/

    /*
     * Pad any short rows with extra cells
     */
    protected padRows() {
        for (const row of this.adaptor.childNodes(this.adaptor.firstChild(this.chtml) as N) as N[]) {
            while (this.adaptor.childNodes(row).length < this.numCols) {
                this.adaptor.append(row, this.html('mjx-mtd'));
            }
        }
    }

    /*
     * Set the inter-column spacing for all columns
     *  (Use frame spacing on the outsides, if needed, and use half the column spacing on each
     *   neighboring column, so that if column lines are needed, they fall in the middle
     *   of the column space.)
     */
    protected handleColumnSpacing() {
        //
        //  Get the column spacing values, and add the frame spacing values at the left and right
        //
        const fspace = this.em(this.fSpace[0]);
        const spacing = this.addEm(this.cSpace, 2);
        if (!spacing) return;
        spacing.unshift(fspace);
        spacing[this.numCols] = fspace;
        const frame = this.frame;
        //
        //  For each row...
        //
        for (const row of this.childNodes) {
            let i = 0;
            //
            //  For each cell in the row...
            //
            for (const cell of row.childNodes) {
                //
                //  Get the left and right-hand spacing
                //
                const lspace = spacing[i++];
                const rspace = spacing[i];
                //
                //  Set the style for the spacing, if it is needed, and isn't the
                //  default already set in the mtd styles
                //
                const styleNode = (cell ? cell.chtml : this.adaptor.childNodes(row.chtml)[i] as N);
                if ((i > 1 || frame) && lspace !== '.5em') {
                    this.adaptor.setStyle(styleNode, 'paddingLeft', lspace);
                }
                if ((i < this.numCols || frame) && rspace !== '.5em') {
                    this.adaptor.setStyle(styleNode, 'paddingRight', rspace);
                }
            }
        }
    }

    /*
     * Add borders to the left of cells to make the column lines
     */
    protected handleColumnLines() {
        if (this.node.attributes.get('columnlines') === 'none') return;
        const lines = this.getColumnAttributes('columnlines');
        if (!lines) return;
        for (const row of this.childNodes) {
            let i = 0;
            for (const cell of this.adaptor.childNodes(row.chtml).slice(1) as N[]) {
                const line = lines[i++];
                if (line === 'none') continue;
                this.adaptor.setStyle(cell, 'borderLeft', '.07em ' + line);
            }
        }
    }

    /*
     * Add widths to the cells for the column widths
     */
    protected handleColumnWidths() {
        for (const row of this.childNodes) {
            let i = 0;
            for (const cell of this.adaptor.childNodes(row.chtml) as N[]) {
                const w = this.cWidths[i++];
                if (w !== null) {
                    const width = (typeof w === 'number' ? this.em(w) : w);
                    this.adaptor.setStyle(cell, 'width', width);
                    this.adaptor.setStyle(cell, 'maxWidth', width);
                    this.adaptor.setStyle(cell, 'minWidth', width);
                }
            }
        }
    }

    /*
     * Set the inter-row spacing for all rows
     *  (Use frame spacing on the outsides, if needed, and use half the row spacing on each
     *   neighboring row, so that if row lines are needed, they fall in the middle
     *   of the row space.)
     */
    protected handleRowSpacing() {
        //
        //  Get the row spacing values, and add the frame spacing values at the left and right
        //
        const fspacing = this.em(this.fSpace[1]);
        const spacing = this.addEm(this.rSpace, 2);
        if (!spacing) return;
        spacing.unshift(fspacing);
        spacing[this.numRows] = fspacing;
        const frame = this.frame;
        //
        //  For each row...
        //
        let i = 0;
        for (const row of this.childNodes) {
            //
            //  Get the top and bottom spacing
            //
            const tspace = spacing[i++];
            const bspace = spacing[i];
            //
            //  For each cell in the row...
            //
            for (const cell of row.childNodes) {
                //
                //  Set the style for the spacing, if it is needed, and isn't the
                //  default already set in the mtd styles
                //
                if ((i > 1 || frame) && tspace !== '.125em') {
                    this.adaptor.setStyle(cell.chtml, 'paddingTop', tspace);
                }
                if ((i < this.numRows || frame) && bspace !== '.125em') {
                    this.adaptor.setStyle(cell.chtml, 'paddingBottom', bspace);
                }
            }
        }
    }

    /*
     * Add borders to the tops of cells to make the row lines
     */
    protected handleRowLines() {
        if (this.node.attributes.get('rowlines') === 'none') return;
        const lines = this.getRowAttributes('rowlines');
        if (!lines) return;
        let i = 0;
        for (const row of this.childNodes.slice(1)) {
            const line = lines[i++];
            if (line === 'none') continue;
            for (const cell of this.adaptor.childNodes(row.chtml) as N[]) {
                this.adaptor.setStyle(cell, 'borderTop', '.07em ' + line);
            }
        }
    }

    /*
     * Set the heights of all rows to be the same, and properly center
     * baseline or axis rows within the newly sized
     */
    protected handleEqualRows() {
        if (!this.node.attributes.get('equalrows')) return;
        const space = this.rSpace.map(x => x / 2);
        space.unshift(this.fSpace[1]);
        space.push(this.fSpace[1]);
        const {H, D} = this.getTableData();
        const HD = this.getEqualRowHeight();
        const HDem = this.em(HD);
        //
        // Loop through the rows and set their heights
        //
        for (const i of Array.from(this.childNodes.keys())) {
            const row = this.childNodes[i];
            if (HD !== H[i] + D[i]) {
                this.adaptor.setStyle(row.chtml, 'height', this.em(space[i] + HD + space[i + 1]));
                const ralign = row.node.attributes.get('rowalign');
                //
                //  Loop through the cells and set the strut height and depth to spread
                //    the extra height equally above and below the baseline.  The strut
                //    is the last element in the cell.
                //
                for (const cell of row.childNodes) {
                    const calign = cell.node.attributes.get('rowalign');
                    if (calign === 'baseline' || calign === 'axis') {
                        const child = this.adaptor.lastChild(cell.chtml) as N;
                        this.adaptor.setStyle(child, 'height', HDem);
                        this.adaptor.setStyle(child, 'verticalAlign', this.em(-((HD - H[i] + D[i]) / 2)));
                        if (ralign === 'baseline' || ralign === 'axis') break;
                    }
                }
            }
        }
    }

    /*
     * Add a frame to the mtable, if needed
     */
    protected handleFrame() {
        if (this.frame) {
            this.adaptor.setStyle(this.adaptor.firstChild(this.chtml) as N,
                                  'border', '.07em ' + this.node.attributes.get('frame'));
        }
    }

    /*
     * Handle percentage widths and fixed widths
     */
    protected handleWidth() {
        let w = this.node.attributes.get('width') as string;
        if (w === 'auto') return;
        if (isPercent(w)) {
            this.bbox.pwidth = w;
        } else {
            w = this.em(this.length2em(w) + (this.frame ? .14 : 0));
        }
        this.adaptor.setStyle(this.chtml, 'minWidth', w);
        this.adaptor.setAttribute(this.chtml, 'width', w);
    }

    /******************************************************************/

    /*
     * Get the maximum height of a row
     */
    protected getEqualRowHeight() {
        const {H, D} = this.getTableData();
        const HD = Array.from(H.keys()).map(i => H[i] + D[i]);
        return Math.max.apply(Math, HD);
    }

    /*
     * Determine the column widths that can be computed (and need to be set).
     * The resulting arrays will have numbers for fixed-size arrays,
     *   strings for percentage sizes that can't be determined now,
     *   and null for stretchy columns tht will expand to fill the extra space.
     * Depending on the width specified for the table, different column
     *  values can be determined.
     *
     * @return{(string|number|null)[]}  The array of widths
     */
    protected getColumnWidths() {
        const width = this.node.attributes.get('width') as string;
        if (this.node.attributes.get('equalcolumns')) {
            return this.getEqualColumns(width);
        }
        const swidths = this.getColumnAttributes('columnwidth', 0);
        if (width === 'auto') {
            return this.getColumnWidthsAuto(swidths);
        }
        if (isPercent(width)) {
            return this.getColumnWidthsPercent(swidths, width);
        }
        return this.getColumnWidthsFixed(swidths, this.length2em(width));
    }

    /*
     * For tables with equal columns, get the proper amount per row.
     *
     * @return{(string|number|null)[]}  The array of widths
     */
    protected getEqualColumns(width: string) {
        const n = Math.max(1, this.numCols);
        let cwidth;
        if (width === 'auto') {
            const {W} = this.getTableData();
            cwidth = MAX(W);
        } else if (isPercent(width)) {
            cwidth = this.percent(1 / n);
        } else {
            const w = SUM([].concat(this.cLines, this.cSpace)) + 2 * this.fSpace[0];
            cwidth = Math.max(0, this.length2em(width) - w) / n;
        }
        return Array(this.numCols).fill(cwidth);
    }

    /*
     * For tables with width="auto", auto and fit columns
     * will end up being natural width, so don't need to
     * set those explicitly.
     *
     * @return{(string|number|null)[]}  The array of widths
     */
    protected getColumnWidthsAuto(swidths: string[]) {
        return swidths.map(x => {
            if (x === 'auto' || x === 'fit') return null;
            if (isPercent(x)) return x;
            return this.length2em(x);
        });
    }

    /*
     * For tables with percentage widths, let 'fit' columns (or 'auto'
     * columns if there are not 'fit' ones) will stretch automatically,
     * but for 'auto' columns (when there are 'fit' ones), set the size
     * to the natural size of the column.
     *
     * @return{(string|number|null)[]}  The array of widths
     */
    protected getColumnWidthsPercent(swidths: string[], width: string) {
        const hasFit = swidths.indexOf('fit') >= 0;
        const {W} = (hasFit ? this.getTableData() : {W: null});
        return Array.from(swidths.keys()).map(i => {
            const x = swidths[i];
            if (x === 'fit') return null;
            if (x === 'auto') return (hasFit ? W[i] : null);
            if (isPercent(x)) return x;
            return this.length2em(x);
        });
    }

    /*
     * For fixed-width tables, compute the column widths of all columns.
     *
     * @return{(string|number|null)[]}  The array of widths
     */
    protected getColumnWidthsFixed(swidths: string[], width: number) {
        //
        // Get the indices of the fit and auto columns, and the number of fit or auto entries.
        // If there are fit or auto columns, get the column widths.
        //
        const indices = Array.from(swidths.keys());
        const fit = indices.filter(i => swidths[i] === 'fit');
        const auto = indices.filter(i => swidths[i] === 'auto');
        const n = fit.length || auto.length;
        const {W} = (n ? this.getTableData() : {W: null});
        //
        // Determine the space remaining from the fixed width after the
        //   separation and lines have been removed (cwidth), and
        //   after the width of the columns have been removed (dw).
        //
        const cwidth = width - SUM([].concat(this.cLines, this.cSpace)) - 2 * this.fSpace[0];
        let dw = cwidth;
        indices.forEach(i => {
            const x = swidths[i];
            dw -= (x === 'fit' || x === 'auto' ? W[i] : this.length2em(x, width));
        });
        //
        // Get the amount of extra space per column, or 0 (fw)
        //
        const fw = (n && dw > 0 ? dw / n : 0);
        //
        // Return the column widths (plus extr space for those that are stretching
        //
        return indices.map(i => {
            const x = swidths[i];
            if (x === 'fit') return W[i] + fw;
            if (x === 'auto') return W[i] + (fit.length === 0 ? fw : 0);
            return this.length2em(x, cwidth);
        });
    }

    /******************************************************************/

    /*
     * @param{string} name           The name of the attribute to get as an array
     * @param{number} i              Return this many fewer than numCols entries
     * @return{string[]}             The array of values in the given attribute, split at spaces,
     *                                 padded to the number of table columns (minus 1) by repeating the last entry
     */
    protected getColumnAttributes(name: string, i: number = 1) {
        const n = this.numCols - i;
        const columns = this.getAttributeArray(name);
        if (columns.length === 0) return;
        while (columns.length < n) {
            columns.push(columns[columns.length - 1]);
        }
        if (columns.length > n) {
            columns.splice(n);
        }
        return columns;
    }

    /*
     * @param{string} name           The name of the attribute to get as an array
     * @param{number} i              Return this many fewer than numRows entries
     * @return{string[]}             The array of values in the given attribute, split at spaces,
     *                                 padded to the number of table rows (minus 1) by repeating the last entry
     */
    protected getRowAttributes(name: string, i: number = 1) {
        const n = this.numRows - i;
        const rows = this.getAttributeArray(name);
        if (rows.length === 0) return;
        while (rows.length < n) {
            rows.push(rows[rows.length - 1]);
        }
        if (rows.length > n) {
            rows.splice(n);
        }
        return rows;
    }

    /*
     * @param{string} name           The name of the attribute to get as an array
     * @return{string[]}             The array of values in the given attribute, split at spaces
     *                                 (after leading and trailing spaces are removed, and multiple
     *                                  spaces have been collapsed to one).
     */
    protected getAttributeArray(name: string) {
        const value = this.node.attributes.get(name) as string;
        if (!value) return [];
        return value.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, ' ').split(/ /);
    }

    /*
     * Adds "em" to a list of dimensions, after dividing by n (defaults to 1).
     *
     * @param{string[]} list   The array of dimensions (in em's)
     * @param{nunber} n        The number to divide each dimension by after converted
     * @return{string[]}       The array of values with "em" added
     */
    protected addEm(list: number[], n: number = 1) {
        if (!list) return;
        return list.map(x => this.em(x / n));
    }

    /*
     * Converts an array of dimensions (with arbitrary units) to an array of numbers
     *   representing the dimensions in units of em's.
     *
     * @param{string[]} list   The array of dimensions to be turned into em's
     * @return{number[]}       The array of values converted to em's
     */
    protected convertLengths(list: string[]) {
        if (!list) return;
        return list.map(x => this.length2em(x));
    }
}
