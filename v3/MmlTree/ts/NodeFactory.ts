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
 * @fileoverview  The generic NodeFactory class for creating Node objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Node, NodeClass, PropertyList} from './Node.js';

/*****************************************************************/
/*
 * The NodeFactory interface
 */

export interface INodeFactory {
    /*
     * @param {string} kind  The kind of node to create
     * @param {PropertyList} properties  The list of initial properties for the node (if any)
     * @param {Node[]} children  The array of initial child nodes (if any)
     * @return {Node}  The newly created node of the given kind
     */
    create(kind: string, properties?: PropertyList, children?: Node[]): Node;

    /*
     * Defines a class for a given node kind
     *
     * @param {string} kind  The kind whose class is being defined
     * @param {NodeClass} nodeClass  The class for the given kind
     */
    setNodeClass(kind: string, nodeClass: NodeClass): void;
    /*
     * @param {string} kind  The kind of node whose class is to be returned
     * @return {NodeClass}  The class object for the given kind
     */
    getNodeClass(kind: string): NodeClass;
    /*
     * @param {string} kind  The kind whose definition is to be deleted
     */
    deleteNodeClass(kind: string): void;

    /*
     * @param {Node} node  The node to test if it is of a given kind
     * @param {string} kind  The kind to test for
     * @return {boolean}  True if the node is of the given kind, false otherwise
     */
    nodeIsKind(node: Node, kind: string): boolean;

    /*
     * @return {string[]}  The names of all the available kinds of nodes
     */
    getKinds(): string[];
}

/*****************************************************************/
/*
 * The generic NodeFactory class
 */

export class NodeFactory implements INodeFactory {
    /*
     * The map of node kinds to node classes
     */
    protected nodeMap: Map<string, NodeClass> = new Map();
    /*
     * An object containing functions for creating the various node kinds
     */
    protected node: {[kind: string]: Function} = {};

    /*
     * @override
     */
    constructor(nodes: {[kind: string]: NodeClass} = {}) {
        for (const kind of Object.keys(nodes)) {
            this.setNodeClass(kind, nodes[kind]);
        }
    }

    /*
     * @override
     */
    public create(kind: string, properties: PropertyList = {}, children: Node[] = []) {
        return this.node[kind](properties, children);
    }

    /*
     * @override
     */
    public setNodeClass(kind: string, nodeClass: NodeClass) {
        this.nodeMap.set(kind, nodeClass);
        let THIS = this;
        let KIND = this.nodeMap.get(kind);
        this.node[kind] = function (properties: PropertyList, children: Node[]) {
            return new KIND(THIS, properties, children);
        };
    }
    /*
     * @override
     */
    public getNodeClass(kind: string): NodeClass {
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
    public nodeIsKind(node: Node, kind: string) {
        return (node instanceof this.getNodeClass(kind));
    }

    /*
     * @override
     */
    public getKinds() {
        return Array.from(this.nodeMap.keys());
    }

}
