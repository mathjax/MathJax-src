/*************************************************************
 *
 *  MathJax/jax/input/TeX/Stack.js
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


import {TreeHelper} from './TreeHelper.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {StackItem, EnvList, BaseItem, StartItem, MmlItem} from './StackItem.js';
// import {BaseItem, StartItem, MmlItem} from 'mathjax3/input/tex/StackItem.js';

// Stack class for the parser.


export default class Stack {

  data: StackItem[] = [];
  env: EnvList = {};
  global: EnvList = {};
  
  constructor(env: EnvList, inner: boolean) {
    this.global = {isInner: inner};
    let item = new StartItem(this.global);
    this.data = [
        new StartItem(this.global)
    ];
    // this.data = [new StartItem(this.global)];
    if (env) {
      this.data[0].env = env;
    }
    this.env = this.data[0].env;
  }


  Push(...args: (StackItem|MmlNode)[]) {
    TreeHelper.printSimple("PUSHING onto stack: ");
    TreeHelper.printSimple(args.toString());
    for (let i = 0, m = args.length; i < m; i++) {
      let item = arguments[i]; if (!item) continue;
      if (TreeHelper.isNode(item)) {
        item = new MmlItem(item);
        // item = new MmlItem(item);
      }
      item.global = this.global;

      let top = (this.data.length ? this.Top().checkItem(item) : true);
      if (top instanceof Array) {
        this.Pop();
        this.Push.apply(this, top);
      }
      else if (top instanceof BaseItem) {
        this.Pop();
        this.Push(top);
      }
      else if (top) {
        this.data.push(item);
        if (item.env) {
          if (item.copyEnv !== false) {
            for (let id in this.env) {
              if (this.env.hasOwnProperty(id)) {
                item.env[id] = this.env[id];
              }
            }
          }
          this.env = item.env;
        } else {
          item.env = this.env;
        }
      }
    }
  }


  Pop() {
    const item = this.data.pop();
    if (!item.isOpen) {
      delete item.env;
    }
    this.env = (this.data.length ? this.Top().env : {});
    return item;
  }


  Top(n?: number): StackItem {
    if (n == null) {
      n = 1;
    }
    if (this.data.length < n) {
      return null;
    }
    return this.data[this.data.length - n];
  }


  Prev(noPop?: boolean): MmlNode | void {
    const top = this.Top();
    if (noPop) {
      return top.data[top.data.length - 1];
    }
    else {
      return top.Pop();
    }
  }


  toString() {
    return 'stack[\n  ' + this.data.join('\n  ') + '\n]';
  }

}
