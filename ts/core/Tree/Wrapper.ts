/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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
 * @file Generic Wrapper class for adding methods to a Node class for visitors
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { Node, NodeClass, TreeWalkerState } from './Node.js';
import { WrapperFactory } from './WrapperFactory.js';

/*********************************************************/
/**
 *  The Wrapper interface
 *
 *  It points to a Node object.  Subclasses add methods for the visitor to call.
 *
 * @template N  The Node type being wrapped
 * @template C  The NodeClass for the nodes being created
 * @template W  The Wrapper type being produced
 */
export interface Wrapper<
  N extends Node<N, C>,
  C extends NodeClass<N, C>,
  W extends Wrapper<N, C, W>,
> {
  /**
   * The kind of this wrapper
   */
  readonly kind: string;

  /**
   * The Node object associated with this instance
   */
  node: N;

  /**
   * The wrapped child nodes for the wrapped node
   */
  childNodes: W[];

  /**
   * @template T   The class to use for the wrapped node (defaults to W)
   *
   * @param {Node} node   A node to be wrapped
   * @param {any[]} args  Any additional arguments needed when creating the wrapper
   * @returns {T}         The wrapped node
   */
  wrap<T extends W = W>(node: N, ...args: any[]): T;

  /**
   * @param {Function} func  A function to apply to each wrapper in the tree rooted at this node
   * @param {any} data       Data to pass to the function (as state information)
   */
  walkTree(func: (node: W, data?: any) => boolean | void, data?: any): void;
}

/*********************************************************/
/**
 *  The Wrapper class interface
 *
 * @template N  The Node type being wrapped
 * @template C  The NodeClass for the nodes being created
 * @template W  The Wrapper type being produced
 */
export interface WrapperClass<
  N extends Node<N, C>,
  C extends NodeClass<N, C>,
  W extends Wrapper<N, C, W>,
> {
  /**
   * @param {WrapperFactory} factory   The factory used to create more wrappers
   * @param {N} node                   The node to be wrapped
   * @param {any[]} args               Any additional arguments needed when creating the wrapper
   * @returns {W}                      The wrapped node
   */
  new (
    factory: WrapperFactory<N, C, W, WrapperClass<N, C, W>>,
    node: N,
    ...args: any[]
  ): W;
}

/*********************************************************/
/**
 *  The abstract Wrapper class
 *
 * @template N  The Node type being created by the factory
 * @template C  The NodeClass for the nodes being created
 * @template W  The Wrapper type being produced
 */
export class AbstractWrapper<
  N extends Node<N, C>,
  C extends NodeClass<N, C>,
  W extends Wrapper<N, C, W>,
> implements Wrapper<N, C, W> {
  /**
   * @override
   */
  public node: N;

  /**
   * @override
   */
  public childNodes: W[];

  /**
   * The WrapperFactory to use to wrap child nodes, as needed
   */
  protected factory: WrapperFactory<N, C, W, WrapperClass<N, C, W>>;

  /**
   * @override
   */
  get kind() {
    return this.node.kind;
  }

  /**
   * @param {WrapperFactory} factory  The WrapperFactory to use to wrap child nodes when needed
   * @param {Node} node               The node to wrap
   *
   * @class
   * @implements {Wrapper}
   */
  constructor(
    factory: WrapperFactory<N, C, W, WrapperClass<N, C, W>>,
    node: N
  ) {
    this.factory = factory;
    this.node = node;
  }

  /**
   * @override
   */
  public wrap<T extends W = W>(node: N) {
    return this.factory.wrap(node) as T;
  }

  /**
   * Note that the `state` parameter is an internal state object, and
   * is not intended for user input, so it is not listed in the
   * interface above, and is not included in the jsDoc for that
   * reason.
   *
   * @override
   */
  public walkTree(
    func: (node: W, data?: any) => boolean | void,
    data?: any,
    $state: TreeWalkerState = { continue: true } // internal state variable
  ) {
    if (func(this as any as W, data)) {
      $state.continue = false;
      return data;
    }
    if ('childNodes' in this) {
      for (const child of this.childNodes) {
        if (child && $state.continue) {
          (child as any as AbstractWrapper<N, C, W>).walkTree(
            func,
            data,
            $state
          );
        }
      }
    }
    return data;
  }
}
