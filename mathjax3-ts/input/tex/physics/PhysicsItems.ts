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
 * @fileoverview Stack items for the physics package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import StackItemFactory from '../StackItemFactory.js';
import {CheckType, BaseItem, StackItem, EnvList} from '../StackItem.js';
import {TEXCLASS, MmlNode} from '../../../core/MmlTree/MmlNode.js';
import ParseUtil from '../ParseUtil.js';


export class AutoOpen extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'auto open';
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
  public toMml() {
    return ParseUtil.fenced(this.factory.configuration,
                            this.getProperty('open') as string,
                            super.toMml(),
                            this.getProperty('close') as string);
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    let close = item.getProperty('close');
    if (close && close === this.getProperty('close')) {
      return [[this.toMml()], true];
    }
    return super.checkItem(item);
  }

}
