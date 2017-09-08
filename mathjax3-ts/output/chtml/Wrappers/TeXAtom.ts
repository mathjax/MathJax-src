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
 * @fileoverview  Implements the CHTMLTeXAtom wrapper for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {BBox} from '../BBox.js';
import {TeXAtom} from '../../../core/MmlTree/MmlNodes/TeXAtom.js';
import {MmlNode, TEXCLASS} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/*
 *  The CHTMLTeXAtom wrapper for the TeXAtom object
 */

export class CHTMLTeXAtom extends CHTMLWrapper {
    public static kind = TeXAtom.prototype.kind;

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        super.toCHTML(parent);
        //
        // Center VCENTER atoms vertically
        //
        if (this.node.texClass === TEXCLASS.VCENTER) {
            const bbox = super.computeBBox();  // get unmodified bbox of children
            const {h, d} = bbox;
            const a = this.font.params.axis_height;
            const dh = ((h + d) / 2 + a) - h;  // new height minus old height
            this.chtml.style.verticalAlign = this.em(dh);
        }
    }

    /*
     * @override
     */
    public computeBBox() {
        const bbox = super.computeBBox();
        //
        // Center VCENTER atoms vertically
        //
        if (this.node.texClass === TEXCLASS.VCENTER) {
            const {h, d} = bbox;
            const a = this.font.params.axis_height;
            const dh = ((h + d) / 2 + a) - h;  // new height minus old height
            bbox.h += dh;
            bbox.d += dh;
        }
        return bbox;
    }

}
