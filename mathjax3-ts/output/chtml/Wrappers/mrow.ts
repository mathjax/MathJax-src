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
 * @fileoverview  Implements the CHTMLmrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {MmlMrow, MmlInferredMrow} from '../../../core/MmlTree/MmlNodes/mrow.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/*
 * The CHTMLmrow wrapper for the MmlMrow object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmrow<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMrow.prototype.kind;

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.stretchChildren();
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = (this.node.isInferred ? (this.chtml = parent) : this.standardCHTMLnode(parent));
        let hasNegative = false;
        for (const child of this.childNodes) {
            child.toCHTML(chtml);
            if (child.bbox.w < 0) {
                hasNegative = true;
            }
            if (child.bbox.pwidth) {
                this.makeFullWidth();
            }
        }
        // FIXME:  handle line breaks
        if (hasNegative) {
            const {w} = this.getBBox();
            if (w) {
                this.adaptor.setStyle(chtml, 'width', this.em(Math.max(0, w)));
                if (w < 0) {
                    this.adaptor.setStyle(chtml, 'marginRight', this.em(w));
                }
            }
        }
    }

    /*
     * Handle the case where a child has a percentage width by
     * marking the parent as 100% width.
     */
    protected makeFullWidth() {
        this.bbox.pwidth = '100%';
        this.adaptor.setAttribute(this.chtml, 'width', 'full');
    }

    /*
     * Handle vertical stretching of children to match height of
     *  other nodes in the row.
     */
    protected stretchChildren() {
        let stretchy: CHTMLWrapper<N, T, D>[] = [];
        //
        //  Locate and count the stretchy children
        //
        for (const child of this.childNodes) {
            if (child.canStretch(DIRECTION.Vertical)) {
                stretchy.push(child);
            }
        }
        let count = stretchy.length;
        let nodeCount = this.childNodes.length;
        if (count && nodeCount > 1) {
            let H = 0, D = 0;
            //
            //  If all the children are stretchy, find the largest one,
            //  otherwise, find the height and depth of the non-stretchy
            //  children.
            //
            let all = (count > 1 && count === nodeCount);
            for (const child of this.childNodes) {
                const noStretch = (child.stretch.dir === DIRECTION.None);
                if (all || noStretch) {
                    const {h, d} = child.getBBox(noStretch);
                    if (h > H) H = h;
                    if (d > D) D = d;
                }
            }
            //
            //  Stretch the stretchable children
            //
            for (const child of stretchy) {
                child.coreMO().getStretchedVariant([H, D]);
            }
        }
    }

}

/*****************************************************************/
/*
 *  The CHTMLinferredMrow wrapper for the MmlInferredMrow object
 */

export class CHTMLinferredMrow<N, T, D> extends CHTMLmrow<N, T, D> {
    public static kind = MmlInferredMrow.prototype.kind;

    /*
     * Since inferred rows don't produce a container span, we can't
     * set a font-size for it, so we inherit the parent scale
     *
     * @override
     */
    protected getScale() {
        this.bbox.scale = this.parent.bbox.scale;
        this.bbox.rscale = 1;
    }
}
