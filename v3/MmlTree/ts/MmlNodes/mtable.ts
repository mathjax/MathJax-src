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
 * @fileoverview  Implements the MmlMtable node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Node';
import {MmlNode, AMmlNode, AttributeList, TEXCLASS} from '../MmlNode';
import {INode} from '../Node';

/*****************************************************************/
/*
 *  Implements the MmlMtable node class (subclass of AMmlNode)
 */

export class MmlMtable extends AMmlNode {
    public static defaults: PropertyList = {
        ...AMmlNode.defaults,
        align: 'axis',
        rowalign: 'baseline',
        columnalign: 'center',
        groupalign: '{left}',
        alignmentscope: true,
        columnwidth: 'auto',
        width: 'auto',
        rowspacing: '1ex',
        columnspacing: '.8em',
        rowlines: 'none',
        columnlines: 'none',
        frame: 'none',
        framespacing: '0.4em 0.5ex',
        equalrows: false,
        equalcolumns: false,
        displaystyle: false,
        side: 'right',
        minlabelspacing: '0.8em'
    };
    public properties = {
        useHeight: 1
    };
    public texClass = TEXCLASS.ORD;

    /*
     * @return {string}  The mtable kind
     */
    public get kind() {
        return 'mtable';
    }

    /*
     * @return {boolean}  Linebreaks are allowed in tables
     */
    public get linebreakContainer() {
        return true;
    }

    //
    //  FIXME:  this should be in MathML input jax, not here (if at all)
    //          (currently, this fixes up bad MathML by adding missing <mtr> nodes
    //
    public appendChild(child: MmlNode) {
        if (!child.isKind('mtr')) {
            child = this.factory.create('mtr', {}, [child]);
        }
        return super.appendChild(child);
    }

    /*
     *  Inherit the table attributes, and set the display attribute based on the table's displaystyle attribute
     *
     *  @override
     */
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        display = !!(this.attributes.getExplicit('displaystyle') || this.attributes.getDefault('displaystyle'));
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
