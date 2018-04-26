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
import {split, isPercent} from '../../../util/string.js';
import {sum, max} from '../../../util/numeric.js';

/*
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
            'text-align': 'center',
            'position': 'relative'
        },
        'mjx-mtable > mjx-itable': {
            'vertical-align': 'middle',
            'text-align': 'left',
            'box-sizing': 'border-box'
        },
        'mjx-labels': {
            display: 'inline-table',
            position: 'absolute',
            top: 0
        },
        'mjx-mtable[align]': {
            'vertical-align': 'baseline'
        },
        'mjx-mtable[align="top"] > mjx-itable': {
            'vertical-align': 'top'
        },
        'mjx-mtable[align="bottom"] > mjx-itable': {
            'vertical-align': 'bottom'
        },
        'mjx-mtable[align="center"] > mjx-itable': {
            'vertical-align': 'middle'
        },
        'mjx-mtable[align="baseline"] > mjx-itable': {
            'vertical-align': 'middle'
        }
    };

    /*
     * The column for labels
     */
    public labels: N;

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


    /*
     * @return{CHTMLmtr[]}  The rows of the table
     */
    get tableRows() {
        return this.childNodes as CHTMLmtr<N, T, D>[];
    }

    /******************************************************************/

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.labels = this.html('mjx-labels', {align: node.attributes.get('side')});
        //
        // Determine the number of columns and rows
        //
        this.numCols = max(this.tableRows.map(row => row.numCells));
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
        this.rLines = this.getRowAttributes('rowlines').map(x => (x === 'none' ? 0 : .07));
        this.cWidths = this.getColumnWidths();
        //
        // Stretch the rows and columns
        //
        this.stretchRows();
        this.stretchColumns();
    }

    /*
     * Stretch the rows to the equal height or natural height
     */
    protected stretchRows() {
        const equal = this.node.attributes.get('equalrows') as boolean;
        const HD = (equal ? this.getEqualRowHeight() : 0);
        const {H, D} = (equal ? this.getTableData() : {H: [0], D: [0]});
        const rows = this.tableRows;
        for (let i = 0; i < this.numRows; i++) {
            const hd = (equal ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i]) / 2] : null);
            rows[i].stretchChildren(hd);
        }
    }

    /*
     * Stretch the columns to their proper widths
     */
    protected stretchColumns() {
        for (let i = 0; i < this.numCols; i++) {
            const width = (typeof this.cWidths[i] === 'number' ? this.cWidths[i] as number : null);
            this.stretchColumn(i, width);
        }
    }

    /*
     * Handle horizontal stretching within the ith column
     *
     * @param{number} i   The column number
     * @param{number} W   The computed width of the column (or null of not computed)
     */
    protected stretchColumn(i: number, W: number) {
        let stretchy: CHTMLWrapper<N, T, D>[] = [];
        //
        //  Locate and count the stretchy children
        //
        for (const row of this.tableRows) {
            const cell = row.getChild(i);
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
            if (W === null) {
                W = 0;
                //
                //  If all the children are stretchy, find the largest one,
                //  otherwise, find the width of the non-stretchy children.
                //
                let all = (count > 1 && count === nodeCount);
                for (const row of this.tableRows) {
                    const cell = row.getChild(i);
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
        this.handleLabels();
        this.handleAlign();
        this.shiftColor();
    }

    /*
     * Move background color (if any) to inner itable node so that labeled tables are
     * only colored on thei main part of the table.
     */
    protected shiftColor() {
        const color = this.adaptor.getStyle(this.chtml, 'backgroundColor');
        if (color) {
            this.adaptor.setStyle(this.chtml, 'backgroundColor', '');
            this.adaptor.setStyle(this.adaptor.firstChild(this.chtml) as N, 'backgroundColor', color);
        }
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
        const NH = new Array(this.numRows);
        const ND = new Array(this.numRows);
        const LW = [0];
        const rows = this.tableRows;
        for (let j = 0; j < rows.length; j++) {
            const row = rows[j];
            const cellCount = row.numCells;
            for (let i = 0; i < cellCount; i++) {
                this.updateHDW(row.getChild(i), i, j, H, D, W);
            }
            NH[j] = H[j];
            ND[j] = D[j];
            if (row.labeled) {
                this.updateHDW(row.childNodes[0], 0, j, H, D, LW);
            }
        }
        const w = this.node.attributes.get('width') as string;
        const L = LW[0];
        this.data = {H, D, W, NH, ND, L};
        return this.data;
    }

    /*
     * @param{CHTMLWrapper} cell    The cell whose height, depth, and width are to be added into the H, D, W arrays
     * @param{number} i             The column number for the cell
     * @param{number} j             The row number for the cell
     * @param{number[]} H           The maximum height for each of the rows
     * @param{number[]} D           The maximum depth for each of the rows
     * @param{number[]} W           The maximum width for each column
     */
    protected updateHDW(cell: CHTMLWrapper<N, T, D>, i: number, j: number, H: number[], D: number[], W: number[] = null) {
        let {h, d, w} = cell.getBBox();
        if (h < .75) h = .75;
        if (d < .25) d = .25;
        if (h > H[j]) H[j] = h;
        if (d > D[j]) D[j] = d;
        if (W && w > W[i]) W[i] = w;
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
        if (this.node.attributes.get('equalrows') as boolean) {
            const HD = this.getEqualRowHeight();
            height = sum([].concat(this.rLines, this.rSpace)) + HD * this.numRows;
        } else {
            height = sum(H.concat(D, this.rLines, this.rSpace));
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
        width = sum(CW.concat(this.cLines, this.cSpace)) + (this.frame ? .14 + 2 * this.fSpace[0] : 0);
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
        //  Return the bounding box information
        //
        let [h, d] = this.getBBoxHD(height);
        bbox.h = h;
        bbox.d = d;
        bbox.w = width;
    }

    /*
     * @param{number} height   The total height of the table
     * @return{number[]}       The [height, depth] for the aligned table
     */
    protected getBBoxHD(height: number) {
        const [align, row] = this.getAlignmentRow();
        if (row === null) {
            const a = this.font.params.axis_height;
            const h2 = height / 2;
            const HD: {[key: string]: number[]} = {
                top: [0, height],
                center: [h2, h2],
                bottom: [height, 0],
                baseline: [h2, h2],
                axis: [h2 + a, h2 - a]
            };
            return HD[align] || [h2, h2];
        } else {
            const y = this.getVerticalPosition(row, align);
            return [y, height - y];
        }
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
        const spacing = this.getEmHalfSpacing(this.fSpace[0], this.cSpace);
        const frame = this.frame;
        //
        //  For each row...
        //
        for (const row of this.tableRows) {
            let i = 0;
            //
            //  For each cell in the row...
            //
            for (const cell of row.tableCells) {
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
                if ((i > 1 && lspace !== '0.4em') || (frame && i === 1)) {
                    this.adaptor.setStyle(styleNode, 'paddingLeft', lspace);
                }
                if ((i < this.numCols && rspace !== '0.4em') || (frame && i === this.numCols)) {
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
        const spacing = this.getEmHalfSpacing(this.fSpace[1], this.rSpace);
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
                if ((i > 1 && tspace !== '0.215em') || (frame && i === 1)) {
                    this.adaptor.setStyle(cell.chtml, 'paddingTop', tspace);
                }
                if ((i < this.numRows && bspace !== '0.215em') || (frame && i === this.numRows)) {
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
        const space = this.getRowHalfSpacing();
        const {H, D, NH, ND} = this.getTableData();
        const HD = this.getEqualRowHeight();
        const HDem = this.em(HD);
        //
        // Loop through the rows and set their heights
        //
        for (let i = 0; i < this.numRows; i++) {
            const row = this.childNodes[i];
            if (HD !== NH[i] + ND[i]) {
                this.setRowHeight(row, HD, (HD - H[i] + D[i]) / 2, space[i] + space[i + 1]);
            }
        }
    }

    /*
     * Set the height of the row, and make sure that the baseline is in the right position for cells
     *   that are row aligned to baseline ot axis
     *
     * @param{CHTMLWrapper} row   The row to be set
     * @param{number} HD          The total height+depth for the row
     * @param{number] D           The new depth for the row
     * @param{number} space       The total spacing above and below the row
     */
    protected setRowHeight(row: CHTMLWrapper<N, T, D>, HD: number, D: number, space: number) {
        const adaptor = this.adaptor;
        adaptor.setStyle(row.chtml, 'height', this.em(HD + space));
        const ralign = row.node.attributes.get('rowalign');
        //
        //  Loop through the cells and set the strut height and depth.
        //    The strut is the last element in the cell.
        //
        for (const cell of row.childNodes) {
            const calign = cell.node.attributes.get('rowalign');
            if (calign === 'baseline' || calign === 'axis') {
                const child = adaptor.lastChild(cell.chtml) as N;
                adaptor.setStyle(child, 'height', this.em(HD));
                adaptor.setStyle(child, 'verticalAlign', this.em(-D));
                if ((row.kind !== 'mlabeledtr' || cell !== row.childNodes[0]) &&
                    (ralign === 'baseline' || ralign === 'axis')) break;
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
        const hasLabels = (this.adaptor.childNodes(this.labels).length > 0);
        if (isPercent(w) || hasLabels) {
            this.bbox.pwidth = (hasLabels ? '100%' : w);
            this.adaptor.setStyle(this.chtml, 'width', '100%');
        } else {
            if (w === 'auto') return;
            w = this.em(this.length2em(w) + (this.frame ? .14 : 0));
        }
        const table = this.adaptor.firstChild(this.chtml) as N;
        this.adaptor.setStyle(table, 'minWidth', w);
    }

    /*
     * Handle alignment of table to surrounding baseline
     */
    protected handleAlign() {
        const [align, row] = this.getAlignmentRow();
        if (row === null) {
            if (align !== 'axis') {
                this.adaptor.setAttribute(this.chtml, 'align', align);
            }
        } else {
            const y = this.getVerticalPosition(row, align);
            this.adaptor.setAttribute(this.chtml, 'align', 'top');
            this.adaptor.setStyle(this.chtml, 'verticalAlign', this.em(y));
        }
    }

    /******************************************************************/

    /*
     * Handle addition of labels to the table
     */
    protected handleLabels() {
        const labels = this.labels;
        const adaptor = this.adaptor;
        if (adaptor.childNodes(labels).length === 0) return;
        //
        //  Set the side for the labels
        //
        const side = this.node.attributes.get('side') as string;
        adaptor.setAttribute(labels, 'side', side);
        adaptor.setStyle(labels, side, '0');
        //
        //  Make sure labels don't overlap table
        //
        const {L} = this.getTableData();
        const sep = this.length2em(this.node.attributes.get('minlabelspacing'));
        const table = adaptor.firstChild(this.chtml) as N;
        adaptor.setStyle(table, 'margin', '0 ' + this.em(L + sep));  // FIXME, handle indentalign values
        //
        // Add the labels to the table
        //
        this.updateRowHeights();
        this.addLabelSpacing();
        adaptor.append(this.chtml, labels);
    }

    /*
     * Update any rows that are not naturally tall enough for the labels
     */
    protected updateRowHeights() {
        if (this.node.attributes.get('equalrows') as boolean) return;
        let {H, D, NH, ND} = this.getTableData();
        const space = this.getRowHalfSpacing();
        for (let i = 0; i < this.numRows; i++) {
            if (H[i] !== NH[i] || D[i] !== ND[i]) {
                this.setRowHeight(this.childNodes[i], H[i] + D[i], D[i], space[i] + space[i + 1]);
            }
        }
    }

    /*
     * Add spacing elements between the label rows so align them with the rest of the table
     */
    protected addLabelSpacing() {
        const adaptor = this.adaptor;
        const equal = this.node.attributes.get('equalrows') as boolean;
        const {H, D} = this.getTableData();
        const HD = (equal ? this.getEqualRowHeight() : 0);
        const space = this.getRowHalfSpacing();
        //
        //  Start with frame size and add in spacing, height and depth,
        //    and line thickness for each non-labeled row.
        //
        let h = (this.frame ? .07 : 0);
        let current = adaptor.firstChild(this.labels) as N;
        for (let i = 0; i < this.numRows; i++) {
            const row = this.childNodes[i];
            if (row.kind === 'mlabeledtr') {
                if (h) {
                    adaptor.insert(this.html('mjx-mtr', {style: {height: this.em(h)}}), current);
                    adaptor.setStyle(current, 'height', this.em((equal ? HD : H[i] + D[i]) + space[i] + space[i+1]));
                    current = adaptor.next(current) as N;
                    h = 0;
                }
            } else {
                h += space[i] + (equal ? HD : H[i] + D[i]) + space[i + 1] + this.rLines[i];
            }
        }
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
        if (this.node.attributes.get('equalcolumns') as boolean) {
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
            cwidth = max(W);
        } else if (isPercent(width)) {
            cwidth = this.percent(1 / n);
        } else {
            const w = sum([].concat(this.cLines, this.cSpace)) + 2 * this.fSpace[0];
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
        const cwidth = width - sum([].concat(this.cLines, this.cSpace)) - 2 * this.fSpace[0];
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

    /*
     * @param{number} i      The row number (starting at 0)
     * @param{string} align  The alignment on that row
     * @return{number}       The offest of the alignment position from the top of the table
     */
    protected getVerticalPosition(i: number, align: string) {
        const equal = this.node.attributes.get('equalrows') as boolean;
        const {H, D} = this.getTableData();
        const HD = (equal ? this.getEqualRowHeight() : 0);
        const space = this.getRowHalfSpacing();
        //
        //  Start with frame size and add in spacing, height and depth,
        //    and line thickness for each row.
        //
        let y = (this.frame ? .07 : 0);
        for (let j = 0; j < i; j++) {
            y += space[j] + (equal ? HD : H[j] + D[j]) + space[j + 1] + this.rLines[j];
        }
        //
        //  For equal rows, get updated height and depth
        //
        const [h, d] = (equal ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i])/2] : [H[i], D[i]]);
        //
        //  Add the offset into the specified row
        //
        const offset: {[name: string]: number} = {
            top: 0,
            center: space[i] + (h + d) / 2,
            bottom: space[i] + h + d + space[i + 1],
            baseline: space[i] + h,
            axis: space[i] + h - .25
        };
        y += offset[align] || 0;
        //
        //  Return the final result
        //
        return y;
    }

    /******************************************************************/

    /*
     * @param{number} fspace   The frame spacing to use
     * @param{number[]} space  The array of spacing values to convert to strings
     * @return{string[]}       The half-spacing as stings with units of "em"
     *                           with frame spacing at the beginning and end
     */
    protected getEmHalfSpacing(fspace: number, space: number[]) {
        //
        //  Get the column spacing values, and add the frame spacing values at the left and right
        //
        const fspaceEm = this.em(fspace);
        const spaceEm = this.addEm(space, 2);
        spaceEm.unshift(fspaceEm);
        spaceEm.push(fspaceEm);
        return spaceEm;
    }

    /*
     * @return{number[]}   The half-spacing for rows with frame spacing at the ends
     */
    protected getRowHalfSpacing() {
        const space = this.rSpace.map(x => x / 2);
        space.unshift(this.fSpace[1]);
        space.push(this.fSpace[1]);
        return space;
    }

    /*
     * @return{[string,number|null]}  The alignment and row number (based at 0) or null
     */
    protected getAlignmentRow(): [string, number] {
        const [align, row] = split(this.node.attributes.get('align') as string);
        if (row == null) return [align, null];
        let i = parseInt(row);
        if (i < 0) i += this.numRows;
        return [align, i < 1 || i > this.numRows ? null : i - 1];
    }

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
        return split(value);
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
