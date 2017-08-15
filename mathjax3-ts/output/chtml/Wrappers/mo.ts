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
 * @fileoverview  Implements the CHTMLmfracr wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {MmlMo} from '../../../core/MmlTree/MmlNodes/mo.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';

/*****************************************************************/
/*
 *  These will be part of a font class in the future.  They are
 *  just temporary for now.
 */

/*
 * Stretchy delimiter data
 */
type DelimiterData = {
    dir: string;
    sizes: [number];
    fonts?: [number];
};

/*
 * The stretch direction
 */
const V = 'V';
const H = 'H';

/*
 * The delimiter list (will be longer in the future)
 */
const DELIMITERS: {[n: number]: DelimiterData} = {
    0x0028: {dir: V, sizes: [1, 1.2, 1.8, 2.4, 3.0]}
};

const VARIANT = ['normal', '-smallop', '-largeop', '-size3', '-size4'];

/*****************************************************************/
/*
 *  The CHTMLmo wrapper for the MmlMo object
 */
export class CHTMLmo extends CHTMLWrapper {
    public static kind = MmlMo.prototype.kind;

    /*
     * The font size that a stretched operator uses.
     * If -1, then stretch arbitrarily, and WHD gives the actual width or height to use
     */
    protected size: number = null;
    protected WH: number = 0;

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        // eventually handle centering, largop, etc.
        let attributes = this.node.attributes;
        if (this.stretch && this.size === null) {
            this.getStretchedVariant(0);
        }
        let chtml = this.standardCHTMLnode(parent);
        if (attributes.get('symmetric') || attributes.get('largeop')) {
            chtml = chtml.appendChild(this.html('mjx-symmetric'));
        }
        for (const child of this.childNodes) {
            child.toCHTML(chtml);
        }
    }

    /*
     * @override
     */
    public computeBBox() {
        // eventually handle centering, largop, etc.
        if (this.stretch && this.size === null) {
            this.getStretchedVariant(0);
        }
        return super.computeBBox();
    }

    /*
     * @override
     */
    getVariant() {
        if (this.node.attributes.get('largeop')) {
            this.variant = (this.node.attributes.get('displaystyle') ? '-largeop' : '-smallop');
        } else {
            super.getVariant();
        }
    }

    /*
     * @override
     */
    public canStretch(direction: string) {
        const attributes = this.node.attributes;
        if (!attributes.get('stretchy')) return false;
        let c = this.getText();
        if (c.length !== 1) return false;
        let C = DELIMITERS[c.charCodeAt(0)];
        this.stretch = (C && C.dir === direction.substr(0, 1) ? C.dir : '');
        return this.stretch !== '';
    }

    /*
     * Determint variant for vertically/horizontally stretched character
     *
     * @param{number} D  size to stretch to
     */
    public getStretchedVariant(D: number) {
        if (this.stretch) {
            let min = this.getSize('minsize', 0);
            let max = this.getSize('maxsize', Infinity);
            D = Math.max(min, Math.min(max, D));
            const m = (min ? D : Math.max(D * this.TeX.delimiterfactor / 1000, D - this.TeX.delimitershortfall));
            let i = 0;
            for (const d of DELIMITERS[this.getText().charCodeAt(0)].sizes) {
                if (d >= m) {
                    this.variant = VARIANT[i];
                    this.size = i;
                    return;
                }
                i++;
            }
            this.size = -1;
            this.WH = D;
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

}
