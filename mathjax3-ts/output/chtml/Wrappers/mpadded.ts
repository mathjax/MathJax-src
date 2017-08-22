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
 * @fileoverview  Implements the CHTMLmpadded wrapper for the MmlMpadded object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, StringMap} from '../Wrapper.js';
import {BBox} from '../BBox.js';
import {MmlMpadded} from '../../../core/MmlTree/MmlNodes/mpadded.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {Property} from '../../../core/Tree/Node.js';

/*
 * Needed in order to access BBox properties by variable
 */
interface iBBox extends BBox {
    [name: string]: number | string | Function;
}

/*****************************************************************/
/*
 *  The CHTMLmpadded wrapper for the MmlMpadded object
 */

export class CHTMLmpadded extends CHTMLWrapper {
    public static kind = MmlMpadded.prototype.kind;

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        let chtml = this.standardCHTMLnode(parent);
        const content: HTMLElement[] = [];
        const style: StringMap = {};
        const [H, D, W, dh, dd, dw, x, y] = this.getDimens();
        //
        // If the width changed, set the width explicitly
        //
        if (dw) {
            style.width = this.em(W + dw);
        }
        //
        // If the height or depth changed, use margin to make the change
        //
        if (dh || dd) {
            style.margin = this.em(dh) + ' 0 ' + this.em(dd);
        }
        //
        // If there is a horizotnal or vertical shift,
        //   use relative poisitioning to move the contents
        //
        if (x || y) {
            style.position = 'relative';
            content.push(this.html('mjx-rbox', {style: {left: this.em(x), top: this.em(-y)}}));
        }
        //
        //  Create the HTML with the proper styles and content
        //
        chtml = chtml.appendChild(this.html('mjx-block', {style: style}, content));
        for (const child of this.childNodes) {
            child.toCHTML(chtml.firstChild as HTMLElement || chtml);
        }
    }

    /*
     * Get the content bounding box, and the change in size and offsets
     *   as specified by the parameters
     *
     * @return{number[]}  The original height, depth, width, the changes in height, depth,
     *                    and width, and the horizontal and vertical offsets of the content
     */
    getDimens() {
        const values = this.node.attributes.getList('width', 'height', 'depth', 'lspace', 'voffset');
        const bbox = (this.childNodes.length ? this.childNodes[0].getBBox() : BBox.zero());
        let {w, h, d} = bbox;
        let W = w, H = h, D = d, x = 0, y = 0;
        if (values.width !== '')   w = this.dimen(values.width, bbox, 'w', 0);
        if (values.height !== '')  h = this.dimen(values.height, bbox, 'h', 0);
        if (values.depth !== '')   d = this.dimen(values.depth, bbox, 'd', 0);
        if (values.voffset !== '') y = this.dimen(values.voffset, bbox);
        if (values.lspace !== '')  x = this.dimen(values.lspace, bbox);
        return [H, D, W, h - H, d - D, w - W, x, y];
    }

    /*
     * Get a particular dimension, which can be relative to any of the BBox dimensions,
     *   and can be an offset from the default size of the given dimension.
     *
     * @param{Property} length   The value to be converted to a length in ems
     * @param{BBox} bbox         The bbox of the mpadded content
     * @param{string} d          The default dimension to use for relative sizes ('w', 'h', or 'd')
     * @param{number} m          The minimum value allowed for the dimension
     * @return{number}           The final dimension in ems
     */
    dimen(length: Property, bbox: BBox, d: string = '', m: number = null) {
        length = String(length);
        const match = length.match(/width|height|depth/);
        const size = (match ? (bbox as iBBox)[match[0].charAt(0)] : (d ? (bbox as iBBox)[d]: 0)) as number;
        let dimen = (this.length2em(length, size) || 0);
        if (length.match(/^[-+]/) && d) {
            dimen += size;
        }
        if (m != null) {
            dimen = Math.max(m, dimen);
        }
        return dimen;
    }

    /*
     * @override
     */
    public computeBBox() {
        const [H, D, W, dh, dd, dw, x, y] = this.getDimens();
        const bbox = this.bbox;
        bbox.w = W + dw;
        bbox.h = H + dh;
        bbox.d = D + dd;
        return bbox;
    }

}
