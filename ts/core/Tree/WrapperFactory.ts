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
 * @file Generic WrapperFactory class for creating Wrapper objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { Node, NodeClass } from './Node.js';
import { Wrapper, WrapperClass } from './Wrapper.js';
import { Factory, AbstractFactory } from './Factory.js';

/*****************************************************************/
/**
 * The generic WrapperFactory class
 *
 * @template N   The Node type being created by the factory
 * @template C   The NodeClass for the nodes being created
 * @template WW  The Wrapper type being produced (instance type)
 * @template WC  The Wrapper class (for static values)
 */
export interface WrapperFactory<
  N extends Node<N, C>,
  C extends NodeClass<N, C>,
  WW extends Wrapper<N, C, WW>,
  WC extends WrapperClass<N, C, WW>,
> extends Factory<WW, WC> {
  /**
   * @template TT The type to use for the wrappedd node
   *
   * @param {N} node      The node to be wrapped
   * @param {any[]} args  Any additional arguments needed when wrapping the node
   * @returns {TT}         The newly wrapped node
   */
  wrap<TT extends WW = WW>(node: N, ...args: any[]): TT;
}

/*****************************************************************/
/**
 * The generic WrapperFactory class
 *
 * @template N   The Node type being created by the factory
 * @template C   The NodeClass for the nodes being created
 * @template WW  The Wrapper type being produced (instance type)
 * @template WC  The Wrapper class (for static values)
 */
export abstract class AbstractWrapperFactory<
    N extends Node<N, C>,
    C extends NodeClass<N, C>,
    WW extends Wrapper<N, C, WW>,
    WC extends WrapperClass<N, C, WW>,
  >
  extends AbstractFactory<WW, WC>
  implements WrapperFactory<N, C, WW, WC>
{
  /**
   * @override
   */
  public wrap<TT extends WW = WW>(node: N, ...args: any[]): TT {
    return this.create(node.kind, node, ...args) as TT;
  }
}
