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


import {imp} from './imp.js';
// import {BaseItem, StartItem, MmlItem} from './StackItem.js';
import {BaseItem, StartItem, MmlItem} from '../../../../../mathjax3/input/tex/StackItem.js';

// Stack class for the parser.


export class Stack {

  constructor(env, inner, stackitem) {
    this.STACKITEM = stackitem;
    this.global = {isInner: inner};
    let item = new StartItem(this.global);
    this.data = [
      imp.STACKS ?
        new StartItem(this.global) :
        this.STACKITEM.start(this.global)
    ];
    // this.data = [new StartItem(this.global)];
    if (env) {
      this.data[0].env = env;
    }
    this.env = this.data[0].env;
  }


  Push() {
    imp.printSimple("PUSHING onto stack: ");
    imp.printSimple(arguments);
    var i, m, item, top;
    for (i = 0, m = arguments.length; i < m; i++) {
      item = arguments[i]; if (!item) continue;
      if (imp.isNode(item)) {
        item = imp.STACKS ? new MmlItem(item) : this.STACKITEM.mml(item);
        // item = new MmlItem(item);
      }
      item.global = this.global;

      top = (this.data.length ? this.Top().checkItem(item) : true);
      if (top instanceof Array) {
        this.Pop();
        this.Push.apply(this, top);
      }
      else if (imp.STACKS ?
               top instanceof BaseItem :
               top instanceof this.STACKITEM) {
        this.Pop();
        this.Push(top);
      }
      else if (top) {
        this.data.push(item);
        if (item.env) {
          if (item.copyEnv !== false) {
            for (var id in this.env) {
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
    var item = this.data.pop();
    if (!item.isOpen) {
      delete item.env;
    }
    this.env = (this.data.length ? this.Top().env : {});
    return item;
  }


  Top(n) {
    if (n == null) {
      n = 1;
    }
    if (this.data.length < n) {
      return null;
    }
    return this.data[this.data.length - n];
  }


  Prev(noPop) {
    var top = this.Top();
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
