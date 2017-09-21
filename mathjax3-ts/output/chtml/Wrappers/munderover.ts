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
 * @fileoverview  Implements the CHTMLmunderover wrapper for the MmlMunderover object
 *                and the special cases CHTMLmunder and CHTMLmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLmsubsup, CHTMLmsub, CHTMLmsup} from './msubsup.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {StyleList} from '../CssStyles.js';

/*****************************************************************/
/*
 *  The CHTMLmunder wrapper for the MmlMunder object
 */

export class CHTMLmunder extends CHTMLmsub {
    public static kind = MmlMunder.prototype.kind;

    public static styles: StyleList = {
        'mjx-munder:not([limits="false"])': {
            display: 'inline-table',
        },
        'mjx-munder > mjx-row': {
            'text-align': 'left'
        },
        'mjx-under': {
            'padding-bottom': '.1em'           // big_op_spacing5
        }
    };

    /*
     * @override
     */
    public get script() {
        return this.childNodes[(this.node as MmlMunder).under];
    }

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        if (this.hasMovableLimits()) {
            super.toCHTML(parent);
            this.chtml.setAttribute('limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        const base = this.chtml.appendChild(this.html('mjx-row')).appendChild(this.html('mjx-base'));
        const under = this.chtml.appendChild(this.html('mjx-row')).appendChild(this.html('mjx-under'));
        this.base.toCHTML(base);
        this.script.toCHTML(under);
        const basebox = this.base.getBBox();
        const underbox = this.script.getBBox();
        const [k, v] = this.getUnderKV(basebox, underbox);
        under.style.paddingTop = this.em(k);
        this.setDeltaW([base, under], this.getDeltaW([basebox, underbox]));
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        if (this.hasMovableLimits()) {
            super.computeBBox(bbox);
            return;
        }
        bbox.empty();
        const basebox = this.base.getBBox();
        const underbox = this.script.getBBox();
        const [k, v] = this.getUnderKV(basebox, underbox);
        const [bw, uw] = this.getDeltaW([basebox, underbox]);
        bbox.combine(basebox, bw, 0);
        bbox.combine(underbox, uw, v);
        bbox.d += this.font.params.big_op_spacing5;
        bbox.clean();
    }

}

/*****************************************************************/
/*
 *  The CHTMLmover wrapper for the MmlMover object
 */

export class CHTMLmover extends CHTMLmsup {
    public static kind = MmlMover.prototype.kind;

    public static styles: StyleList = {
        'mjx-mover:not([limits="false"])': {
            'padding-top': '.1em'        // big_op_spacing5
        },
        'mjx-mover:not([limits="false"]) > *': {
            display: 'block',
            'text-align': 'left'
        }
    };

    /*
     * @override
     */
    public get script() {
        return this.childNodes[(this.node as MmlMover).over];
    }

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        if (this.hasMovableLimits()) {
            super.toCHTML(parent);
            this.chtml.setAttribute('limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        const over = this.chtml.appendChild(this.html('mjx-over'));
        const base = this.chtml.appendChild(this.html('mjx-base'));
        this.script.toCHTML(over);
        this.base.toCHTML(base);
        const overbox = this.script.getBBox();
        const basebox = this.base.getBBox();
        const [k, u] = this.getOverKU(basebox, overbox);
        over.style.paddingBottom = this.em(k);
        this.setDeltaW([base, over], this.getDeltaW([basebox, overbox]));
        if (overbox.d < 0) {
            over.style.marginBottom = this.em(overbox.d * overbox.rscale);
        }
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        if (this.hasMovableLimits()) {
            super.computeBBox(bbox);
            return;
        }
        bbox.empty();
        const basebox = this.base.getBBox();
        const overbox = this.script.getBBox();
        const [k, u] = this.getOverKU(basebox, overbox);
        const [bw, ow] = this.getDeltaW([basebox, overbox]);
        bbox.combine(basebox, bw, 0);
        bbox.combine(overbox, ow, u);
        bbox.h += this.font.params.big_op_spacing5;
        bbox.clean();
    }

}

/*****************************************************************/
/*
 *  The CHTMLmunderover wrapper for the MmlMunderover object
 */

export class CHTMLmunderover extends CHTMLmsubsup {
    public static kind = MmlMunderover.prototype.kind;

    public static styles: StyleList = {
        'mjx-munderover:not([limits="false"])': {
            'padding-top': '.1em'        // big_op_spacing5
        },
        'mjx-munderover:not([limits="false"]) > *': {
            display: 'block'
        },
    };

    /*
     * @return{CHTMLWrapper)   The wrapped under node
     */
    public get under() {
        return this.childNodes[(this.node as MmlMunderover).under];
    }

    /*
     * @return{CHTMLWrapper)   The wrapped overder node
     */
    public get over() {
        return this.childNodes[(this.node as MmlMunderover).over];
    }

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get sub() {
        return this.under;
    }

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get sup() {
        return this.over;
    }

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        if (this.hasMovableLimits()) {
            super.toCHTML(parent);
            this.chtml.setAttribute('limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        const over = this.chtml.appendChild(this.html('mjx-over'));
        const table = this.chtml.appendChild(this.html('mjx-box')).appendChild(this.html('mjx-munder'));
        const base = table.appendChild(this.html('mjx-row')).appendChild(this.html('mjx-base'));
        const under = table.appendChild(this.html('mjx-row')).appendChild(this.html('mjx-under'));
        this.over.toCHTML(over);
        this.base.toCHTML(base);
        this.under.toCHTML(under);
        const overbox = this.over.getBBox();
        const basebox = this.base.getBBox();
        const underbox = this.under.getBBox();
        const [ok, u] = this.getOverKU(basebox, overbox);
        const [uk, v] = this.getUnderKV(basebox, underbox);
        over.style.paddingBottom = this.em(ok);
        under.style.paddingTop = this.em(uk);
        this.setDeltaW([base, under, over], this.getDeltaW([basebox, underbox, overbox]));
        if (overbox.d < 0) {
            over.style.marginBottom = this.em(overbox.d * overbox.rscale);
        }
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        if (this.hasMovableLimits()) {
            super.computeBBox(bbox);
            return;
        }
        bbox.empty();
        const overbox = this.over.getBBox();
        const basebox = this.base.getBBox();
        const underbox = this.under.getBBox();
        const [ok, u] = this.getOverKU(basebox, overbox);
        const [uk, v] = this.getUnderKV(basebox, underbox);
        const [bw, uw, ow] = this.getDeltaW([basebox, underbox, overbox]);
        bbox.combine(basebox, bw, 0);
        bbox.combine(overbox, ow, u);
        bbox.combine(underbox, uw, v);
        const z = this.font.params.big_op_spacing5;
        bbox.h += z;
        bbox.d += z;
        bbox.clean();
    }

}
