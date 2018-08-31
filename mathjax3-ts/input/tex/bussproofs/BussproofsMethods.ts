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
 * @fileoverview Mappings for TeX parsing for the bussproofs package.
 *                                            
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {Args, Attributes, ParseMethod} from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import BaseMethods from '../base/BaseMethods.js';
import ParseUtil from '../ParseUtil.js';
import {StackItem} from '../StackItem.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {NodeFactory} from '../NodeFactory.js';

// Namespace
let BussproofsMethods: Record<string, ParseMethod> = {};

// TODO: Error handling if we have leftover elements or elements are not in the
// required order.
// fraction is temporary!
BussproofsMethods.Prooftree = function(parser: TexParser, begin: StackItem, fraction: boolean) {
  parser.Push(begin);
  // TODO: Check if opening a proof tree is legal.
  let newItem = parser.itemFactory.create('proofTree').
    setProperties({name: begin.getName(), fraction: fraction, // fraction is temporary! 
                   line: 'solid', currentLine: 'solid'});
  // parser.Push(item);
  return newItem;
};

BussproofsMethods.Axiom = function(parser: TexParser, name: string) {
  console.log('Axiom');
  let top = parser.stack.Top();
  // TODO: Label error
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  let content = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
  top.Push.apply(top, content);
};


BussproofsMethods.Inference = function(parser: TexParser, name: string, n: number) {
  console.log('Inference');
  let top = parser.stack.Top();
  const factory = parser.configuration.nodeFactory;
  // Check for label
  // TODO
  let label = null;
  if (top.kind === 'proofLabel') {
    label = top;
    parser.stack.Pop();
    top = parser.stack.Top();
  }
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  if (top.Size() < n) {
    throw new TexError('BadProofTree', 'Proof tree badly specified.');
  }
  let children: MmlNode[] = [];
  do {
    if (children.length) {
      let space = factory.create('node', 'mspace', [], {'width': '.5em'});
      children.unshift(factory.create('node', 'mtd', [space], {}));
    }
    children.unshift(
      factory.create('node', 'mtd', [top.Pop()], {'rowalign': 'bottom'}));
    n--;
  } while (n > 0);
  let row = factory.create('node', 'mtr', children, {});
  let table = factory.create('node', 'mtable', [row], {framespacing: '0 0'});
  let conclusion = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
  // Here we use the information on the
  let style = top.getProperty('currentLine') as string;
  if (style !== top.getProperty('line')) {
    top.setProperty('currentLine', top.getProperty('line'));
  }
  let rule = top.getProperty('fraction') ?
    createRuleOld(factory, table, conclusion, label, style) :
    createRule(factory, table, conclusion, label, style);
  top.Push(rule);
};


function createRuleOld(factory: NodeFactory, premise: MmlNode,
                       conclusions: MmlNode[], label: StackItem, style: string) {
  let conclusion = factory.create('node', 'mrow', conclusions, {});
  let frac = factory.create('node', 'mfrac', [premise, conclusion], {});
  if (label) {
    let mml = label.toMml();
    frac = factory.create('node', 'mrow',
                          (label.getProperty('side') === 'right') ? [frac, mml] : [mml, frac], {});
  }
  return frac;
};


function createRule(factory: NodeFactory, premise: MmlNode,
                    conclusions: MmlNode[], label: StackItem, style: string) {
  const upper = factory.create(
    'node', 'mtr', [factory.create('node', 'mtd', [premise], {})], {});
  const lower = factory.create(
    'node', 'mtr', [factory.create('node', 'mtd', conclusions, {})], {});
  let rule = factory.create('node', 'mtable', [upper, lower],
                            {align: 'top 2', rowlines: style, framespacing: '0 0'});
  if (label) {
    let mml = label.toMml();
    const name = factory.create('node', 'mpadded', [mml],
                                {height: '+.5em', width: '+.5em', voffset: '-.15em'});
    rule = factory.create('node', 'mrow',
                          (label.getProperty('side') === 'right') ? [rule, name] : [name, rule], {});
  }
  return rule;
};


BussproofsMethods.Label = function(parser: TexParser, name: string, side: string) {
  console.log('Label');
  let top = parser.stack.Top();
  // Label error
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  let content = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
  // let label = (content.length > 1) ?
  //   parser.configuration.nodeFactory.create('node', 'mrow', content, {}) : content[0];
  // top.setProperty(side, label);
  // TODO: No label item. Have two fields in the prooftree item for left and right.
  let newItem = parser.itemFactory.create('proofLabel').setProperties({side: side});
  newItem.Push.apply(newItem, content);
  parser.Push(newItem);
};


/**
 * Sets line style for inference rules.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 * @param {string} style The line style to set.
 * @param {boolean} always Set as permanent style.
 */
BussproofsMethods.SetLine = function(parser: TexParser, name: string, style: string, always: boolean) {
  let top = parser.stack.Top();
  // Label error
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  top.setProperty('currentLine', style);
  if (always) {
    top.setProperty('line', style);
  }
};


export default BussproofsMethods;
