/*************************************************************
 *
 *  Copyright (c) 2015-2017 The MathJax Consortium
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

import {Environment} from './types';
import {StackItem} from './stack_item';


export default class Stack {

  private global: Environment = {};
  // TODO: Refine this type to stack items.
  private data: any[] = [];
  public env: Environment = {};
  // TODO: Special functions that can be removed eventually.
  private transformMML: (item: any) => any;
  private testStackItem: (item: any) => boolean;

  constructor(env: Environment, inner: boolean,
              start: (global: Environment) => any,
              transform: (item: any) => any,
              test: (item: any) => boolean) {
    this.global = {isInner: inner};
    this.data = [start(this.global)];
    if (env) {this.data[0].env = env}
    this.env = this.data[0].env;
    this.transformMML = transform;
    this.testStackItem = test;
  }

  // TODO: Capitalised methods are temporary and will be removed!
  // This should be rewritten to rest arguments!
  public Push(item: any): void {
    this.push(item);
  }
  public push(item: any):void {
    if (!item) return;
    item = this.transformMML(item);
    item.global = this.global;
    let top = (this.data.length ? this.top().checkItem(item) : true);
    // TODO: Can we model this with a multi-stackitem?
    if (top instanceof Array) {
      this.pop();
      for (let it of top) {
        this.push(it);
      }
    }
    else if (this.testStackItem(top)) {
      this.pop();
      this.push(top);
    }
    else if (top) {
      this.data.push(item);
      // TODO: This needs to be reconciled with the env in new stack item.
      if (item.env) {
        for (var id in this.env) {
          if (this.env.hasOwnProperty(id)) {
            item.env[id] = this.env[id];
          }
        }
        this.env = item.env;
      } else {
        item.env = this.env
      }
    }
  }

  public Pop(): any {
    return this.Pop();
  }
  public pop(): any {
    var item = this.data.pop();
    // TODO: This needs to be reconciled with the environment in stack item.
    if (!item.isOpen) {
      delete item.env
    }
    this.env = (this.data.length ? this.top().env : {});
    return item;
  }

  public Top(n?: number): any {
    return this.top(n);
  }
  public top(n?: number): any {
    if (n == null) {n = 1}
    if (this.data.length < n) {return null}
    return this.data[this.data.length-n];
  }

  public Prev(noPop: boolean): any {
    return this.prev(noPop);
  }
  public prev(noPop: boolean): any {
    var top = this.top();
    if (noPop) {
      return top.data[top.data.length-1];
    }
    return top.Pop();
  }
  
  /**
   * @override
   */
  public toString() {
    return "stack[\n  " + this.data.join("\n  ") + "\n]";
  }
  
}
