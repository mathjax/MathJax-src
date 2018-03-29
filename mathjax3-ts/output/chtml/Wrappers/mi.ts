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
 * @fileoverview  Implements the CHTMLmi wrapper for the MmlMi object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {MmlMi} from '../../../core/MmlTree/MmlNodes/mi.js';
import {BBox} from '../BBox.js';

/*****************************************************************/
/*
 *  The CHTMLmi wrapper for the MmlMi object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmi<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMi.prototype.kind;

    /*
     * True if no italic correction should be used
     */
    public noIC: boolean = false;

    /*
     * @override
     */
    public toCHTML(parent: N) {
        super.toCHTML(parent);
        if (this.noIC) {
            this.adaptor.setAttribute(this.chtml, 'noIC', 'true');
        }
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        super.computeBBox(bbox);
        const child = this.childNodes[this.childNodes.length - 1];
        if (child && child.bbox.ic) {
            bbox.ic = child.bbox.ic;
            bbox.w += bbox.ic;
        }
    }

}
