/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview Factory generating maps to keep options for the TeX parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import StackItemFactory from './StackItemFactory.js';
import {Tags} from './Tags.js';
import {HandlerType, SubHandlers} from './MapHandler.js';
import {NodeFactory} from './NodeFactory.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';


const DefaultOptions: [string, string | boolean][] = [
  //
  //  This specifies the side on which \tag{} macros will place the tags.
  //  Set to 'left' to place on the left-hand side.
  //
  ['TagSide', 'right'],

  //
  //  This is the amound of indentation (from right or left) for the tags.
  //
  ['TagIndent', '0.8em'],

  //
  //  This is the width to use for the multline environment
  //
  ['MultLineWidth', '85%'],

  // make element ID's use \label name rather than equation number
  // MJ puts in an equation prefix: mjx-eqn
  // When true it uses the label name XXX as mjx-eqn-XXX
  // If false it uses the actual number N that is displayed: mjx-eqn-N
  ['useLabelIds', true],

  ['refUpdate', false]
];


/**
 * @class
 */
export default class ParseOptions {

  public handlers: SubHandlers;
  public options: Map<string, string|boolean> = new Map();
  public itemFactory: StackItemFactory = new StackItemFactory();
  public nodeFactory: NodeFactory = new NodeFactory();
  public tags: Tags;
  
  public constructor(setting: {[key: string]: (string|boolean)} = {}) {
    this.options = new Map(DefaultOptions);
    Object.assign(this.options, setting);
  }


  /**
   * Convenience method to create nodes with this node factory.
   * @param {string} kind The kind of node to create.
   * @param {any[]} ...rest The remaining arguments for the creation method.
   * @return {MmlNode} The newly created node.
   */
  public createNode(kind: string, ...rest: any[]): MmlNode {
    return this.nodeFactory.create(kind, ...rest);
  }
}
