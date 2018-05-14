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
 * @fileoverview StackItems needed for parsing AMS math commands.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {ArrayItem} from './BaseItems.js';
import ParseUtil from './ParseUtil.js';
import {TreeHelper} from './TreeHelper.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import StackItemFactory from './StackItemFactory.js';
import {StackItem, BaseItem} from './StackItem.js';
import TexError from './TexError.js';
import {TexConstant} from './TexConstants.js';


export class MultlineItem extends ArrayItem {

  /**
   * @override
   */
  constructor(factory: any, ...args: any[]) {
    super(factory);
    this.factory.configuration.tags.start('multline', true, args[0]);
  }


  /**
   * @override
   */
  get kind() {
    return 'multline';
  }


  /**
   * @override
   */
  public EndEntry() {
    TreeHelper.printMethod('AMS-EndEntry');
    if (this.table.length) {
      ParseUtil.fixInitialMO(this.nodes);
    }
    const shove = this.getProperty('shove');
    const mtd = TreeHelper.createNode(
      'mtd', this.nodes, shove ? {columnalign: shove} : {});
    this.setProperty('shove', null);
    this.row.push(mtd);
    this.Clear();
  }

  /**
   * @override
   */
  public EndRow() {
    TreeHelper.printMethod('AMS-EndRow');
    if (this.row.length !== 1) {
      throw new TexError(
        ['MultlineRowsOneCol',
         'The rows within the %1 environment must have exactly one column',
         'multline']);
      }
    let row = TreeHelper.createNode('mtr', this.row, {});
    this.table.push(row);
    this.row = [];
  }

  /**
   * @override
   */
  public EndTable() {
    TreeHelper.printMethod('AMS-EndTable');
    super.EndTable();
    if (this.table.length) {
      let m = this.table.length - 1, i, label = -1;
      if (!TreeHelper.getAttribute(
        TreeHelper.getChildren(this.table[0])[0], 'columnalign')) {
        TreeHelper.setAttribute(TreeHelper.getChildren(this.table[0])[0],
                                'columnalign', TexConstant.Align.LEFT);
      }
      if (!TreeHelper.getAttribute(
        TreeHelper.getChildren(this.table[m])[0], 'columnalign')) {
        TreeHelper.setAttribute(TreeHelper.getChildren(this.table[m])[0],
                                'columnalign', TexConstant.Align.RIGHT);
      }
      let tag = this.factory.configuration.tags.getTag();
      if (tag) {
        label = (this.arraydef.side === TexConstant.Align.LEFT ? 0 : this.table.length - 1);
        const mtr = this.table[label];
        const mlabel = TreeHelper.createNode(
          'mlabeledtr', [tag].concat(TreeHelper.getChildren(mtr)), {});
        TreeHelper.copyAttributes(mtr, mlabel);
        this.table[label] = mlabel;
      }
    }
    this.factory.configuration.tags.end();
  }
}
