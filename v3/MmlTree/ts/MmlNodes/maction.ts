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
 * @fileoverview  Implements the MmlMaction node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Node';
import {MmlNode, AMmlNode, IMmlNode} from '../MmlNode';

/*****************************************************************/
/*
 *  Implements the MmlMaction node class (subclass of AMmlNode)
 */

export class MmlMaction extends AMmlNode {
    public static defaults: PropertyList = {
        ...AMmlNode.defaults,
        actiontype: 'toggle',
        selection: 1
    };

    /*
     *  @return {string}  The maction kind
     */
    public get kind() {
        return 'maction';
    }

    /*
     * @return {number}  Any nummber of nodes
     */
    public get arity() {
        return Infinity;
    }

    /*
     * @return {MmlNode}  The selected child node (or an mrow if none selected)
     */
    public get selected(): MmlNode {
        return this.childNodes[(this.attributes.get('selection') as number) - 1] || this.factory.create('mrow');
    }

    /*
     * @override
     */
    public get isEmbellished() {
        return this.selected.isEmbellished;
    }

    /*
     * @override
     */
    public get isSpacelike() {
        return this.selected.isSpacelike;
    }

    /*
     * @override
     */
    public core(): MmlNode {
        return this.selected.core();
    }

    /*
     * @override
     */
    public coreMO(): MmlNode {
        return this.selected.coreMO();
    }

    /*
     * Get the TeX class from the selceted node
     * For tooltips, set TeX classes within the tip as a separate math list
     *
     * @override
     */
    public setTeXclass(prev: MmlNode) {
        if (this.attributes.get('actiontype') === 'tooltip' && this.childNodes[1]) {
            this.childNodes[1].setTeXclass(null);
        }
        let selected = this.selected;
        prev = selected.setTeXclass(prev);
        this.updateTeXclass(selected);
        return prev;
    }
}
