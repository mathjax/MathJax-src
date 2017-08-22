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
 * @fileoverview  Implements the CHTMLsemantics wrapper for the Mmlsemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {BBox} from '../BBox.js';
import {MmlSemantics, MmlAnnotation, MmlAnnotationXML} from '../../../core/MmlTree/MmlNodes/semantics.js';
import {MmlNode, XMLNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/*
 *  The CHTMLsemantics wrapper for the MmlSemantics object
 */

export class CHTMLsemantics extends CHTMLWrapper {
    public static kind = MmlSemantics.prototype.kind;

    /*
     * Only the first child of <semantics> is displayed
     *
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        const chtml = this.standardCHTMLnode(parent);
        if (this.childNodes.length) {
            this.childNodes[0].toCHTML(chtml);
        }
    }

    /*
     * @override
     */
    public computeBBox() {
        const bbox = this.bbox;
        if (this.childNodes.length) {
            const {w, h, d} = this.childNodes[0].getBBox();
            bbox.w = w;
            bbox.h = h;
            bbox.d = d;
        }
        return bbox;
    }

}


/*****************************************************************/
/*
 *  The CHTMLannotation wrapper for the MmlAnnotation object
 */

export class CHTMLannotation extends CHTMLWrapper {
    public static kind = MmlAnnotation.prototype.kind;

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        // FIXME:  output as plain text
        super.toCHTML(parent);
    }

    /*
     * @override
     */
    public computeBBox() {
        // FIXME:  compute using the DOM, if possible
        return this.bbox;
    }

}

/*****************************************************************/
/*
 *  The CHTMLannotationXML wrapper for the MmlAnnotationXML object
 */

export class CHTMLannotationXML extends CHTMLWrapper {
    public static kind = MmlAnnotationXML.prototype.kind;
}

/*****************************************************************/
/*
 *  The CHTMLxml wrapper for the XMLNode object
 */

export class CHTMLxml extends CHTMLWrapper {
    public static kind = XMLNode.prototype.kind;

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        parent.appendChild(((this.node as XMLNode).getXML() as HTMLElement).cloneNode(true));
    }

    /*
     * @override
     */
    public computeBBox() {
        // FIXME:  compute using the DOM, if possible
        return this.bbox;
    }

    /*
     * @override
     */
    protected getStyles() {}

    /*
     * @override
     */
    protected getScale() {}

    /*
     * @override
     */
    protected getVariant() {}
}
