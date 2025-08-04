/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file Generic Node classes for node trees
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { NodeFactory } from './NodeFactory.js';

/**
 *  PropertyList and Property are for string data like
 *  attributes and other properties
 */
export type Property = string | number | boolean;
export type PropertyList = { [key: string]: Property };

/*********************************************************/
/**
 *  The generic Node interface
 *
 * @template N   The actual type of node being created (so parent, children, and factory
 *                  know what they are).  This avoids the need for casting node types later.
 * @template C   The node class for N (the constructor rather than instance of the class)
 */
export interface Node<N extends Node<N, C>, C extends NodeClass<N, C>> {
  readonly kind: string;
  /**
   * The NodeFactory to use to create additional nodes, as needed
   */
  readonly factory: NodeFactory<N, C>;
  parent: N;
  childNodes: N[];

  /**
   * @param {string} name     The name of the property to set
   * @param {Property} value  The value to which the property will be set
   */
  setProperty(name: string, value: Property): void;

  /**
   * @param {string} name  The name of the property to get
   * @returns {Property}   The value of the named property
   */
  getProperty(name: string): Property;

  /**
   * @returns {string[]}  An array of the names of every property currently defined
   */
  getPropertyNames(): string[];

  /**
   * @returns {PropertyList}  The propery list containing all the properties of the node
   */
  getAllProperties(): PropertyList;

  /**
   * @param {string[]} names  The names of the properties to be removed
   */
  removeProperty(...names: string[]): void;

  /**
   * @param {string} kind  The type of node to test for
   * @returns {boolean}     True when the node is of the given type
   */
  isKind(kind: string): boolean;

  /**
   * @param {N[]} children  The child nodes to add to this node
   */
  setChildren(children: N[]): void;

  /**
   * @param {N} child  A node to add to this node's children
   * @returns {N}       The child node that was added
   */
  appendChild(child: N): N;

  /**
   * @param {N} newChild  A child node to be inserted
   * @param {N} oldChild  A child node to be replaced
   * @returns {N}          The old child node that was removed
   */
  replaceChild(newChild: N, oldChild: N): N;

  /**
   * @param {N} child   Child node to be removed
   * @returns {N}        The old child node that was removed
   */
  removeChild(child: N): N;

  /**
   * @param {N} child  A child node whose index in childNodes is desired
   * @returns {number}     The index of the child in childNodes, or null if not found
   */
  childIndex(child: N): number;

  /**
   * Make a deep copy of the node (but with no parent).
   */
  copy(): N;

  /**
   * @param {string} kind  The kind of nodes to be located in the tree
   * @returns {N[]}      An array of nodes that are children (at any depth) of the given kind
   */
  findNodes(kind: string): N[];

  /**
   * @param {Function} func  A function to apply to each node in the tree rooted at this node
   * @param {any} data       Data to pass to the function (as state information)
   */
  walkTree(func: (node: N, data?: any) => void, data?: any): void;
}

/*********************************************************/
/**
 * The generic Node class interface
 *
 * @template N   The node type being created
 * @template C   The node class for N (the constructor rather than instance of the class)
 */
export interface NodeClass<N extends Node<N, C>, C extends NodeClass<N, C>> {
  /**
   * @param {NodeFactory} factory  The NodeFactory to use to create new nodes when needed
   * @param {PropertyList} properties  Any properties to be added to the node, if any
   * @param {N[]} children  The initial child nodes, if any
   * @returns {N}  The newly created node
   */
  new (
    factory: NodeFactory<N, C>,
    properties?: PropertyList,
    children?: N[]
  ): N;
}

/*********************************************************/
/**
 * The abstract Node class
 *
 * @template N   The actual type of node being created
 * @template C   The node class for N (the constructor rather than instance of the class)
 */
export abstract class AbstractNode<
  N extends Node<N, C>,
  C extends NodeClass<N, C>,
> implements Node<N, C>
{
  /**
   * The parent node for this one
   */
  public parent: N = null;

  /**
   * The properties for this node
   */
  protected properties: PropertyList = {};

  /**
   * The children for this node
   */
  public childNodes: N[] = [];

  /**
   * @param {NodeFactory} factory  The NodeFactory to use to create new nodes when needed
   * @param {PropertyList} properties  Any properties to be added to the node, if any
   * @param {N[]} children  The initial child nodes, if any
   *
   * @class
   * @implements {N}
   */
  constructor(
    readonly factory: NodeFactory<N, C>,
    properties: PropertyList = {},
    children: N[] = []
  ) {
    for (const name of Object.keys(properties)) {
      this.setProperty(name, properties[name]);
    }
    if (children.length) {
      this.setChildren(children);
    }
  }

  /**
   * @override
   */
  public get kind() {
    return 'unknown';
  }

  /**
   * @override
   */
  public setProperty(name: string, value: Property) {
    this.properties[name] = value;
  }

  /**
   * @override
   */
  public getProperty(name: string) {
    return this.properties[name];
  }

  /**
   * @override
   */
  public getPropertyNames() {
    return Object.keys(this.properties);
  }

  /**
   * @override
   */
  public getAllProperties() {
    return this.properties;
  }

  /**
   * @override
   */
  public removeProperty(...names: string[]) {
    for (const name of names) {
      delete this.properties[name];
    }
  }

  /**
   * @override
   */
  public isKind(kind: string): boolean {
    return this.factory.nodeIsKind(this as any, kind);
  }

  /**
   * @override
   */
  public setChildren(children: N[]) {
    this.childNodes = [];
    for (const child of children) {
      this.appendChild(child);
    }
  }

  /**
   * @override
   */
  public appendChild(child: N) {
    this.childNodes.push(child);
    child.parent = this as any as N;
    return child;
  }

  /**
   * @override
   */
  public replaceChild(newChild: N, oldChild: N) {
    const i = this.childIndex(oldChild);
    // If i === null should we error?  return null?  silently fail?
    if (i !== null) {
      this.childNodes[i] = newChild;
      newChild.parent = this as any as N;
      if (oldChild.parent === (this as any as N)) {
        oldChild.parent = null;
      }
    }
    return newChild;
  }

  /**
   * @override
   */
  public removeChild(child: N) {
    const i = this.childIndex(child);
    if (i !== null) {
      this.childNodes.splice(i, 1);
      child.parent = null;
    }
    return child;
  }

  /**
   * @override
   */
  public childIndex(node: N) {
    const i = this.childNodes.indexOf(node);
    return i === -1 ? null : i;
  }

  /**
   * @override
   */
  public copy() {
    const node = this.factory.create(this.kind) as any as AbstractNode<N, C>;
    node.properties = { ...this.properties };
    for (const child of this.childNodes || []) {
      if (child) {
        node.appendChild(child.copy());
      }
    }
    return node as any as N;
  }

  /**
   * @override
   */
  public findNodes(kind: string) {
    const nodes: N[] = [];
    this.walkTree((node: N) => {
      if (node.isKind(kind)) {
        nodes.push(node);
      }
    });
    return nodes;
  }

  /**
   * @override
   */
  public walkTree(func: (node: N, data?: any) => void, data?: any) {
    func(this as any as N, data);
    for (const child of this.childNodes) {
      if (child) {
        child.walkTree(func, data);
      }
    }
    return data;
  }

  /**
   * Simple string version for debugging, just to get the structure.
   *
   * @override
   */
  public toString() {
    return this.kind + '(' + this.childNodes.join(',') + ')';
  }
}

/*********************************************************/
/**
 * The abstract EmptyNode class
 *
 * @template N   The actual type of node being created
 * @template C   The node class for N (the constructor rather than instance of the class)
 */
export abstract class AbstractEmptyNode<
  N extends Node<N, C>,
  C extends NodeClass<N, C>,
> extends AbstractNode<N, C> {
  /**
   *  We don't have children, so ignore these methods
   */

  /**
   * @override
   */
  public setChildren(_children: N[]) {}

  /**
   * @override
   */
  public appendChild(child: N) {
    return child;
  }

  /**
   * @override
   */
  public replaceChild(_newChild: N, oldChild: N) {
    return oldChild;
  }

  /**
   * @override
   */
  public childIndex(_node: N) {
    return null as number;
  }

  /**
   * Don't step into children (there aren't any)
   *
   * @override
   */
  public walkTree(func: (node: N, data?: any) => void, data?: any) {
    func(this as any as N, data);
    return data;
  }

  /**
   * Simple string version for debugging, just to get the structure.
   *
   * @override
   */
  public toString() {
    return this.kind;
  }
}
