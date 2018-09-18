/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview  Implements the SVGmtable wrapper for the MmlMtable object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {CommonMtable, CommonMtableMixin} from '../../common/Wrappers/mtable.js';
import {SVGmtr} from './mtr.js';
import {SVGmtd} from './mtd.js';
import {MmlMtable} from '../../../core/MmlTree/MmlNodes/mtable.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {isPercent} from '../../../util/string.js';
import {OptionList} from '../../../util/Options.js';
import {StyleList} from '../../common/CssStyles.js';


const WFUZZ = .25;  // a little padding for min-width

/*****************************************************************/
/**
 * The SVGmtable wrapper for the MmlMtable object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGmtable<N, T, D> extends
CommonMtableMixin<SVGmtd<N, T, D>, SVGmtr<N, T, D>, SVGConstructor<N, T, D>>(SVGWrapper) {

    public static kind = MmlMtable.prototype.kind;

    public static styles: StyleList = {
        'g[data-mml-node="mtable"] rect[data-line]': {
            'outline-style': 'solid',
            'outline-width': '70px',
            'outline-offset': '-70px',
            fill: 'none'
        },
        'g[data-mml-node="mtable"] rect[data-frame]': {
            'outline-style': 'solid',
            'outline-width': '70px',
            'outline-offset': '-70px',
            fill: 'none'
        }
    }

    /**
     * The column for labels
     */
    public labels: N;

    /******************************************************************/

    /**
     * @override
     */
    constructor(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent: SVGWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.labels = this.svg('g', {transform: 'matrix(1 0 0 -1 0 0)'});
    }

    /**
     * @override
     */
    public toSVG(parent: N) {
        const svg = this.standardSVGnode(parent);
        this.placeRows(svg);
        this.handleColumnLines(svg);
        this.handleRowLines(svg);
        this.handleFrame(svg);
        this.handleLabels(svg, parent);
    }

    /**
     * @param {N} svg  The container in which to place the rows
     */
    protected placeRows(svg: N) {
        const equal = this.node.attributes.get('equalrows') as boolean;
        const {H, D} = this.getTableData();
        const HD = this.getEqualRowHeight();
        const rSpace = this.getRowHalfSpacing();
        const rLines = [this.fLine, ...this.rLines, this.fLine];
        let y = this.getBBox().h - rLines[0];
        for (let i = 0; i < this.numRows; i++) {
            const row = this.childNodes[i];
            [row.H, row.D] = this.getRowHD(equal, HD, H[i], D[i]);
            [row.tSpace, row.bSpace] = [rSpace[i], rSpace[i+1]];
            [row.tLine, row.bLine] = [rLines[i], rLines[i+1]];
            row.toSVG(svg);
            row.place(0, y - rSpace[i] - row.H);
            y -= rSpace[i] + row.H + row.D + rSpace[i+1] + rLines[i+1];
        }
    }

    /**
     * @param {boolean} equal   True for equal-height rows
     * @param {number} HD       The height of equal-height rows
     * @param {number} H        The natural height of the row
     * @param {number} D        The natural depth of the row
     * @return {number[]}       The (possibly scaled) height and depth to use
     */
    protected getRowHD(equal: boolean, HD: number, H: number, D: number) {
        return (equal ? [(HD + H - D) / 2, (HD - H + D) / 2] : [H, D]);
    }

    /******************************************************************/

    /**
     * Add vertical lines between columns
     *
     * @param {N} svg   The container for the table
     */
    protected handleColumnLines(svg: N) {
        if (this.node.attributes.get('columnlines') === 'none') return;
        const lines = this.getColumnAttributes('columnlines');
        if (!lines) return;
        const cSpace = this.getColumnHalfSpacing();
        const cLines = this.cLines;
        const cWidth = this.getComputedWidths();
        let x = this.fLine;
        for (let i = 0; i < lines.length; i++) {
            x += cSpace[i] + cWidth[i] + cSpace[i+1];
            this.adaptor.append(svg, this.makeVLine(x, lines[i]));
            x += cLines[i];
        }
    }

    /**
     * Add horizontal lines between rows
     *
     * @param {N} svg   The container for the table
     */
    protected handleRowLines(svg: N) {
        if (this.node.attributes.get('rowlines') === 'none') return;
        const lines = this.getRowAttributes('rowlines');
        if (!lines) return;
        const equal = this.node.attributes.get('equalrows') as boolean;
        const {H, D} = this.getTableData();
        const HD = this.getEqualRowHeight();
        const rSpace = this.getRowHalfSpacing();
        const rLines = this.rLines;
        let y = this.getBBox().h - this.fLine;
        for (let i = 0; i < lines.length; i++) {
            const [rH, rD] = this.getRowHD(equal, HD, H[i], D[i]);
            y -= rSpace[i] + rH + rD + rSpace[i+1]
            this.adaptor.append(svg, this.makeHLine(y, lines[i]));
            y -= rLines[i];
        }

    }

    /**
     * Add a frame to the mtable, if needed
     *
     * @param {N} svg   The container for the table
     */
    protected handleFrame(svg: N) {
        if (this.frame) {
            const {h, d, w} = this.getBBox();
            const style = this.node.attributes.get('frame') as string;
            this.adaptor.append(svg, this.makeFrame(w, h, d, style));
        }
    }

    /******************************************************************/

    /**
     * @param {number} w       The width of the frame
     * @param {number} h       The height of the frame
     * @param {number} d       The depth of the frame
     * @param {string} style   The border style for the frame
     * @return {N}             The SVG element for the frame
     */
    protected makeFrame(w: number, h: number, d: number, style: string) {
        const properties: OptionList = {
            'data-frame': true,
            width: this.fixed(w), height: this.fixed(h+d), y: this.fixed(-d)
        }
        if (style !== 'solid') {
            properties.style = {'outline-style': style};
        }
        return this.svg('rect', properties);
    }

    /**
     * @param {number} x       The x location of the line
     * @param {string} style   The border style for the line
     * @return {N}             The SVG element for the line
     */
    protected makeVLine(x: number, style: string) {
        const {h, d} = this.getBBox();
        const p = (style === 'dashed' || style === 'dotted' || style === 'solid' ? 0 : .07);
        const properties: OptionList = {
            width: this.fixed(.07 + 2 * p), height: this.fixed(h + d + 2 * p),
            x: this.fixed(x), y: this.fixed(-d - p), 'data-line': 'v'
        };
        if (style !== 'solid') {
            properties.style = {'outline-style': style};
        }
        if (p) {
            properties['clip-path'] = 'inset(70 130 70 0)';
        }
        return this.svg('rect', properties);
    }

    /**
     * @param {number} y       The y location of the line
     * @param {string} style   The border style for the line
     * @return {N}             The SVG element for the line
     */
    protected makeHLine(y: number, style: string) {
        const w = this.getBBox().w;
        const p = (style === 'dashed' || style === 'dotted' || style === 'solid' ? 0 : .07);
        const properties: OptionList = {
            width: this.fixed(w + 2 * p), height: this.fixed(.07 + 2 * p),
            y: this.fixed(y - .07), 'data-line': 'h'
        }
        if (style !== 'solid') {
            properties.style = {'outline-style': style};
        }
        if (p) {
            properties['clip-path'] = 'inset(0 70 130 70)';
            properties['x'] = this.fixed(-p);
        }
        return this.svg('rect', properties);
    }

    /******************************************************************/

    /**
     * Force percentage width to fixed width of current container width
     *
     * @override
     */
    public getColumnWidthsPercent(swidths: string[], width: string) {
        const W = this.length2em(width, this.metrics.containerWidth / this.metrics.em);
        return this.getColumnWidthsFixed(swidths, W);
    }

    /******************************************************************/


    /**
     * Handle addition of labels to the table
     *
     * @param {N} svg     The container for the table contents
     * @param {N} parent  The parent containing the the table
     */
    protected handleLabels(svg: N, parent: N) {
        const labels = this.labels;
        const attributes = this.node.attributes;
        const adaptor = this.adaptor;
        if (adaptor.childNodes(labels).length === 0) return;
        //
        //  Set the side for the labels
        //
        const side = attributes.get('side') as string;
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
        //
        //  Handle indentation
        //
        let [align, shift] = this.getAlignShift();
        if (align === side) {
            shift = (side === 'left' ? Math.max(pad, shift) - pad : Math.min(-pad, shift) + pad);
        }
        //
        // Add the labels to the table
        //
        this.placeLabels();
        this.nestTable(svg, labels, side, align, pad, shift);
    }

    /**
     * Add spacing elements between the label rows to align them with the rest of the table
     */
    protected placeLabels() {
        const adaptor = this.adaptor;
        const equal = this.node.attributes.get('equalrows') as boolean;
        const {h, d} = this.getBBox();
        const L = this.getTableData().L;
        const space = this.getRowHalfSpacing();
        //
        //  Start with frame size and add in spacing, height and depth,
        //    and line thickness for each non-labeled row.
        //
        let y = h - this.fLine;
        let current = adaptor.firstChild(this.labels) as N;
        for (let i = 0; i < this.numRows; i++) {
            const row = this.childNodes[i] as SVGmtr<N, T, D>;
            if (row.node.isKind('mlabeledtr')) {
                const cell = row.childNodes[0];
                y -= space[i] + row.H;
                row.placeCell(cell, {x: 0, y: y, w: L, lSpace: 0, rSpace: 0, lLine: 0, rLine: 0});
                y -= row.D + space[i + 1] + this.rLines[i];
                current = adaptor.next(current) as N;
            } else {
                y -= space[i] + row.H + row.D + space[i + 1] + this.rLines[i];
            }
        }
    }

    /**
     * @param {N} svg         The SVG container for the table
     * @param {N} labels      The group of labels
     * @param {string} side   The side alignment (left or right)
     * @param {string} align  The table alignment (left, center, right)
     * @param {number} pad    The padding for the label
     * @param {number} shift  The shift of the table
     */
    protected nestTable(svg: N, labels: N, side: string, align: string, pad: number, shift: number) {
        const adaptor = this.adaptor;
        const {h, d, w} = this.getBBox();
        const L = this.getTableData().L;
        const [x, dw] = (side === align  ? [side === 'left' ? -pad : 0, pad] : [0, 0]);
        const translate = (shift ? 'translate(' + this.fixed(shift) + ' 0)' : '');
        let table = this.svg('svg', {
            'data-table': true,
            preserveAspectRatio: (align === 'left' ? 'xMinYMid' : align === 'right' ? 'xMaxYMid' : 'xMidYMid'),
            viewBox: [this.fixed(x), this.fixed(-h), this.fixed(w + dw), this.fixed(h + d)].join(' ')
        }, [this.svg('g', {transform: 'matrix(1 0 0 -1 0 0)' + translate}, adaptor.childNodes(svg))]);
        labels = this.svg('svg', {
            'data-labels': true,
            preserveAspectRatio: (side === 'left' ? 'xMinYMid' : 'xMaxYMid'),
            viewBox: [0, this.fixed(-h), this.fixed(L), this.fixed(h + d)].join(' ')
        }, [labels]);
        this.jax.minwidth = w + pad + (align === 'center' ? pad : 0) + WFUZZ;
        adaptor.append(svg, table)
        adaptor.append(svg, labels);
    }

}
