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
 * @fileoverview  Implements the CHTMLmfenced wrapper for the MmlMfenced object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLinferredMrow} from './mrow.js';
import {MmlMfenced} from '../../../core/MmlTree/MmlNodes/mfenced.js';
import {MmlInferredMrow} from '../../../core/MmlTree/MmlNodes/mrow.js';
import {MmlNode, AbstractMmlNode, AttributeList} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../BBox.js';

/*****************************************************************/
/**
 * The CHTMLmfenced wrapper for the MmlMfenced object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmfenced<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMfenced.prototype.kind;

    //
    // An mrow to use for the layout of the mfenced
    //
    protected mrow: CHTMLinferredMrow<N, T, D> = null;

    /**
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.createMrow();
        this.addMrowChildren();
    }

    /**
     * Creates the mrow wrapper to use for the layout
     */
    protected createMrow() {
        const mmlFactory = (this.node as AbstractMmlNode).factory;
        const mrow = mmlFactory.create('inferredMrow');
        const attributes = this.node.attributes;
        const display = attributes.get('display') as boolean;
        const scriptlevel = attributes.get('scriptlevel') as number;
        const defaults: AttributeList = {
            mathsize: ['math', attributes.get('mathsize')]
        };
        mrow.setInheritedAttributes(defaults, display, scriptlevel, false);
        this.mrow = this.wrap(mrow) as CHTMLinferredMrow<N, T, D>;
        this.mrow.parent = this;
    }

    /**
     * Populate the mrow with wrapped mo elements interleaved
     *   with the mfenced children (the mo's are already created
     *   in the mfenced object)
     */
    protected addMrowChildren() {
        const mfenced = this.node as MmlMfenced;
        const mrow = this.mrow;
        this.addMo(mfenced.open);
        if (this.childNodes.length) {
            mrow.childNodes.push(this.childNodes[0]);
        }
        let i = 0;
        for (const child of this.childNodes.slice(1)) {
            this.addMo(mfenced.separators[i++]);
            mrow.childNodes.push(child);
        }
        this.addMo(mfenced.close);
        mrow.stretchChildren();
    }

    /**
     * Wrap an mo element and push it onto the mrow
     *
     * @param {MmlNode} node  The mo element to push on the mrow
     */
    protected addMo(node: MmlNode) {
        if (!node) return;
        const mo = this.wrap(node);
        this.mrow.childNodes.push(mo);
        mo.parent = this.mrow;
    }

    /**
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = this.standardCHTMLnode(parent);
        this.mrow.toCHTML(chtml);
        this.drawBBox();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox) {
        bbox.updateFrom(this.mrow.getBBox());
    }

}
