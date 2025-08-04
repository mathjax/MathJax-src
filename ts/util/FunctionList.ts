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
 * @file  Implement FunctionList object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { PrioritizedList, PrioritizedListItem } from './PrioritizedList.js';

export type AnyFunction = (...args: unknown[]) => unknown;
export type AnyFunctionDef = AnyFunction | [AnyFunction, number];
export type AnyFunctionList = AnyFunctionDef[];

/*****************************************************************/
/**
 *  The FunctionListItem interface (extends PrioritizedListItem<Function>)
 */

export interface FunctionListItem extends PrioritizedListItem<AnyFunction> {}

/*****************************************************************/
/**
 *  Implements the FunctionList class (extends PrioritizedList<Function>)
 */

export class FunctionList extends PrioritizedList<AnyFunction> {
  /**
   * @override
   * @param {AnyFunctionList} list   The initial list of functions to add
   */
  constructor(list: AnyFunctionList = null) {
    super();
    if (list) {
      this.addList(list);
    }
  }

  /**
   * Add a list of filter functions, possibly with priorities.
   *
   * @param {AnyFunctionList} list   The list of functions to add
   */
  public addList(list: AnyFunctionList) {
    for (const item of list) {
      if (Array.isArray(item)) {
        this.add(item[0], item[1]);
      } else {
        this.add(item);
      }
    }
  }

  /**
   * Executes the functions in the list (in prioritized order),
   *   passing the given data to the functions.  If any return
   *   false, the list is terminated.
   *
   * @param {any[]} data  The array of arguments to pass to the functions
   * @returns {boolean}    False if any function stopped the list by
   *                       returning false, true otherwise
   */
  public execute(...data: any[]): boolean {
    for (const item of this) {
      const result = item.item(...data);
      if (result === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Executes the functions in the list (in prioritized order) asynchronously,
   *   passing the given data to the functions, and doing the next function
   *   only when the previous one completes.  If the function returns a
   *   Promise, then use that to control the flow.  Otherwise, if the
   *   function returns false, the list is terminated.
   * This function returns a Promise.  If any function in the list fails,
   *   the promise fails.  If any function returns false, the promise
   *   succeeds, but passes false as its argument.  Otherwise it succeeds
   *   and passes true.
   *
   * @param {any[]} data  The array of arguments to pass to the functions
   * @returns {Promise}    The promise that is satisfied when the function
   *                       list completes (with argument true or false
   *                       depending on whether some function returned
   *                       false or not).
   */
  public asyncExecute(...data: any[]): Promise<boolean> {
    let i = -1;
    const items = this.items;
    return new Promise((ok, fail) => {
      (function execute() {
        while (++i < items.length) {
          const result = items[i].item(...data);
          if (result instanceof Promise) {
            result.then(execute).catch((err) => fail(err));
            return;
          }
          if (result === false) {
            ok(false);
            return;
          }
        }
        ok(true);
      })();
    });
  }
}
