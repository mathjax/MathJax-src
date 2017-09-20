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
 * @fileoverview  Implements the CHTMLmsubsup wrapper for the MmlMsubsup object
 *                and the special cases CHTMLmsub and CHTMLmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLscriptbase} from './scriptbase.js';
import {MmlMsubsup, MmlMsub, MmlMsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {StyleList} from '../CssStyles.js';

/*****************************************************************/
/*
 *  The CHTMLmsub wrapper for the MmlMsub object
 */

export class CHTMLmsub extends CHTMLscriptbase {
    public static kind = MmlMsub.prototype.kind;

    /*
     * @override
     */
    public get script() {
        return this.childNodes[(this.node as MmlMsub).sub];
    }

    /*
     * Get the shift for the subscript
     *
     * @override
     */
    protected getOffset(bbox: BBox, sbox: BBox) {
        return -this.getV(bbox, sbox);
    }

}

/*****************************************************************/
/*
 *  The CHTMLmsup wrapper for the MmlMsup object
 */

export class CHTMLmsup extends CHTMLscriptbase {
    public static kind = MmlMsup.prototype.kind;

    /*
     * @override
     */
    public get script() {
        return this.childNodes[(this.node as MmlMsup).sup];
    }

    /*
     * Get the shift for the superscript
     *
     * @override
     */
    public getOffset(bbox: BBox, sbox: BBox) {
        return this.getU(bbox, sbox);
    }

}

/*****************************************************************/
/*
 *  The CHTMLmsubsup wrapper for the MmlMsubsup object
 */

export class CHTMLmsubsup extends CHTMLscriptbase {
    public static kind = MmlMsubsup.prototype.kind;

    public static styles: StyleList = {
        'mjx-script': {
            display: 'inline-block',
            'padding-right': '.05em'   // scriptspace
        },
        'mjx-script > *': {
            display: 'block'
        }
    };

    /*
     *  Cached values for the script offsets and separation (so if they are
     *  computed in computeBBox(), they don't have to be recomputed for toCHTML())
     */
    protected UVQ: number[] = null;

    /*
     * @return{CHTMLWrapper}  The wrapper for the subscript
     */
    public get sub() {
        return this.childNodes[(this.node as MmlMsubsup).sub];
    }

    /*
     * @return{CHTMLWrapper}  The wrapper for the superscript
     */
    public get sup() {
        return this.childNodes[(this.node as MmlMsubsup).sup];
    }

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        this.chtml = this.standardCHTMLnode(parent);
        const [u, v, q] = this.getUVQ(this.base.getBBox(), this.sub.getBBox(), this.sup.getBBox());
        const style = {'vertical-align': this.em(v)};
        this.base.toCHTML(this.chtml);
        const stack = this.chtml.appendChild(this.html('mjx-script', {style}));
        this.sup.toCHTML(stack);
        stack.appendChild(this.html('mjx-spacer', {style: {'margin-top': this.em(q)}}));
        this.sub.toCHTML(stack);
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        const basebox = this.base.getBBox();
        const subbox  = this.sub.getBBox();
        const supbox  = this.sup.getBBox();
        bbox.empty();
        bbox.append(basebox);
        const w = bbox.w;
        const [u, v, q] = this.getUVQ(basebox, subbox, supbox);
        bbox.combine(subbox, w, v);
        bbox.combine(supbox, w, u);
        bbox.w += this.font.params.scriptspace;
        bbox.clean();
    }

    /*
     * Get the shift for the scripts and their separation (TeXBook Appendix G 18adef)
     *
     * @param{BBox} basebox    The bounding box of the base
     * @param{BBox} subbox     The bounding box of the superscript
     * @param{BBox} supbox     The bounding box of the subscript
     * @return{number[]}       The vertical offsets for super and subscripts, and the space between them
     */
    protected getUVQ(basebox: BBox, subbox: BBox, supbox: BBox) {
        if (this.UVQ) return this.UVQ;
        const tex = this.font.params;
        const t = 3 * tex.rule_thickness;
        let [u, v] = (this.isCharBase() ? [0, 0] : [this.getU(basebox, supbox),
                       Math.max(basebox.d + tex.sub_drop * subbox.rscale, tex.sub2)]);
        let q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
        if (q < t) {
            v += t - q;
            const p = (4/5) * tex.x_height - (u - supbox.d * supbox.rscale);
            if (p > 0) {
                u += p;
                v -= p;
            }
        }
        u = Math.max(this.length2em(this.node.attributes.get('superscriptshift'), u), u);
        v = Math.max(this.length2em(this.node.attributes.get('subscriptshift'), v), v);
        q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
        this.UVQ = [u, -v, q];
        return this.UVQ;
    }

}
