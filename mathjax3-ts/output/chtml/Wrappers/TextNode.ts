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
 * @fileoverview  Implements the CHTMLTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {BBox} from '../BBox.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';
import {CharOptions} from '../FontData.js';

/*****************************************************************/
/*
 *  The CHTMLTextNode wrapper for the TextNode object
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLTextNode<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = TextNode.prototype.kind;

    public static autoStyle = false;
    public static styles = {
        'mjx-c, mjx-c::before': {
            display: 'inline-block'
        }
    };

    /*
     * @override
     */
    public toCHTML(parent: N) {
        let text = (this.node as TextNode).getText();
        if (this.parent.variant === '-explicitFont') {
            this.adaptor.append(parent, this.text(text));
        } else if (this.parent.stretch.c) {
            this.adaptor.append(parent, this.html('mjx-c', {c: this.char(this.parent.stretch.c)}));
        } else {
            for (const n of this.unicodeChars(text)) {
                this.adaptor.append(parent, this.html('mjx-c', {c: this.char(n)}));
            }
        }
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        const variant = this.parent.variant;
        if (variant === '-explicitFont') {
            // FIXME:  measure this using DOM, if possible
        } else {
            const c = this.parent.stretch.c;
            const chars = (c ? [c] : this.unicodeChars((this.node as TextNode).getText()));
            let [h, d, w, data] = this.getChar(variant, chars[0]);
            bbox.h = h;
            bbox.d = d;
            bbox.w = w;
            bbox.ic = data.ic || 0;
            for (let i = 1, m = chars.length; i < m; i++) {
                [h, d, w, data] = this.getChar(variant, chars[i]);
                bbox.w += w;
                if (h > bbox.h) bbox.h = h;
                if (d > bbox.d) bbox.d = d;
                bbox.ic = data.ic || 0;
            }
        }
    }

    /*
     * @param{string} variant   The variant in which to look for the character
     * @param{number} n         The number of the character to look up
     * @return{CharData}        The full CharData object, with CharOptions guaranteed to be defined
     */
    protected getChar(variant: string, n: number) {
        const char = this.font.getChar(variant, n) || [0, 0, 0, null];
        return [char[0], char[1], char[2], char[3] || {}] as [number, number, number, CharOptions];
    }

    /******************************************************/
    /*
     * TextNodes don't need these, since these properties
     *   are inherited from the parent nodes
     */

    /*
     * @override
     */
    public getStyles() {}

    /*
     * @override
     */
    public getVariant() {}

    /*
     * @override
     */
    public getScale() {}
}
