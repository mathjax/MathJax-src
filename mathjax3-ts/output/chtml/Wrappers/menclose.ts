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

import {CHTMLWrapper, CHTMLConstructor, StringMap} from '../Wrapper.js';
import {CommonMenclose, CommonMencloseMixin} from '../../common/Wrappers/menclose.js';
import {CHTMLmsqrt} from './msqrt.js';
import {BBox} from '../BBox.js';
import * as Notation from '../Notation.js';
import {MmlMenclose} from '../../../core/MmlTree/MmlNodes/menclose.js';
import {MmlNode, AbstractMmlNode, AttributeList} from '../../../core/MmlTree/MmlNode.js';
import {OptionList} from '../../../util/Options.js';
import {StyleList, StyleData} from '../../common/CssStyles.js';
import {split} from '../../../util/string.js';

/*****************************************************************/
/**
 * The CHTMLmenclose wrapper for the MmlMenclose object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmenclose<N, T, D> extends
CommonMencloseMixin<CHTMLWrapper<N, T, D>, CHTMLmsqrt<N, T, D>, N, CHTMLConstructor<N, T, D>>(CHTMLWrapper) {

    public static kind = MmlMenclose.prototype.kind;

    /**
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
            'border-top': Notation.SOLID,
            'transform-origin': 'top left'
        },
        'mjx-menclose > mjx-ustrike': {
            display: 'inline-block',
            left: 0, bottom: 0,
            position: 'absolute',
            'border-top': Notation.SOLID,
            'transform-origin': 'bottom left'
        },
        'mjx-menclose > mjx-hstrike': {
            'border-top': Notation.SOLID,
            position: 'absolute',
            left: 0, right: 0, bottom: '50%',
            transform: 'translateY(' + (Notation.THICKNESS / 2) + 'em)'
        },
        'mjx-menclose > mjx-vstrike': {
            'border-left': Notation.SOLID,
            position: 'absolute',
            top: 0, bottom: 0, right: '50%',
            transform: 'translateX(' + (Notation.THICKNESS / 2) + 'em)'
        },
        'mjx-menclose > mjx-rbox': {
            position: 'absolute',
            top: 0, bottom: 0, right: 0, left: 0,
            'border': Notation.SOLID,
            'border-radius': (Notation.THICKNESS + Notation.PADDING) + 'em'
        },
        'mjx-menclose > svg.mjx-circle': {
            position: 'absolute',
            top: 0, bottom: 0, right: 0, left: 0,
            width: '100%', height: '100%'
        },
        'mjx-menclose > svg.mjx-circle > ellipse': {
            'stroke-width': Notation.THICKNESS,
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
            'stroke-width': Notation.THICKNESS,
            'stroke-linecap': 'round'
        },
        'mjx-menclose > svg.mjx-longdiv': {
            position: 'absolute',
            top: 0, bottom: 0, left: 0, right: 0,
            width: '100%', height: '100%'
        },
        'mjx-menclose > svg.mjx-longdiv > path': {
            'stroke': 'currentColor',
            'stroke-width': Notation.THICKNESS,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            fill: 'none',
        }
    };

    /**
     *  The definitions of the various notations
     */
    public static notations: Notation.DefList<CHTMLmenclose<any, any, any>, any> = new Map([

        Notation.Border('top'),
        Notation.Border('right'),
        Notation.Border('bottom'),
        Notation.Border('left'),

        Notation.Border2('actuarial', 'top', 'right'),
        Notation.Border2('madruwb', 'bottom', 'right'),

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

    ] as Notation.DefPair<CHTMLmenclose<any, any, any>, any>[]);

    /********************************************************/

    /**
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
        for (const name of Notation.sideNames) {
            const i = Notation.sideIndex[name];
            pbox[i] > 0 && adaptor.setStyle(block, 'padding-' + name, this.em(pbox[i]));
        }
    }

    /********************************************************/

    /**
     * @override
     */
    public svgNode(kind: string, properties: OptionList = {}, nodes: N[] = []) {
        return this.html(kind, properties, nodes);
    }

    /**
     * @param {N} node   The HTML element whose border width must be
     *                  adjusted if the thickness isn't the default
     * @return {N}       The adjusted element
     */
    public adjustBorder(node: N) {
        if (this.thickness !== Notation.THICKNESS) {
            this.adaptor.setStyle(node, 'borderWidth', this.em(this.thickness));
        }
        return node;
    }

    /********************************************************/

    /**
     * @override
     * (make it public so it can be called by the notation functions)
     */
    public em(m: number) {
        return super.em(m);
    }

}
