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
        'mjx-frac': {
            display: 'inline-block',
            'vertical-align': '0.17em',  // axis_height - 1.5 * rule_thickness
            padding: '0 .22em'           // nulldelimiterspace + .1 (for line's -.1em margin)
        },
        'mjx-frac[type="d"]': {
            'vertical-align': '.04em'    // axis_height - 3.5 * rule_thickness
        },
        'mjx-frac[delims="true"]': {
            padding: '0 .1em'            // .1 (for line's -.1em margin)
        },
        'mjx-dtable': {
            display: 'inline-table',
            width: '100%'
        },
        'mjx-dtable > *': {
            'font-size': '2000%'
        },
        'mjx-dbox': {
            display: 'block',
            'font-size': '5%'
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

        'mjx-den[align="right"], mjx-num[align="right"]': {
            align: 'right'
        },
        'mjx-den[align="left"], mjx-num[align="left"]': {
            align: 'left'
        },

        'mjx-nstrut': {
            display: 'inline-block',
            height: '.054em',              // num2 - a - 1.5t
            width: 0,
            'vertical-align': '-.054em'    // ditto
        },
        'mjx-nstrut[type="d"]': {
            height: '.217em',              // num1 - a - 3.5t
            'vertical-align': '-.217em',   // ditto
        },
        'mjx-dstrut': {
            display: 'inline-block',
            height: '.505em',              // denom2 + a - 1.5t
            width: 0
        },
        'mjx-dstrut[type="d"]': {
            height: '.726em',              // denom1 + a - 3.5t
        },

        'mjx-line': {
            display: 'block',
            'box-sizing': 'border-box',
            'min-height': '1px',
            height: '.06em',               // t = rule_thickness
            'border-top': '.06em solid',   // t
            margin: '.06em -.1em',         // t
            overflow: 'hidden'
        },
        'mjx-line[type="d"]': {
            margin: '.18em -.1em'          // 3t
        }

    };

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        this.chtml = this.standardCHTMLnode(parent);
        const attr = this.node.attributes.getList('displaystyle', 'scriptlevel');
        const style = (attr.displaystyle && attr.scriptlevel === 0 ? {type: 'd'} : {});
        const fstyle = (this.node.getProperty('withDelims') ? {...style, delims: 'true'} : style);
        let num, den;
        this.chtml.appendChild(this.html('mjx-frac', fstyle, [
            num = this.html('mjx-num', {}, [this.html('mjx-nstrut', style)]),
            this.html('mjx-dbox', {}, [
                this.html('mjx-dtable', {}, [
                    this.html('mjx-line', style),
                    this.html('mjx-row', {}, [
                        den = this.html('mjx-den', {}, [this.html('mjx-dstrut', style)])
                    ])
                ])
            ])
        ]));
        this.childNodes[0].toCHTML(num);
        this.childNodes[1].toCHTML(den);
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        bbox.empty();
        const attr = this.node.attributes.getList('displaystyle', 'scriptlevel');
        const display = attr.displaystyle && attr.scriptlevel === 0;
        const nbox = this.childNodes[0].getBBox();
        const dbox = this.childNodes[1].getBBox();
        const pad = (this.node.getProperty('withDelims') as boolean ? 0 : this.font.params.nulldelimiterspace);
        const a = this.font.params.axis_height;
        const T = (display ? 3.5 : 1.5) * this.font.params.rule_thickness;;
        bbox.combine(nbox, 0, a + T + Math.max(nbox.d * nbox.rscale, display ? .217 : .054));
        bbox.combine(dbox, 0, a - T - Math.max(dbox.h * dbox.rscale, display ? .726 : .505));
        bbox.w += 2 * pad + .2;
        bbox.clean();
    }

    /*
     * @override
     */
    public canStretch(direction: DIRECTION) {
        return false;
    }
}
