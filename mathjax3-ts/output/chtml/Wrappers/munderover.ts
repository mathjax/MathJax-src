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
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLmsubsup, CHTMLmsub, CHTMLmsup} from './msubsup.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {StyleList} from '../CssStyles.js';

/*
 * Mutliply italic correction by this much (improve horizontal shift for italic characters)
 */
const DELTA = 1.1;

/*****************************************************************/
/*
 * The CHTMLmunder wrapper for the MmlMunder object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmunder<N, T, D> extends CHTMLmsub<N, T, D> {
    public static kind = MmlMunder.prototype.kind;

    public static useIC: boolean = true;

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
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.stretchChildren();
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        if (this.hasMovableLimits()) {
            super.toCHTML(parent);
            this.adaptor.setAttribute(this.chtml, 'limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        const base = this.adaptor.append(
            this.adaptor.append(this.chtml, this.html('mjx-row')) as N,
            this.html('mjx-base')
        ) as N;
        const under = this.adaptor.append(
            this.adaptor.append(this.chtml, this.html('mjx-row')) as N,
            this.html('mjx-under')
        ) as N;
        this.baseChild.toCHTML(base);
        this.script.toCHTML(under);
        const basebox = this.baseChild.getBBox();
        const underbox = this.script.getBBox();
        const [k, v] = this.getUnderKV(basebox, underbox);
        const del = DELTA * this.baseCore.bbox.ic / 2;
        this.adaptor.setStyle(under, 'paddingTop', this.em(k));
        this.setDeltaW([base, under], this.getDeltaW([basebox, underbox], [0, -del]));
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
        const basebox = this.baseChild.getBBox();
        const underbox = this.script.getBBox();
        const [k, v] = this.getUnderKV(basebox, underbox);
        const delta = DELTA * this.baseCore.bbox.ic / 2;
        const [bw, uw] = this.getDeltaW([basebox, underbox], [0, -delta]);
        bbox.combine(basebox, bw, 0);
        bbox.combine(underbox, uw, v);
        bbox.d += this.font.params.big_op_spacing5;
        bbox.clean();
    }

}

/*****************************************************************/
/*
 * The CHTMLmover wrapper for the MmlMover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmover<N, T, D> extends CHTMLmsup<N, T, D> {
    public static kind = MmlMover.prototype.kind;

    public static useIC: boolean = true;

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
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.stretchChildren();
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        if (this.hasMovableLimits()) {
            super.toCHTML(parent);
            this.adaptor.setAttribute(this.chtml, 'limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        const over = this.adaptor.append(this.chtml, this.html('mjx-over')) as N;
        const base = this.adaptor.append(this.chtml, this.html('mjx-base')) as N;
        this.script.toCHTML(over);
        this.baseChild.toCHTML(base);
        const overbox = this.script.getBBox();
        const basebox = this.baseChild.getBBox();
        const [k, u] = this.getOverKU(basebox, overbox);
        const delta = DELTA * this.baseCore.bbox.ic / 2;
        this.adaptor.setStyle(over, 'paddingBottom', this.em(k));
        this.setDeltaW([base, over], this.getDeltaW([basebox, overbox], [0, delta]));
        if (overbox.d < 0) {
            this.adaptor.setStyle(over, 'marginBottom', this.em(overbox.d * overbox.rscale));
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
        const basebox = this.baseChild.getBBox();
        const overbox = this.script.getBBox();
        const [k, u] = this.getOverKU(basebox, overbox);
        const delta = DELTA * this.baseCore.bbox.ic / 2;
        const [bw, ow] = this.getDeltaW([basebox, overbox], [0, delta]);
        bbox.combine(basebox, bw, 0);
        bbox.combine(overbox, ow, u);
        bbox.h += this.font.params.big_op_spacing5;
        bbox.clean();
    }

}

/*****************************************************************/
/*
 * The CHTMLmunderover wrapper for the MmlMunderover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmunderover<N, T, D> extends CHTMLmsubsup<N, T, D> {
    public static kind = MmlMunderover.prototype.kind;

    public static useIC: boolean = true;

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
    public get underChild() {
        return this.childNodes[(this.node as MmlMunderover).under];
    }

    /*
     * @return{CHTMLWrapper)   The wrapped overder node
     */
    public get overChild() {
        return this.childNodes[(this.node as MmlMunderover).over];
    }

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get subChild() {
        return this.underChild;
    }

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get supChild() {
        return this.overChild;
    }

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.stretchChildren();
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        if (this.hasMovableLimits()) {
            super.toCHTML(parent);
            this.adaptor.setAttribute(this.chtml, 'limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        const over = this.adaptor.append(this.chtml, this.html('mjx-over')) as N;
        const table = this.adaptor.append(
            this.adaptor.append(this.chtml, this.html('mjx-box')) as N,
            this.html('mjx-munder')
        ) as N;
        const base = this.adaptor.append(
            this.adaptor.append(table, this.html('mjx-row')) as N,
            this.html('mjx-base')
        ) as N;
        const under = this.adaptor.append(
            this.adaptor.append(table, this.html('mjx-row')) as N,
            this.html('mjx-under')
        ) as N;
        this.overChild.toCHTML(over);
        this.baseChild.toCHTML(base);
        this.underChild.toCHTML(under);
        const overbox = this.overChild.getBBox();
        const basebox = this.baseChild.getBBox();
        const underbox = this.underChild.getBBox();
        const [ok, u] = this.getOverKU(basebox, overbox);
        const [uk, v] = this.getUnderKV(basebox, underbox);
        const delta = DELTA * this.baseCore.bbox.ic / 2;
        this.adaptor.setStyle(over, 'paddingBottom', this.em(ok));
        this.adaptor.setStyle(under, 'paddingTop', this.em(uk));
        this.setDeltaW([base, under, over], this.getDeltaW([basebox, underbox, overbox], [0, -delta, delta]));
        if (overbox.d < 0) {
            this.adaptor.setStyle(over, 'marginBottom', this.em(overbox.d * overbox.rscale));
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
        const overbox = this.overChild.getBBox();
        const basebox = this.baseChild.getBBox();
        const underbox = this.underChild.getBBox();
        const [ok, u] = this.getOverKU(basebox, overbox);
        const [uk, v] = this.getUnderKV(basebox, underbox);
        const delta = DELTA * this.baseCore.bbox.ic / 2;
        const [bw, uw, ow] = this.getDeltaW([basebox, underbox, overbox], [0, -delta, delta]);
        bbox.combine(basebox, bw, 0);
        bbox.combine(overbox, ow, u);
        bbox.combine(underbox, uw, v);
        const z = this.font.params.big_op_spacing5;
        bbox.h += z;
        bbox.d += z;
        bbox.clean();
    }

}
