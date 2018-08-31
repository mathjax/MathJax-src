/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview Items for TeX parsing of bussproofs.
 *                                            
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import TexError from '../TexError.js';
import {EndItem, BeginItem} from '../base/BaseItems.js';
import {BaseItem, StackItem} from '../StackItem.js';
import StackItemFactory from '../StackItemFactory.js';
import ParseUtil from '../ParseUtil.js';
import {MmlNode, TextNode} from '../../../core/MmlTree/MmlNode.js';


export class ProofTreeItem extends BaseItem {


  /**
   * The current left label.
   * @type {MmlNode[]}
   */
  public leftLabel: MmlNode[] = null;

  /**
   * The current right label.
   * @type {MmlNode[]}
   */
  public rigthLabel: MmlNode[] = null;

  /**
   * @override
   */
  public get kind() {
    return 'proofTree';
  }


  /**
   * @override
   */
  public checkItem(item: StackItem) {
    if (item.isKind('end')) {
      console.log('here at the end');
      return [this.toMml(), item];
    }
    if (item.isKind('stop')) {
      console.log(this);
      // @test EnvMissingEnd Equation
      throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
    }
    return super.checkItem(item);
  }

}


export class ProofLabelItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'proofLabel';
  }


  // /**
  //  * @override
  //  */
  // public checkItem(item: StackItem) {
  //   console.log(2);
  //   console.log(item.kind);
  //   if (item.isKind('end')) {
  //     console.log('here at the end');
  //     return [this.toMml(), item];
  //   }
  //   if (item.isKind('stop')) {
  //     console.log(this);
  //     // @test EnvMissingEnd Equation
  //     throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
  //   }
  //   return super.checkItem(item);
  // }

}



