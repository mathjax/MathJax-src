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
 * @fileoverview  Implements the CHTMLmenclose wrapper for the MmlMenclose object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, StringMap} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLmsqrt} from './msqrt.js';
import {BBox} from '../BBox.js';
import {MmlMenclose} from '../../../core/MmlTree/MmlNodes/menclose.js';
import {MmlNode, AbstractMmlNode, AttributeList} from '../../../core/MmlTree/MmlNode.js';
import {OptionList} from '../../../util/Options.js';
import {StyleList, StyleData} from '../CssStyles.js';
import {split} from '../../../util/string.js';

/*****************************************************************/

const ARROWX = 4, ARROWDX = 1, ARROWY = 2;  // default relative arrowhead values

const THICKNESS = .067;  // default rule thickness
const PADDING = .2;      // default padding

const SOLID = THICKNESS + 'em solid';  // a solid border

/*
 * The functions used for notation definitions
 */
export type Renderer<N, T, D> = (node: CHTMLmenclose<N, T, D>, child: N) => void;
export type BBoxExtender<N, T, D> = (node: CHTMLmenclose<N, T, D>) => number[];
export type BBoxBorder<N, T, D> = (node: CHTMLmenclose<N, T, D>) => number[];
export type Initializer<N, T, D> = (node: CHTMLmenclose<N, T, D>) => void;

/*
 * The definition of a notation
 */
export type NotationDef<N, T, D> = {
    renderer: Renderer<N, T, D>;        // renders the HTML for the notation
    bbox: BBoxExtender<N, T, D>;        // gives the offsets to the child bounidng box: [top, right, bottom, left]
    border?: BBoxBorder<N, T, D>;       // gives the amount of the bbox offset that is due to borders on the child
    renderChild?: boolean;              // true if the notation is used to render the child directly (e.g., radical)
    init?: Initializer<N, T, D>;        // function to be called during wrapper construction
    remove?: string;                    // list of notations that are suppressed by this one
};

/*
 * For defining notation maps
 */
export type NotationDefPair = [string, NotationDef<any, any, any>];
export type NotationDefList = Map<string, NotationDef<any, any, any>>;

/*
 * The list of notations for an menclose element
 */
export type NotationList<N, T, D> = {[notation: string]: NotationDef<N, T, D>};


/*****************************************************************/

/*
 * The names and indices of sides for borders, padding, etc.
 */
export const sideIndex = {top: 0, right: 1, bottom: 2, left: 3};
export type Side = keyof typeof sideIndex;

/*
 * the spacing to leave for an arrowhead
 */
export const arrowHead = (node: CHTMLmenclose<any, any, any>) => {
    return Math.max(node.padding, node.thickness * (node.arrowhead.x + node.arrowhead.dx + 1));
};

/*
 * Service routines used for notations
 */
export const Notation = {

    /*
     * Common BBox and Border functions
     */
    fullBBox: ((node) => new Array(4).fill(node.thickness + node.padding)) as BBoxExtender<any, any, any>,
    fullPadding: ((node) => new Array(4).fill(node.padding)) as BBoxExtender<any, any, any>,
    fullBorder: ((node) => new Array(4).fill(node.thickness)) as BBoxBorder<any, any, any>,

    /*
     * The data for horizontal and vertical arrow notations
     *   [angle, neg, double, origin, offset, isVertical, remove]
     */
    arrowDef: {
        up:    [-Math.PI / 2,  1, false, 'bottom left', 'X', true,  'verticalstrike'],
        down:  [ Math.PI / 2, -1, false, 'top left',    'X', true,  'verticakstrike'],
        right: [  0,          -1, false, 'top left',    'Y', false, 'horizontalstrike'],
        left:  [  Math.PI,    -1, false, 'top right',   'Y', false, 'horizontalstrike'],
        updown:    [Math.PI / 2, -1, true, 'top left',  'X', true,  'verticalstrike uparrow downarrow'],
        leftright: [0,           -1, true, 'top left',  'Y', false, 'horizontalstrike leftarrow rightarrow']
    } as {[name: string]: [number, number, boolean, string, string, boolean, string]},

    /*
     * The data for diagonal arrow notations
     *   [neg, c, pi, double, origin, remove]
     */
    diagonalArrowDef: {
        updiagonal: [ 1, -1, 0,       false, 'bottom left',  'updiagonalstrike'],
        northeast:  [ 1, -1, 0,       false, 'bottom left',  'updiagonalstrike'],
        southeast:  [-1,  1, 0,       false, 'top left',     'downdiagonalstrike'],
        northwest:  [ 1,  1, Math.PI, false, 'bottom right', 'downdiagonalstrike'],
        southwest:  [-1, -1, Math.PI, false, 'top right',    'updiagonalstrike'],
        northeastsouthwest: [ 1, -1, 0, true, 'bottom left', 'updiagonalstrike northeastarrow updiagonalarrow southwestarrow'],
        northwestsoutheast: [-1,  1, 0, true, 'top left',    'downdiagonalstrike northwestarrow southeastarrow']
    } as {[name: string]: [number, number, number, boolean, string, string]},

    /*
     * The BBox functions for horizontal and vertical arrows
     */
    arrowBBox: {
        up:    (node) => [arrowHead(node), 0, node.padding, 0],
        down:  (node) => [node.padding, 0, arrowHead(node), 0],
        right: (node) => [0, arrowHead(node), 0, node.padding],
        left:  (node) => [0, node.padding, 0, arrowHead(node)],
        updown:    (node) => [arrowHead(node), 0, arrowHead(node), 0],
        leftright: (node) => [0, arrowHead(node), 0, arrowHead(node)]
    } as {[name: string]: BBoxExtender<any, any, any>},

    /*
     * Create a named element (handled by CSS), and adjust it if thickness is non-standard
     *
     * @param{string} name    The name of the element to create
     * @param{string} offset  The offset direction to adjust if thickness is non-standard
     * @return{Renderer}      The renderer function for the given element name
     */
    RenderElement: (name: string, offset: string = '') => {
        return ((node, child) => {
            const shape = node.adjustBorder(node.html('mjx-' + name));
            if (offset && node.thickness !== THICKNESS) {
                const transform = 'translate' + offset + '(' + node.em(node.thickness / 2) + ')';
                node.adaptor.setStyle(shape, 'transform', transform);
            }
            node.adaptor.append(node.chtml, shape);
        }) as Renderer<any, any, any>;
    },

    /*
     * @param{string} side       The side on which a border should appear
     * @return{NotationDefPair}  The notation definition for the notation having a line on the given side
     */
    Border: (side: Side) => {
        const i = sideIndex[side];
        return [side, {
            //
            // Add the border to the main child object
            //
            renderer: (node, child) => {
                node.adaptor.setStyle(child, 'border-' + side, node.em(node.thickness) + ' solid');
            },
            //
            // Indicate the extra space on the given side
            //
            bbox: (node) => {
                const bbox = [0, 0, 0, 0];
                bbox[i] = node.thickness + node.padding;
                return bbox;
            },
            //
            // Indicate the border on the given side
            //
            border: (node) => {
                const bbox = [0, 0, 0, 0];
                bbox[i] = node.thickness;
                return bbox;
            }
        }] as NotationDefPair;
    },

    /*
     * @param{string} name       The name of the notation to define
     * @param{string} side1      The first side to get a border
     * @param{string} side2      The second side to get a border
     * @return{NotationDefPair}  The notation definition for the notation having lines on two sides
     */
    Border2: (name: string, side1: Side, side2: Side) => {
        const i1 = sideIndex[side1];
        const i2 = sideIndex[side2];
        return [name, {
            //
            // Add the border along the given sides
            //
            renderer: (node, child) => {
                const border = node.em(node.thickness) + ' solid';
                node.adaptor.setStyle(child, 'border-' + side1, border);
                node.adaptor.setStyle(child, 'border-' + side2, border);
            },
            //
            // Mark the extra space along the two sides
            //
            bbox: (node) => {
                const t = node.thickness + node.padding;
                const bbox = [0, 0, 0, 0];
                bbox[i1] = bbox[i2] = t;
                return bbox;
            },
            //
            // Indicate the border on the two sides
            //
            border: (node) => {
                const bbox = [0, 0, 0, 0];
                bbox[i1] = bbox[i2] = node.thickness;
                return bbox;
            },
            //
            // Remove the single side notations, if present
            //
            remove: side1 + ' ' + side2
        }] as NotationDefPair;
    },

    /*
     * @param{string} name       The name of the diagonal strike to define
     * @param{number} neg        1 or -1 to use with the angle
     * @return{NotationDefPair}  The notation definition for the diagonal strike
     */
    DiagonalStrike: (name: string, neg: number) => {
        const cname = 'mjx-' + name.charAt(0) + 'strike';
        return [name + 'diagonalstrike', {
            //
            // Find the angle and width from the bounding box size and create
            //   the diagonal line from them by rotating a border of the proper size
            //
            renderer: (node, child) => {
                const {w, h, d} = node.getBBox();
                const [a, W] = node.getArgMod(w, h + d);
                const t = neg * node.thickness / 2;
                const strike = node.adjustBorder(node.html(cname, {style: {
                    width: node.em(W),
                    transform: 'rotate(' + node.units(-neg * a) + 'rad) translateY(' + t + 'em)',
                }}));
                node.adaptor.append(node.chtml, strike);
            },
            //
            //  Add padding all around
            //
            bbox: Notation.fullBBox
        }] as NotationDefPair;
    },

    /*
     * @param{string} name       The name of the diagonal arrow to define
     * @return{NotationDefPair}  The notation definition for the diagonal arrow
     */
    DiagonalArrow: (name: string) => {
        const [neg, c, pi, double, origin, remove] = Notation.diagonalArrowDef[name];
        return [name + 'arrow', {
            //
            // Find the angle and width from the bounding box size and create
            //   the arrow from them and the other arrow data
            //
            renderer: (node, child) => {
                const {w, h, d} = node.getBBox();
                const [a, W] = node.getArgMod(w, h + d);
                const arrow = node.arrow(W, c * (a - pi), neg, origin, '', 0, double);
                node.adaptor.append(node.chtml, arrow);
            },
            //
            // Add roughly the right amount of space for the arrowhead all around
            //
            bbox: (node) => {
                const t = Math.max(node.padding, node.thickness * (node.arrowhead.x + node.arrowhead.dx) / Math.sqrt(2));
                return [t, t, t, t];
            },
            //
            // Remove redundant notations
            //
            remove: remove
        }] as NotationDefPair;
    },

    /*
     * @param{string} name       The name of the horizontal or vertical arrow to define
     * @return{NotationDefPair}  The notation definition for the arrow
     */
    Arrow: (name: string) => {
        const [angle, neg, double, origin, offset, isVertical, remove] = Notation.arrowDef[name];
        return [name + 'arrow', {
            //
            // Get the arrow height and depth from the bounding box and the arrow direction
            //   then create the arrow from that and the other data
            //
            renderer: (node, child) => {
                const adaptor = node.adaptor;
                const {w, h, d} = node.getBBox();
                const [W, H] = (isVertical ? [h + d, w] : [w, h + d]);
                const arrow = node.arrow(W, angle, neg, origin, offset, H / 2, double);
                adaptor.append(node.chtml, arrow);
            },
            //
            // Add the padding to teh proper sides
            //
            bbox: Notation.arrowBBox[name],
            //
            // Remove redundant notations
            //
            remove: remove
        }] as NotationDefPair;
    }

};


/*****************************************************************/
/*
 * The CHTMLmenclose wrapper for the MmlMenclose object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmenclose<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMenclose.prototype.kind;

    /*
     * Styles needed for the various notations
     */
    public static styles: StyleList = {
        'mjx-menclose': {
            position: 'relative'
        },
        'mjx-menclose > mjx-dstrike': {
            display: 'inline-block',
            left: 0, top: 0,
            position: 'absolute',
            'border-top': SOLID,
            'transform-origin': 'top left'
        },
        'mjx-menclose > mjx-ustrike': {
            display: 'inline-block',
            left: 0, bottom: 0,
            position: 'absolute',
            'border-top': SOLID,
            'transform-origin': 'bottom left'
        },
        'mjx-menclose > mjx-hstrike': {
            'border-top': SOLID,
            position: 'absolute',
            left: 0, right: 0, bottom: '50%',
            transform: 'translateY(' + (THICKNESS / 2) + 'em)'
        },
        'mjx-menclose > mjx-vstrike': {
            'border-left': SOLID,
            position: 'absolute',
            top: 0, bottom: 0, right: '50%',
            transform: 'translateX(' + (THICKNESS / 2) + 'em)'
        },
        'mjx-menclose > mjx-rbox': {
            position: 'absolute',
            top: 0, bottom: 0, right: 0, left: 0,
            'border': SOLID,
            'border-radius': (THICKNESS + PADDING) + 'em'
        },
        'mjx-menclose > svg.mjx-circle': {
            position: 'absolute',
            top: 0, bottom: 0, right: 0, left: 0,
            width: '100%', height: '100%'
        },
        'mjx-menclose > svg.mjx-circle > ellipse': {
            'stroke-width': THICKNESS,
            'stroke': 'currentColor',
            'fill': 'none'
        },
        'mjx-menclose > svg.mjx-arrow': {
            position: 'absolute',
        },
        'mjx-menclose > svg.mjx-arrow > path': {
            'stroke': 'none',
            'fill': 'currentColor'
        },
        'mjx-menclose > svg.mjx-arrow > line': {
            'stroke': 'currentColor',
            'stroke-width': THICKNESS,
            'stroke-linecap': 'round'
        },
        'mjx-menclose > svg.mjx-longdiv': {
            position: 'absolute',
            top: 0, bottom: 0, left: 0, right: 0,
            width: '100%', height: '100%'
        },
        'mjx-menclose > svg.mjx-longdiv > path': {
            'stroke': 'currentColor',
            'stroke-width': THICKNESS,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            fill: 'none',
        }
    };

    /*
     *  The definitions of the various notations
     */
    public static Notations: NotationDefList = new Map([

        Notation.Border('top'),
        Notation.Border('right'),
        Notation.Border('bottom'),
        Notation.Border('left'),

        Notation.Border2('actuarial', 'top', 'right'),
        Notation.Border2('madrawb', 'bottom', 'right'),

        Notation.DiagonalStrike('up', 1),
        Notation.DiagonalStrike('down', -1),

        ['horizontalstrike', {
            renderer: Notation.RenderElement('hstrike', 'Y'),
            bbox: (node) => [0, 0, 0, 0]
        }],

        ['verticalstrike', {
            renderer: Notation.RenderElement('vstrike', 'X'),
            bbox: (node) => [node.padding, 0, node.padding, 0]
        }],

        ['box', {
            renderer: (node, child) => {
                node.adaptor.setStyle(child, 'border', node.em(node.thickness) + ' solid');
            },
            bbox: Notation.fullBBox,
            border: Notation.fullBorder,
            remove: 'left right top bottom'
        }],

        ['roundedbox', {
            renderer: Notation.RenderElement('rbox'),
            bbox: Notation.fullBBox
        }],

        ['circle', {
            renderer: (node, child) => {
                const adaptor = node.adaptor;
                const {w, h, d} = node.getBBox();
                const circle = node.svg('circle', [0, 0, w, h + d], [node.ellipse(w, h + d)]);
                adaptor.append(node.chtml, circle);
            },
            bbox: Notation.fullBBox
        }],

        ['phasorangle', {
            //
            // Use a bottom border and an upward strike properly angled
            //
            renderer: (node, child) => {
                const {w, h, d} = node.getBBox();
                const [a, W] = node.getArgMod(1.75 * node.padding, h + d);
                const t = node.thickness * Math.sin(a) * .9;
                node.adaptor.setStyle(child, 'border-bottom', node.em(node.thickness) + ' solid');
                const strike = node.adjustBorder(node.html('mjx-ustrike', {style: {
                    width: node.em(W),
                    transform: 'translateX(' + node.em(t) + ') rotate(' + node.units(-a) + 'rad)',
                }}));
                node.adaptor.append(node.chtml, strike);
            },
            bbox: (node) => {
                const p = node.padding / 2;
                const t = node.thickness;
                return [2 * p, p, p + t, 3 * p + t];
            },
            border: (node) => [0, 0, node.thickness, 0],
            remove: 'bottom'
        }],

        Notation.Arrow('up'),
        Notation.Arrow('down'),
        Notation.Arrow('left'),
        Notation.Arrow('right'),

        Notation.Arrow('updown'),
        Notation.Arrow('leftright'),

        Notation.DiagonalArrow('updiagonal'),  // backward compatibility
        Notation.DiagonalArrow('northeast'),
        Notation.DiagonalArrow('southeast'),
        Notation.DiagonalArrow('northwest'),
        Notation.DiagonalArrow('southwest'),

        Notation.DiagonalArrow('northeastsouthwest'),
        Notation.DiagonalArrow('northwestsoutheast'),

        ['longdiv', {
            //
            // Use a line along the top followed by a half arc at the left
            //
            renderer: (node, child) => {
                const adaptor = node.adaptor;
                const {w, h, d} = node.getBBox();
                const t = node.thickness / 2;
                const p = 1.5 * node.padding;
                adaptor.append(node.chtml, node.svg('longdiv', [0, 0, w, h + d], [
                    node.path(
                        'M', w - t, t,  'L', t, t,
                        'a', p, (h + d) / 2 - t,  0, 0, 1,  t, h + d - 3 * t
                    )
                ]));
            },
            bbox: (node) => {
                const p = node.padding;
                const t = node.thickness;
                return [p + t, p, p, 2 * p + t / 2];
            }
        }],

        ['radical', {
            //
            //  Use the msqrt rendering, but remove the extra space due to the radical
            //    (it is added in at the end, so other notations overlap the root)
            //
            renderer: (node, child) => {
                node.msqrt.toCHTML(child);
                const TRBL = node.sqrtTRBL();
                node.adaptor.setStyle(node.msqrt.chtml, 'margin', TRBL.map(x => node.em(-x)).join(' '));
            },
            //
            //  Create the needed msqrt wrapper
            //
            init: (node) => {
                node.msqrt = node.createMsqrt(node.childNodes[0]);
            },
            //
            //  Add back in the padding for the square root
            //
            bbox: (node) => node.sqrtTRBL(),
            //
            //  This notation replaces the child
            //
            renderChild: true
        }]

    ] as NotationDefPair[]);

    /*
     *  The notations active on this menclose, and the one to use for the child, if any
     */
    protected notations: NotationList<N, T, D> = {};
    protected renderChild: Renderer<N, T, D> = null;

    /*
     * fake msqrt for radial notation (if used)
     */
    protected msqrt: CHTMLmsqrt<N, T, D> = null;

    /*
     * The padding, thickness, and shape of the arrow head
     *   (may be overriden using data-padding, data-thickness, and data-arrowhead attibutes)
     */
    public padding: number = PADDING;
    public thickness: number = THICKNESS;
    public arrowhead = {x: ARROWX, y: ARROWY, dx: ARROWDX};

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.getParameters();
        this.getNotations();
        this.removeRedundantNotations();
        this.initializeNotations();
    }

    /*
     * Look up the data-* attributes and override the default values
     */
    protected getParameters() {
        const attributes = this.node.attributes;
        const padding = attributes.get('data-padding');
        if (padding !== undefined) {
            this.padding = this.length2em(padding, PADDING);
        }
        const thickness = attributes.get('data-thickness');
        if (thickness !== undefined) {
            this.thickness = this.length2em(thickness, THICKNESS);
        }
        const arrowhead = attributes.get('data-arrowhead') as string;
        if (arrowhead !== undefined) {
            let [x, y, dx] = split(arrowhead);
            this.arrowhead = {
                x: (x ? parseFloat(x) : ARROWX),
                y: (y ? parseFloat(y) : ARROWY),
                dx: (dx ? parseFloat(dx) : ARROWDX)
            };
        }
    }

    /*
     *  Get the notations given in the notation attribute
     *    and check if any are used to render the child nodes
     */
    protected getNotations() {
        const Notations = (this.constructor as typeof CHTMLmenclose).Notations;
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

    /*
     *  Remove any redundant notations
     */
    protected removeRedundantNotations() {
        for (const name of Object.keys(this.notations)) {
            if (this.notations[name]) {
                const remove = this.notations[name].remove || '';
                for (const notation of remove.split(/ /)) {
                    delete this.notations[notation];
                }
            }
        }
    }

    /*
     *  Run any initialization needed by notations in use
     */
    protected initializeNotations() {
        for (const name of Object.keys(this.notations)) {
            const init = this.notations[name].init;
            init && init(this);
        }
    }

    /********************************************************/

    /*
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = this.standardCHTMLnode(parent);
        //
        //  Create a box for the child (that can have padding and borders added by the notations)
        //    and add the child HTML into it
        //
        const block = this.adaptor.append(chtml, this.html('mjx-box')) as N;
        if (this.renderChild) {
            this.renderChild(this, block);
        } else {
            this.childNodes[0].toCHTML(block);
        }
        //
        //  Render all the notations for this menclose element
        //
        for (const name of Object.keys(this.notations)) {
            const notation = this.notations[name];
            !notation.renderChild && notation.renderer(this, block);
        }
        //
        //  Add the needed padding, if any
        //
        const pbox = this.getPadding();
        const adaptor = this.adaptor;
        for (const name of Object.keys(sideIndex) as Side[]) {
            const i = sideIndex[name];
            pbox[i] > 0 && adaptor.setStyle(block, 'padding-' + name, this.em(pbox[i]));
        }
    }

    /*
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

    /*
     * @return{number[]}  Array of the maximum extra space from the notations along each side
     */
    protected getBBoxExtenders() {
        let TRBL = [0, 0, 0, 0];
        for (const name of Object.keys(this.notations)) {
            this.maximizeEntries(TRBL, this.notations[name].bbox(this));
        }
        return TRBL;
    }

    /*
     * @return{number[]}  Array of padding (i.e., BBox minus border) along each side
     */
    protected getPadding() {
        let TRBL = [0, 0, 0, 0];
        let BTRBL = [0, 0, 0, 0];
        for (const name of Object.keys(this.notations)) {
            this.maximizeEntries(TRBL, this.notations[name].bbox(this));
            const border = this.notations[name].border;
            if (border) {
                this.maximizeEntries(BTRBL, border(this));
            }
        }
        return [0, 1, 2, 3].map(i => TRBL[i] - BTRBL[i]);
    }

    /*
     * Each entry in X gets replaced by the corresponding one in Y if it is larger
     *
     * @param{number[]} X   An array of numbers
     * @param{number[]} Y   An array of numbers that replace smaller ones in X
     */
    protected maximizeEntries(X: number[], Y: number[]) {
        for (let i = 0; i < X.length; i++) {
            if (X[i] < Y[i]) {
                X[i] = Y[i];
            }
        }
    }

    /********************************************************/

    /*
     * @override
     * (make it public so it can be called by the notation functions)
     */
    public em(m: number) {
        return super.em(m);
    }

    /*
     * @param{number} m  A number to trim to 4 decimal places
     * @return{string}   The number trimmed to 4 places, with trailing 0's removed
     */
    public units(m: number) {
        if (Math.abs(m) < .001) return '0';
        return m.toFixed(4).replace(/\.?0+$/, '');
    }

    /*
     * @param{number} w   The width of the box whose diagonal is needed
     * @param{number} h   The height of the box whose diagonal is needed
     * @param{number[]}   The angle and width of the diagonal of the box
     */
    public getArgMod(w: number, h: number) {
        return [Math.atan2(h, w), Math.sqrt(w * w + h * h)];
    }

    /*
     * Create an svg element
     *
     * @param{string} type       The class for the new svg element
     * @param{number[]} box      The viewBox values for the svg element
     * @param{N[]} nodes         The children for the svg element
     * @param{StyleData} styles  Styles to set on the svg element, if any
     * @return{N}                The newly created svg element
     */
    public svg(type: string, box: number[], nodes: N[], styles: StyleData = null) {
        const properties: OptionList = {
            class: 'mjx-' + type,
            viewbox: box.join(' ')
        };
        if (styles) {
            properties.style = styles;
        }
        return this.html('svg', properties, nodes);
    }

    /*
     * Create an ellipse element
     *
     * @param{number} w  The width of the ellipse
     * @param{number} h  The height of the ellipse
     * @return{N}        The newly created ellipse node
     */
    public ellipse(w: number, h: number) {
        const t = this.thickness;
        return this.adjustThickness(this.html('ellipse', {
            rx: this.units((w - t) / 2), ry: this.units((h - t) / 2),
            cx: this.units(w / 2), cy: this.units(h / 2)
        }));
    }

    /*
     * Create a line element
     *
     * @param{number} x1   The x-coordinate of the starting point
     * @param{number} y1   The y-coordinate of the starting point
     * @param{number} x2   The x-coordinate of the ending point
     * @param{number} y2   The y-coordinate of the ending point
     * @return{N}          The newly created line element
     */
    public line(x1: number, y1: number, x2: number, y2: number) {
        return this.adjustThickness(this.html('line', {
            x1: this.units(x1), y1: this.units(y1),
            x2: this.units(x2), y2: this.units(y2)
        }));
    }

    /*
     * Create a path element from the commands the specify it
     *
     * @param{(string|number)[]} P   The list of commands and coordinates for the path
     * @return{N}                    The newly created path
     */
    public path(...P: (string | number)[]) {
        return this.adjustThickness(this.html('path', {
            d: P.map(x => (typeof x === 'string' ? x : this.units(x))).join(' ')
        }));
    }

    /*
     * Create a filled path element from the commands the specify it
     *   (same as path above, but no thickness adjustments)
     *
     * @param{(string|number)[]} P   The list of commands and coordinates for the path
     * @return{N}                    The newly created path
     */
    public fill(...P: (string | number)[]) {
        return this.html('path', {
            d: P.map(x => (typeof x === 'string' ? x : this.units(x))).join(' ')
        });
    }

    /*
     * Create a arrow using an svg element
     *
     * @param{number} w        The length of the arrow
     * @param{number} a        The angle for the arrow
     * @param{number} neg      The direction to shift the arrow's Y coordinate before rotating it (1 or -1)
     * @param{string} origin   The transform-origin for the rotation
     * @param{string} offset   The axis alogn which to offset the rotated arrow
     * @param{number} d        The distance to offset by
     * @param{boolean} double  True if this is a double-headed arrow
     */
    public arrow(w: number, a: number, neg: number, origin: string, offset: string = '', d: number = 0, double: boolean = false) {
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

    /*
     * @param{N} shape   The svg element whose stroke-thickness must be
     *                   adjusted if the thickness isn't the default
     * @return{N}        The adjusted element
     */
    public adjustThickness(shape: N) {
        if (this.thickness !== THICKNESS) {
            this.adaptor.setStyle(shape, 'strokeWidth', this.units(this.thickness));
        }
        return shape;
    }

    /*
     * @param{N} node   The HTML element whose border width must be
     *                  adjusted if the thickness isn't the default
     * @return{N}       The adjusted element
     */
    public adjustBorder(node: N) {
        if (this.thickness !== THICKNESS) {
            this.adaptor.setStyle(node, 'borderWidth', this.em(this.thickness));
        }
        return node;
    }

    /********************************************************/

    /*
     * Create an unattached msqrt wrapper to render the 'radical' notation.
     *   We replace the inferred mrow of the msqrt with the one from the menclose
     *   but without changing the parent pointer, so as not to detach it from
     *   the menclose (which would desrtoy the original MathML tree).
     *
     * @param{CHTMLWrapper} child   The inferred mrow that is the child of this menclose
     * @return{CHTMLmsqrt}          The newly created (but detached) msqrt wrapper
     */
    public createMsqrt(child: CHTMLWrapper<N, T, D>) {
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
        const node = this.wrap(mml) as CHTMLmsqrt<N, T, D>;
        node.parent = this;
        return node;
    }

    /*
     * @return{number[]}  The differences between the msqrt bounding box
     *                    and its child bounding box (i.e., the extra space
     *                    created by the radical symbol).
     */
    public sqrtTRBL() {
        const bbox = this.msqrt.getBBox();
        const cbox = this.msqrt.childNodes[0].getBBox();
        return [bbox.h - cbox.h, 0, bbox.d - cbox.d, bbox.w - cbox.w];
    }
}
