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
 * @fileoverview  Implements the a base class for CHTMLmsubsup and CHTMLmunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderoer needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLmo} from './mo.js';
import {MmlMsubsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {StyleData, StyleList} from '../CssStyles.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/*
 * A base class for msup/msub/msubsup and munder/mover/munderover
 * wrapper implementations
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLscriptbase<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = 'scriptbase';

    /*
     * Set to true for munderover/munder/mover/msup (Appendix G 13)
     */
    public static useIC: boolean = false;

    /*
     * The core mi or mo of the base (or the base itself if there isn't one)
     */
    protected baseCore: CHTMLWrapper<N, T, D>;

    /*
     * @return{CHTMLWrapper}  The base element's wrapper
     */
    public get baseChild() {
        return this.childNodes[(this.node as MmlMsubsup).base];
    }

    /*
     * @return{CHTMLWrapper}  The script element's wrapper (overridden in subclasses)
     */
    public get script() {
        return this.childNodes[1];
    }

    /*
     * @override
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        //
        //  Find the base core
        //
        let core = this.baseCore = this.childNodes[0];
        if (!core) return;
        while (core.childNodes.length === 1 && (core.node.isKind('mrow') || core.node.isKind('TeXAtom'))) {
            core = core.childNodes[0];
            if (!core) return;
        }
        if (!('noIC' in core)) return;
        this.baseCore = core;
        //
        //  Check if the base is a mi or mo that needs italic correction removed
        //
        if (!(this.constructor as typeof CHTMLscriptbase).useIC) {
            (core as CHTMLmo<N, T, D>).noIC = true;
        }
    }

    /*
     * This gives the common output for msub and msup.  It is overriden
     * for all the others (msubsup, munder, mover, munderover).
     *
     * @override
     */
    public toCHTML(parent: N) {
        this.chtml = this.standardCHTMLnode(parent);
        const [x, v] = this.getOffset(this.baseChild.getBBox(), this.script.getBBox());
        const style: StyleData = {'vertical-align': this.em(v)};
        if (x) {
            style['margin-left'] = this.em(x);
        }
        this.baseChild.toCHTML(this.chtml);
        this.script.toCHTML(this.adaptor.append(this.chtml, this.html('mjx-script', {style})) as N);
    }

    /*
     * This gives the common bbox for msub and msup.  It is overriden
     * for all the others (msubsup, munder, mover, munderover).
     *
     * @override
     */
    public computeBBox(bbox: BBox) {
        const basebox = this.baseChild.getBBox();
        const scriptbox = this.script.getBBox();
        const [x, y] = this.getOffset(basebox, scriptbox);
        bbox.append(basebox);
        bbox.combine(scriptbox, bbox.w + x, y);
        bbox.w += this.font.params.scriptspace;
        bbox.clean();
    }

    /*
     * @return{boolean}  True if the base is an mi, mn, or mo (not a largeop) consisting of a single character
     */
    protected isCharBase() {
        let base = this.baseChild;
        if ((base.node.isKind('mstyle') || base.node.isKind('mrow')) && base.childNodes.length === 1) {
            base = base.childNodes[0];
        }
        return ((base.node.isKind('mo') || base.node.isKind('mi') || base.node.isKind('mn')) &&
                base.bbox.rscale === 1 && base.getText().length === 1 &&
                !base.node.attributes.get('largeop'));
    }

    /***************************************************************************/
    /*
     *  Methods for sub-sup nodes
     */

    /*
     * Get the shift for the script (implemented in subclasses)
     *
     * @param{BBox} bbox   The bounding box of the base element
     * @param{BBox} sbox   The bounding box of the script element
     * @return{number[]}   The horizontal and vertical offsets for the script
     */
    protected getOffset(bbox: BBox, sbox: BBox) {
        return [0, 0];
    }

    /*
     * Get the shift for a subscript (TeXBook Appendix G 18ab)
     *
     * @param{BBox} bbox   The bounding box of the base element
     * @param{BBox} sbox   The bounding box of the superscript element
     * @return{number}     The vertical offset for the script
     */
    protected getV(bbox: BBox, sbox: BBox) {
        const tex = this.font.params;
        const subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub1);
        return Math.max(
            this.isCharBase() ? 0 : bbox.d + tex.sub_drop * sbox.rscale,
            subscriptshift,
            sbox.h * sbox.rscale - (4/5) * tex.x_height
        );
    }

    /*
     * Get the shift for a superscript (TeXBook Appendix G 18acd)
     *
     * @param{BBox} bbox   The bounding box of the base element
     * @param{BBox} sbox   The bounding box of the superscript element
     * @return{number}     The vertical offset for the script
     */
    protected getU(bbox: BBox, sbox: BBox) {
        const tex = this.font.params;
        const attr = this.node.attributes.getList('displaystyle', 'texprimestyle', 'superscriptshift');
        const p = (attr.displaystyle ? tex.sup1 : attr.texprimestyle ? tex.sup3 : tex.sup2);
        const superscriptshift = this.length2em(attr.superscriptshift, p);
        return Math.max(
            this.isCharBase() ? 0 : bbox.h - tex.sup_drop * sbox.rscale,
            superscriptshift,
            sbox.d * sbox.rscale + (1/4) * tex.x_height
        );
    }

    /***************************************************************************/
    /*
     *  Methods for under-over nodes
     */

    /*
     * @return{boolean}  True if the base has movablelimits (needed by munderover)
     */
    protected hasMovableLimits() {
        const display = this.node.attributes.get('displaystyle');
        return (!display && (this.node.getProperty('movablelimits') ||
                             this.node.attributes.get('movablelimits') ||
                             this.baseChild.coreMO().node.attributes.get('movablelimits')));
    }

    /*
     * Get the separation and offset for overscripts (TeXBoox Appendix G 13, 13a)
     *
     * @param{BBox} basebox  The bounding box of the base
     * @param{BBox} overbox  The bounding box of the overscript
     * @return{numner[]}     The separation between their boxes, and the offset of the overscript
     */
    protected getOverKU(basebox: BBox, overbox: BBox) {
        const tex = this.font.params;
        const d = overbox.d * overbox.rscale;
        const k = Math.max(tex.big_op_spacing1, tex.big_op_spacing3 - Math.max(0, d));
        return [k, basebox.h + k + d];
    }

    /*
     * Get the separation and offset for underscripts (TeXBoox Appendix G 13, 13a)
     *
     * @param{BBox} basebox   The bounding box of the base
     * @param{BBox} underbox  The bounding box of the underscript
     * @return{numner[]}      The separation between their boxes, and the offset of the underscript
     */
    protected getUnderKV(basebox: BBox, underbox: BBox) {
        const tex = this.font.params;
        const h = underbox.h * underbox.rscale;
        const k = Math.max(tex.big_op_spacing2, tex.big_op_spacing4 - h);
        return [k, -(basebox.d + k + h)];
    }

    /*
     * @param{BBox[]} boxes  The bounding boxes whose offsets are to be computed
     * @param{number[]}      The initial x offsets of the boxes
     * @return{number[]}     The actual offsets needed to center the boxes in the stack
     */
    protected getDeltaW(boxes: BBox[], delta: number[] = [0, 0, 0]) {
        const widths = boxes.map(box => box.w * box.rscale);
        const w = Math.max(...widths);
        const dw = [];
        let m = 0;
        for (const i of widths.keys()) {
            dw[i] = (w - widths[i]) / 2 + delta[i];
            if (dw[i] < m) {
                m = -dw[i];
            }
        }
        if (m) {
            for (const i of dw.keys()) {
                dw[i] += m;
            }
        }
        return dw;
    }

    /*
     * @param{N[]} nodes    The HTML elements to be centered in a stack
     * @param{number[]} dx  The x offsets needed to center the elements
     */
    protected setDeltaW(nodes: N[], dx: number[]) {
        for (let i = 0; i < dx.length; i++) {
            if (dx[i]) {
                this.adaptor.setStyle(nodes[i], 'paddingLeft', this.em(dx[i]));
            }
        }
    }

    /*
     * Handle horizontal stretching of children to match greatest width
     *  of all children
     */
    protected stretchChildren() {
        let stretchy: CHTMLWrapper<N, T, D>[] = [];
        //
        //  Locate and count the stretchy children
        //
        for (const child of this.childNodes) {
            if (child.canStretch(DIRECTION.Horizontal)) {
                stretchy.push(child);
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
            for (const child of this.childNodes) {
                const noStretch = (child.stretch.dir === DIRECTION.None);
                if (all || noStretch) {
                    const {w} = child.getBBox(noStretch);
                    if (w > W) W = w;
                }
            }
            //
            //  Stretch the stretchable children
            //
            for (const child of stretchy) {
                child.coreMO().getStretchedVariant([W / child.bbox.rscale]);
            }
        }
    }
}
