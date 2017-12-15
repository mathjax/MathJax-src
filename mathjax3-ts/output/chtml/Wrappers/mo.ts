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
 * @fileoverview  Implements the CHTMLmo wrapper for the MmlMo object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, StringMap} from '../Wrapper.js';
import {MmlMo} from '../../../core/MmlTree/MmlNodes/mo.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {DelimiterData} from '../FontData.js';
import {StyleList} from '../CssStyles.js';
import {DIRECTION} from '../FontData.js';

/*
 * Convert direction to letter
 */
const DirectionVH: {[n: number]: string} = {
    [DIRECTION.Vertical]: 'v',
    [DIRECTION.Horizontal]: 'h'
};

/*****************************************************************/
/*
 *  The CHTMLmo wrapper for the MmlMo object
 */
export class CHTMLmo extends CHTMLWrapper {
    public static kind = MmlMo.prototype.kind;

    public static styles: StyleList = {
        'mjx-symmetric': {
            'vertical-align': '.25em'
        },
        'mjx-symmetric > mjx-c': {
            'vertical-align': 'middle'
        },

        'mjx-stretchy-h': {
            display: 'inline-table',
            width: '100%',
            'min-width': '1.2em'
        },
        'mjx-stretchy-h > mjx-beg, mjx-stretchy-h > mjx-end': {
            display: 'table-cell',
            width: 0
        },
        'mjx-stretchy-h > mjx-ext': {
            display: 'table-cell',
            overflow: 'hidden',
            width: '100%'
        },
        'mjx-stretchy-h > mjx-ext > mjx-c': {
            transform: 'scalex(1000)',
            margin: '0 -1em'
        },

        'mjx-stretchy-v': {
            display: 'inline-block'
        },
        'mjx-stretchy-v > mjx-beg': {
            display: 'block',
            height: 0
        },
        'mjx-stretchy-v > mjx-end': {
            display: 'block'
        },
        'mjx-stretchy-v > mjx-end > mjx-c': {
            display: 'block'
        },
        'mjx-stretchy-v > mjx-beg > mjx-c, mjx-stretchy-v > mjx-end > mjx-c': {
            overflow: 'hidden'
        },
        'mjx-stretchy-v > mjx-ext': {
            display: 'block',
            height: '100%',
            'box-sizing': 'border-box',
            border: '0px solid transparent',
            overflow: 'hidden'
        },
        'mjx-stretchy-v > mjx-ext > mjx-c': {
            transform: 'scaleY(1000) translateY(.5em)'
        },
        'mjx-mark': {
            display: 'inline-block',
            height: '0px'
        }

    };

    /*
     * The font size that a stretched operator uses.
     * If -1, then stretch arbitrarily, and bbox gives the actual height, depth, width
     */
    public size: number = null;

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        // eventually handle centering, largop, etc.
        const attributes = this.node.attributes;
        const symmetric = attributes.get('symmetric') as boolean;
        if (this.stretch && this.size === null) {
            this.getStretchedVariant([]);
        }
        let chtml = this.standardCHTMLnode(parent);
        if (this.stretch && this.size < 0) {
            this.stretchHTML(chtml, symmetric);
        } else {
            if (symmetric || attributes.get('largeop')) {
                chtml = chtml.appendChild(this.html('mjx-symmetric'));
            }
            for (const child of this.childNodes) {
                child.toCHTML(chtml);
            }
        }
    }

    /*
     * Create the HTML for a multi-character stretchy delimiter
     *
     * @param{HTMLElement} chtml  The parent element in which to put the delimiter
     * @param{boolean} symmetric  Whether delimiter should be symmetric about the math axis
     */
    protected stretchHTML(chtml: HTMLElement, symmetric: boolean) {
        const c = this.getText().charCodeAt(0);
        const C = this.font.getDelimiter(c).stretch;
        const content: HTMLElement[] = [];
        //
        //  Set up the beginning, extension, and end pieces
        //
        if (C[0]) {
            content.push(this.html('mjx-beg', {}, [this.html('mjx-c')]));
        }
        content.push(this.html('mjx-ext', {}, [this.html('mjx-c')]));
        if (C.length === 4) {
            //
            //  Braces have a middle and second extensible piece
            //
            content.push(
                this.html('mjx-mid', {}, [this.html('mjx-c')]),
                this.html('mjx-ext', {}, [this.html('mjx-c')])
            );
        }
        if (C[2]) {
            content.push(this.html('mjx-end', {}, [this.html('mjx-c')]));
        }
        //
        //  Set the styles needed
        //
        const styles: StringMap = {};
        const {h, d, w} = this.bbox;
        if (this.stretch === DIRECTION.Vertical) {
            //
            //  Vertical needs an extra (empty) element to get vertical position right
            //  in some browsers (e.g., Safari)
            //
            content.push(this.html('mjx-mark'));
            styles.height = this.em(h + d);
            styles.verticalAlign = this.em(-d);
        } else {
            styles.width = this.em(w);
        }
        //
        //  Make the main element and add it to the parent
        //
        const dir = DirectionVH[this.stretch];
        const html = this.html('mjx-stretchy-' + dir, {c: this.char(c), style: styles}, content);
        chtml.appendChild(html);
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        const symmetric = this.node.attributes.get('symmetric');
        if (this.stretch && this.size === null) {
            this.getStretchedVariant([0]);
        }
        if (this.stretch && this.size < 0) return;
        super.computeBBox(bbox);
        if (symmetric) {
            const d = ((bbox.h + bbox.d) / 2 + this.font.params.axis_height) - bbox.h;
            bbox.h += d;
            bbox.d += d;
        }
    }

    /*
     * @override
     */
    protected getVariant() {
        if (this.node.attributes.get('largeop')) {
            this.variant = (this.node.attributes.get('displaystyle') ? '-largeop' : '-smallop');
        } else {
            super.getVariant();
        }
    }

    /*
     * @override
     */
    public canStretch(direction: DIRECTION) {
        const attributes = this.node.attributes;
        if (!attributes.get('stretchy')) return false;
        const c = this.getText();
        if (c.length !== 1) return false;
        const delim = this.font.getDelimiter(c.charCodeAt(0));
        this.stretch = (delim && delim.dir === direction ? delim.dir : DIRECTION.None);
        return this.stretch !== DIRECTION.None;
    }

    /*
     * Determint variant for vertically/horizontally stretched character
     *
     * @param{number[]} WH  size to stretch to, either [W] or [H, D]
     * @param{boolean} exact  True if not allowed to use delimiter factor and shortfall
     */
    public getStretchedVariant(WH: number[], exact: boolean = false) {
        if (this.stretch) {
            let D = this.getWH(WH);
            const min = this.getSize('minsize', 0);
            const max = this.getSize('maxsize', Infinity);
            //
            //  Clamp the dimension to the max and min
            //  then get the minimum size via TeX rules
            //
            D = Math.max(min, Math.min(max, D));
            const m = (min || exact ? D : Math.max(D * this.font.params.delimiterfactor / 1000,
                                                   D - this.font.params.delimitershortfall));
            //
            //  Look through the delimiter sizes for one that matches
            //
            const c = this.getText().charCodeAt(0);
            const delim = this.font.getDelimiter(c);
            let i = 0;
            for (const d of delim.sizes) {
                if (d >= m) {
                    this.variant = this.font.getSizeVariant(c, i);
                    this.size = i;
                    return;
                }
                i++;
            }
            //
            //  No size matches, so if we can make multi-character delimiters,
            //  record the data for that, otherwise, use the largest fixed size.
            //
            if (delim.stretch) {
                this.size = -1;
                this.getStretchBBox(WH, D, delim);
            } else {
                this.variant = this.font.getSizeVariant(c, i - 1);
                this.size = i - 1;
            }
        }
    }

    /*
     * @param{string} name  The name of the attribute to fix
     * @param{number} value  The default value to use
     */
    protected getSize(name: string, value: number) {
        let attributes = this.node.attributes;
        if (attributes.isSet(name)) {
            value = this.length2em(attributes.get(name), 1, 1); // FIXME: should use height of actual character
        }
        return value;
    }

    /*
     * @param{number[]} WH  Either [W] for width, [H, D] for height and depth, or [] for min/max size
     */
    protected getWH(WH: number[]) {
        if (WH.length === 0) return 0;
        if (WH.length === 1) return WH[0];
        let [H, D] = WH;
        const a = this.font.params.axis_height;
        return (this.node.attributes.get('symmetric') ? 2 * Math.max(H - a, D + a) : H + D);
    }

    /*
     * @param{number[]} WHD     The [W] or [H, D] being requested from the parent mrow
     * @param{number} D         The full dimension (including symmetry, etc)
     * @param{DelimiterData} C  The delimiter data for the stretchy character
     */
    protected getStretchBBox(WHD: number[], D: number, C: DelimiterData) {
        let [h, d, w] = C.HDW;
        if (this.stretch === DIRECTION.Vertical) {
            [h, d] = this.getBaseline(WHD, D, C);
        } else {
            w = D;
        }
        this.bbox.h = h;
        this.bbox.d = d;
        this.bbox.w = w;
    }

    /*
     * @param{number[]} WHD     The [H, D] being requested from the parent mrow
     * @param{number} HD        The full height (including symmetry, etc)
     * @param{DelimiterData} C  The delimiter data for the stretchy character
     * @param{number[]}         The height and depth for the vertically stretched delimiter
     */
    protected getBaseline(WHD: number[], HD: number, C: DelimiterData) {
        const hasWHD = (WHD.length === 2);
        const symmetric = (hasWHD && this.node.attributes.get('symmetric'));
        const [H, D] = (hasWHD ? WHD : [HD, 0]);
        let [h, d] = [H + D, 0];
        if (symmetric) {
            //
            //  Center on the math axis
            //
            const a = this.font.params.axis_height;
            h = 2 * Math.max(H - a, D + a);
            d = h / 2 - a;
        } else if (hasWHD) {
            //
            //  Use the given depth (from mrow)
            //
            d = D;
        } else {
            //
            //  Use depth proportional to the normal-size character
            //  (when stretching for minsize or maxsize by itself)
            //
            let [ch, cd] = (C.HDW || [.75, .25]);
            d = cd * (h / (ch + cd));
        }
        return [h - d, d];
    }

}
