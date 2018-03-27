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
 * @fileoverview  Implements the CHTMLmtr wrapper for the MmlMtr object
 *                and CHTMLmlabeledtr for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {BBox} from '../BBox.js';
import {MmlMtr, MmlMlabeledtr} from '../../../core/MmlTree/MmlNodes/mtr.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../CssStyles.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/*
 * The CHTMLmtr wrapper for the MmlMtr object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmtr<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMtr.prototype.kind;

    public static styles: StyleList = {
        'mjx-mtr': {
            display: 'table-row',
        }
    };

    /*
     * @return{number}   The number of mtd's in the mtr
     */
    get numCells() {
        return this.childNodes.length;
    }

    /*
     * @return{number}   The index of the first table cell (overridden in mlabeledtr)
     */
    get firstCell() {
        return 0;
    }

    /*
     * @return{BBox[]}  An array of the bounding boxes for the mtd's in the row
     */
    public getChildBBoxes() {
        return this.childNodes.map(cell => cell.getBBox());
    }

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.stretchChildren();
    }

    /*
     * Handle vertical stretching of cells to match height of
     *  other cells in the row.
     */
    protected stretchChildren() {
        let stretchy: CHTMLWrapper<N, T, D>[] = [];
        let children = (this.firstCell ? this.childNodes.slice(this.firstCell) : this.childNodes);
        //
        //  Locate and count the stretchy children
        //
        for (const mtd of children) {
            const child = mtd.childNodes[0];
            if (child.canStretch(DIRECTION.Vertical)) {
                stretchy.push(child);
            }
        }
        let count = stretchy.length;
        let nodeCount = this.childNodes.length;
        if (count && nodeCount > 1) {
            let H = 0, D = 0;
            //
            //  If all the children are stretchy, find the largest one,
            //  otherwise, find the height and depth of the non-stretchy
            //  children.
            //
            let all = (count > 1 && count === nodeCount);
            for (const mtd of children) {
                const child = mtd.childNodes[0];
                const noStretch = (child.stretch.dir === DIRECTION.None);
                if (all || noStretch) {
                    const {h, d} = child.getBBox(noStretch);
                    if (h > H) {
                        H = h;
                    }
                    if (d > D) {
                        D = d;
                    }
                }
            }
            //
            //  Stretch the stretchable children
            //
            for (const child of stretchy) {
                child.coreMO().getStretchedVariant([H, D]);
            }
        }
    }

}

/*****************************************************************/
/*
 * The CHTMLlabeledmtr wrapper for the MmlMlabeledtr object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmlabeledtr<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMlabeledtr.prototype.kind;

    public static styles: StyleList = {
        'mjx-mlabeledtr': {
            display: 'table-row'
        }
    };

    /*
     * @override
     */
    public toCHTML(parent: N) {
        super.toCHTML(parent);
        //
        //  FIXME: for now, remove label
        //
        const child = this.adaptor.firstChild(this.chtml);
        if (child) {
            this.adaptor.remove(child);
        }
    }

    /*
     * @override
     */
    get numCells() {
        //
        //  Don't include the label mtd
        //
        return Math.max(0, this.childNodes.length - 1);
    }

    /*
     * @override
     */
    get firstCell() {
        return 1;
    }

    /*
     * @override
     */
    public getChildBBoxes() {
        //
        //  Don't include the label mtd
        //
        return this.childNodes.slice(1).map(cell => cell.getBBox());
    }

}
