/*************************************************************
 *
 *  MathJax/jax/input/TeX/StackItemFactory.ts
 *
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2009-2018 The MathJax Consortium
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
 * @fileoverview A factory for stack items. This allows particular items to be
 *     overwritten later.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {StackItemClass, StackItem, BaseItem} from './StackItem.js';
import {MmlNode, TextNode, TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import ParseOptions from './ParseOptions.js';


class DummyItem extends BaseItem {}

/**
 * The StackItemFactory is initially populated with the default stack item
 * classes. They can be changed, deleted or added to, if and when necessary.
 *
 * @constructor
 */
export default class StackItemFactory {

  private static DefaultStackItems: {[kind: string]: StackItemClass} = {
    [DummyItem.prototype.kind]: DummyItem
  };

  /**
   * A default item.
   */
  public defaultKind: string = 'dummy';

  /**
   * The parser configuration.
   * @type {ParseOptions} 
   */
  public configuration: ParseOptions = null;

  private itemMap: Map<string, StackItemClass> = new Map();

  private item: {[kind: string]: (factory: StackItemFactory, ...args: any[]) => StackItem} = {};

  /**
   * @constructor
   */
  constructor() {
    this.addStackItems(StackItemFactory.DefaultStackItems);
  }


  /**
   * Adds a list of stack items to the current factory.
   * @param {Object.<string, StackItemClass>} stackItems A list of stackitems.
   */
  public addStackItems(stackItems: {[kind: string]: StackItemClass}) {
    for (const kind of Object.keys(stackItems)) {
      this.itemMap.set(kind, stackItems[kind]);
      let constr = this.itemMap.get(kind);
      this.item[kind] = (factory: StackItemFactory, ...args: any[]) => {
        return new constr(factory, ...args);
      };
    }
  }


  /**
   * Removes stack item classs from the factory.
   * @param {string[]} keys The classes to remove.
   */
  public removeStackItems(keys: string[]) {
    for (const key of keys) {
      this.itemMap.delete(key);
    }
  }


  /**
   *
   * @param {string} kind The type of
   * @return {}
   */
  public create(kind: string, ...parameters: any[]) {
    let tt1 = [this].concat(...parameters);
    let tt2 = [this].concat(parameters);
    return (this.item[kind] || this.item[this.defaultKind])
      .apply(null, [this].concat(...parameters));
  }

}
