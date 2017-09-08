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

/*****************************************************************/
/*
 *  The CHTMLTextNode wrapper for the TextNode object
 */

export class CHTMLTextNode extends CHTMLWrapper {
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
    public toCHTML(parent: HTMLElement) {
        let text = (this.node as TextNode).getText();
        if (this.parent.variant === '-explicitFont') {
            parent.appendChild(this.text(text));
        } else {
            for (const n of this.unicodeChars(text)) {
                parent.appendChild(this.html('mjx-c', {c: this.char(n)}));
            }
        }
    }

    /*
     * @override
     */
    public computeBBox() {
        const variant = this.parent.variant;
        let bbox = this.bbox;
        if (variant === '-explicitFont') {
            // FIXME:  measure this using DOM, if possible
        } else {
            const chars = this.unicodeChars((this.node as TextNode).getText());
            let [h, d, w] = this.font.getChar(variant, chars[0]) || [0, 0, 0];
            bbox.h = h;
            bbox.d = d;
            bbox.w = w;
            for (let i = 1, m = chars.length; i < m; i++) {
                [h, d, w] = this.font.getChar(variant, chars[i]) || [0, 0, 0];
                bbox.w += w;
                if (h > bbox.h) bbox.h = h;
                if (d > bbox.d) bbox.d = d;
            }
        }
        return bbox;
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
