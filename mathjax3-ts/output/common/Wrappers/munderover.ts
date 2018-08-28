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
 * @fileoverview  Implements the CommonMunderover wrapper mixin for the MmlMunderover object
 *                and the special cases CommonMunder and CommonMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper} from '../Wrapper.js';
import {CommonScriptbase, CommonScriptbaseInterface, ScriptbaseConstructor} from './scriptbase.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {BBox} from '../BBox.js';

/*****************************************************************/
/**
 * The CommonMunder interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMunderInterface<W extends AnyWrapper> extends CommonScriptbaseInterface<W> {
}

/**
 * Shorthand for the CommonMunder constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MunderConstructor<W extends AnyWrapper> = Constructor<CommonMunderInterface<W>>;

/*****************************************************************/
/**
 * The CommonMunder wrapper mixin for the MmlMunder object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template W  The child-node Wrapper class
 * @template U  The Wrapper class constructor type
 */
export function CommonMunder<N, T, D, W extends AnyWrapper,
                                      U extends ScriptbaseConstructor<W>>(Base: U): MunderConstructor<W> & U {
    return class extends Base {

        /**
         * @override
         */
        public get script() {
            return this.childNodes[(this.node as MmlMunder).under];
        }

        /**
         * @override
         * @constructor
         */
        constructor(...args: any[]) {
            super(...args);
            this.stretchChildren();
        }

        /**
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
            const delta = this.getDelta(true);
            const [bw, uw] = this.getDeltaW([basebox, underbox], [0, -delta]);
            bbox.combine(basebox, bw, 0);
            bbox.combine(underbox, uw, v);
            bbox.d += this.font.params.big_op_spacing5;
            bbox.ic = -this.baseCore.bbox.ic;
            bbox.clean();
        }

    };

}

/*****************************************************************/
/**
 * The CommonMover interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMoverInterface<W extends AnyWrapper> extends CommonScriptbaseInterface<W> {
}

/**
 * Shorthand for the CommonMover constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MoverConstructor<W extends AnyWrapper> = Constructor<CommonMoverInterface<W>>;

/*****************************************************************/
/**
 * The CommonMover wrapper mixin for the MmlMover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template W  The child-node Wrapper class
 * @template U  The Wrapper class constructor type
 */
export function CommonMover<N, T, D, W extends AnyWrapper,
                                     U extends ScriptbaseConstructor<W>>(Base: U): MoverConstructor<W> & U {
    return class extends Base {

        /**
         * @override
         */
        public get script() {
            return this.childNodes[(this.node as MmlMover).over];
        }

        /**
         * @override
         * @constructor
         */
        constructor(...args: any[]) {
            super(...args);
            this.stretchChildren();
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
            const delta = this.getDelta();
            const [bw, ow] = this.getDeltaW([basebox, overbox], [0, delta]);
            bbox.combine(basebox, bw, 0);
            bbox.combine(overbox, ow, u);
            bbox.h += this.font.params.big_op_spacing5;
            bbox.ic = -this.baseCore.bbox.ic;
            bbox.clean();
        }

    };

}

/*****************************************************************/
/**
 * The CommonMunderover interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMunderoverInterface<W extends AnyWrapper> extends CommonScriptbaseInterface<W> {

    /*
     * The wrapped under node
     */
    readonly underChild: W;

    /*
     * The wrapped overder node
     */
    readonly overChild: W;

}

/**
 * Shorthand for the CommonMunderover constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MunderoverConstructor<W extends AnyWrapper> = Constructor<CommonMunderoverInterface<W>>;

/*****************************************************************/
/*
 * The CommonMunderover wrapper for the MmlMunderover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template W  The child-node Wrapper class
 * @template U  The Wrapper class constructor type
 */
export function CommonMunderover<N, T, D, W extends AnyWrapper,
                                       U extends ScriptbaseConstructor<W>>(Base: U): MunderoverConstructor<W> & U {
    return class extends Base {

        /*
         * @return {CHTMLWrapper)   The wrapped under node
         */
        public get underChild() {
            return this.childNodes[(this.node as MmlMunderover).under];
        }

        /*
         * @return {CHTMLWrapper)   The wrapped overder node
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
        constructor(...args: any[]) {
            super(...args);
            this.stretchChildren();
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
            const delta = this.getDelta();
            const [bw, uw, ow] = this.getDeltaW([basebox, underbox, overbox], [0, -delta, delta]);
            bbox.combine(basebox, bw, 0);
            bbox.combine(overbox, ow, u);
            bbox.combine(underbox, uw, v);
            const z = this.font.params.big_op_spacing5;
            bbox.h += z;
            bbox.d += z;
            bbox.ic = -this.baseCore.bbox.ic;
            bbox.clean();
        }

    };

}
