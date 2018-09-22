/*************************************************************
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
 * @fileoverview Stack items for parsing the braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import StackItemFactory from '../StackItemFactory.js';
import {CheckType, BaseItem, StackItem, EnvList} from '../StackItem.js';


export class BraketItem extends BaseItem {

  /**
   * @override
   */
  get kind() {
    return 'braket';
  }

  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    console.log('In Braket Item');
   console.log(item);
    if (item.isKind('close')) {
      let node = this.toMml();
      // Add the closing angle or set bracket!
      return [[this.factory.create('mml', node)], true];
    }
    if (item.isKind('bar')) {
      // Let's close here with a bar.
    }
    if (item.isKind('mml')) {
      this.Push(item.toMml());
      return [null, false];
    }
    return super.checkItem(item);
  }

}
