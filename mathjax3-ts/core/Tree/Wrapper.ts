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
 * @fileoverview Generic Wrapper class for adding methods to a Node class for visitors
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Node} from './Node.js';
import {WrapperFactory} from './WrapperFactory.js';

/*********************************************************/
/*
 *  The Wrapper interface
 *
 *  It points to a Node object.  Subclasses add methods for the visitor to call.
 */

export interface Wrapper<N extends Node, W extends Wrapper<N, W>> {
    node: N;
    readonly kind: string;

    /*
     * @param {Node} node  A (child) node to be wrapped
     * @return {Wrapper}  The newly wrapped node
     */
    wrap(node: N): W;
}

/*********************************************************/
/*
 *  The Wrapper class interface
 */

export interface WrapperClass<N extends Node, W extends Wrapper<N, W>> {
    new(factory: WrapperFactory<N, W, WrapperClass<N, W>>, node: N, ...args: any[]): W;
}

/*********************************************************/
/*
 *  The abstract Wrapper class
 */

export class AbstractWrapper<N extends Node, W extends Wrapper<N, W>> implements Wrapper<N, W> {
    /*
     * The Node object associated with this instance
     */
    public node: N;

    /*
     * The WrapperFactory to use to wrap child nodes, as needed
     */
    protected factory: WrapperFactory<N, W, WrapperClass<N, W>>;

    get kind() {
        return this.node.kind;
    }

    /*
     * @param {WrapperFactory} factory  The WrapperFactory to use to wrap child nodes when needed
     * @param {Node} node               The node to wrap
     * @return {Wrapper}                The newly created wrapped node
     *
     * @constructor
     * @implements {Wrapper}
     */
    constructor(factory: WrapperFactory<N, W, WrapperClass<N, W>>, node: N) {
        this.factory = factory;
        this.node = node;
    }

    /*
     * @override
     */
    public wrap(node: N) {
        return this.factory.wrap(node);
    }

}
