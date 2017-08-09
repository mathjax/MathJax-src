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
 * @fileoverview  Implements the CHTMLmfracr wrapper for the MmlMfrac object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {MmlMfrac} from '../../../core/MmlTree/MmlNodes/mfrac.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';

/*****************************************************************/
/*
 *  The CHTMLmfrac wrapper for the MmlMfrac object
 */

export class CHTMLmfrac extends CHTMLWrapper {
    public static kind = MmlMfrac.prototype.kind;

    /*
     * @override
     */
    public toCHTML(parent: Element, WHD: number[] = []) {
        let num, den;
        let chtml = this.html('mjx-frac', {}, [
            num = this.html('mjx-num', {}, [this.html('mjx-dstrut')]),
            this.html('mjx-dbox', {}, [
                this.html('mjx-dtable', {}, [
                    this.html('mjx-line'),
                    this.html('mjx-row', {}, [
                        den = this.html('mjx-den', {}, [this.html('mjx-hstrut')])
                    ])
                ])
            ])
        ]);
        this.chtml = parent.appendChild(chtml);
        this.handleScale();
        this.childNodes[0].toCHTML(num);
        this.childNodes[1].toCHTML(den);
    }

    /*
     * @override
     */
    public computeBBox() {
        const bbox = BBox.empty();
        const nbox = this.childNodes[0].getBBox();
        const dbox = this.childNodes[1].getBBox();
        const pad = (this.node.getProperty('withDelims') as boolean ? this.TeX.nulldelimiterspace : 0);
        const a = this.TeX.axis_height;
        const t = this.TeX.rule_thickness;
        bbox.combine(dbox, pad, a + 1.5 * t + nbox.d);
        bbox.combine(nbox, pad, a + 1.5 * t + dbox.h);
        bbox.w += pad;
        bbox.clean();
        return bbox;
    }
}
