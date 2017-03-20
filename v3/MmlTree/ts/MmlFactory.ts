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
 * @fileoverview  Implements the MmlFactory to create Mml Nodes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {NodeFactory} from './NodeFactory.js';
import {MmlNodeClass} from './MmlNode.js';
import {MML} from './MML.js';

/*****************************************************************/
/*
 *  Implements the MmlFactory (subclass of NodeFactory)
 */

export class MmlFactory extends NodeFactory {
    /*
     * @parm {object} nodes  The list of node kinds and classes that can be created
     *                       (defaults to the standard MML nodes)
     *
     * @constructor
     * @extends {NodeFactory}
     */
    constructor(nodes: {[kind: string]: MmlNodeClass} = MML) {
        super(nodes);
    }
    /*
     * @return {object}  The list of node-creation functions (similar to the
     *                   MML object from MathJax v2).
     */
    get MML() {
        return this.node;
    }

}
