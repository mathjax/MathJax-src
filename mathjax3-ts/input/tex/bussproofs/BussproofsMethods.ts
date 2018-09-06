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
import NodeUtil from '../NodeUtil.js';

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
                   line: 'solid', currentLine: 'solid', rootAtTop: false});
  // parser.Push(item);
  return newItem;
};

BussproofsMethods.Axiom = function(parser: TexParser, name: string) {
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
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  if (top.Size() < n) {
    throw new TexError('BadProofTree', 'Proof tree badly specified.');
  }
  const factory = parser.configuration.nodeFactory;
  const rootAtTop = top.getProperty('rootAtTop') as boolean;
  let children: MmlNode[] = [];
  do {
    if (children.length) {
      let space = factory.create('node', 'mspace', [], {'width': '.5em'});
      children.unshift(factory.create('node', 'mtd', [space], {}));
    }
    children.unshift(
      factory.create('node', 'mtd', [top.Pop()],
                     {'rowalign': (rootAtTop ? 'top' : 'bottom')}));
    n--;
  } while (n > 0);
  let row = factory.create('node', 'mtr', children, {});
  let table = factory.create('node', 'mtable', [row], {framespacing: '0 0'});
  let conclusion = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
  let style = top.getProperty('currentLine') as string;
  if (style !== top.getProperty('line')) {
    top.setProperty('currentLine', top.getProperty('line'));
  }
  let rule = top.getProperty('fraction') ?
    createRuleOld(factory, table, conclusion,
                  top.getProperty('left') as MmlNode, top.getProperty('right') as MmlNode,
                  style, rootAtTop) :
    createRule(factory, table, conclusion,
               top.getProperty('left') as MmlNode, top.getProperty('right') as MmlNode,
               style, rootAtTop);
  top.setProperty('left', null);
  top.setProperty('right', null);
  top.Push(rule);
};


function createRuleOld(factory: NodeFactory, premise: MmlNode,
                       conclusions: MmlNode[], left: MmlNode|null,
                       right: MmlNode|null, style: string,
                       rootAtTop: boolean) {
  let conclusion = factory.create('node', 'mrow', conclusions, {});
  let frac = factory.create('node', 'mfrac',
                            rootAtTop ? [conclusion, premise] : [premise, conclusion], {});
  if (left && right) {
    return factory.create('node', 'mrow', [left, frac, right], {});
  }
  if (left) {
    return factory.create('node', 'mrow', [left, frac], {});
  }
  if (right) {
    return factory.create('node', 'mrow', [frac, right], {});
  }
  return frac;
};


function createRule(factory: NodeFactory, premise: MmlNode,
                    conclusions: MmlNode[], left: MmlNode|null,
                    right: MmlNode|null, style: string,
                    rootAtTop: boolean) {
  const upper = factory.create(
    'node', 'mtr', [factory.create('node', 'mtd', [premise], {})], {});
  const lower = factory.create(
    'node', 'mtr', [factory.create('node', 'mtd', conclusions, {})], {});
  let rule = factory.create('node', 'mtable', rootAtTop ? [lower, upper] : [upper, lower],
                            {align: 'top 2', rowlines: style, framespacing: '0 0'});
  let leftLabel, rightLabel;
  if (left) {
    leftLabel = factory.create('node', 'mpadded', [left],
                               {height: '+.5em', width: '+.5em', voffset: '-.15em'});
  }
  if (right) {
    rightLabel = factory.create('node', 'mpadded', [right],
                                {height: '+.5em', width: '+.5em', voffset: '-.15em'});
  }
  if (left && right) {
    return factory.create('node', 'mrow', [leftLabel, rule, rightLabel], {});
  }
  if (left) {
    return factory.create('node', 'mrow', [leftLabel, rule], {});
  }
  if (right) {
    return factory.create('node', 'mrow', [rule, rightLabel], {});
  }
  return rule;
};


BussproofsMethods.Label = function(parser: TexParser, name: string, side: string) {
  let top = parser.stack.Top();
  // Label error
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  let content = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
  let label = (content.length > 1) ?
    parser.configuration.nodeFactory.create('node', 'mrow', content, {}) : content[0];
  top.setProperty(side, label);
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


BussproofsMethods.RootAtTop = function(parser: TexParser, name: string, where: boolean) {
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  top.setProperty('rootAtTop', where);
};


BussproofsMethods.AxiomF = function(parser: TexParser, name: string) {
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  let line = parseFCenterLine(parser, name);
  top.Push(line);
};


function parseFCenterLine(parser: TexParser, name: string): MmlNode {
  let dollar = parser.GetNext();
  if (dollar !== '$') {
    throw new TexError('IllegalUseOfCommand',
                       'Use of %1 does not match it\'s definition.', name);
  }
  parser.i++;
  let axiom = parser.GetUpTo(name, '$');
  if (axiom.indexOf('\\fCenter') === -1) {
    throw new TexError('IllegalUseOfCommand',
                       'Missing \\fCenter in %1.', name);
  }
  // Check for fCenter and throw error?
  let [prem, conc] = axiom.split('\\fCenter');
  let premise = (new TexParser(prem, parser.stack.env, parser.configuration)).mml();
  let conclusion = (new TexParser(conc, parser.stack.env, parser.configuration)).mml();
  let fcenter = (new TexParser('\\fCenter', parser.stack.env, parser.configuration)).mml();
  const factory = parser.configuration.nodeFactory;
  const left = factory.create('node', 'mtd', [premise], {});
  const middle = factory.create('node', 'mtd', [fcenter], {});
  const right = factory.create('node', 'mtd', [conclusion], {});
  const row = factory.create('node', 'mtr', [left, middle, right], {});
  row.setProperty('sequent', true);
  const table = factory.create('node', 'mtable', [row], {columnspacing: '.5ex', columnalign: 'center 2'});
  return table;
};


BussproofsMethods.FCenter = function(parser: TexParser, name: string) { };

BussproofsMethods.InferenceF = function(parser: TexParser, name: string) { 
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  const factory = parser.configuration.nodeFactory;
  const rootAtTop = top.getProperty('rootAtTop') as boolean;
  let style = top.getProperty('currentLine') as string;
  if (style !== top.getProperty('line')) {
    top.setProperty('currentLine', top.getProperty('line'));
  }
  let conclusion = parseFCenterLine(parser, name);
  let premise = top.Pop() as MmlNode;
  let rule = createRule(factory, premise, [conclusion],
                        top.getProperty('left') as MmlNode, top.getProperty('right') as MmlNode,
                        style, rootAtTop);
  NodeUtil.setAttribute(rule, 'columnalign', 'center 2');
  top.setProperty('left', null);
  top.setProperty('right', null);
  top.Push(rule);
};

export default BussproofsMethods;
