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

/*****************************************************************/
/*
 *  The CHTMLmtable wrapper for the MmlMtable object
 */

export class CHTMLmtable extends CHTMLWrapper {
    public static kind = MmlMtable.prototype.kind;

    public static styles: StyleList = {
        'mjx-mtable': {
            'vertical-align': '.25em',
            'text-align': 'center'
        },
        'mjx-mtable > mjx-itable': {
            'vertical-align': 'middle',
            'text-align': 'left'
        },
        'mjx-mtable[width="%"] > mjx-itable': {
            width: '100%'
        }
    };

    /*
     * The number of columns and rows in the table
     */
    protected numCols: number = 0;
    protected numRows: number = 0;


    /******************************************************************/

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory, node: MmlNode, parent: CHTMLWrapper = null) {
        super(factory, node, parent);
        //
        // Determine the number of columns and rows
        //
        this.numCols = this.childNodes.map(row => (row as CHTMLmtr).numCells)
                                      .reduce((a, b) => Math.max(a, b), 0);
        this.numRows = this.childNodes.length;
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
        let stretchy: CHTMLWrapper[] = [];
        //
        //  Locate and count the stretchy children
        //
        for (const row of (this.childNodes as CHTMLmtr[])) {
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
            for (const row of (this.childNodes as CHTMLmtr[])) {
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
    public toCHTML(parent: HTMLElement) {
        //
        //  Create the rows inside an mjx-itable (which will be used to center the table on the math axis)
        //
        let chtml = this.standardCHTMLnode(parent);
        const table = chtml.appendChild(this.html('mjx-itable'));
        for (const child of this.childNodes) {
            child.toCHTML(table);
        }
        //
        //  Check if there is a frame or lines, and get the frame spacing, if so
        //
        const attributes = this.node.attributes;
        const frame = attributes.get('frame') !== 'none';
        const lines = frame || attributes.get('columnlines') !== 'none' || attributes.get('rowlines') !== 'none';
        const fspacing = (lines ? this.convertLengths(this.getAttributeArray('framespacing')) : []);
        //
        //  Pad the rows of the table, if needed
        //  Then set the column and row attributes for alignment, spacing, and lines
        //  Finally, add the frame, if needed
        //
        this.padRows();
        this.handleColumnAlign();
        this.handleColumnSpacing(lines, fspacing[0] || '0');
        this.handleColumnLines();
        this.handleRowAlign();
        this.handleRowSpacing(lines, fspacing[1] || '0');
        this.handleRowLines();
        this.handleFrame(frame);
        this.handleWidth();
    }

    /******************************************************************/

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        const H = new Array(this.numRows).fill(0);
        const D = new Array(this.numRows).fill(0);
        const W = new Array(this.numCols).fill(0);
        for (let j = 0; j < this.numRows; j++) {
            const row = this.childNodes[j] as CHTMLmtr;
            for (let i = 0; i < row.childNodes.length; i++) {
                const cbox = row.childNodes[i].getBBox();
                const h = Math.max(cbox.h, .75);
                const d = Math.max(cbox.d, .25);
                if (h > H[j]) H[j] = h;
                if (d > D[j]) D[j] = d;
                if (cbox.w > W[i]) W[i] = cbox.w;
            }
        }
        const cMax = Math.max(0, this.numCols - 1);
        const rMax = Math.max(0, this.numRows - 1);
        const cSpace = this.convertLengths(this.getColumnAttributes('columnspacing')).slice(0, cMax);
        const rSpace = this.convertLengths(this.getRowAttributes('rowspacing')).slice(0, rMax);
        const frame = this.node.attributes.get('frame') !== 'none';
        const fSpace = (frame ? this.convertLengths(this.getAttributeArray('framespacing')) : []);
        const cLines = this.getColumnAttributes('columnlines').slice(0, cMax).map(x => (x === 'none' ? 0 : .07));
        const rLines = this.getColumnAttributes('rowlines').slice(0, cMax).map(x => (x === 'none' ? 0 : .07));
        const a = this.font.params.axis_height;
        const h = H.concat(D, rLines).reduce((a, b) => a + b, 0)
                + (frame ? .14 : 0)
                + rSpace.map(x => parseFloat(x))
                        .reduce((a, b) => a + b, 0)
                + 2 * parseFloat(fSpace[1] || '0');
        bbox.h = h / 2 + a;
        bbox.d = h / 2 - a;
        bbox.w = W.concat(cLines).reduce((a, b) => a + b, 0)
               + cSpace.map(x => parseFloat(x))
                       .reduce((a, b) => a + b, 0)
               + 2 * parseFloat(fSpace[1] || '0');
    }

    /******************************************************************/

    /*
     * Pad any short rows with extra cells
     */
    protected padRows() {
        for (const row of Array.from((this.chtml.firstChild as HTMLElement).childNodes)) {
            while (row.childNodes.length < this.numCols) {
                row.appendChild(this.html('mjx-mtd'));
            }
        }
    }

    /*
     * Set the cell aligments based on the table, row, or cell columnalign attributes
     */
    protected handleColumnAlign() {
        const colAlign = this.getColumnAttributes('columnalign') || [];
        for (const row of this.childNodes) {
            const aligns = this.getColumnAttributes('columnalign', row) || colAlign;
            let i = 0;
            for (const cell of row.childNodes) {
                let align = (cell.node.attributes.get('columnalign') as string) || aligns[i++];
                if (align !== 'center') {
                    cell.chtml.style.textAlign = align;
                }
            }
        }
    }

    /*
     * Set the inter-column spacing for all columns
     *  (Use frame spacing on the outsides, if needed, and use half the column spacing on each
     *   neighboring column, so that if column lines are needed, they fall in the middle
     *   of the column space.)
     *
     * @param{boolean} frame  Whether to include frame spacing on the left and right or not
     * @param{string} fspace  The frame spacing to use, if any
     */
    protected handleColumnSpacing(frame: boolean, fspace: string) {
        //
        //  Get the column spacing values, and add the frame spacing values at the left and right
        //
        const spacing = this.convertLengths(this.getColumnAttributes('columnspacing'), 2);
        if (!spacing) return;
        spacing.unshift(fspace);
        spacing[this.numCols] = fspace;
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
                const style = (cell ? cell.chtml : row.chtml.childNodes[i] as HTMLElement).style;
                if ((i > 1 || frame) && lspace !== '.5em') {
                    style.paddingLeft = lspace;
                }
                if ((i < this.numCols || frame) && rspace !== '.5em') {
                    style.paddingRight = rspace;
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
            for (const cell of (Array.from(row.chtml.childNodes) as HTMLElement[]).slice(1)) {
                const line = lines[i++];
                if (line === 'none') continue;
                cell.style.borderLeft = '.07em ' + line;
            }
        }
    }

    /*
     * Add vertical alignment to rows, and override in the cells, if needed
     */
    protected handleRowAlign() {
        const rowAlign = this.getRowAttributes('rowalign') || [];
        let i = 0;
        for (const row of this.childNodes) {
            const align = (row.node.attributes.get('rowalign') as string) || rowAlign[i++];
            if (align !== 'baseline') {
                row.chtml.style.verticalAlign = align;
            }
            for (const cell of row.childNodes) {
                const calign = cell.node.attributes.get('rowalign') as string;
                if (calign && calign !== align) {
                    cell.chtml.style.verticalAlign = calign;
                }
            }
        }
    }

    /*
     * Set the inter-row spacing for all rows
     *  (Use frame spacing on the outsides, if needed, and use half the row spacing on each
     *   neighboring row, so that if row lines are needed, they fall in the middle
     *   of the row space.)
     *
     * @param{boolean} frame  Whether to include frame spacing on the top and bottom or not
     * @param{string} fspace  The frame spacing to use, if any
     */
    protected handleRowSpacing(frame: boolean, fspacing: string) {
        //
        //  Get the row spacing values, and add the frame spacing values at the left and right
        //
        const spacing = this.convertLengths(this.getRowAttributes('rowspacing'), 2);
        if (!spacing) return;
        spacing.unshift(fspacing);
        spacing[this.numRows] = fspacing;
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
                const style = cell.chtml.style;
                if ((i > 1 || frame) && tspace !== '.125em') {
                    style.paddingTop = tspace;
                }
                if ((i < this.numRows || frame) && bspace !== '.125em') {
                    style.paddingBottom = bspace;
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
            for (const cell of Array.from(row.chtml.childNodes) as HTMLElement[]) {
                cell.style.borderTop = '.07em ' + line;
            }
        }
    }

    /*
     * Add a frame to the mtable, if needed
     */
    protected handleFrame(frame: boolean) {
        if (frame) {
            (this.chtml.firstChild as HTMLElement).style.border = '.07em ' + this.node.attributes.get('frame');
        }
    }

    /*
     * Handle percentage widths and fixed widths
     */
    protected handleWidth() {
        let w = this.node.attributes.get('width') as string;
        if (w === 'auto') return;
        if (w.match(/%$/)) {
            this.bbox.pwidth = w;
            this.chtml.setAttribute('width','%');
        } else {
            w = this.em(this.length2em(w));
        }
        this.chtml.style.width = w;
    }

    /******************************************************************/

    /*
     * @param{string} name           The name of the attribute to get as an array
     * @param{CHTMLWrapper} wrapper  The wrapper whose attribute is to be used
     * @return{string[]}             The array of values in the given attribute, split at spaces,
     *                                 padded to the number of table columns by repeating the last entry
     */
    protected getColumnAttributes(name: string, wrapper: CHTMLWrapper = null) {
        const columns = this.getAttributeArray(name, wrapper);
        if (columns.length === 0) return;
        while (columns.length < this.numCols) {
            columns.push(columns[columns.length - 1]);
        }
        return columns;
    }

    /*
     * @param{string} name           The name of the attribute to get as an array
     * @param{CHTMLWrapper} wrapper  The wrapper whose attribute is to be used
     * @return{string[]}             The array of values in the given attribute, split at spaces,
     *                                 padded to the number of table rows by repeating the last entry
     */
    protected getRowAttributes(name: string, wrapper: CHTMLWrapper = null) {
        const rows = this.getAttributeArray(name, wrapper);
        if (rows.length === 0) return;
        while (rows.length < this.numRows) {
            rows.push(rows[rows.length - 1]);
        }
        return rows;
    }

    /*
     * @param{string} name           The name of the attribute to get as an array
     * @param{CHTMLWrapper} wrapper  The wrapper whose attribute is to be used
     * @return{string[]}             The array of values in the given attribute, split at spaces
     *                                 (after leading and trailing spaces are removed, and multiple
     *                                  spaces have been collapsed to one).
     */
    protected getAttributeArray(name: string, wrapper: CHTMLWrapper = null) {
        const value = ((wrapper || this).node.attributes.get(name) as string);
        if (!value) return [];
        return value.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, ' ').split(/ /);
    }

    /*
     * Converts an array of dimensions (with arbitrary units) to an array of dimensions
     *   in units of em's, dividing the dimension by n (defaults to 1).
     *
     * @param{string[]} list   The array of dimensions to be turned into em's
     * @param{nunber} n        The number to divide each dimension by after converted
     * @return{string[]}       The array of values converted to em's
     */
    protected convertLengths(list: string[], n: number = 1) {
        if (!list) return;
        return list.map(x => this.em(this.length2em(x) / n));
    }
}
