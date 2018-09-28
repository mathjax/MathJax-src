/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview  Implements the CommonMenclose wrapper mixin for the MmlMenclose object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor, CommonWrapperClass} from '../Wrapper.js';
import * as Notation from '../Notation.js';
import {CommonMsqrt} from './msqrt.js';
import {BBox} from '../BBox.js';
import {AbstractMmlNode, AttributeList} from '../../../core/MmlTree/MmlNode.js';
import {MmlMenclose} from '../../../core/MmlTree/MmlNodes/menclose.js';
import {OptionList} from '../../../util/Options.js';
import {StyleData} from '../../common/CssStyles.js';
import {split} from '../../../util/string.js';

/*****************************************************************/
/**
 * The CommonMenclose interface
 *
 * @template W  The menclose wrapper type
 */
export interface CommonMenclose<W extends AnyWrapper, S extends CommonMsqrt, N> extends AnyWrapper {
    /**
     *  The notations active on this menclose, and the one to use for the child, if any
     */
    notations: Notation.List<W, N>;
    renderChild: Notation.Renderer<W, N>;

    /**
     * fake msqrt for radial notation (if used)
     */
    msqrt: S;

    /**
     * The padding, thickness, and shape of the arrow head
     *   (may be overriden using data-padding, data-thickness, and data-arrowhead attibutes)
     */
    padding: number;
    thickness: number;
    arrowhead: {x: number, y: number, dx: number};

    /**
     * Look up the data-* attributes and override the default values
     */
    getParameters(): void;

    /**
     *  Get the notations given in the notation attribute
     *    and check if any are used to render the child nodes
     */
    getNotations(): void;

    /**
     *  Remove any redundant notations
     */
    removeRedundantNotations(): void;

    /**
     *  Run any initialization needed by notations in use
     */
    initializeNotations(): void;

    /**
     * @return {number[]}  Array of the maximum extra space from the notations along each side
     */
    getBBoxExtenders(): number[];

    /**
     * @return {number[]}  Array of padding (i.e., BBox minus border) along each side
     */
    getPadding(): number[];

    /**
     * Each entry in X gets replaced by the corresponding one in Y if it is larger
     *
     * @param {number[]} X   An array of numbers
     * @param {number[]} Y   An array of numbers that replace smaller ones in X
     */
    maximizeEntries(X: number[], Y: number[]): void;

    /**
     * @param {number} m  A number to trim to 4 decimal places
     * @return {string}   The number trimmed to 4 places, with trailing 0's removed
     */
    units(m: number): string;

    /**
     * @param {number} w    The width of the box whose diagonal is needed
     * @param {number} h    The height of the box whose diagonal is needed
     * @return {number[]}   The angle and width of the diagonal of the box
     */
    getArgMod(w: number, h: number): number[];

    /**
     * Create an svg tree
     *
     * @param {string} type        The class for the new svg element
     * @param {number[]} box       The viewBox values for the svg element
     * @param {N[]} nodes          The children for the svg element
     * @param {StyleData=} styles  Styles to set on the svg element, if any
     * @return {N}                 The newly created svg element
     */
    svg(type: string, box: number[], nodes: N[], styles?: StyleData): void;

    /**
     * @param {string} kind              The name of the svg node
     * @param {OptionList=} properties   The properties to set for the node
     * @param {N[]=} nodes               The children of the node
     */
    svgNode(kind: string, properties?: OptionList, nodes?: N[]): N;

    /**
     * Create an ellipse element
     *
     * @param {number} w  The width of the ellipse
     * @param {number} h  The height of the ellipse
     * @return {N}        The newly created ellipse node
     */
    ellipse(w: number, h: number): N;

    /**
     * Create a line element
     *
     * @param {number} x1   The x-coordinate of the starting point
     * @param {number} y1   The y-coordinate of the starting point
     * @param {number} x2   The x-coordinate of the ending point
     * @param {number} y2   The y-coordinate of the ending point
     * @return {N}          The newly created line element
     */
    line(x1: number, y1: number, x2: number, y2: number): N;

    /**
     * Create a path element from the commands the specify it
     *
     * @param {(string|number)[]} P   The list of commands and coordinates for the path
     * @return {N}                    The newly created path
     */
    path(...P: (string | number)[]): N;

    /**
     * Create a filled path element from the commands the specify it
     *   (same as path above, but no thickness adjustments)
     *
     * @param {(string|number)[]} P   The list of commands and coordinates for the path
     * @return {N}                    The newly created path
     */
    fill(...P: (string | number)[]): N;

    /**
     * Create an arrow using an svg element
     *
     * @param {number} w         The length of the arrow
     * @param {number} a         The angle for the arrow
     * @param {number} neg       The direction to shift the arrow's Y coordinate before rotating it (1 or -1)
     * @param {string} origin    The transform-origin for the rotation
     * @param {string=} offset   The axis alogn which to offset the rotated arrow
     * @param {number=} d        The distance to offset by
     * @param {boolean=} double  True if this is a double-headed arrow
     * @return {N}               The newly created arrow
     */
    arrow(w: number, a: number, neg: number, origin: string, offset?: string, d?: number, double?: boolean): N;

    /**
     * @param {N} shape   The svg element whose stroke-thickness must be
     *                    adjusted if the thickness isn't the default
     * @return {N}        The adjusted element
     */
    adjustThickness(shape: N): N;

    /**
     * Create an unattached msqrt wrapper to render the 'radical' notation.
     *   We replace the inferred mrow of the msqrt with the one from the menclose
     *   but without changing the parent pointer, so as not to detach it from
     *   the menclose (which would desrtoy the original MathML tree).
     *
     * @param {W} child   The inferred mrow that is the child of this menclose
     * @return {S}        The newly created (but detached) msqrt wrapper
     */
    createMsqrt(child: W): S;

    /**
     * @return {number[]}  The differences between the msqrt bounding box
     *                     and its child bounding box (i.e., the extra space
     *                     created by the radical symbol).
     */
    sqrtTRBL(): number[];
}

/**
 * The CommonMenclose class interface
 *
 * @template W  The menclose wrapper type
 * @templare N  The DOM node class
 */
export interface CommonMencloseClass<W extends AnyWrapper, N> extends CommonWrapperClass<any, any, any> {
    /**
     *  The definitions of the various notations
     */
    notations: Notation.DefList<W, N>;
}

/**
 * Shorthand for the CommonMenclose constructor
 *
 * @template W  The menclose wrapper type
 */
export type MencloseConstructor<W extends AnyWrapper, S extends CommonMsqrt, N> = Constructor<CommonMenclose<W, S, N>>;

/*****************************************************************/
/**
 * The CommonMenclose wrapper mixin for the MmlMenclose object
 *
 * @template W  The menclose wrapper type
 * @templare N  The DOM node class
 * @templare S  The msqrt wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMencloseMixin<W extends AnyWrapper,
                                    S extends CommonMsqrt, N,
                                    T extends WrapperConstructor>(Base: T): MencloseConstructor<W, S, N> & T {
    return class extends Base {

        /**
         *  The notations active on this menclose, and the one to use for the child, if any
         */
        public notations: Notation.List<W, N> = {};
        public renderChild: Notation.Renderer<W, N> = null;

        /**
         * fake msqrt for radial notation (if used)
         */
        public msqrt: S = null;

        /**
         * The padding, thickness, and shape of the arrow head
         *   (may be overriden using data-padding, data-thickness, and data-arrowhead attibutes)
         */
        public padding: number = Notation.PADDING;
        public thickness: number = Notation.THICKNESS;
        public arrowhead = {x: Notation.ARROWX, y: Notation.ARROWY, dx: Notation.ARROWDX};

        /**
         * @override
         * @constructor
         */
        constructor(...args: any[]) {
            super(...args);
            this.getParameters();
            this.getNotations();
            this.removeRedundantNotations();
            this.initializeNotations();
        }

        /**
         * Look up the data-* attributes and override the default values
         */
        public getParameters() {
            const attributes = this.node.attributes;
            const padding = attributes.get('data-padding');
            if (padding !== undefined) {
                this.padding = this.length2em(padding, Notation.PADDING);
            }
            const thickness = attributes.get('data-thickness');
            if (thickness !== undefined) {
                this.thickness = this.length2em(thickness, Notation.THICKNESS);
            }
            const arrowhead = attributes.get('data-arrowhead') as string;
            if (arrowhead !== undefined) {
                let [x, y, dx] = split(arrowhead);
                this.arrowhead = {
                    x: (x ? parseFloat(x) : Notation.ARROWX),
                    y: (y ? parseFloat(y) : Notation.ARROWY),
                    dx: (dx ? parseFloat(dx) : Notation.ARROWDX)
                };
            }
        }

        /**
         *  Get the notations given in the notation attribute
         *    and check if any are used to render the child nodes
         */
        public getNotations() {
            const Notations = (this.constructor as CommonMencloseClass<W, N>).notations;
            for (const name of split(this.node.attributes.get('notation') as string)) {
                const notation = Notations.get(name);
                if (notation) {
                    this.notations[name] = notation;
                    if (notation.renderChild) {
                        this.renderChild = notation.renderer;
                    }
                }
            }
        }

        /**
         *  Remove any redundant notations
         */
        public removeRedundantNotations() {
            for (const name of Object.keys(this.notations)) {
                if (this.notations[name]) {
                    const remove = this.notations[name].remove || '';
                    for (const notation of remove.split(/ /)) {
                        delete this.notations[notation];
                    }
                }
            }
        }

        /**
         *  Run any initialization needed by notations in use
         */
        public initializeNotations() {
            for (const name of Object.keys(this.notations)) {
                const init = this.notations[name].init;
                init && init(this as any);
            }
        }

        /********************************************************/

        /**
         * @override
         */
        public computeBBox(bbox: BBox) {
            //
            //  Combine the BBox from the child and add the extenders
            //
            let [T, R, B, L] = this.getBBoxExtenders();
            const child = this.childNodes[0].getBBox();
            bbox.combine(child, L, 0);
            bbox.h += T;
            bbox.d += B;
            bbox.w += R;
        }

        /**
         * @return {number[]}  Array of the maximum extra space from the notations along each side
         */
        public getBBoxExtenders() {
            let TRBL = [0, 0, 0, 0];
            for (const name of Object.keys(this.notations)) {
                this.maximizeEntries(TRBL, this.notations[name].bbox(this as any));
            }
            return TRBL;
        }

        /**
         * @return {number[]}  Array of padding (i.e., BBox minus border) along each side
         */
        public getPadding() {
            let TRBL = [0, 0, 0, 0];
            let BTRBL = [0, 0, 0, 0];
            for (const name of Object.keys(this.notations)) {
                this.maximizeEntries(TRBL, this.notations[name].bbox(this as any));
                const border = this.notations[name].border;
                if (border) {
                    this.maximizeEntries(BTRBL, border(this as any));
                }
            }
            return [0, 1, 2, 3].map(i => TRBL[i] - BTRBL[i]);
        }

        /**
         * Each entry in X gets replaced by the corresponding one in Y if it is larger
         *
         * @param {number[]} X   An array of numbers
         * @param {number[]} Y   An array of numbers that replace smaller ones in X
         */
        public maximizeEntries(X: number[], Y: number[]) {
            for (let i = 0; i < X.length; i++) {
                if (X[i] < Y[i]) {
                    X[i] = Y[i];
                }
            }
        }

        /********************************************************/

        /**
         * @override
         * (make it public so it can be called by the notation functions)
         */
        public em(m: number) {
            return super.em(m);
        }

        /**
         * @param {number} m  A number to trim to 4 decimal places
         * @return {string}   The number trimmed to 4 places, with trailing 0's removed
         */
        public units(m: number) {
            if (Math.abs(m) < .001) return '0';
            return m.toFixed(4).replace(/\.?0+$/, '');
        }

        /**
         * @param {number} w    The width of the box whose diagonal is needed
         * @param {number} h    The height of the box whose diagonal is needed
         * @return {number[]}   The angle and width of the diagonal of the box
         */
        public getArgMod(w: number, h: number) {
            return [Math.atan2(h, w), Math.sqrt(w * w + h * h)];
        }

        /**
         * Create an svg tree
         *
         * @param {string} type        The class for the new svg element
         * @param {number[]} box       The viewBox values for the svg element
         * @param {N[]} nodes          The children for the svg element
         * @param {StyleData=} styles  Styles to set on the svg element, if any
         * @return {N}                 The newly created svg element
         */
        public svg(type: string, box: number[], nodes: N[], styles: StyleData = null) {
            const properties: OptionList = {
                class: 'mjx-' + type,
                viewbox: box.join(' ')
            };
            if (styles) {
                properties.style = styles;
            }
            return this.svgNode('svg', properties, nodes);
        }

        /**
         * @param {string} kind              The name of the svg node
         * @param {OptionList=} properties   The properties to set for the node
         * @param {N[]=} nodes               The children of the node
         */
        public svgNode(kind: string, properties: OptionList = {}, nodes: N[] = null) {
            // implemented in subclasses
            return null as N;
        }

        /**
         * Create an ellipse element
         *
         * @param {number} w  The width of the ellipse
         * @param {number} h  The height of the ellipse
         * @return {N}        The newly created ellipse node
         */
        public ellipse(w: number, h: number) {
            const t = this.thickness;
            return this.adjustThickness(this.svgNode('ellipse', {
                rx: this.units((w - t) / 2), ry: this.units((h - t) / 2),
                cx: this.units(w / 2), cy: this.units(h / 2)
            }));
        }

        /**
         * Create a line element
         *
         * @param {number} x1   The x-coordinate of the starting point
         * @param {number} y1   The y-coordinate of the starting point
         * @param {number} x2   The x-coordinate of the ending point
         * @param {number} y2   The y-coordinate of the ending point
         * @return {N}          The newly created line element
         */
        public line(x1: number, y1: number, x2: number, y2: number) {
            return this.adjustThickness(this.svgNode('line', {
                x1: this.units(x1), y1: this.units(y1),
                x2: this.units(x2), y2: this.units(y2)
            }));
        }

        /**
         * Create a path element from the commands the specify it
         *
         * @param {(string|number)[]} P   The list of commands and coordinates for the path
         * @return {N}                    The newly created path
         */
        public path(...P: (string | number)[]) {
            return this.adjustThickness(this.svgNode('path', {
                d: P.map(x => (typeof x === 'string' ? x : this.units(x))).join(' ')
            }));
        }

        /**
         * Create a filled path element from the commands the specify it
         *   (same as path above, but no thickness adjustments)
         *
         * @param {(string|number)[]} P   The list of commands and coordinates for the path
         * @return {N}                    The newly created path
         */
        public fill(...P: (string | number)[]) {
            return this.svgNode('path', {
                d: P.map(x => (typeof x === 'string' ? x : this.units(x))).join(' ')
            });
        }

        /**
         * Create an arrow using an svg element
         *
         * @param {number} w        The length of the arrow
         * @param {number} a        The angle for the arrow
         * @param {number} neg      The direction to shift the arrow's Y coordinate before rotating it (1 or -1)
         * @param {string} origin   The transform-origin for the rotation
         * @param {string} offset   The axis alogn which to offset the rotated arrow
         * @param {number} d        The distance to offset by
         * @param {boolean} double  True if this is a double-headed arrow
         */
        public arrow(w: number, a: number, neg: number, origin: string, offset: string = '',
                     d: number = 0, double: boolean = false) {
            const t = this.thickness;
            const head = this.arrowhead;
            const [x, y, dx] = [t * head.x, t * head.y, t * head.dx];
            //
            //  Get the offset, if any,
            //  and translate by the width if rotating by more than 90 degrees
            //
            if (offset) {
                offset = 'translate' + offset + '(' + this.em(d) + ') ';
            }
            if (Math.abs(a) >  Math.PI / 2) {
                offset = 'translateX(' + this.em(w) + ') ' + offset;
            }
            //
            //  Create the svg holding the arrow with the one or two arrow heads and the line between them
            //
            const svg = this.svg('arrow', [0, -y, w, 2 * y], [
                this.line(double ? x : t / 2, 0, w - x, 0),
                this.fill('M', w - x, 0,  'L', w - x - dx, y,  'L', w, 0,  'L', w - x - dx, -y)
            ], {
                width: this.em(w), height: this.em(2 * y),
                transform: offset + 'rotate(' + this.units(a) + 'rad) translateY(' + this.units(neg * y) + 'em)',
                'transform-origin': origin.replace(/right/, 'left')
            });
            double && this.adaptor.append(svg, this.fill('M', x, 0,  'L', x + dx, y,  'L', 0, 0,  'L', x + dx, -y));
            //
            // Align the arrow with the givin origin sides
            //
            for (const side of split(origin)) {
                this.adaptor.setStyle(svg, side, '0');
            }
            return svg;
        }

        /**
         * @param {N} shape   The svg element whose stroke-thickness must be
         *                    adjusted if the thickness isn't the default
         * @return {N}        The adjusted element
         */
        public adjustThickness(shape: N) {
            if (this.thickness !== Notation.THICKNESS) {
                this.adaptor.setStyle(shape, 'strokeWidth', this.units(this.thickness));
            }
            return shape;
        }

        /********************************************************/

        /**
         * Create an unattached msqrt wrapper to render the 'radical' notation.
         *   We replace the inferred mrow of the msqrt with the one from the menclose
         *   but without changing the parent pointer, so as not to detach it from
         *   the menclose (which would desrtoy the original MathML tree).
         *
         * @param {W} child   The inferred mrow that is the child of this menclose
         * @return {S}        The newly created (but detached) msqrt wrapper
         */
        public createMsqrt(child: W) {
            const mmlFactory = (this.node as AbstractMmlNode).factory;
            const mml = mmlFactory.create('msqrt');
            mml.childNodes[0] = child.node;
            const attributes = this.node.attributes;
            const display = attributes.get('display') as boolean;
            const scriptlevel = attributes.get('scriptlevel') as number;
            const defaults: AttributeList = {
                mathsize: ['math', attributes.get('mathsize')]
            };
            mml.setInheritedAttributes(defaults, display, scriptlevel, false);
            const node = this.wrap(mml) as S;
            node.parent = this;
            return node;
        }

        /**
         * @return {number[]}  The differences between the msqrt bounding box
         *                     and its child bounding box (i.e., the extra space
         *                     created by the radical symbol).
         */
        public sqrtTRBL() {
            const bbox = this.msqrt.getBBox();
            const cbox = this.msqrt.childNodes[0].getBBox();
            return [bbox.h - cbox.h, 0, bbox.d - cbox.d, bbox.w - cbox.w];
        }

    };
}
