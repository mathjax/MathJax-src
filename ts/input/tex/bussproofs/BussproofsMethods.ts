/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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

import { COMPONENT } from './locales/Component.js';

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
 * Gets the current proof tree stack item. If the parser is not currently
 * inside a prooftree environment, an implicit proof tree is started, which
 * has to be terminated with a \DisplayProof command (as in the original
 * plain TeX version of the package, where proof commands can occur anywhere
 * in the text).
 *
 * @param {TexParser} parser The calling parser.
 * @returns {StackItem} The (possibly newly created) proof tree item.
 */
function getProofTree(parser: TexParser): StackItem {
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    top = parser.itemFactory.create('proofTree').setProperties({
      line: 'solid',
      currentLine: 'solid',
      rootAtTop: false,
      implicit: true,
    });
    parser.Push(top);
  }
  return top;
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
    throw new TexError(COMPONENT, 'IllegalUseOfCommand', name);
  }
  parser.i++;
  let axiom = parser.GetUpTo(name, '$');
  if (axiom.indexOf('\\fCenter') === -1) {
    throw new TexError(COMPONENT, 'MissingProofCommand', '\\fCenter', name);
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

/**
 * Builds an inference rule from the topmost n elements of the proof tree.
 * This implements the joint functionality of the InfC (plain conclusion) and
 * Inf (sequent conclusion with \fCenter) commands of any arity.
 *
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the calling command.
 * @param {number} n Number of premises for this inference rule.
 * @param {boolean} sequent True if the conclusion is a sequent line
 *     containing \fCenter.
 */
function doInference(
  parser: TexParser,
  name: string,
  n: number,
  sequent: boolean
) {
  const top = getProofTree(parser);
  if (top.Size() < n) {
    throw new TexError(COMPONENT, 'BadProofTree');
  }
  const rootAtTop = top.getProperty('rootAtTop') as boolean;
  const childCount = n === 1 && !top.Peek()[0].childNodes.length ? 0 : n;
  const hypSep = top.getProperty('hypSep') as string;
  const children: MmlNode[] = [];
  do {
    if (children.length) {
      // The separating column, possibly containing the material given by
      // \insertBetweenHyps, which is parsed anew for each separator.
      const sep = hypSep
        ? [new TexParser(hypSep, parser.stack.env, parser.configuration).mml()]
        : [];
      children.unshift(parser.create('node', 'mtd', sep, {}));
    }
    children.unshift(
      parser.create('node', 'mtd', [top.Pop()], {
        rowalign: rootAtTop ? 'top' : 'bottom',
      })
    );
    n--;
  } while (n > 0);
  const hypKern = top.getProperty('hypKern') as string;
  if (hypKern) {
    // \kernHyps: slide the block of hypotheses to the right (or left for
    // negative values) by prepending a space to the first premise.
    const mspace = parser.create('node', 'mspace', [], { width: hypKern });
    const mrow = children[0].childNodes[0] as MmlNode;
    mspace.parent = mrow;
    mrow.childNodes.unshift(mspace);
  }
  const row = parser.create('node', 'mtr', children, {});
  const table = parser.create(
    'node',
    'mtable',
    [row],
    hypSep
      ? // The hypothesis separation replaces the default column spacing.
        { framespacing: '0 0', columnspacing: '0em' }
      : { framespacing: '0 0' }
  );
  const conclusion = sequent
    ? parseFCenterLine(parser, name) // TODO: Padding
    : paddedContent(parser, parser.GetArgument(name));
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
  top.setProperty('hypKern', null);
  top.setProperty('hypSep', null);
  BussproofsUtil.setProperty(rule, 'inference', childCount);
  parser.configuration.addNode('inference', rule);
  top.Push(rule);
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
    const top = getProofTree(parser);
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
    doInference(parser, name, n, false);
  },

  /**
   * Implements the label command.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   * @param {string} side The side of the label.
   */
  Label(parser: TexParser, name: string, side: string) {
    const top = getProofTree(parser);
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
    const top = getProofTree(parser);
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
    const top = getProofTree(parser);
    top.setProperty('rootAtTop', where);
  },

  /**
   * Implements Axiom command for sequents.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   */
  AxiomF(parser: TexParser, name: string) {
    const top = getProofTree(parser);
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
    doInference(parser, name, n, true);
  },

  /**
   * Implements the DisplayProof command that terminates and displays a
   * proof tree given outside of a prooftree environment. Inside the
   * environment the command is redundant, as the display is provided by the
   * end of the environment.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} _name The name of the command.
   */
  DisplayProof(parser: TexParser, _name: string) {
    const top = parser.stack.Top();
    if (top.kind !== 'proofTree') {
      throw new TexError(COMPONENT, 'BadProofTree');
    }
    if (!top.getProperty('implicit')) {
      return;
    }
    if (top.Size() !== 1) {
      throw new TexError(COMPONENT, 'BadProofTree');
    }
    const node = top.toMml();
    BussproofsUtil.setProperty(node, 'proof', true);
    parser.stack.Pop();
    parser.Push(node);
  },

  /**
   * Implements the EnableBpAbbreviations command. The abbreviated commands
   * are always enabled in this implementation, so this is a no-op.
   *
   * @param {TexParser} _parser The current parser.
   * @param {string} _name The name of the command.
   */
  EnableAbbreviations(_parser: TexParser, _name: string) {},

  /**
   * Implements the kernHyps command that slides the block of hypotheses of
   * the next inference to the right by the given dimension (negative values
   * slide to the left).
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   */
  KernHyps(parser: TexParser, name: string) {
    const top = getProofTree(parser);
    top.setProperty('hypKern', parser.GetDimen(name));
  },

  /**
   * Implements the insertBetweenHyps command that provides the material
   * separating the hypotheses of the next inference.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} name The name of the command.
   */
  BetweenHyps(parser: TexParser, name: string) {
    const top = getProofTree(parser);
    top.setProperty('hypSep', parser.GetArgument(name));
  },

  /**
   * Implements the proof alignment commands that determine the vertical
   * position of the proof tree with respect to the baseline.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} _name The name of the command.
   * @param {string} align The alignment: 'bottom', 'center' or 'normal'.
   */
  AlignProof(parser: TexParser, _name: string, align: string) {
    const top = getProofTree(parser);
    top.setProperty('proofAlign', align);
  },
};

export default BussproofsMethods;
