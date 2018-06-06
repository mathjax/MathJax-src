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
 * @fileoverview  Implements utilities for notations for menclose elements
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {BBox} from './BBox.js';
import {CHTMLmenclose} from './Wrappers/menclose.js';

/*****************************************************************/

export const ARROWX = 4, ARROWDX = 1, ARROWY = 2;  // default relative arrowhead values

export const THICKNESS = .067;  // default rule thickness
export const PADDING = .2;      // default padding

export const SOLID = THICKNESS + 'em solid';  // a solid border

/*****************************************************************/

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
export type DefPair = [string, NotationDef<any, any, any>];
export type DefList = Map<string, NotationDef<any, any, any>>;

/*
 * The list of notations for an menclose element
 */
export type List<N, T, D> = {[notation: string]: NotationDef<N, T, D>};


/*****************************************************************/

/*
 * The names and indices of sides for borders, padding, etc.
 */
export const sideIndex = {top: 0, right: 1, bottom: 2, left: 3};
export type Side = keyof typeof sideIndex;
export const sideNames = Object.keys(sideIndex) as Side[];

/*
 * the spacing to leave for an arrowhead
 */
export const arrowHead = (node: CHTMLmenclose<any, any, any>) => {
    return Math.max(node.padding, node.thickness * (node.arrowhead.x + node.arrowhead.dx + 1));
};

/*
 * Common BBox and Border functions
 */
export const fullBBox = ((node) => new Array(4).fill(node.thickness + node.padding)) as BBoxExtender<any, any, any>;
export const fullPadding = ((node) => new Array(4).fill(node.padding)) as BBoxExtender<any, any, any>;
export const fullBorder = ((node) => new Array(4).fill(node.thickness)) as BBoxBorder<any, any, any>;

/*
 * The data for horizontal and vertical arrow notations
 *   [angle, neg, double, origin, offset, isVertical, remove]
 */
export const arrowDef = {
    up:    [-Math.PI / 2,  1, false, 'bottom left', 'X', true,  'verticalstrike'],
    down:  [ Math.PI / 2, -1, false, 'top left',    'X', true,  'verticakstrike'],
    right: [  0,          -1, false, 'top left',    'Y', false, 'horizontalstrike'],
    left:  [  Math.PI,    -1, false, 'top right',   'Y', false, 'horizontalstrike'],
    updown:    [Math.PI / 2, -1, true, 'top left',  'X', true,  'verticalstrike uparrow downarrow'],
    leftright: [0,           -1, true, 'top left',  'Y', false, 'horizontalstrike leftarrow rightarrow']
} as {[name: string]: [number, number, boolean, string, string, boolean, string]};

/*
 * The data for diagonal arrow notations
 *   [neg, c, pi, double, origin, remove]
 */
export const diagonalArrowDef = {
    updiagonal: [ 1, -1, 0,       false, 'bottom left',  'updiagonalstrike'],
    northeast:  [ 1, -1, 0,       false, 'bottom left',  'updiagonalstrike'],
    southeast:  [-1,  1, 0,       false, 'top left',     'downdiagonalstrike'],
    northwest:  [ 1,  1, Math.PI, false, 'bottom right', 'downdiagonalstrike'],
    southwest:  [-1, -1, Math.PI, false, 'top right',    'updiagonalstrike'],
    northeastsouthwest: [ 1, -1, 0, true, 'bottom left',
                          'updiagonalstrike northeastarrow updiagonalarrow southwestarrow'],
    northwestsoutheast: [-1,  1, 0, true, 'top left',
                          'downdiagonalstrike northwestarrow southeastarrow']
} as {[name: string]: [number, number, number, boolean, string, string]};

/*
 * The BBox functions for horizontal and vertical arrows
 */
export const arrowBBox = {
    up:    (node) => [arrowHead(node), 0, node.padding, 0],
    down:  (node) => [node.padding, 0, arrowHead(node), 0],
    right: (node) => [0, arrowHead(node), 0, node.padding],
    left:  (node) => [0, node.padding, 0, arrowHead(node)],
    updown:    (node) => [arrowHead(node), 0, arrowHead(node), 0],
    leftright: (node) => [0, arrowHead(node), 0, arrowHead(node)]
} as {[name: string]: BBoxExtender<any, any, any>};

/*
 * Create a named element (handled by CSS), and adjust it if thickness is non-standard
 *
 * @param{string} name    The name of the element to create
 * @param{string} offset  The offset direction to adjust if thickness is non-standard
 * @return{Renderer}      The renderer function for the given element name
 */
export const  RenderElement = (name: string, offset: string = '') => {
    return ((node, child) => {
        const shape = node.adjustBorder(node.html('mjx-' + name));
        if (offset && node.thickness !== THICKNESS) {
            const transform = 'translate' + offset + '(' + node.em(node.thickness / 2) + ')';
            node.adaptor.setStyle(shape, 'transform', transform);
        }
        node.adaptor.append(node.chtml, shape);
    }) as Renderer<any, any, any>;
};

/*
 * @param{string} side   The side on which a border should appear
 * @return{DefPair}      The notation definition for the notation having a line on the given side
 */
export const Border = (side: Side) => {
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
    }] as DefPair;
};

/*
 * @param{string} name    The name of the notation to define
 * @param{string} side1   The first side to get a border
 * @param{string} side2   The second side to get a border
 * @return{DefPair}       The notation definition for the notation having lines on two sides
 */
export const Border2 = (name: string, side1: Side, side2: Side) => {
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
    }] as DefPair;
};

/*
 * @param{string} name  The name of the diagonal strike to define
 * @param{number} neg   1 or -1 to use with the angle
 * @return{DefPair}     The notation definition for the diagonal strike
 */
export const DiagonalStrike = (name: string, neg: number) => {
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
        bbox: fullBBox
    }] as DefPair;
};

/*
 * @param{string} name   The name of the diagonal arrow to define
 * @return{DefPair}      The notation definition for the diagonal arrow
 */
export const DiagonalArrow = (name: string) => {
    const [neg, c, pi, double, origin, remove] = diagonalArrowDef[name];
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
    }] as DefPair;
};

/*
 * @param{string} name   The name of the horizontal or vertical arrow to define
 * @return{DefPair}      The notation definition for the arrow
 */
export const Arrow = (name: string) => {
    const [angle, neg, double, origin, offset, isVertical, remove] = arrowDef[name];
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
        bbox: arrowBBox[name],
        //
        // Remove redundant notations
        //
        remove: remove
    }] as DefPair;
};
