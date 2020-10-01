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
import {MultlineItem} from '../ams/AmsItems.js';
import {StackItem} from '../StackItem.js';
import ParseUtil from '../ParseUtil.js';
import ParseMethods from '../ParseMethods.js';
import {Configuration} from '../Configuration.js';
import {ParseMethod} from '../Types.js';
import {AmsMethods} from '../ams/AmsMethods.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {CommandMap, EnvironmentMap} from '../SymbolMap.js';
import NodeUtil from '../NodeUtil.js';
import {TexConstant} from '../TexConstants.js';


let MathtoolsMethods: Record<string, ParseMethod> = {};

export class MultlinedItem extends MultlineItem {

  /**
   * @override
   */
  get kind() {
    return 'multlined';
  }


  /**
   * @override
   */
  public EndTable() {
    if (this.Size() || this.row.length) {
      this.EndEntry();
      this.EndRow();
    }
    if (this.table.length) {
      let first = NodeUtil.getChildren(this.table[0])[0];
      let m = this.table.length - 1;
      if (NodeUtil.getAttribute(first, 'columnalign') !== TexConstant.Align.RIGHT) {
        first.appendChild(
          this.create('node', 'mspace', [],
                      { width: this.factory.configuration.options['MultlineGap'] || '2em' })
        );
      }
      let last = NodeUtil.getChildren(this.table[m])[0];
      if (NodeUtil.getAttribute(
        last, 'columnalign') !== TexConstant.Align.LEFT) {
        let top = last.childNodes[0] as MmlNode;
        top.childNodes.unshift(null);
        const space = this.create(
          'node', 'mspace', [],
          { width: this.factory.configuration.options['MultlineGap'] || '2em' });
        NodeUtil.setChild(top, 0, space);
      }
    }
    super.EndTable.call(this);
  }

}


MathtoolsMethods.MtMatrix = function(parser: TexParser, begin: StackItem, open, close) {
  const align = parser.GetBrackets('\\begin{' + begin.getName() + '}') || 'c';
  return BaseMethods.Array(parser, begin, open, close, align);
},

MathtoolsMethods.MtSmallMatrix = function(
    parser: TexParser, begin: StackItem, open, close, align) {
  if (!align) {
    align = parser.GetBrackets('\\begin{' + begin.getName() + '}') || 'c';
  }
  return BaseMethods.Array(
      parser, begin, open, close, align, ParseUtil.Em(1 / 3), '.2em', 'S', 1);
},

MathtoolsMethods.MtMultlined = function(parser: TexParser, begin: StackItem) {
  let pos = parser.GetBrackets('\\begin{' + begin.getName() + '}') || '';
  let width = pos ? parser.GetBrackets('\\begin{' + begin.getName() + '}') : null;
  if (!pos.match(/^[cbt]$/)) {
    let tmp = width;
    width = pos;
    pos = tmp;
  }
  parser.Push(begin);
  let item = parser.itemFactory.create('multlined', parser, begin) as ArrayItem;
  item.arraydef = {
    displaystyle: true,
    rowspacing: '.5em',
    width: width || parser.options['multlineWidth'],
    columnwidth: '100%',
  };
  return ParseUtil.setArrayAlign(item as ArrayItem, pos || 'c');
};

MathtoolsMethods.HandleShove = function(parser: TexParser, name: string, shove: string) {
  let top = parser.stack.Top();
  if (top.kind !== 'multline' && top.kind !== 'multlined') {
    throw new TexError(
      'CommandInMultlined',
      '%1 can only appear within the multline or multlined environments',
      name);
  }
  if (top.Size()) {
    throw new TexError(
      'CommandAtTheBeginingOfLine',
      '%1 must come at the beginning of the line',
      name);
  }
  top.setProperty('shove', shove);
  let shift = parser.GetBrackets(name);
  let mml = parser.ParseArg(name);
  if (shift) {
    let mrow = parser.create('node', 'mrow', []);
    let mspace = parser.create('node', 'mspace', [], { width: shift });
    if (shove === 'left') {
      mrow.appendChild(mspace);
      mrow.appendChild(mml);
    } else {
      mrow.appendChild(mml);
      mrow.appendChild(mspace);
    }
    mml = mrow;
  }
  parser.Push(mml);
};


MathtoolsMethods.Array = BaseMethods.Array;
MathtoolsMethods.Macro = BaseMethods.Macro;
MathtoolsMethods.xArrow = AmsMethods.xArrow;


new CommandMap('mathtools-macros', {
  shoveleft:  ['HandleShove', TexConstant.Align.LEFT],
  shoveright: ['HandleShove', TexConstant.Align.RIGHT],

  coloneqq: ['Macro', '\\mathrel{≔}'],
  xleftrightarrow: ['xArrow', 0x2194, 7, 6]
}, MathtoolsMethods);


new EnvironmentMap('mathtools-environment', ParseMethods.environment, {
  dcases: ['Array', null, '\\{', '.', 'll', null, '.2em', 'D'],
  rcases: ['Array', null, '.', '\\}', 'll', null, '.2em', 'D'],
  drcases: ['Array', null, '\\{', '\\}', 'll', null, '.2em', 'D'],
  'matrix*': ['MtMatrix', null, null, null],
  'pmatrix*': ['MtMatrix', null, '(', ')'],
  'bmatrix*': ['MtMatrix', null, '[', ']'],
  'Bmatrix*': ['MtMatrix', null, '\\{', '\\}'],
  'vmatrix*': ['MtMatrix', null, '\\vert', '\\vert'],
  'Vmatrix*': ['MtMatrix', null, '\\Vert', '\\Vert'],

  'smallmatrix*': ['MtSmallMatrix', null, null, null],
  psmallmatrix: ['MtSmallMatrix', null, '(', ')', 'c'],
  'psmallmatrix*': ['MtSmallMatrix', null, '(', ')'],
  bsmallmatrix: ['MtSmallMatrix', null, '[', ']', 'c'],
  'bsmallmatrix*': ['MtSmallMatrix', null, '[', ']'],
  Bsmallmatrix: ['MtSmallMatrix', null, '\\{', '\\}', 'c'],
  'Bsmallmatrix*': ['MtSmallMatrix', null, '\\{', '\\}'],
  vsmallmatrix: ['MtSmallMatrix', null, '\\vert', '\\vert', 'c'],
  'vsmallmatrix*': ['MtSmallMatrix', null, '\\vert', '\\vert'],
  Vsmallmatrix: ['MtSmallMatrix', null, '\\Vert', '\\Vert', 'c'],
  'Vsmallmatrix*': ['MtSmallMatrix', null, '\\Vert', '\\Vert'],

  multlined: 'MtMultlined',
}, MathtoolsMethods);


export const MathtoolsConfiguration = Configuration.create(
  'mathtools', {
    handler: {
      macro: ['mathtools-macros'],
      environment: ['mathtools-environment']
    },
    items: {[MultlinedItem.prototype.kind]: MultlinedItem}
  }
);
