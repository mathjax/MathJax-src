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
 * @fileoverview The parsing stack.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Environment} from './types.js';
import * as StackItem from './stack_item.js';
import {MathItem} from '../../core/MathItem.js';


export default class Stack {

  public env: Environment = {};
  // private tree = new Tree();
  private global: Environment = {};
  private data: StackItem.StackItem[] = [];

  // TODO: Special functions that can be removed eventually.
  private transformMML: (item: any) => any;
  private testStackItem: (item: any) => boolean;

  constructor(env: Environment, inner: boolean,
              transform: (item: any) => boolean,
              test: (item: any) => boolean) {
    this.global = {isInner: inner};
    this.data = [new StackItem.Start(this.global)];
    if (env) {
      this.data[0].env = env;
    }
    this.env = this.data[0].env;
    this.transformMML = transform;
    this.testStackItem = test;
  }


  private pushItem(item: StackItem.StackItem) {
    this.data.push(item);
  }
  
  // This should be rewritten to rest arguments!
  public push(itemJson: {kind: StackItem.ItemType, content: any}) {
    if (!itemJson) {
      return;
    }

    if (itemJson.kind === 'mml') {
      // Tree.parseNode(itemJson.content);
    }
    let item = StackItem.ItemFactory(itemJson.kind, itemJson.content);
    item.env = this.global;
    let top = (this.data.length ? this.top().checkItem(item) : true);

    if (item.hasType('mml')) {
      // this.tree.setRoot((item as StackItem.Mml).node);
    }
    
    // TODO: Can we model this with a multi-stackitem?
    if (top instanceof Array) {
      this.pop();
      for (let it of top) {
        this.pushItem(it);
      }
    }
    // Do we really need this?
    else if (top instanceof StackItem.Base) {
      this.pop();
      this.pushItem(top);
    }
    else if (top) {
      this.data.push(item);
      // TODO: This needs to be reconciled with the env in new stack item.
      if (item.env) {
        for (let id in this.env) {
          item.env[id] = this.env[id];
        }
        this.env = item.env;
      } else {
        item.env = this.env;
      }
    }
  }

  public pop(): any {
    let item = this.data.pop();
    // TODO: This needs to be reconciled with the environment in stack item.
    if (!item.isOpen()) {
      delete item.env;
    }
    this.env = (this.data.length ? this.top().env : {});
    return item;
  }

  public top(n?: number): any {
    if (n == null) {
      n = 1;
    }
    if (this.data.length < n) {
      return null;
    }
    return this.data[this.data.length - n];
  }

  public prev(noPop: boolean): any {
    let top = this.top();
    if (noPop) {
      return top.data[top.data.length - 1];
    }
    // TODO: This Pop has to be small once all the step item functions are
    //       refactored.
    return top.Pop();
  }

  /**
   * @override
   */
  public toString() {
    return 'stack[\n  ' + this.data.join(', ') + '\n]';
  }

  // public getResult(): Tree {
  //   if (this.top().kind === 'stop') {
  //     console.log('Warning: incomplete parsing!');
  //   }
  //   return this.tree;
  // }
  
}
