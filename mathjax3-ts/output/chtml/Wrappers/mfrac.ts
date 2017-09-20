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
 * @fileoverview  Implements the CHTMLmfrac wrapper for the MmlMfrac object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {MmlMfrac} from '../../../core/MmlTree/MmlNodes/mfrac.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {StyleList} from '../CssStyles.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/*
 *  The CHTMLmfrac wrapper for the MmlMfrac object
 */

export class CHTMLmfrac extends CHTMLWrapper {
    public static kind = MmlMfrac.prototype.kind;

    public static styles: StyleList = {
        'mjx-strut': {
            display: 'inline-block',
            height: '1em',
            width: 0,
            'vertical-align': '-.25em'
        },
        'mjx-hstrut': {
            display: 'inline-block',
            height: '.75em',
            width: 0
        },
        'mjx-dstrut': {
            display: 'inline-block',
            height: '.25em',
            width: 0,
            'vertical-align': '-.25em'
        },

        'mjx-frac': {
            display: 'inline-block',
            'vertical-align': '0.145em',
            padding: '0 .1em'
        },
        'mjx-dtable': {
            display: 'inline-table',
            width: '100%'
        },
        'mjx-dtable > *': {
            'font-size': '2000%'
        },
        'mjx-row': {
            display: 'table-row'
        },
        'mjx-num': {
            display: 'block',
            'text-align': 'center'
        },
        'mjx-den': {
            display: 'block',
            'text-align': 'center'
        },
        'mjx-dbox': {
            display: 'block',
            'font-size': '5%'
        },

        'mjx-line': {
            display: 'block',
            'box-sizing': 'border-box',
            'min-height': '1px',
            height: '.06em',
            'border-top': '.06em solid',
            margin: '.06em -.1em',
            overflow: 'hidden'
        }
    };

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
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
    public computeBBox(bbox: BBox) {
        bbox.empty();
        const nbox = this.childNodes[0].getBBox();
        const dbox = this.childNodes[1].getBBox();
        const pad = (this.node.getProperty('withDelims') as boolean ? this.font.params.nulldelimiterspace : 0);
        const a = this.font.params.axis_height;
        const t = this.font.params.rule_thickness;
        bbox.combine(nbox, pad, a + 1.5 * t + Math.max(nbox.d, .25));
        bbox.combine(dbox, pad, a - 1.5 * t - Math.max(dbox.h, .75));
        bbox.w += pad + .2;
        bbox.clean();
    }

    /*
     * @override
     */
    public canStretch(direction: DIRECTION) {
        return false;
    }
}
