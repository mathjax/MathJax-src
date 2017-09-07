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
 * @fileoverview  Implements the CHTMLMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLmsqrt} from './msqrt.js';
import {CHTMLmo} from './mo.js';
import {BBox} from '../BBox.js';
import {MmlMroot} from '../../../core/MmlTree/MmlNodes/mroot.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/*
 *  The CHTMLMroot wrapper for the Mroot object (extends CHTMLmsqrt)
 */

export class CHTMLmroot extends CHTMLmsqrt {
    public static kind = MmlMroot.prototype.kind;

    /*
     * @override
     */
    get surd() {
        return 2;
    }

    /*
     * @override
     */
    get root(): number {
        return 1;
    }

    /*
     * @override
     */
    protected addRoot(ROOT: HTMLElement, root: CHTMLWrapper, sbox: BBox) {
        root.toCHTML(ROOT);
        const [x, h, dx, scale] = this.getRootDimens(sbox);
        const bbox = root.getBBox();
        ROOT.style.verticalAlign = this.em(h / scale);
        ROOT.style.width = this.em(x / scale);
        if (dx) (ROOT.firstChild as HTMLElement).style.paddingLeft = this.em(dx);
    }

    /*
     * @override
     */
    protected combineRootBBox(BBOX: BBox, sbox: BBox) {
        const bbox = this.childNodes[this.root].getBBox();
        const [x, h] = this.getRootDimens(sbox);
        BBOX.combine(bbox, 0, h);
    }

    /*
     * @override
     */
    protected getRootDimens(sbox: BBox) {
        const surd = this.childNodes[this.surd] as CHTMLmo;
        const offset = (surd.size < -1 ? .5 : .6) * sbox.w;
        const bbox = this.childNodes[this.root].getBBox();
        const {w, rscale} = bbox;
        const W = Math.max(w, offset / rscale);
        const dx = Math.max(0, W - w);
        const h = this.rootHeight(bbox, sbox, offset);
        const x = W * rscale - offset;
        return [x, h, dx, rscale];
    }

    /*
     * @param{BBox} bbox      The bbox of the root
     * @param{BBox} sbox      The bbox of the surd
     * @param{number} offset  The computed offset for the root within the surd
     * @return{number}        The height of the root within the surd
     */
    protected rootHeight(bbox: BBox, sbox: BBox, offset: number) {
        return .45 * (sbox.h + sbox.d - .9) + offset + Math.max(0, bbox.d - .075);
    }

}
