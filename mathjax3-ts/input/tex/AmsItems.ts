/*************************************************************
 *
 *  MathJax/jax/input/TeX/AmsItem.ts
 *
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2009-2019 The MathJax Consortium
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


import {ArrayItem} from './BaseItems.js';
import ParseUtil from './ParseUtil.js';
import {TreeHelper} from './TreeHelper.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import StackItemFactory from './StackItemFactory.js';
import {StackItem} from './StackItem.js';
import TexError from './TexError.js';
import {TexConstant} from './TexConstants.js';
import {DefaultTags} from './Tags.js';

// AMS


export class AmsArrayItem extends ArrayItem {

  private save: {node: MmlNode | void, notags: string,
                 defaultTag: boolean, notag: boolean} =
    {node: null, notags: '', notag: false, defaultTag: false};
  
  constructor(factory: any, ...args: any[]) {
    super(factory);
    DefaultTags.start(args[0], args[2], args[1]);
  }

  get kind() {
    return 'AMSarray';
  }
  
  EndEntry() {
    TreeHelper.printMethod('AMS-EndEntry');
    // @test Cubic Binomial
    if (this.row.length) {
      ParseUtil.fixInitialMO(this.nodes);
    }
    const node = TreeHelper.createNode('mtd', this.nodes, {});
    // VS: OLD
    // var node = MML.mtd.apply(MML,this.data);
    this.row.push(node);
    this.Clear();
  }
  
  EndRow() {
    TreeHelper.printMethod('AMS-EndRow');
    // @test Cubic Binomial
    let mtr = 'mtr';
    let tag = DefaultTags.getTag();
    if (tag) {
      this.row = [tag].concat(this.row);
      mtr = 'mlabeledtr';
    }
    DefaultTags.clearTag();
    const node = TreeHelper.createNode(mtr, this.row, {});
    this.table.push(node); this.row = [];
  }
  
  EndTable() {
    TreeHelper.printMethod('AMS-EndTable');
    // @test Cubic Binomial
    super.EndTable();
    DefaultTags.end();
  }
}



export class MultlineItem extends ArrayItem {

  get kind() {
    return 'multline';
  }

  constructor(factory: any, ...args: any[]) {
    super(factory);
    DefaultTags.start('multline', true, args[0]);
  }

  
  EndEntry() {
    TreeHelper.printMethod('AMS-EndEntry');
    if (this.table.length) {
      ParseUtil.fixInitialMO(this.nodes);
    }
    let mtd = TreeHelper.createNode('mtd', this.nodes, {});
    // if (this.nodes.shove) {mtd.columnalign = this.nodes.shove}
    this.row.push(mtd);
    this.Clear();
  }

  EndRow() {
    TreeHelper.printMethod('AMS-EndRow');
    if (this.row.length !== 1) {
      throw new TexError(['MultlineRowsOneCol',
                          'The rows within the %1 environment must have exactly one column',
                          'multline']);
      }
    let row = TreeHelper.createNode('mtr', this.row, {});
    // this.table.push(this.row); this.row = [];
    this.table.push(row);
    this.row = [];
  }

  EndTable() {
    TreeHelper.printMethod('AMS-EndTable');
    super.EndTable();
    if (this.table.length) {
      let m = this.table.length - 1, i, label = -1;
      if (!TreeHelper.getAttribute(this.table[0], 'columnalign')) {
        TreeHelper.setAttribute(TreeHelper.getChildren(this.table[0])[0],
                                'columnalign', TexConstant.Align.LEFT);
      }
      if (!TreeHelper.getAttribute(this.table[m], 'columnalign')) {
        TreeHelper.setAttribute(TreeHelper.getChildren(this.table[m])[0],
                                'columnalign', TexConstant.Align.RIGHT);
      }
      let tag = DefaultTags.getTag();
      if (tag) {
        label = (this.arraydef.side === TexConstant.Align.LEFT ? 0 : this.table.length - 1);
        console.log(label);
        const mtr = this.table[label];
        const mlabel = TreeHelper.createNode(
          'mlabeledtr', [tag].concat(TreeHelper.getChildren(mtr)), {});
        TreeHelper.copyAttributes(mtr, mlabel);
        this.table[label] = mlabel;
      }
    }
    DefaultTags.end();
  }
}

