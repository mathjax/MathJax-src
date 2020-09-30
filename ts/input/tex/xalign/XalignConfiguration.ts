/*************************************************************
 *  Copyright (c) 2019-2020 MathJax Consortium
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


import {ArrayItem} from '../base/BaseItems.js';
import {StackItem} from '../StackItem.js';
import ParseUtil from '../ParseUtil.js';
import ParseMethods from '../ParseMethods.js';
import {Configuration} from '../Configuration.js';
import {ParseMethod} from '../Types.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {EnvironmentMap} from '../SymbolMap.js';


export class XalignArrayItem extends ArrayItem {

  /**
   * Maximum row number in the array.
   * @type {number}
   */
  public maxrow: number = 0;

  /**
   * @override
   */
  get kind() {
    return 'XalignArray';
  }


  /**
   * @override
   */
  constructor(factory: any, public name: string, public numbered: boolean,
              public padded: boolean, public center: boolean) {
    super(factory);
  }


  /**
   * @override
   */
  public EndRow() {
    let cell: MmlNode;
    let row = this.row;
    this.row = [];
    if (this.padded) {
      this.row.push(this.create('node', 'mtd'));
    }
    while ((cell = row.shift())) {
        this.row.push(cell);
        cell = row.shift();
        if (cell) this.row.push(cell);
      if (row.length || this.padded) {
        this.row.push(this.create('node', 'mtd'));
      }
    }
    if (this.row.length > this.maxrow) this.maxrow = this.row.length;
    super.EndRow();
  }


  /**
   * @override
   */
  public EndTable() {
    super.EndTable();
    if (this.center) {
      let def = this.arraydef;
      if (this.maxrow <= 2) delete def.width;
      def.columnalign = (def.columnalign as string)
        .split(/ /)
        .slice(0, this.maxrow)
        .join(' ');
      def.columnwidth = (def.columnwidth as string)
          .split(/ /)
          .slice(0, this.maxrow)
          .join(' ');
      }
  }

}


let XalignMethods: Record<string, ParseMethod> = {};

/**
 * Generate an align at environment.
 * @param {TexParser} parser The current TeX parser.
 * @param {StackItem} begin The begin stackitem.
 * @param {boolean} numbered Is this a numbered array.
 * @param {boolean} padded Is it padded.
 */
XalignMethods.XalignAt = function(parser: TexParser, begin: StackItem,
                                  numbered: boolean, padded: boolean) {
  console.log(begin);
  let arg = parser.GetArgument('\\begin{' + begin.getName() + '}');
  if (arg.match(/[^0-9]/)) {
    throw new TexError('PositiveIntegerArg',
                       'Argument to %1 must me a positive integer',
                       '\\begin{' + begin.getName() + '}');
  }
  let n = parseInt(arg, 10);
  let align = [];
  let width = [];
  if (padded) {
    align.push('');
    width.push('');
  }
  while (n > 0) {
    align.push('rl');
    width.push('auto auto');
    n--;
  }
  if (padded) {
    align.push('');
    width.push('');
  }
  return XalignMethods.XalignArray(
    parser, begin, numbered, padded, false, align.join('c'), width.join(' fit '));
};


XalignMethods.XalignArray = function(parser: TexParser, begin: StackItem, numbered: boolean,
                                     padded: boolean, center: boolean, align: string, width: string) {
  console.log('Width!');
  console.log(width);
  parser.Push(begin);
  ParseUtil.checkEqnEnv(parser);
  align = align
    .split('')
    .join(' ')
    .replace(/r/g, 'right')
    .replace(/l/g, 'left')
    .replace(/c/g, 'center');
  const item = parser.itemFactory.create(
    'XalignArray', begin.getName(), numbered, padded, center, parser.stack) as ArrayItem;
  item.arraydef = {
    width: '100%',
    displaystyle: true,
    columnalign: align,
    columnspacing: '0em',
    columnwidth: width,
    rowspacing: '3pt',
    side: parser.options['tagSide'],
    minlabelspacing: parser.options['tagIndent']
  };
  return item;
};


new EnvironmentMap('Xalign-environment', ParseMethods.environment, {
      xalignat: ['XalignAt', null, true, true],
      'xalignat*': ['XalignAt', null, false, true],
      xxalignat: ['XalignAt', null, true, false],
      'xxalignat*': ['XalignAt', null, false, false],
      flalign: [
        'XalignArray',
        null,
        true,
        false,
        true,
        'rlcrlcrlcrlcrlcrlc',
        ['', ' ', ' ', ' ', ' ', ' ', ''].join('auto auto fit')
      ],
      'flalign*': [
        'XalignArray',
        null,
        false,
        false,
        true,
        'rlcrlcrlcrlcrlcrlc',
        ['', ' ', ' ', ' ', ' ', ' ', ''].join('auto auto fit')
      ]
}, XalignMethods);


export const XalignConfiguration = Configuration.create(
  'xalign', {
    handler: {
      environment: ['Xalign-environment']
    },
    items: {[XalignArrayItem.prototype.kind]: XalignArrayItem}
  }
);
