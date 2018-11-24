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
 * @fileoverview  Implements the SVGmo wrapper for the MmlMo object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor, StringMap} from '../Wrapper.js';
import {CommonMo, CommonMoMixin, DirectionVH} from '../../common/Wrappers/mo.js';
import {MmlMo} from '../../../core/MmlTree/MmlNodes/mo.js';
import {BBox} from '../BBox.js';
import {DIRECTION, NOSTRETCH, CharOptions, DelimiterData} from '../FontData.js';


/*****************************************************************/

const VFUZZ = 0.1;       // overlap for vertical stretchy glyphs
const HFUZZ = 0.1;       // overlap for horizontal sgretchy glyphs
const HBEARING = 0.05;   // extra space to accommodate horizontal glyphs that overlap their bounding boxes

/*****************************************************************/
/**
 * The SVGmo wrapper for the MmlMo object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGmo<N, T, D> extends CommonMoMixin<SVGConstructor<N, T, D>>(SVGWrapper) {

    public static kind = MmlMo.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
        const attributes = this.node.attributes;
        const symmetric = (attributes.get('symmetric') as boolean) && this.stretch.dir !== DIRECTION.Horizontal;
        const stretchy = this.stretch.dir !== DIRECTION.None;
        if (stretchy && this.size === null) {
            this.getStretchedVariant([]);
        }
        let svg = this.standardSVGnode(parent);
        if (stretchy && this.size < 0) {
            this.stretchSVG(svg, symmetric);
        } else {
            if (symmetric || attributes.get('largeop')) {
                const bbox = BBox.empty();
                super.computeBBox(bbox);
                const u = this.fixed((bbox.d - bbox.h) / 2 + this.font.params.axis_height);
                if (u !== '0') {
                    this.adaptor.setAttribute(svg, 'transform', 'translate(0 '+ u + ')');
                }
            }
            this.addChildren(svg);
        }
    }

    /**
     * Create the SVG for a multi-character stretchy delimiter
     *
     * @param {N} svg  The parent element in which to put the delimiter
     * @param {boolean} symmetric  Whether delimiter should be symmetric about the math axis
     */
    protected stretchSVG(svg: N, symmetric: boolean) {
        const stretch = this.stretch.stretch;
        const bbox = this.getBBox();
        if (this.stretch.dir === DIRECTION.Vertical) {
            this.stretchVertical(stretch, bbox);
        } else {
            this.stretchHorizontal(stretch, bbox);
        }
    }

    /**
     * @param {number[]} stretch    The characters to use for stretching
     * @param {BBox} bbox           The full size of the stretched character
     */
    protected stretchVertical(stretch: number[], bbox: BBox) {
        const {h, d, w} = bbox;
        const T = this.addTop(stretch[0], h, w);
        const B = this.addBot(stretch[2], d, w);
        if (stretch.length === 4) {
            const [H, D] = this.addMidV(stretch[3], w);
            this.addExtV(stretch[1], h, 0, T, H, w);
            this.addExtV(stretch[1], 0, d, D, B, w);
        } else {
            this.addExtV(stretch[1], h, d, T, B, w);
        }
    }

    /**
     * @param {number[]} stretch    The characters to use for stretching
     * @param {BBox} bbox           The full size of the stretched character
     */
    protected stretchHorizontal(stretch: number[], bbox: BBox) {
        const {h, d, w} = bbox
        const L = this.addLeft(stretch[0]);
        const R = this.addRight(stretch[2], w);
        if (stretch.length === 4) {
            const [x1, x2] = this.addMidH(stretch[3], w);
            const w2 = w / 2;
            this.addExtH(stretch[1], w2, L, w2 - x1);
            this.addExtH(stretch[1], w2, x2 - w2, R, w2);
        } else {
            this.addExtH(stretch[1], w, L, R);
        }
    }

    /***********************************************************/

    /**
     * @param {number} n         The number of the character to look up
     * @return {CharData}        The full CharData object, with CharOptions guaranteed to be defined
     */
    protected getChar(n: number) {
        const char = this.font.getChar('-size4', n) || [0, 0, 0, null];
        return [char[0], char[1], char[2], char[3] || {}] as [number, number, number, CharOptions];
    }

    /**
     * @param {number} n   The character code for the glyph
     * @param {number} x   The x position of the glyph
     * @param {number} y   The y position of the glyph
     * @param {N} parent   The container for the glyph
     * @return {N}         The SVG path for the glyph
     */
    protected addGlyph(n: number, x: number, y: number, parent: N = null) {
        return this.placeChar(n, x, y, parent || this.element, '-size4');
    }

    /***********************************************************/

    /**
     * @param {number} n    The character number for the top glyph
     * @param {number} H    The height of the stretched delimiter
     * @param {number} W    The width of the stretched delimiter
     * @return {number}     The total height of the top glyph
     */
    protected addTop(n: number, H: number, W: number) {
        if (!n)  return 0;
        const [h, d, w] = this.getChar(n);
        this.addGlyph(n, (W - w) / 2, H - h);
        return h + d;
    }

    /**
     * @param {number} n    The character number for the extender glyph
     * @param {number} H    The height of the stretched delimiter
     * @param {number} D    The depth of the stretched delimiter
     * @param {number} T    The height of the top glyph in the delimiter
     * @param {number} B    The height of the bottom glyph in the delimiter
     * @param {number} W    The width of the stretched delimiter
     */
    protected addExtV(n: number, H: number, D: number, T: number, B: number, W: number) {
        if (!n) return;
        const adaptor = this.adaptor;
        const [h, d, w] = this.getChar(n);
        const s = (H + D) / (h + d);
        this.addGlyph(n, 0, 0);
        const glyph = adaptor.lastChild(this.element);
        const scale = 'scale(1 ' + this.jax.fixed(s) + ')';
        const translate = 'translate(' + this.fixed((W - w)/2) + ' ' + this.fixed(d * s - D) + ')';
        adaptor.setAttribute(glyph, 'transform', translate + ' ' + scale);
        const inset = 'inset(' + [this.fixed((B - VFUZZ) / s), 0, this.fixed((T - VFUZZ) / s), 0].join(' ') + ')';
        adaptor.setAttribute(glyph, 'clip-path', inset);
    }

    /**
     * @param {number} n    The character number for the bottom glyph
     * @param {number} D    The depth of the stretched delimiter
     * @param {number} W    The width of the stretched delimiter
     * @return {number}     The total height of the bottom glyph
     */
    protected addBot(n: number, D: number, W: number) {
        if (!n) return 0;
        const [h, d, w] = this.getChar(n);
        this.addGlyph(n, (W - w) / 2, d - D);
        return h + d;
    }

    /**
     * @param {number} n    The character number for the middle glyph
     * @param {number} W    The width of the stretched delimiter
     * @return {number[]}   The top and bottom positions of the middle glyph
     */
    protected addMidV(n: number, W: number) {
        if (!n) return [0, 0];
        const [h, d, w] = this.getChar(n);
        const y = (d - h) / 2 + this.font.params.axis_height;
        this.addGlyph(n, (W - w) / 2, y);
        return [h + y, d - y];
    }

    /***********************************************************/

    /**
     * @param {number} n   The character number for the left glyph of the stretchy character
     * @return {number}    The width of the left glyph
     */
    protected addLeft(n: number) {
        return (n ? this.addGlyph(n, 0, 0) : 0);
    }

    /**
     * @param {number} n   The character number for the extender glyph of the stretchy character
     * @param {number} W   The width of the stretched character
     * @param {number} L   The width of the left glyph of the stretchy character
     * @param {number} R   The width of the right glyph of the stretchy character
     * @param {number} x   The x-position of the extender (needed for ones with two extenders)
     */
    protected addExtH(n: number, W: number, L: number, R: number, x: number = 0) {
        if (!n) return;
        const [h, d, cw] = this.getChar(n);
        const w = cw + 2 * HBEARING;  // add extra space for glyphs that extend beyond their width;
        const s = 2 * (W / w);        // scale it so that left- and right-bearing won't hurt us
        const scale = 'scale(' + this.jax.fixed(s) + ', 1)';
        const inset = [0, this.fixed((Math.max(0, R - HFUZZ) + W / 2) / s),
                       0, this.fixed((Math.max(0, L - HFUZZ) + W / 2) / s)];
        //
        // Use a group with a rect of the full width (since the glyph may have
        // non-zero left- or right-bearing, which will throw off the svg path
        // bounding box).
        //
        const char = this.svg('g', {
            transform: 'translate(' + this.fixed(x - W / 2) + ', 0) ' + scale,
            'clip-path': 'inset(' + inset.join(' ') + ')'
        }, [this.svg('rect', {width: this.fixed(w), height: 1, fill: 'none'})]);
        this.addGlyph(n, HBEARING, 0, char);
        this.adaptor.append(this.element, char);
    }

    /**
     * @param {number} n   The character number for the right glyph of the stretchy character
     * @param {number} W   The width of the stretched character
     * @return {number}    The width of the right glyph
     */
    protected addRight(n: number, W: number) {
        if (!n) return 0;
        const [h, d, w] = this.getChar(n);
        return this.addGlyph(n, W - w, 0);
    }

    /**
     * @param {number} n   The character number for the middle glyph of the stretchy character
     * @param {number} W   The width of the stretched character
     * @return {number[]}  The positions of the left and right edges of the middle glyph
     */
    protected addMidH(n: number, W: number) {
        if (!n) return [0, 0];
        const [h, d, w] = this.getChar(n);
        this.addGlyph(n, (W - w) / 2, 0);
        return [(W - w) / 2, (W + w) / 2];
    }

}
