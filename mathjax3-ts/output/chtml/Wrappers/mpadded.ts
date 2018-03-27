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
import {StyleList} from '../CssStyles.js';

/*****************************************************************/
/*
 * The CHTMLmpadded wrapper for the MmlMpadded object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmpadded<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMpadded.prototype.kind;

    public static styles: StyleList = {
        'mjx-mpadded': {
            display: 'inline-block'
        },
        'mjx-rbox': {
            display: 'inline-block',
            position: 'relative'
        }
    };

    /*
     * @override
     */
    public toCHTML(parent: N) {
        let chtml = this.standardCHTMLnode(parent);
        const content: N[] = [];
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
        // If there is a horizontal or vertical shift,
        //   use relative positioning to move the contents
        //
        if (x || y) {
            style.position = 'relative';
            content.push(this.html('mjx-rbox', {style: {left: this.em(x), top: this.em(-y)}}));
        }
        //
        //  Create the HTML with the proper styles and content
        //
        chtml = this.adaptor.append(chtml, this.html('mjx-block', {style: style}, content)) as N;
        for (const child of this.childNodes) {
            child.toCHTML(content[0] || chtml);
        }
    }

    /*
     * Get the content bounding box, and the change in size and offsets
     *   as specified by the parameters
     *
     * @return{number[]}  The original height, depth, width, the changes in height, depth,
     *                    and width, and the horizontal and vertical offsets of the content
     */
    protected getDimens() {
        const values = this.node.attributes.getList('width', 'height', 'depth', 'lspace', 'voffset');
        const bbox = this.childNodes[0].getBBox();  // get unmodified bbox of children
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
    protected dimen(length: Property, bbox: BBox, d: string = '', m: number = null) {
        length = String(length);
        const match = length.match(/width|height|depth/);
        const size = (match ? bbox[match[0].charAt(0) as (keyof BBox)] : (d ? bbox[d as (keyof BBox)] : 0)) as number;
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
    public computeBBox(bbox: BBox) {
        const [H, D, W, dh, dd, dw, x, y] = this.getDimens();
        bbox.w = W + dw;
        bbox.h = H + dh;
        bbox.d = D + dd;
    }

}
