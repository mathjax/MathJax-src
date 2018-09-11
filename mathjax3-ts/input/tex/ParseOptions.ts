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
import TexParser from './TexParser.js';
import {OptionList} from '../../util/Options.js';


/**
 * @class
 */
export default class ParseOptions {

  /**
   * A set of sub handlers
   * @type {SubHandlers}
   */
  public handlers: SubHandlers;

  /**
   * A set of options, mapping names to string or boolean values.
   * @type {OptionList}
   */
  public options: OptionList;

  /**
   * The current item factory.
   * @type {StackItemFactory}
   */
  public itemFactory: StackItemFactory = new StackItemFactory();

  /**
   * The current node factory.
   * @type {NodeFactory}
   */
  public nodeFactory: NodeFactory = new NodeFactory();

  /**
   * The current tagging object.
   * @type {Tags}
   */
  public tags: Tags;

  /**
   * Stack of previous tex parsers. This is used to keep track of parser
   * settings when expressions are recursively parser.
   * @type {TexParser[]}
   */
  public parsers: TexParser[] = [];

  // ephemeral options
  public root: MmlNode = null;
  public nodeLists: {[key: string]: MmlNode[]} = {};
  public error = false;
  
  public clear() {
    this.root = null;
    this.nodeLists = {};
    this.error = false;
  }

  public addNode(property: string, node: MmlNode) {
    let list = this.nodeLists[property];
    if (!list) {
      list = this.nodeLists[property] = [];
    }
    list.push(node);
  }
    

  public removeNode(property: string, node: MmlNode) {
    let list = this.nodeLists[property];
    if (!list) {
      return;
    }
    let position = list.indexOf(node);
    if (position !== -1) {
      list.splice(position, 1);
    }
  }
    

  // private inTree(node: MmlNode) {
  //   while (node && node !== this.root) {
  //     node = node.parent;
  //   }
  //   return !!node;
  // }

  public getList(property: string) {
    return this.nodeLists[property] || [];
  }
  
  // public getList(property: string) {
  //   let list = this.nodeLists[property] || [];
  //   let result = [];
  //   for (let node of list) {
  //     if (this.inTree(node)) {
  //       result.push(node);
  //     }
  //   }
  //   this.nodeLists[property] = result;
  //   return result;
  // }

  
  /**
   * @constructor
   * @param {{[key: string]: (string|boolean)}} setting A list of option
   *     settings. Those are added to the default options.
   */
  public constructor(setting: OptionList = {}) {
    this.options = setting;
  }


  /**
   * Pushes a new tex parser onto the stack.
   * @param {TexParser} parser The new parser.
   */
  public pushParser(parser: TexParser) {
    this.parsers.unshift(parser);
  }


  /**
   * Pops a parser of the tex parser stack.
   */
  public popParser() {
    this.parsers.shift();
  }


  /**
   * @return {TexParser} The currently active tex parser.
   */
  public get parser(): TexParser {
    return this.parsers[0];
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
