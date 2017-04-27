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
 * @fileoverview  Implements the MmlMtr and MmlMlabeledtr nodes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList, Node} from '../Node.js';
import {MmlNode, AbstractMmlNode, AttributeList} from '../MmlNode.js';
import {INHERIT} from '../Attributes.js';

/*****************************************************************/
/*
 *  Implements the MmlMtr node class (subclass of AbstractMmlNode)
 */

export class MmlMtr extends AbstractMmlNode {
    public static defaults: PropertyList = {
        ...AbstractMmlNode.defaults,
        rowalign: INHERIT,
        columnalign: INHERIT,
        groupalign: INHERIT
    };

    /*
     * @return {string}  The mtr kind
     */
    public get kind() {
        return 'mtr';
    }

    /*
     * @return {boolean}  <mtr> can contain linebreaks
     */
    public get linebreakContainer() {
        return true;
    }

    //
    // FIXME: Should be in MathML input jax, not here (if at all)
    //
    public appendChild(child: MmlNode) {
        if (!child.isKind('mtd')) {
            child = this.factory.create('mtd', {}, [child]);
        }
        return super.appendChild(child);
    }

    /*
     * Inherit the mtr attributes
     *
     * @override
     */
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
        super.setChildInheritedAttributes(attributes, display, level, prime);
    }

    /*
     * @override
     */
    public setTeXclass(prev: MmlNode) {
        this.getPrevClass(prev);
        for (const child of this.childNodes) {
            child.setTeXclass(null);
        }
        return this;
    }
}

/*****************************************************************/
/*
 *  Implements the MmlMlabeledtr node class (subclass of MmlMtr)
 */

export class MmlMlabeledtr extends MmlMtr {

    /*
     * @return {string}  The mtr kind
     */
    public get kind() {
        return 'mlabeledtr';
    }

    /*
     * @return {number}  <mlabeledtr> requires at least one child (the label)
     */
    get arity() {
        return 1;
    }
}
