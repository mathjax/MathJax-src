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

  private numbered: boolean = false;
  private save: {[key: string]: string} = {};
  
  constructor(factory: any, ...args: any[]) {
    super(factory);
    // Omitted configuration: && CONFIG.autoNumber !== "none";
    /// name: string, numbered: boolean, taggable: boolean, global: EnvList
    console.log('All arguments');
    console.log(args);
    let global = args[3];
    let taggable = args[2];
    this.numbered = args[1] && DefaultTags.tagged;
    this.save['notags'] = global['notags'] as string;
    this.save['notag'] = global['notag'] as string;
    global['notags'] = (taggable ? null : args[0]);
    // prevent automatic tagging in starred environments
    global['tagged'] = !taggable && !global['forcetag'];
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
    let mtr = 'mtr'; // MML.mtr;
    console.log('Starting');
    console.log(this.numbered);
    if (!DefaultTags.tagNode && this.numbered) {
      DefaultTags.autoTag();
    }
    console.log('global tag: ' + !!DefaultTags.tagNode);
    let tag = DefaultTags.getTag();
    console.log('HERE? ' + this.global['notags']);
    // if (this.global['tag'] && !this.global['notags']) {
    if (tag && !this.global['notags']) {
      this.row = [tag].concat(this.row);
      mtr = 'mlabeledtr'; // MML.mlabeledtr;
    } else {
      console.log('clearing?');
      DefaultTags.clearTag();
    }
    if (this.numbered) {
      delete this.global['notag'];
    }
    const node = TreeHelper.createNode(mtr, this.row, {});
    this.table.push(node); this.row = [];
  }
  
  EndTable() {
    TreeHelper.printMethod('AMS-EndTable');
    // @test Cubic Binomial
    super.EndTable();
    this.global['notags'] = this.save['notags'];
    this.global['notag']  = this.save['notag'];
  }
}



export class MultlineItem extends ArrayItem {

  get kind() {
    return 'multline';
  }

  private numbered: boolean = false;
  private save: {[key: string]: string} = {};
  
  
  constructor(factory: any, ...args: any[]) {
    super(factory);
        // Omitted configuration: && CONFIG.autoNumber !== "none";
    this.numbered = args[0] && DefaultTags.tagged;
    let stack = args[1];
    this.save = {notag: stack.global.notag};
    stack.global.tagged = !this.numbered && !stack.global.forcetag; // prevent automatic tagging in starred environments
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
    // super.EndTable();
    // if (this.table.length) {
    //   let m = this.table.length - 1, i, label = -1;
    //   if (!this.table[0][0].columnalign) {this.table[0][0].columnalign = MML.ALIGN.LEFT}
    //   if (!this.table[m][0].columnalign) {this.table[m][0].columnalign = MML.ALIGN.RIGHT}
    //   if (!this.global.tag && this.numbered) {this.autoTag()}
    //   if (this.global.tag && !this.global.notags) {
    //     label = (this.arraydef.side === 'left' ? 0 : this.table.length - 1);
    //     this.table[label] = [this.getTag()].concat(this.table[label]);
    //     }
    //   for (i = 0, m = this.table.length; i < m; i++) {
    //     var mtr = (i === label ? MML.mlabeledtr : MML.mtr);
    //     this.table[i] = mtr.apply(MML,this.table[i]);
    //   }
    // }
    // this.global.notag  = this.save.notag;
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
      if (!DefaultTags.tagNode && this.numbered) {
        DefaultTags.autoTag();
      }
      console.log(this.global.tag);
      if (DefaultTags.tagNode && !this.global.notags) {
        label = (this.arraydef.side === TexConstant.Align.LEFT ? 0 : this.table.length - 1);
        console.log(label);
        // NEW
        // This needs to be stored in the actual tag object!
        // this.table[label] = this.global.tag as MmlNode;
        // OLD
        // this.table[label] = [this.getTag()].concat(this.table[label]);
        }
      // for (i = 0, m = this.table.length; i < m; i++) {
      //   var mtr = (i === label ? MML.mlabeledtr : MML.mtr);
      //   this.table[i] = mtr.apply(MML,this.table[i]);
      // }
    }
    this.global.notag  = this.save.notag;
  }
}

// StackItemFactory.DefaultStackItems[AmsArrayItem.prototype.kind] = AmsArrayItem;
