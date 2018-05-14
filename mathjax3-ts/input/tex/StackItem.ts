/*************************************************************
 *
 *  MathJax/jax/input/TeX/StackItem.ts
 *
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2009-2017 The MathJax Consortium
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
 * @fileoverview Stack items hold information on the TexParser stack.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import MapHandler from './MapHandler.js';
import {CharacterMap} from './SymbolMap.js';
import {Entities} from '../../util/Entities.js';
import {MmlNode, TextNode, TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import {MmlMsubsup} from '../../core/MmlTree/MmlNodes/msubsup.js';
import {TexConstant} from './TexConstants.js';
import TexError from './TexError.js';
import ParseUtil from './ParseUtil.js';
import {TreeHelper} from './TreeHelper.js';
import {Property, PropertyList} from '../../core/Tree/Node.js';
import StackItemFactory from './StackItemFactory.js';

// Union types for abbreviation.
export type EnvProp = string | number | boolean;

export type EnvList = {[key: string]: EnvProp};

// This is the type for all fields that used to be set with With.
export type Prop = string | number | boolean | MmlNode | PropList;

export type PropList = {[key: string]: Prop};

export type CheckType = boolean | StackItem | (MmlNode | StackItem)[];


export interface NodeStack {

  /**
   * Get or set the topmost element on the node stack without removing it.
   * @return {MmlNode} The topmost node on the stack.
   */
  Top: MmlNode;

  /**
   * Get or set the last element on the node stack without removing it.
   * @return {MmlNode} The topmost node on the stack.
   */
  Last: MmlNode;

  /**
   * @return {MmlNode} The topmost node on the item's node stack.
   */
  Pop(): MmlNode | void;

  /**
   * Pushes new nodes onto the items node stack.
   * @param {MmlNode[]} ...nodes A list of nodes.
   */
  Push(...nodes: MmlNode[]): void;

  /**
   * Get the top n elements on the node stack without removing them.
   * @param {number=} n Number of elements that should be returned.
   * @return {MmlNode[]} List of nodes on top of stack.
   */
  TopN(n?: number): MmlNode[];

  /**
   * @return {number} The size of the stack.
   */
  Size(): number;

  /**
   * Clears the stack.
   */
  Clear(): void;

  /**
   * Returns nodes on the stack item's node stack as an Mml node. I.e., in case
   * the item contains more than one node, it creates an mrow.
   * @param {boolean=} inferred If set the mrow will be an inferred mrow.
   * @param {boolean=} forceRow If set an mrow will be created, regardless of
   *     how many nodes the item contains.
   * @return {MmlNode} The topmost Mml node.
   */
  toMml(inferred?: boolean, forceRow?: boolean): MmlNode;

}


export class MmlStack implements NodeStack {

  constructor(private _nodes: MmlNode[]) { }

  protected get nodes(): MmlNode[] {
    return this._nodes;
  }

  /**
   * @override
   */
  public Push(...nodes: MmlNode[]) {
    TreeHelper.printMethod('StackItem Push arguments: ' + this._nodes + ' arguments: ');
    this._nodes.push.apply(this._nodes, nodes);
  }


  /**
   * @override
   */
  public Pop(): MmlNode {
    return this._nodes.pop();
  }


  /**
   * @override
   */
  public get Top(): MmlNode {
    return this._nodes[0];
  }


  /**
   * @override
   */
  public set Top(node: MmlNode) {
    this._nodes[0] = node;
  }


  /**
   * @override
   */
  public get Last(): MmlNode {
    return this._nodes[this._nodes.length - 1];
  }


  /**
   * @override
   */
  public set Last(node: MmlNode) {
    this._nodes[this._nodes.length - 1] = node;
  }


  /**
   * @override
   */
  public TopN(n?: number): MmlNode[] {
    if (n == null) {
      n = 1;
    }
    return this._nodes.slice(0, n);
  }


  /**
   * @override
   */
  public Size(): number {
    return this._nodes.length;
  }


  /**
   * @override
   */
  public Clear(): void {
    this._nodes = [];
  }


  /**
   * @override
   */
  public toMml(inferred?: boolean, forceRow?: boolean) {
    TreeHelper.printMethod('toMml');
    if (inferred == null) {
      inferred = true;
    }
    if (this._nodes.length === 1 && !forceRow) {
      return this.Top;
    }
    // @test Two Identifiers
    return TreeHelper.createNode(inferred ? 'inferredMrow' : 'mrow', this._nodes, {});
  }

}

export interface StackItem extends NodeStack {

  kind: string;
  isClose: boolean;
  isOpen: boolean;
  isFinal: boolean;
  global: EnvList;
  env: EnvList;

  /**
   * Tests if item is of the given type.
   * @param {string} kind The type.
   * @return {boolean} True if item is of that type.
   */
  isKind(kind: string): boolean;

  getProperty(key: string): Prop;
  setProperty(key: string, value: Prop): void;

  getName(): string;
  checkItem(item: StackItem): CheckType;

}

export interface StackItemClass {
  new (factory: StackItemFactory, ...nodes: MmlNode[]): StackItem;
}

export abstract class BaseItem extends MmlStack implements StackItem {

  private _env: EnvList;

  private _properties: PropList = {};

  protected errors: {[key: string]: string[]} = {
    // @test ExtraOpenMissingClose End
    end: ['ExtraOpenMissingClose', 'Extra open brace or missing close brace'],
    // @test ExtraCloseMissingOpen
    close: ['ExtraCloseMissingOpen', 'Extra close brace or missing open brace'],
    // @test MissingLeftExtraRight
    right: ['MissingLeftExtraRight', 'Missing \\left or extra \\right']
  };

  public global: EnvList = {};

  constructor(private _factory: StackItemFactory, ...nodes: MmlNode[]) {
    super(nodes);
    if (this.isOpen) {
      this._env = {};
    }
  }

  public get factory() {
    console.log('Getting the item factory for item: ' + this.kind);
    return this._factory;
  }

  /**
   * @return {string} The type of the stack item.
   */
  public get kind() {
    return 'base';
  }

  get env() {
    return this._env;
  }

  set env(value) {
    this._env = value;
  }

  getProperty(key: string): Prop {
    return this._properties[key];
  }

  setProperty(key: string, value: Prop) {
    this._properties[key] = value;
  }


  /**
   * @return {boolean} True if item is an opening entity, i.e., it expects a
   *     closing counterpart on the stack later.
   */
  get isOpen() {
    return false;
  }

  /**
   * @return {boolean} True if item is an closing entity, i.e., it needs an
   *     opening counterpart already on the stack.
   */
  get isClose() {
    return false;
  }


  /**
   * @return {boolean} True if item is final, i.e., it contains one or multiple
   *      finished parsed nodes.
   */
  get isFinal() {
    return false;
  }


  /**
   * @override
   */
  public isKind(kind: string) {
    return kind === this.kind;
  }


  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    TreeHelper.printMethod('Checkitem base for ' + item.kind + ' with ' + item);
    if (item.isKind('over') && this.isOpen) {
      item.setProperty('num', this.toMml(false));
      this.Clear();
    }
    if (item.isKind('cell') && this.isOpen) {
      if (item.getProperty('linebreak')) {
        return false;
      }
      // TODO: Test what symbol really does!
      //throw new TexError(['Misplaced', 'Misplaced %1', item.getProperty('name').symbol]);
      // @test Ampersand-error
      throw new TexError(['Misplaced', 'Misplaced %1', item.getName()]);
    }
    if (item.isClose && this.errors[item.kind]) {
      throw new TexError(this.errors[item.kind]);
    }
    if (!item.isFinal) {
      return true;
    }
    this.Push(item.Top);
    return false;
  }


  /**
   * Clears the item's environment.
   */
  public clearEnv() {
    for (let id in this.env) {
      if (this.env.hasOwnProperty(id)) {
        delete this.env[id];
      }
    }
  }


  /**
   * Sets a list of properties.
   * @param {PropList} def The properties to set.
   * @return {StackItem} Returns the stack item object for pipelining.
   */
  public setProperties(def: PropList) {
    for (let id in def) {
      if (def.hasOwnProperty(id)) {
        this.setProperty(id, def[id]);
      }
    }
    return this;
  }



  /**
   * Convenience method for returning the string property "name".
   * @return {string} The value for the name property.
   */
  public getName() {
    return this.getProperty('name') as string;
  }


  /**
   * @override
   */
  public toString() {
    return this.kind + '[' + this.nodes.join('; ') + ']';
  }

}
