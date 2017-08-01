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
 * @fileoverview  The generic Factory class for creating arbitrary objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/*****************************************************************/
/*
 * The Factory node interfaces (one for the node instance, one for the node class)
 */

export interface FactoryNode {
    readonly kind: string;
}

export interface FactoryNodeClass<N extends FactoryNode> {
    new(factory: Factory<N, FactoryNodeClass<N>>, ...args: any[]): N;
}

/*****************************************************************/
/*
 * The Factory interface
 */

export interface Factory<N extends FactoryNode, C extends FactoryNodeClass<N>> {
    /*
     * @param {string} kind  The kind of node to create
     * @return {N}  The newly created node of the given kind
     */
    create(kind: string): N;

    /*
     * Defines a class for a given node kind
     *
     * @param {string} kind  The kind whose class is being defined
     * @param {C} nodeClass  The class for the given kind
     */
    setNodeClass(kind: string, nodeClass: C): void;
    /*
     * @param {string} kind  The kind of node whose class is to be returned
     * @return {C}  The class object for the given kind
     */
    getNodeClass(kind: string): C;
    /*
     * @param {string} kind  The kind whose definition is to be deleted
     */
    deleteNodeClass(kind: string): void;

    /*
     * @param {N} node  The node to test if it is of a given kind
     * @param {string} kind  The kind to test for
     * @return {boolean}  True if the node is of the given kind, false otherwise
     */
    nodeIsKind(node: N, kind: string): boolean;

    /*
     * @return {string[]}  The names of all the available kinds of nodes
     */
    getKinds(): string[];
}


/*****************************************************************/
/*
 * The generic AbstractFactoryClass interface
 *   (needed for access to defaultNodes via the constructor)
 */

interface AbstractFactoryClass<N extends FactoryNode, C extends FactoryNodeClass<N>> extends Function {
    defaultNodes: {[kind: string]: C};
}


/*****************************************************************/
/*
 * The generic AbstractFactory class
 */

export abstract class AbstractFactory<N extends FactoryNode, C extends FactoryNodeClass<N>> implements Factory<N, C> {

    /*
     * The default collection of objects to use for the node map
     */
    public static defaultNodes = {};

    /*
     * The default kind
     */
    public defaultKind = "unknown";

    /*
     * The map of node kinds to node classes
     */
    protected nodeMap: Map<string, C> = new Map();

    /*
     * An object containing functions for creating the various node kinds
     */
    protected node: {[kind: string]: Function} = {};

    /*
     * @override
     */
    constructor(nodes: {[kind: string]: C} = null) {
        if (nodes === null) {
            nodes = (this.constructor as AbstractFactoryClass<N, C>).defaultNodes;
        }
        for (const kind of Object.keys(nodes)) {
            this.setNodeClass(kind, nodes[kind]);
        }
    }

    /*
     * @override
     */
    public create(kind: string, ...args: any[]) {
        return (this.node[kind] || this.node[this.defaultKind])(...args);
    }

    /*
     * @override
     */
        public setNodeClass(kind: string, nodeClass: C) {
        this.nodeMap.set(kind, nodeClass);
        let THIS = this;
        let KIND = this.nodeMap.get(kind);
        this.node[kind] = (...args: any[]) => {return new KIND(THIS, ...args);};
    }
    /*
     * @override
     */
    public getNodeClass(kind: string): C {
        return this.nodeMap.get(kind);
    }
    /*
     * @override
     */
    public deleteNodeClass(kind: string) {
        this.nodeMap.delete(kind);
        delete this.node[kind];
    }

    /*
     * @override
     */
    public nodeIsKind(node: N, kind: string) {
        return (node instanceof this.getNodeClass(kind));
    }

    /*
     * @override
     */
    public getKinds() {
        return Array.from(this.nodeMap.keys());
    }

}
