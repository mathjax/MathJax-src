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
 * The CHTMLmsub wrapper for the MmlMsub object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmsub<N, T, D> extends CHTMLscriptbase<N, T, D> {
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
        return [0, -this.getV(bbox, sbox)];
    }

}

/*****************************************************************/
/*
 * The CHTMLmsup wrapper for the MmlMsup object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmsup<N, T, D> extends CHTMLscriptbase<N, T, D> {
    public static kind = MmlMsup.prototype.kind;

    public static useIC: boolean = true;

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
        const x = (this.baseCore.bbox.ic ? .2 * this.baseCore.bbox.ic + .05 : 0);
        return [x, this.getU(bbox, sbox)];
    }

}

/*****************************************************************/
/*
 * The CHTMLmsubsup wrapper for the MmlMsubsup object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmsubsup<N, T, D> extends CHTMLscriptbase<N, T, D> {
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

    public static noIC: boolean = true;

    /*
     *  Cached values for the script offsets and separation (so if they are
     *  computed in computeBBox(), they don't have to be recomputed for toCHTML())
     */
    protected UVQ: number[] = null;

    /*
     * @return{CHTMLWrapper}  The wrapper for the subscript
     */
    public get subChild() {
        return this.childNodes[(this.node as MmlMsubsup).sub];
    }

    /*
     * @return{CHTMLWrapper}  The wrapper for the superscript
     */
    public get supChild() {
        return this.childNodes[(this.node as MmlMsubsup).sup];
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = this.standardCHTMLnode(parent);
        const [u, v, q] = this.getUVQ(this.baseChild.getBBox(), this.subChild.getBBox(), this.supChild.getBBox());
        const style = {'vertical-align': this.em(v)};
        this.baseChild.toCHTML(chtml);
        const stack = this.adaptor.append(chtml, this.html('mjx-script', {style})) as N;
        this.supChild.toCHTML(stack);
        this.adaptor.append(stack, this.html('mjx-spacer', {style: {'margin-top': this.em(q)}}));
        this.subChild.toCHTML(stack);
        const corebox = this.baseCore.bbox;
        if (corebox.ic) {
            this.adaptor.setStyle(this.supChild.chtml, 'marginLeft',
                                 this.em((1.2 * corebox.ic + .05) / this.supChild.bbox.rscale));
        }
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        const basebox = this.baseChild.getBBox();
        const subbox  = this.subChild.getBBox();
        const supbox  = this.supChild.getBBox();
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
        const subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub2);
        const drop = (this.isCharBase() ? 0 : basebox.d + tex.sub_drop * subbox.rscale);
        //
        // u and v are the veritcal shifts of the scripts, initially set to minimum values and then adjusted
        //
        let [u, v] = [this.getU(basebox, supbox), Math.max(drop, subscriptshift)];
        //
        // q is the space currently between the super- and subscripts.
        // If it is less than 3 rule thicknesses,
        //   increase the subscript offset to make the space 3 rule thicknesses
        //   If the bottom of the superscript is below 4/5 of the x-height
        //     raise both the super- and subscripts by the difference
        //     (make the bottom of the superscript be at 4/5 the x-height, and the
        //      subscript 3 rule thickness below that).
        //
        let q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
        if (q < t) {
            v += t - q;
            const p = (4/5) * tex.x_height - (u - supbox.d * supbox.rscale);
            if (p > 0) {
                u += p;
                v -= p;
            }
        }
        //
        // Make sure the shifts are at least the minimum amounts and
        // return the shifts and the space between the scripts
        //
        u = Math.max(this.length2em(this.node.attributes.get('superscriptshift'), u), u);
        v = Math.max(this.length2em(this.node.attributes.get('subscriptshift'), v), v);
        q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
        this.UVQ = [u, -v, q];
        return this.UVQ;
    }

}
