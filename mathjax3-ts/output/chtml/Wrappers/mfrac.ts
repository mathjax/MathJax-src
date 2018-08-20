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
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLmo} from './mo.js';
import {MmlMfrac} from '../../../core/MmlTree/MmlNodes/mfrac.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {StyleList} from '../../common/CssStyles.js';
import {OptionList} from '../../../util/Options.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CHTMLmfrac wrapper for the MmlMfrac object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmfrac<N, T, D> extends CHTMLWrapper<N, T, D> {
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
        'mjx-frac[delims]': {
            padding: '0 .1em'            // .1 (for line's -.1em margin)
        },
        'mjx-frac[atop]': {
            padding: '0 .12em'           // nulldelimiterspace
        },
        'mjx-frac[atop][delims]': {
            padding: '0'
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
            'text-align': 'right'
        },
        'mjx-den[align="left"], mjx-num[align="left"]': {
            'text-align': 'left'
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

    protected bevel: CHTMLmo<N, T, D> = null;

    /************************************************/

    /**
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        //
        //  create internal bevel mo element
        //
        if (this.node.attributes.get('bevelled')) {
            const {H} = this.getBevelData(this.isDisplay());
            const bevel = this.bevel = this.createMo('/');
            bevel.canStretch(DIRECTION.Vertical);
            bevel.getStretchedVariant([H], true);
        }
    }

    /**
     * @override
     */
    public toCHTML(parent: N) {
        this.standardCHTMLnode(parent);
        const {linethickness, bevelled} = this.node.attributes.getList('linethickness', 'bevelled');
        const display = this.isDisplay();
        if (bevelled) {
            this.makeBevelled(display);
        } else {
            const thickness = this.length2em(String(linethickness));
            if (thickness === 0) {
                this.makeAtop(display);
            } else {
                this.makeFraction(display, thickness);
            }
        }
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox) {
        bbox.empty();
        const {linethickness, bevelled} = this.node.attributes.getList('linethickness', 'bevelled');
        const display = this.isDisplay();
        if (bevelled) {
            this.getBevelledBBox(bbox, display);
        } else {
            const thickness = this.length2em(String(linethickness));
            if (thickness === 0) {
                this.getAtopBBox(bbox, display);
            } else {
                this.getFractionBBox(bbox, display, thickness);
            }
        }
        bbox.clean();
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     * @param {number} t         The rule line thickness
     */
    protected makeFraction(display: boolean, t: number) {
        const {numalign, denomalign} = this.node.attributes.getList('numalign', 'denomalign');
        const withDelims = this.node.getProperty('withDelims');
        //
        // Attributes to set for the different elements making up the fraction
        //
        const attr = (display ? {type: 'd'} : {}) as OptionList;
        const fattr = (withDelims ? {...attr, delims: 'true'} : {...attr}) as OptionList;
        const nattr = (numalign !== 'center' ? {align: numalign} : {}) as OptionList;
        const dattr = (denomalign !== 'center' ? {align: denomalign} : {}) as OptionList;
        const dsattr = {...attr}, nsattr = {...attr};
        //
        // Set the styles to handle the linethickness, if needed
        //
        const tex = this.font.params;
        if (t !== .06) {
            const a = tex.axis_height;
            const tEm = this.em(t);
            const {T, u, v} = this.getTUV(display, t);
            const m = (display ? this.em(3 * t) : tEm) + ' -.1em';
            attr.style = {height: tEm, 'border-top': tEm + ' solid', margin: m};
            const nh = this.em(Math.max(0, u));
            nsattr.style = {height: nh, 'vertical-align': '-' + nh};
            dsattr.style = {height: this.em(Math.max(0, v))};
            fattr.style  = {'vertical-align': this.em(a - T)};
        }
        //
        // Create the DOM tree
        //
        let num, den;
        this.adaptor.append(this.chtml, this.html('mjx-frac', fattr, [
            num = this.html('mjx-num', nattr, [this.html('mjx-nstrut', nsattr)]),
            this.html('mjx-dbox', {}, [
                this.html('mjx-dtable', {}, [
                    this.html('mjx-line', attr),
                    this.html('mjx-row', {}, [
                        den = this.html('mjx-den', dattr, [this.html('mjx-dstrut', dsattr)])
                    ])
                ])
            ])
        ]));
        this.childNodes[0].toCHTML(num);
        this.childNodes[1].toCHTML(den);
    }

    /**
     * @param {BBox} bbox        The buonding box to modify
     * @param {boolean} display  True for display-mode fractions
     * @param {number} t         The thickness of the line
     */
    protected getFractionBBox(bbox: BBox, display: boolean, t: number) {
        const nbox = this.childNodes[0].getBBox();
        const dbox = this.childNodes[1].getBBox();
        const tex = this.font.params;
        const pad = (this.node.getProperty('withDelims') as boolean ? 0 : tex.nulldelimiterspace);
        const a = tex.axis_height;
        const {T, u, v} = this.getTUV(display, t);
        bbox.combine(nbox, 0, a + T + Math.max(nbox.d * nbox.rscale, u));
        bbox.combine(dbox, 0, a - T - Math.max(dbox.h * dbox.rscale, v));
        bbox.w += 2 * pad + .2;
    }

    /**
     * @param {boolean} display  True for display-mode fractions
     * @param {number} t         The thickness of the line
     * @return {Object}          The expanded rule thickness (T), and baeline offsets
     *                             for numerator and denomunator (u and v)
     */
    protected getTUV(display: boolean, t: number) {
        const tex = this.font.params;
        const a = tex.axis_height;
        const T = (display ? 3.5 : 1.5) * t;
        return {T: (display ? 3.5 : 1.5) * t,
                u: (display ? tex.num1 : tex.num2) - a - T,
                v: (display ? tex.denom1 : tex.denom2) + a - T};
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     */
    protected makeAtop(display: boolean) {
        const {numalign, denomalign} = this.node.attributes.getList('numalign', 'denomalign');
        const withDelims = this.node.getProperty('withDelims');
        //
        // Attributes to set for the different elements making up the fraction
        //
        const attr = (display ? {type: 'd', atop: true} : {atop: true}) as OptionList;
        const fattr = (withDelims ? {...attr, delims: true} : {...attr}) as OptionList;
        const nattr = (numalign !== 'center' ? {align: numalign} : {}) as OptionList;
        const dattr = (denomalign !== 'center' ? {align: denomalign} : {}) as OptionList;
        //
        // Determine sparation and positioning
        //
        const {v, q} = this.getUVQ(display);
        nattr.style = {'padding-bottom': this.em(q)};
        fattr.style = {'vertical-align': this.em(-v)};
        //
        // Create the DOM tree
        //
        let num, den;
        this.adaptor.append(this.chtml, this.html('mjx-frac', fattr, [
            num = this.html('mjx-num', nattr),
            den = this.html('mjx-den', dattr)
        ]));
        this.childNodes[0].toCHTML(num);
        this.childNodes[1].toCHTML(den);
    }

    /**
     * @param {BBox} bbox        The bounding box to modify
     * @param {boolean} display  True for display-mode fractions
     */
    protected getAtopBBox(bbox: BBox, display: boolean) {
        const tex = this.font.params;
        const pad = (this.node.getProperty('withDelims') as boolean ? 0 : tex.nulldelimiterspace);
        const {u, v, nbox, dbox} = this.getUVQ(display);
        bbox.combine(nbox, 0, u);
        bbox.combine(dbox, 0, -v);
        bbox.w += 2 * pad;
    }

    /**
     * @param {boolean} display  True for diplay-mode fractions
     * @return {Object}
     *    The vertical offsets of the numerator (u), the denominator (v),
     *    the separation between the two, and the bboxes themselves.
     */
    protected getUVQ(display: boolean) {
        const nbox = this.childNodes[0].getBBox();
        const dbox = this.childNodes[1].getBBox();
        const tex = this.font.params;
        //
        //  Initial offsets (u, v)
        //  Minimum separation (p)
        //  Actual separation with initial positions (q)
        //
        let [u, v] = (display ? [tex.num1, tex.denom1] : [tex.num3, tex.denom2]);
        let p = (display ? 7 : 3) * tex.rule_thickness;
        let q = (u - nbox.d * nbox.scale) - (dbox.h * dbox.scale - v);
        //
        //  If actual separation is less than minimum, move them farther apart
        //
        if (q < p) {
            u += (p - q)/2;
            v += (p - q)/2;
            q = p;
        }
        return {u, v, q, nbox, dbox};
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     */
    protected makeBevelled(display: boolean) {
        const adaptor = this.adaptor;
        //
        //  Create HTML tree
        //
        this.childNodes[0].toCHTML(this.chtml);
        this.bevel.toCHTML(this.chtml);
        this.childNodes[1].toCHTML(this.chtml);
        //
        //  Place the parts
        //
        const {u, v, delta, nbox, dbox} = this.getBevelData(display);
        if (u) {
            const num = this.childNodes[0].chtml;
            adaptor.setStyle(num, 'verticalAlign', this.em(u / nbox.scale));
        }
        if (v) {
            const denom = this.childNodes[1].chtml;
            adaptor.setStyle(denom, 'verticalAlign', this.em(v / dbox.scale));
        }
        const dx = this.em(-delta / 2);
        adaptor.setStyle(this.bevel.chtml, 'marginLeft', dx);
        adaptor.setStyle(this.bevel.chtml, 'marginRight', dx);
    }

    /**
     * @param {BBox} bbox        The boundng box to modify
     * @param {boolean} display  True for display-mode fractions
     */
    protected getBevelledBBox(bbox: BBox, display: boolean) {
        const {u, v, delta, nbox, dbox} = this.getBevelData(display);
        const lbox = this.bevel.getBBox();
        bbox.combine(nbox, 0, u);
        bbox.combine(lbox, bbox.w - delta / 2, 0);
        bbox.combine(dbox, bbox.w - delta / 2, v);
    }

    /**
     * @param {boolean} display  True for display-style fractions
     * @return {Object}          The height (H) of the bevel, horizontal offest (delta)
     *                             vertical offsets (u and v) of the parts, and
     *                             bounding boxes of the parts.
     */
    protected getBevelData(display: boolean) {
        const nbox = this.childNodes[0].getBBox();
        const dbox = this.childNodes[1].getBBox();
        const delta = (display ? .4 : .15);
        const H = Math.max(nbox.scale * (nbox.h + nbox.d), dbox.scale * (dbox.h + dbox.d)) + 2 * delta;
        const a = this.font.params.axis_height;
        const u = nbox.scale * (nbox.d - nbox.h) / 2 + a + delta;
        const v = dbox.scale * (dbox.d - dbox.h) / 2 + a - delta;
        return {H, delta, u, v, nbox, dbox};
    }


    /************************************************/

    /**
     * @override
     */
    public canStretch(direction: DIRECTION) {
        return false;
    }

    /**
     * @return {boolean}   True if in display mode, false otherwise
     */
    protected isDisplay() {
        const {displaystyle, scriptlevel} = this.node.attributes.getList('displaystyle', 'scriptlevel');
        return displaystyle && scriptlevel === 0;
    }
}
