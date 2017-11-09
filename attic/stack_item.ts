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
 * @fileoverview Elements of the parsing stack.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Attributes, Environment} from './types.js';
import {MmlFactory} from '../../core/MmlTree/MmlFactory.js';
import {MmlNode, TextNode, XMLNode, TEXCLASS} from '../../core/MmlTree/MmlNode.js';


// TODO: This is a placeholder for the current MML elements.
module tempFunctions {
  export let createMmlElement: (func: string, data: StackItem[], attribute: Attributes) => any;
  export let createError: (content: string[]) => void;
  export let setData: (base: StackItem, count: number, item: StackItem) => void;
}

export function setTempFunctions(functions: any) {
  tempFunctions.createMmlElement = functions.mml;
  tempFunctions.createError = functions.error;
  tempFunctions.setData = functions.setdata
}

// TODO: See if this can correctly extended for AMSmath specific stack items.
export type ItemType = 'base' | 'start' | 'stop' | 'open' | 'close' | 'prime' |
  'subsup' | 'over' | 'left' | 'right' | 'begin' | 'end' | 'style' |
  'position' | 'array' | 'cell' | 'mml' | 'fn' | 'not' | 'dots';

let itemErrors: [ItemType, [string, string]][] = [
  ['end', ["ExtraOpenMissingClose","Extra open brace or missing close brace"]],
  ['close', ["ExtraCloseMissingOpen","Extra close brace or missing open brace"]],
  ['right', ["MissingLeftExtraRight","Missing \\left or extra \\right"]]
];

export const ItemErrors: Map<ItemType|string, [string, string]> =
  new Map<ItemType, [string, string]>(itemErrors);


export interface StackItem {

  env: Environment;
  data: StackItem[];
  attributes: Attributes;
  
  /**
   * @return {string} The type of the stack item as a string.
   */
  getType(): string;

  /**
   * @param {ItemType} kind An item type.
   * @return {boolean} True if the item is of that particular type.
   */
  hasType(kind: string): boolean;
  
  /**
   * @return {Attributes} The current attribute set of the stack item.
   */
  getAttributes(): Attributes;

  // TODO: Not quite sure yet what that can return!
  checkItem(item: StackItem): any;

  
  /**
   * @return {boolean} Is the item opening a new nesting level?
   */
  isOpen(): boolean;

  /**
   * @return {boolean} Is the item closing a nesting level?
   */
  isClose(): boolean;

}

export abstract class Base implements StackItem {

  protected kind: ItemType = 'base';
  protected open: boolean = false;
  protected close: boolean = false;
  protected global: Environment = {};
  public attributes: Attributes;
  public env: Environment = {};
  public data: StackItem[] = [];
  
  constructor(attributes: Attributes) {
    this.attributes = attributes;
  }

  /**
   * @override
   */
  getType(): ItemType {
    return this.kind;
  }
  
  /**
   * @override
   */
  hasType(kind: ItemType) {
    return kind === this.kind;
  }
  
  /**
   * @override
   */
  getAttributes() {
    return this.attributes;
  }

  /**
   * @override
   */
  // TODO: Should this be an abstract method?
  //abstract checkItem(item: StackItem): any;
  checkItem(item: StackItem): any {
    // TODO: Make that num field part of the over type.
    // 
    // if (item.hasType('over') && this.isOpen()) {
    //   item.num = this.mmlData(false);
    //   this.data = []
    // }
    console.log('HERE is the ' + this.kind + ' item');
    console.log(item);
    
    if (item.hasType('cell') && this.isOpen()) {
      let attr = item.getAttributes();
      if (attr['linebreak']) {
        return false;
      }
      tempFunctions.createError(["Misplaced","Misplaced %1", <string>attr['name']]);
    }
    if (item.isClose && ItemErrors.has(item.getType())) {
      tempFunctions.createError(ItemErrors.get(item.getType()));
    }
    if (item.getType() !== 'mml') {
      return true
    }
    this.push(item.data[0]); return false;
  }

  /**
   * @override
   */
  isOpen() {
    return this.open;
  }

  /**
   * @override
   */
  isClose() {
    return this.close;
  }


  // TODO: This is data stack handling that should be refactored into a base
  //       stack data structure.
  push(item: StackItem) {
    this.data.push(item);
  }

  Pop(): StackItem { return this.pop(); }
  pop(): StackItem {
    return this.data.pop();
  }

  // TODO: This method should either create a Tree node or a JSON structure.
  mmlData(inferred?: boolean): any {
    console.log('IN MML Data');
    console.log(this.data);
    if (inferred == null) {
      inferred = true;
    }
    if (this.data.length === 1) {
      return this.data[0];
    }
    let node = (new MmlFactory).create('mrow', {}, []);
    return tempFunctions.createMmlElement(
      'mrow', this.data, inferred ? {inferred: true}: {});
  }

  /**
   * @override
   */
  toString() {
    return this.kind + '[\n    global:' + this.global.toString() + ',\n' +
      this.data.join('\n  ') + '\n]'
  }
}

export class Start extends Base {

  kind: ItemType = 'start';
  open = true;

  constructor(global: Environment) {
    super({});
    this.global = global;
  }

  checkItem(item: StackItem) {
    if (item.hasType('stop')) {
      return new Mml(this.mmlData());
    }
    return super.checkItem(item);
  }
  
}


export class Stop extends Base {

  kind: ItemType = 'stop';
  close = true;

}


export class Mml extends Base {

  kind: ItemType = 'mml';
  public node: MmlNode;
  
  constructor(node: any) {
    super({});
    this.node = node;
  }
  // TODO: Do we need the Add method?
}


export class Subsup extends Base {

  kind: ItemType = 'subsup';

  // stopError: /*_()*/ ['MissingScript','Missing superscript or subscript argument'],
  // supError:  /*_()*/ ['MissingOpenForSup','Missing open brace for superscript'],
  // subError:  /*_()*/ ['MissingOpenForSub','Missing open brace for subscript'],

  constructor(base: StackItem, attrs: Attributes) {
    super(attrs);
    this.push(base);
  }
  
  /**
   * @override
   */
  checkItem(item: StackItem) {
    if (item.hasType('open') || item.hasType('left')) {
      return true;
    }
    if (item.hasType('mml')) {
      // TODO: We need a test for primes first!
      // 
      // if (this.primes) {
      //     if (this.position !== 2) {this.data[0].SetData(2,this.primes)}
      //       else {item.data[0] = MML.mrow(this.primes.With({variantForm:true}),item.data[0])}
      // }
      tempFunctions.setData(this.data[0], <number>this.attributes['position'], item.data[0]);
      if (this.attributes['movesupsub'] != null) {
        this.data[0].attributes['movesupsub'] = this.attributes['movesupsub'];
      }
        return new Mml(this.data[0]);
    }
    if (super.checkItem(item)) {
      // TODO: Add an error output function.
      tempFunctions.createError(ItemErrors.get(
        ['','subError','supError'][<number>this.attributes['position']]));
    }
  }

  // Pop(): StackItem { return; }
  /**
   * @override
   */
  pop(): StackItem { return; }

}


export class Prime extends Base {

  kind: ItemType = 'prime';
  
  constructor(base: StackItem, sup: StackItem, attrs: Attributes) {
    super(attrs);
    this.push(base);
    this.push(sup);
  }
  
  checkItem(item: StackItem) {
    // TODO: This needs to be checked on the new structure.
    // 
    if ((<any>this.data[0])['type'] !== 'msubsup') {
      return [
        tempFunctions.createMmlElement('msup',
                                       [this.data[0],this.data[1]], {}), item];
    }
    // TODO: We need a test for the msubsup case.
    // TODO: Again this seems to grep directly the mml datastructure.
    tempFunctions.setData(
      this.data[0], <number>(<any>this.data[0])['sup'], this.data[1]);
    return [this.data[0], item];
  }
}
  

let ItemDictionary: any = {}

ItemDictionary['start'] = Start;
ItemDictionary['stop'] = Stop;
ItemDictionary['mml'] = Mml;

export function factory(kind: 'start', content: any): Start;
export function factory(kind: 'stop', content: any): Stop;
export function factory(kind: 'mml', content: any): Mml;
export function factory(kind: ItemType, content: any) {
  return new ItemDictionary[kind](content);
}

export function ItemFactory(kind: any, content: any): StackItem {
  return factory(kind, content);
}
