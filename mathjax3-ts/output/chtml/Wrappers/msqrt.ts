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
 * @fileoverview  Implements the CHTMLMsqrt wrapper for the MmlMsqrt object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLmo} from './mo.js';
import {BBox} from '../BBox.js';
import {MmlMsqrt} from '../../../core/MmlTree/MmlNodes/msqrt.js';
import {MmlNode, AbstractMmlNode, TextNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../CssStyles.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/*
 *  The CHTMLMsqrt wrapper for the Msqrt object
 */

export class CHTMLmsqrt extends CHTMLWrapper {
    public static kind = MmlMsqrt.prototype.kind;

    public static styles: StyleList = {
        'mjx-root': {
            display: 'inline-block'
        },
        'mjx-surd': {
            display: 'inline-block',
            'vertical-align': 'top'
        }
    };

    /*
     * @return{number}  The index of the base of the root in childNodes
     */
    get base() {
        return 0;
    }

    /*
     * @return{number}  The index of the surd in childNodes
     */
    get surd() {
        return 1;
    }

    /*
     * @return{number}  The index of the root in childNodes (or null if none)
     */
    get root(): number {
        return null;
    }

    /*
     * The requested height of the stretched surd character
     */
    protected surdH: number;

    /*
     * Add the surd character so we can display it later
     *
     * @override
     */
    constructor(factory: CHTMLWrapperFactory, node: MmlNode, parent: CHTMLWrapper = null) {
        super(factory, node, parent);
        const surd = this.createMo('\u221A');
        surd.canStretch(DIRECTION.Vertical);
        const {h, d} = this.childNodes[this.base].getBBox();
        const t = this.font.params.rule_thickness;
        const p = (this.node.attributes.get('displaystyle') ? this.font.params.x_height : t);
        this.surdH = h + d + 2 * t + p / 4;
        surd.getStretchedVariant([this.surdH, 0]);
    }

    /*
     * Create an mo wrapper with the given text;
     *
     * @param{string} text  The text for the wrapped element
     * @return{CHTMLWrapper}  The wrapped MmlMo node
     */
    protected createMo(text: string) {
        const node = this.wrap(this.mmlNode('mo', {stretchy: true}, [this.mmlText(text)])) as CHTMLmo;
        node.parent = this;
        this.childNodes.push(node);
        return node;
    }

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        const surd = this.childNodes[this.surd];
        const base = this.childNodes[this.base];
        //
        //  Get the parameters for the spacing of the parts
        //
        const sbox = surd.getBBox();
        const bbox = base.getBBox();
        const [p, q] = this.getPQ(sbox);
        const [x] = this.getRootDimens(sbox);
        const t = this.font.params.rule_thickness;
        const T = this.font.params.surd_height;
        //
        //  Create the HTML structure for the root
        //
        const CHTML = this.standardCHTMLnode(parent);
        let SURD, BASE, ROOT, root;
        if (this.root != null) {
            ROOT = CHTML.appendChild(this.html('mjx-root'));
            root = this.childNodes[this.root];
        }
        const SQRT = CHTML.appendChild(this.html('mjx-box', {
            style: {paddingTop: this.px(2 * t - T, 1)}
        }, [
            SURD = this.html('mjx-surd'),
            BASE = this.html('mjx-box', {style: {
                paddingTop: this.px(q, 1),
                borderTop: this.px(T * bbox.scale, 1) + ' solid'
            }})
        ]));
        //
        //  Add the child content
        //
        this.addRoot(ROOT, root, sbox);
        surd.toCHTML(SURD);
        base.toCHTML(BASE);
    }

    /*
     * Add root HTML (overridden in mroot)
     *
     * @param{HTMLElement} ROOT   The container for the root
     * @param{CHTMLWrapper} root  The wrapped MML root content
     * @param{BBox} sbox          The bounding box of the surd
     */
    protected addRoot(ROOT: HTMLElement, root: CHTMLWrapper, sbox: BBox) {
    }

    /*
     * @override
     */
    public computeBBox() {
        const box = BBox.empty();
        const sbox = this.childNodes[this.surd].getBBox();
        const bbox = new BBox(this.childNodes[this.base].getBBox());
        const [p, q] = this.getPQ(sbox);
        const [x] = this.getRootDimens(sbox);
        const t = this.font.params.rule_thickness;
        const H = bbox.h + q + t;
        bbox.h += q + 2 * t;  // FIXME:  should take into account minimums for this.px() used above
        this.combineRootBBox(box, sbox);
        box.combine(sbox, x, H - sbox.h);
        box.combine(bbox, x + sbox.w, 0);
        box.clean();
        return box;
    }

    /*
     * Combine the bounding box of the root (overridden in mroot)
     *
     * @param{BBox} box   The bounding box so far
     * @param{BBox} sbox  The bounding box of the surd
     */
    protected combineRootBBox(box: BBox, sbox: BBox) {
    }

    /*
     * @param{BBox} sbox   The bounding box for the surd character
     * @return{number[]}  The p, q, and x values for the TeX layout computations
     */
    protected getPQ(sbox: BBox) {
        const t = this.font.params.rule_thickness;
        const p = (this.node.attributes.get('displaystyle') ? this.font.params.x_height : t);
        const q = (sbox.h + sbox.d > this.surdH ? ((sbox.h + sbox.d) - (this.surdH - t)) / 2 : t + p / 4);
        return [p, q];
    }

    /*
     * @param{BBox} sbox  The bounding box of the surd
     * @return{number[]}  The x offset of the surd, and the height, x offset, and scale of the root
     */
    protected getRootDimens(sbox: BBox) {
        return [0, 0, 0, 0];
    }

}
