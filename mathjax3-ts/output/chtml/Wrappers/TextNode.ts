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
        //
        // Fake a bbox for now (eventually, this will get looked up in the font table)
        //
        this.bbox.w = .5;
        this.bbox.h = .8;
        this.bbox.d = .2;
        return this.bbox;
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
