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

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CommonMtable, CommonMtableMixin} from '../../common/Wrappers/mtable.js';
import {CHTMLmtr} from './mtr.js';
import {CHTMLmtd} from './mtd.js';
import {MmlMtable} from '../../../core/MmlTree/MmlNodes/mtable.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../common/CssStyles.js';
import {isPercent} from '../../../util/string.js';

/*****************************************************************/
/**
 * The CHTMLmtable wrapper for the MmlMtable object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmtable<N, T, D> extends
CommonMtableMixin<CHTMLmtd<N, T, D>, CHTMLmtr<N, T, D>, CHTMLConstructor<N, T, D>>(CHTMLWrapper) {

    public static kind = MmlMtable.prototype.kind;

    public static styles: StyleList = {
        'mjx-mtable': {
            'vertical-align': '.25em',
            'text-align': 'center',
            'position': 'relative',
            'box-sizing': 'border-box'
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
        'mjx-mtable[justify="left"][side="left"]': {
            'text-align': 'left',
            'padding-right': '0 ! important'
        },
        'mjx-mtable[justify="left"][side="right"]': {
            'text-align': 'left',
            'padding-left': '0 ! important'
        },
        'mjx-mtable[justify="right"][side="left"]': {
            'text-align': 'right',
            'padding-right': '0 ! important'
        },
        'mjx-mtable[justify="right"][side="right"]': {
            'text-align': 'right',
            'padding-left': '0 ! important'
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

    /**
     * The column for labels
     */
    public labels: N;

    /******************************************************************/

    /**
     * @override
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.labels = this.html('mjx-labels');
    }

    /**
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
        this.handleJustify();
        this.shiftColor();
    }

    /**
     * Move background color (if any) to inner itable node so that labeled tables are
     * only colored on the main part of the table.
     */
    protected shiftColor() {
        const color = this.adaptor.getStyle(this.chtml, 'backgroundColor');
        if (color) {
            this.adaptor.setStyle(this.chtml, 'backgroundColor', '');
            this.adaptor.setStyle(this.adaptor.firstChild(this.chtml) as N, 'backgroundColor', color);
        }
    }

    /******************************************************************/

    /**
     * Pad any short rows with extra cells
     */
    protected padRows() {
        for (const row of this.adaptor.childNodes(this.adaptor.firstChild(this.chtml) as N) as N[]) {
            while (this.adaptor.childNodes(row).length < this.numCols) {
                this.adaptor.append(row, this.html('mjx-mtd'));
            }
        }
    }

    /**
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

    /**
     * Add borders to the left of cells to make the column lines
     */
    protected handleColumnLines() {
        if (this.node.attributes.get('columnlines') === 'none') return;
        const lines = this.getColumnAttributes('columnlines');
        for (const row of this.childNodes) {
            let i = 0;
            for (const cell of this.adaptor.childNodes(row.chtml).slice(1) as N[]) {
                const line = lines[i++];
                if (line === 'none') continue;
                this.adaptor.setStyle(cell, 'borderLeft', '.07em ' + line);
            }
        }
    }

    /**
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

    /**
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

    /**
     * Add borders to the tops of cells to make the row lines
     */
    protected handleRowLines() {
        if (this.node.attributes.get('rowlines') === 'none') return;
        const lines = this.getRowAttributes('rowlines');
        let i = 0;
        for (const row of this.childNodes.slice(1)) {
            const line = lines[i++];
            if (line === 'none') continue;
            for (const cell of this.adaptor.childNodes(row.chtml) as N[]) {
                this.adaptor.setStyle(cell, 'borderTop', '.07em ' + line);
            }
        }
    }

    /**
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

    /**
     * Set the height of the row, and make sure that the baseline is in the right position for cells
     *   that are row aligned to baseline ot axis
     *
     * @param {CHTMLWrapper} row   The row to be set
     * @param {number} HD          The total height+depth for the row
     * @param {number] D           The new depth for the row
     * @param {number} space       The total spacing above and below the row
     */
    protected setRowHeight(row: CHTMLWrapper<N, T, D>, HD: number, D: number, space: number) {
        this.adaptor.setStyle(row.chtml, 'height', this.em(HD + space));
        const ralign = row.node.attributes.get('rowalign') as string;
        //
        //  Loop through the cells and set the strut height and depth.
        //    The strut is the last element in the cell.
        //
        for (const cell of row.childNodes) {
            if (this.setCellBaseline(cell, ralign, HD, D)) break;
        }
    }

    /**
     * Make sure the baseline is in the correct place for cells aligned on baseline or axis
     *
     * @param {CHTMLWrapper} cell  The cell to modify
     * @param {string} ralign      The alignment of the row
     * @param {number} HD          The total height+depth for the row
     * @param {number] D           The new depth for the row
     * @return {boolean}           True if no other cells in this row need to be processed
     */
    protected setCellBaseline(cell: CHTMLWrapper<N, T, D>, ralign: string, HD: number, D: number) {
        const calign = cell.node.attributes.get('rowalign');
        if (calign === 'baseline' || calign === 'axis') {
            const adaptor = this.adaptor;
            const child = adaptor.lastChild(cell.chtml) as N;
            adaptor.setStyle(child, 'height', this.em(HD));
            adaptor.setStyle(child, 'verticalAlign', this.em(-D));
            const row = cell.parent;
            if ((!row.node.isKind('mlabeledtr') || cell !== row.childNodes[0]) &&
                (ralign === 'baseline' || ralign === 'axis')) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add a frame to the mtable, if needed
     */
    protected handleFrame() {
        if (this.frame) {
            this.adaptor.setStyle(this.adaptor.firstChild(this.chtml) as N,
                                  'border', '.07em ' + this.node.attributes.get('frame'));
        }
    }

    /**
     * Handle percentage widths and fixed widths
     */
    protected handleWidth() {
        let w = this.node.attributes.get('width') as string;
        const hasLabels = (this.adaptor.childNodes(this.labels).length > 0);
        if (!(isPercent(w) || hasLabels)) {
            if (w === 'auto') return;
            w = this.em(this.length2em(w) + 2 * this.fLine);
        }
        const table = this.adaptor.firstChild(this.chtml) as N;
        this.adaptor.setStyle(table, 'minWidth', w);
    }

    /**
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

    /**
     * Mark the alignment of the table
     */
    protected handleJustify() {
        const [align, shift] = this.getAlignShift();
        if (align !== 'center') {
            this.adaptor.setAttribute(this.chtml, 'justify', align);
        }
    }

    /******************************************************************/

    /**
     * Handle addition of labels to the table
     */
    protected handleLabels() {
        const labels = this.labels;
        const attributes = this.node.attributes;
        const adaptor = this.adaptor;
        if (adaptor.childNodes(labels).length === 0) return;
        //
        //  Set the side for the labels
        //
        const side = attributes.get('side') as string;
        adaptor.setAttribute(this.chtml, 'side', side);
        adaptor.setAttribute(labels, 'align', side);
        adaptor.setStyle(labels, side, '0');
        //
        //  Make sure labels don't overlap table
        //
        const {L} = this.getTableData();
        const sep = this.length2em(attributes.get('minlabelspacing'));
        let pad = L + sep;
        const [lpad, rpad] = (this.styles == null ? ['', ''] :
                              [this.styles.get('padding-left'), this.styles.get('padding-right')]);
        if (lpad || rpad) {
            pad = Math.max(pad, this.length2em(lpad || '0'), this.length2em(rpad || '0'));
        }
        adaptor.setStyle(this.chtml, 'padding', '0 ' + this.em(pad));
        //
        //  Handle indentation
        //
        let [align, shift] = this.getAlignShift();
        if (align === side) {
            shift = (side === 'left' ? Math.max(pad, shift) - pad : Math.min(-pad, shift) + pad);
        }
        if (shift) {
            const table = adaptor.firstChild(this.chtml) as N;
            this.setIndent(table, align, shift);
        }
        //
        // Add the labels to the table
        //
        this.updateRowHeights();
        this.addLabelSpacing();
        adaptor.append(this.chtml, labels);
    }

    /**
     * Update any rows that are not naturally tall enough for the labels,
     *   and set the baseline for labels that are baseline aligned.
     */
    protected updateRowHeights() {
        if (this.node.attributes.get('equalrows') as boolean) return;
        let {H, D, NH, ND} = this.getTableData();
        const space = this.getRowHalfSpacing();
        for (let i = 0; i < this.numRows; i++) {
            const row = this.childNodes[i];
            if (H[i] !== NH[i] || D[i] !== ND[i]) {
                this.setRowHeight(row, H[i] + D[i], D[i], space[i] + space[i + 1]);
            } else if (row.node.isKind('mlabeledtr')) {
                this.setCellBaseline(row.childNodes[0], '', H[i] + D[i], D[i]);
            }
        }
    }

    /**
     * Add spacing elements between the label rows to align them with the rest of the table
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
        let h = this.fLine;
        let current = adaptor.firstChild(this.labels) as N;
        for (let i = 0; i < this.numRows; i++) {
            const row = this.childNodes[i];
            if (row.node.isKind('mlabeledtr')) {
                h && adaptor.insert(this.html('mjx-mtr', {style: {height: this.em(h)}}), current);
                adaptor.setStyle(current, 'height', this.em((equal ? HD : H[i] + D[i]) + space[i] + space[i + 1]));
                current = adaptor.next(current) as N;
                h = this.rLines[i];
            } else {
                h += space[i] + (equal ? HD : H[i] + D[i]) + space[i + 1] + this.rLines[i];
            }
        }
    }

}
