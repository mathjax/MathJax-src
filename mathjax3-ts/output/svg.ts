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
 * @fileoverview  Implements the SVG OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CommonOutputJax} from './common/OutputJax.js';
import {OptionList} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {SVGWrapper} from './svg/Wrapper.js';
import {SVGWrapperFactory} from './svg/WrapperFactory.js';
import {TeXFont} from './svg/fonts/tex.js';

export const SVGNS = "http://www.w3.org/2000/svg";

/*****************************************************************/
/**
 *  Implements the CHTML class (extends AbstractOutputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVG<N, T, D> extends CommonOutputJax<N, T, D, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>> {

    public static NAME: string = 'SVG';
    public static OPTIONS: OptionList = {...CommonOutputJax.OPTIONS};

    /**
     *  Used to store the CHTMLWrapper factory,
     *  the FontData object, and the CssStyles object.
     */
    public factory: SVGWrapperFactory<N, T, D>;
    public font: TeXFont;

    /**
     * Minimum width for tables with labels,
     * and shift and align for main equation
     */
    public minwidth: number = 0;
    public shift: number = 0;

    /**
     * The container element for the math
     */
    public container: N;

    /**
     * @override
     * @constructor
     */
    constructor(options: OptionList = null) {
        super(options, SVGWrapperFactory, TeXFont);
    }

    /**
     * @override
     */
    public escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
        this.setDocument(html);
        return this.html('span', {}, [this.text(math.math)]);
    }

    /**
     * @override
     */
    public styleSheet(html: MathDocument<N, T, D>) {
        const sheet = super.styleSheet(html);
        this.adaptor.setAttribute(sheet, 'id', 'SVG-styles');
        return sheet;
    }

    /**
     * @override
     */
    protected addClassStyles(CLASS: typeof SVGWrapper) {
        super.addClassStyles(CLASS);
    }

    /**
     * @param {MmlNode} math  The MML node whose SVG is to be produced
     * @param {N} parent      The HTML node to contain the SVG
     */
    protected processMath(math: MmlNode, parent: N) {
        const container = this.container;
        this.container = parent;
        const wrapper = this.factory.wrap(math);
        const {w, h, d, pwidth} = wrapper.getBBox();
        const adaptor = this.adaptor;
        const px = (this.font.params.x_height / wrapper.metrics.ex);
        const H = (Math.ceil(h / px) + 1) * px + 2/1000;  // round to pixels and add padding
        const D = (Math.ceil(d / px) + 1) * px + 2/1000;
        const g = this.svg('g', {
            stroke: 'currentColor', fill: 'currentColor',
            'stroke-width': 0, transform: 'matrix(1 0 0 -1 0 0)'
        }) as N;
        const svg = adaptor.append(parent, this.svg('svg', {
            xmlns: SVGNS,
            width: this.ex(w), height: this.ex(H + D),
            style: {'vertical-align': this.ex(-D)},
            viewBox: [0, this.fixed(-H * 1000, 1), this.fixed(w * 1000, 1), this.fixed((H + D) * 1000, 1)].join(' ')
        }, [g])) as N;
        if (pwidth) {
            adaptor.setAttribute(svg, 'width', pwidth);
            adaptor.removeAttribute(svg, 'viewBox');
            adaptor.removeAttribute(g, 'transform');
        }
        this.minwidth = this.shift = 0;
        wrapper.toSVG(g);
        if (this.minwidth) {
            adaptor.setStyle(svg, 'minWidth', this.ex(this.minwidth));
        } else if (this.shift) {
            const align = adaptor.getAttribute(parent, 'justify') || 'center';
            this.setIndent(svg, align, this.shift);
        }
        this.container = container;
    }

    /**
     * @param {N} svg         The svg node whose indentation is to be adjusted
     * @param {string} align  The alignment for the node
     * @param {number} shift  The indent (positive or negative) for the node
     */
    protected setIndent(svg: N, align: string, shift: number) {
        if (align === 'center' || align === 'left') {
            this.adaptor.setStyle(svg, 'margin-left', this.ex(shift));
        }
        if (align === 'center' || align === 'right') {
            this.adaptor.setStyle(svg, 'margin-right', this.ex(-shift));
        }
    }

    /**
     * @param {number} m  A number to be shown in ex
     * @return {string}   The number with units of ex
     */
    ex(m: number) {
        m /= this.font.params.x_height;
        if (Math.abs(m) < .001) return '0';
        return (m.toFixed(3).replace(/\.?0+$/, '')) + 'ex';
    }

    /**
     * @param {number} m    A number to be shown with a fixed number of digits
     * @param {number=} n   The number of digits to use
     * @return {string}     The formatted number
     */
    fixed(m: number, n: number = 3) {
        if (Math.abs(m) < .0006) return "0";
        return m.toFixed(n).replace(/\.?0+$/,"");
    }

    /**
     * @param {string} kind             The kind of node to create
     * @param {OptionList} properties   The properties to set for the element
     * @param {N[]} children            The child nodes for this node
     * @return {N}                      The newly created node in the SVG namespace
     */
    svg(kind: string, properties: OptionList = {}, children: N[] = []) {
        return this.html(kind, properties, children, SVGNS);
    }
}
