/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file Mappings for TeX parsing for the bussproofs package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { ParseMethod } from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import { ParseUtil } from '../ParseUtil.js';
import { UnitUtil } from '../UnitUtil.js';
import { StackItem } from '../StackItem.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import * as BussproofsUtil from './BussproofsUtil.js';

/**
 * Pads content of an inference rule.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} content The content to be padded.
 * @returns {MmlNode} The mrow element with padded content.
 */
function paddedContent(parser: TexParser, content: string): MmlNode {
  // Add padding on either site.
  const nodes = ParseUtil.internalMath(parser, UnitUtil.trimSpaces(content), 0);
  if (!nodes[0].childNodes[0].childNodes.length) {
    return parser.create('node', 'mrow', []);
  }
  const lpad = parser.create('node', 'mspace', [], { width: '.5ex' });
  const rpad = parser.create('node', 'mspace', [], { width: '.5ex' });
  return parser.create('node', 'mrow', [lpad, ...nodes, rpad]);
}

/**
 * Creates a ND style inference rule.
 *
 * @param {TexParser} parser The calling parser.
 * @param {MmlNode} premise The premise (a single table).
 * @param {MmlNode[]} conclusions Elements that are combined into the conclusion.
 * @param {MmlNode|null} left The left label if it exists.
 * @param {MmlNode|null} right The right label if it exists.
 * @param {string} style Style of inference rule line.
 * @param {boolean} rootAtTop Direction of inference rule: true for root at top.
 * @returns {MmlNode} The create rule node.
 */
function createRule(
  parser: TexParser,
  premise: MmlNode,
  conclusions: MmlNode[],
  left: MmlNode | null,
  right: MmlNode | null,
  style: string,
  rootAtTop: boolean
): MmlNode {
  const upper = parser.create(
    'node',
    'mtr',
    [parser.create('node', 'mtd', [premise], {})],
    {}
  );
  const lower = parser.create(
    'node',
    'mtr',
    [parser.create('node', 'mtd', conclusions, {})],
    {}
  );
  let rule = parser.create(
    'node',
    'mtable',
    rootAtTop ? [lower, upper] : [upper, lower],
    { align: 'top 2', rowlines: style, framespacing: '0 0' }
  );
  BussproofsUtil.setProperty(rule, 'inferenceRule', rootAtTop ? 'up' : 'down');
  let leftLabel, rightLabel;
  if (left) {
    leftLabel = parser.create('node', 'mpadded', [left], {
      height: '.25em',
      depth: '+.25em',
      width: '+.5ex',
      voffset: '-.25em',
    });
    BussproofsUtil.setProperty(leftLabel, 'prooflabel', 'left');
  }
  if (right) {
    rightLabel = parser.create('node', 'mpadded', [right], {
      height: '-.25em',
      depth: '+.25em',
      width: '+.5ex',
      voffset: '-.25em',
      lspace: '.5ex',
    });
    BussproofsUtil.setProperty(rightLabel, 'prooflabel', 'right');
  }
  let children, label;
  if (left && right) {
    children = [leftLabel, rule, rightLabel];
    label = 'both';
  } else if (left) {
    children = [leftLabel, rule];
    label = 'left';
  } else if (right) {
    children = [rule, rightLabel];
    label = 'right';
  } else {
    return rule;
  }
  rule = parser.create('node', 'mrow', children);
  BussproofsUtil.setProperty(rule, 'labelledRule', label);
  return rule;
}

/**
 * Parses a line with a sequent (i.e., one containing \\fcenter).
 *
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the calling command.
 * @returns {MmlNode} The parsed line.
 */
function parseFCenterLine(parser: TexParser, name: string): MmlNode {
  const dollar = parser.GetNext();
  if (dollar !== '$') {
    throw new TexError(
      'IllegalUseOfCommand',
      'Use of %1 does not match its definition.',
      name
    );
  }
  parser.i++;
  const axiom = parser.GetUpTo(name, '$');
  if (!axiom.includes('\\fCenter')) {
    throw new TexError(
      'MissingProofCommand',
      'Missing %1 in %2.',
      '\\fCenter',
      name
    );
  }
  // Check for fCenter and throw error?
  const [prem, conc] = axiom.split('\\fCenter');
  const premise = new TexParser(
    prem,
    parser.stack.env,
    parser.configuration
  ).mml();
  const conclusion = new TexParser(
    conc,
    parser.stack.env,
    parser.configuration
  ).mml();
  const fcenter = new TexParser(
    '\\fCenter',
    parser.stack.env,
    parser.configuration
  ).mml();
  const left = parser.create('node', 'mtd', [premise], {});
  const middle = parser.create('node', 'mtd', [fcenter], {});
  const right = parser.create('node', 'mtd', [conclusion], {});
  const row = parser.create('node', 'mtr', [left, middle, right], {});
  const table = parser.create('node', 'mtable', [row], {
    columnspacing: '.5ex',
    columnalign: 'center 2',
  });
  BussproofsUtil.setProperty(table, 'sequent', true);
  parser.configuration.addNode('sequent', row);
  return table;
}

// Namespace
const BussproofsMethods: { [key: string]: ParseMethod } = {
  /**
   * Implements the proof tree environment.
   *
   * @param {TexParser} parser The current parser.
   * @param {StackItem} begin The opening element of the environment.
   * @returns {StackItem} The proof tree stackitem.
   */
  // TODO: Error handling if we have leftover elements or elements are not in the
  // required order.
  Prooftree(parser: TexParser, begin: StackItem): StackItem {
    parser.Push(begin);
    // TODO: Check if opening a proof tree is legal.
    const newItem = parser.itemFactory.create('proofTree').setProperties({
      name: begin.getName(),
      line: 'solid',
      currentLine: 'solid',
      rootAtTop: false,
    });
    // parser.Push(item);
    return newItem;
  },

  /**
   * Implements the Axiom command.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   */
  Axiom(parser: TexParser, name: string) {
    const top = parser.stack.Top();
    // TODO: Label error
    if (top.kind !== 'proofTree') {
      throw new TexError(
        'IllegalProofCommand',
        'Proof commands only allowed in prooftree environment.'
      );
    }
    const content = paddedContent(parser, parser.GetArgument(name));
    BussproofsUtil.setProperty(content, 'axiom', true);
    top.Push(content);
  },

  /**
   * Implements the Inference rule commands.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   * @param {number} n Number of premises for this inference rule.
   */
  Inference(parser: TexParser, name: string, n: number) {
    const top = parser.stack.Top();
    if (top.kind !== 'proofTree') {
      throw new TexError(
        'IllegalProofCommand',
        'Proof commands only allowed in prooftree environment.'
      );
    }
    if (top.Size() < n) {
      throw new TexError('BadProofTree', 'Proof tree badly specified.');
    }
    const rootAtTop = top.getProperty('rootAtTop') as boolean;
    const childCount = n === 1 && !top.Peek()[0].childNodes.length ? 0 : n;
    const children: MmlNode[] = [];
    do {
      if (children.length) {
        children.unshift(parser.create('node', 'mtd', [], {}));
      }
      children.unshift(
        parser.create('node', 'mtd', [top.Pop()], {
          rowalign: rootAtTop ? 'top' : 'bottom',
        })
      );
      n--;
    } while (n > 0);
    const row = parser.create('node', 'mtr', children, {});
    const table = parser.create('node', 'mtable', [row], {
      framespacing: '0 0',
    });
    const conclusion = paddedContent(parser, parser.GetArgument(name));
    const style = top.getProperty('currentLine') as string;
    if (style !== top.getProperty('line')) {
      top.setProperty('currentLine', top.getProperty('line'));
    }
    const rule = createRule(
      parser,
      table,
      [conclusion],
      top.getProperty('left') as MmlNode,
      top.getProperty('right') as MmlNode,
      style,
      rootAtTop
    );
    top.setProperty('left', null);
    top.setProperty('right', null);
    BussproofsUtil.setProperty(rule, 'inference', childCount);
    parser.configuration.addNode('inference', rule);
    top.Push(rule);
  },

  /**
   * Implements the label command.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   * @param {string} side The side of the label.
   */
  Label(parser: TexParser, name: string, side: string) {
    const top = parser.stack.Top();
    // Label error
    if (top.kind !== 'proofTree') {
      throw new TexError(
        'IllegalProofCommand',
        'Proof commands only allowed in prooftree environment.'
      );
    }
    const content = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
    const label =
      content.length > 1
        ? parser.create('node', 'mrow', content, {})
        : content[0];
    top.setProperty(side, label);
  },

  /**
   * Sets line style for inference rules.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} _name The name of the command.
   * @param {string} style The line style to set.
   * @param {boolean} always Set as permanent style.
   */
  SetLine(parser: TexParser, _name: string, style: string, always: boolean) {
    const top = parser.stack.Top();
    // Label error
    if (top.kind !== 'proofTree') {
      throw new TexError(
        'IllegalProofCommand',
        'Proof commands only allowed in prooftree environment.'
      );
    }
    top.setProperty('currentLine', style);
    if (always) {
      top.setProperty('line', style);
    }
  },

  /**
   * Implements commands indicating where the root of the proof tree is.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} _name The name of the command.
   * @param {string} where If true root is at top, otherwise at bottom.
   */
  RootAtTop(parser: TexParser, _name: string, where: boolean) {
    const top = parser.stack.Top();
    if (top.kind !== 'proofTree') {
      throw new TexError(
        'IllegalProofCommand',
        'Proof commands only allowed in prooftree environment.'
      );
    }
    top.setProperty('rootAtTop', where);
  },

  /**
   * Implements Axiom command for sequents.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   */
  AxiomF(parser: TexParser, name: string) {
    const top = parser.stack.Top();
    if (top.kind !== 'proofTree') {
      throw new TexError(
        'IllegalProofCommand',
        'Proof commands only allowed in prooftree environment.'
      );
    }
    const line = parseFCenterLine(parser, name);
    BussproofsUtil.setProperty(line, 'axiom', true);
    top.Push(line);
  },

  /**
   * Placeholder for Fcenter macro that can be overwritten with renewcommand.
   *
   * @param {TexParser} _parser The current parser.
   * @param {string} _name The name of the command.
   */
  FCenter(_parser: TexParser, _name: string) {},

  /**
   * Implements inference rules for sequents.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   * @param {number} n Number of premises for this inference rule.
   */
  InferenceF(parser: TexParser, name: string, n: number) {
    const top = parser.stack.Top();
    if (top.kind !== 'proofTree') {
      throw new TexError(
        'IllegalProofCommand',
        'Proof commands only allowed in prooftree environment.'
      );
    }
    if (top.Size() < n) {
      throw new TexError('BadProofTree', 'Proof tree badly specified.');
    }
    const rootAtTop = top.getProperty('rootAtTop') as boolean;
    const childCount = n === 1 && !top.Peek()[0].childNodes.length ? 0 : n;
    const children: MmlNode[] = [];
    do {
      if (children.length) {
        children.unshift(parser.create('node', 'mtd', [], {}));
      }
      children.unshift(
        parser.create('node', 'mtd', [top.Pop()], {
          rowalign: rootAtTop ? 'top' : 'bottom',
        })
      );
      n--;
    } while (n > 0);
    const row = parser.create('node', 'mtr', children, {});
    const table = parser.create('node', 'mtable', [row], {
      framespacing: '0 0',
    });

    const conclusion = parseFCenterLine(parser, name); // TODO: Padding
    const style = top.getProperty('currentLine') as string;
    if (style !== top.getProperty('line')) {
      top.setProperty('currentLine', top.getProperty('line'));
    }
    const rule = createRule(
      parser,
      table,
      [conclusion],
      top.getProperty('left') as MmlNode,
      top.getProperty('right') as MmlNode,
      style,
      rootAtTop
    );
    top.setProperty('left', null);
    top.setProperty('right', null);
    BussproofsUtil.setProperty(rule, 'inference', childCount);
    parser.configuration.addNode('inference', rule);
    top.Push(rule);
  },
};

export default BussproofsMethods;
