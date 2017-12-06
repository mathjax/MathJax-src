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
import {StyleList} from '../CssStyles.js';

/*****************************************************************/
/*
 *  The CHTMLmtr wrapper for the MmlMtr object
 */

export class CHTMLmtr extends CHTMLWrapper {
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
     * @return{BBox[]}  An array of the bounding boxes for the mtd's in the row
     */
    public getChildBBoxes() {
        return this.childNodes.map(cell => cell.getBBox());
    }

}

/*****************************************************************/
/*
 *  The CHTMLlabeledmtr wrapper for the MmlMlabeledtr object
 */

export class CHTMLmlabeledtr extends CHTMLWrapper {
    public static kind = MmlMlabeledtr.prototype.kind;

    public static styles: StyleList = {
        'mjx-mlabeledtr': {
            display: 'table-row'
        }
    };

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        super.toCHTML(parent);
        //
        //  FIXME: for now, remove label
        //
        const row = this.chtml;
        if (row.firstChild) {
            row.removeChild(row.firstChild);
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
    public getChildBBoxes() {
        //
        //  Don't include the label mtd
        //
        return this.childNodes.slice(1).map(cell => cell.getBBox());
    }

}
