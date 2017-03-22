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
 * @fileoverview  Implements the MmlMmultiscripts node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Node';
import {AMmlNode, AttributeList} from '../MmlNode';
import {MmlMsubsup} from './msubsup';

/*****************************************************************/
/*
 *  Implements the MmlMmultiscripts node class (subclass of MmlMsubsup)
 */

export class MmlMmultiscripts extends MmlMsubsup {
    public static defaults: PropertyList = {
        ...MmlMsubsup.defaults
    };

    /*
     * @return {string}  The mmultiscripts kind
     */
    public get kind() {
        return 'mmultiscripts';
    }

    /*
     * @return {number}  <mmultiscripts> requires at least one child (the base)
     */
    public get arity() {
        return 1;
    }

    /*
     * Push the inherited values to the base
     * For the scripts, use displaystyle = false, scriptlevel + 1, and
     *   set the primestyle in the subscripts
     *
     * @override
     */
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        this.childNodes[0].setInheritedAttributes(attributes, display, level, prime);
        let n = 0;
        for (const child of this.childNodes.slice(1)) {
            if (!child.isKind('mprescripts')) {
                let primestyle = prime || (n % 2 === 0);
                child.setInheritedAttributes(attributes, false, level + 1, primestyle);
                n++;
            }
        }
    }
}

/*****************************************************************/
/*
 *  Implements the MmlMprescripts node class (subclass of AMmlNode)
 */

export class MmlMprescripts extends AMmlNode {
    public static defaults: PropertyList = {
        ...AMmlNode.defaults
    };

    /*
     * @return {string}  The mprescripts kind
     */
    public get kind() {
        return 'mprescripts';
    }

    /*
     * @return {number}  <mprescripts> can have no children
     */
    public get arity() {
        return 0;
    }
}

/*****************************************************************/
/*
 *  Implements the MmlNone node class (subclass of AMmlNode)
 */

export class MmlNone extends AMmlNode {
    public static defaults: PropertyList = {
        ...AMmlNode.defaults
    };

    /*
     * @return {string}  The none kind
     */
    public get kind() {
        return 'none';
    }

    /*
     * @return {number}  <none> can have no children
     */
    public get arity() {
        return 0;
    }
}
