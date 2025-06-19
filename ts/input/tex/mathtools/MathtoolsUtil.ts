/*************************************************************
 *  Copyright (c) 2021-2025 MathJax Consortium
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
 * @file    Utility functions for the mathtools package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { EqnArrayItem } from '../base/BaseItems.js';
import { UnitUtil } from '../UnitUtil.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import { lookup } from '../../../util/Options.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { HandlerType } from '../HandlerTypes.js';
import { NewcommandUtil } from '../newcommand/NewcommandUtil.js';

import { MathtoolsMethods } from './MathtoolsMethods.js';

/**
 * Utility functions for the Mathtools package.
 */
export const MathtoolsUtil = {
  /**
   * Set the displaystyle and scriptlevel attributes of an mstyle element
   *
   * @param {MmlNode} mml     The mstyle node to modify.
   * @param {string} style    The TeX style macro to apply.
   */
  setDisplayLevel(mml: MmlNode, style: string) {
    if (!style) return;
    const [display, script] = lookup(
      style,
      {
        '\\displaystyle': [true, 0],
        '\\textstyle': [false, 0],
        '\\scriptstyle': [false, 1],
        '\\scriptscriptstyle': [false, 2],
      },
      [null, null]
    );
    if (display !== null) {
      mml.attributes.set('displaystyle', display);
      mml.attributes.set('scriptlevel', script);
    }
  },

  /**
   * Check that the top stack item is an alignment table.
   *
   * @param {TexParser} parser   The current TeX parser.
   * @param {string} name        The name of the macro doing the checking.
   * @returns {EqnArrayItem}     The top item (an EqnArrayItem).
   */
  checkAlignment(parser: TexParser, name: string): EqnArrayItem {
    const top = parser.stack.Top() as EqnArrayItem;
    if (top.kind !== EqnArrayItem.prototype.kind) {
      throw new TexError(
        'NotInAlignment',
        '%1 can only be used in aligment environments',
        name
      );
    }
    return top;
  },

  /**
   * Add a paired delimiter to the list of them.
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} cs          The control sequence for the paired delimiters.
   * @param {string[]} args      The definition for the paired delimiters.  One of:
   *                                [left, right]
   *                                [left, right, body, argcount]
   *                                [left, right, body, argcount, pre, post]
   */
  addPairedDelims(parser: TexParser, cs: string, args: string[]) {
    if (parser.configuration.handlers.get(HandlerType.MACRO).contains(cs)) {
      throw new TexError(
        'CommadExists',
        'Command %1 already defined',
        `\\${cs}`
      );
    }
    NewcommandUtil.addMacro(
      parser,
      cs,
      MathtoolsMethods.PairedDelimiters,
      args
    );
  },

  /**
   * Adjust the line spacing for a table.
   *
   * @param {MmlNode} mtable   The mtable node to adjust (if it is a table).
   * @param {string} spread    The dimension to change by (number-with-units).
   */
  spreadLines(mtable: MmlNode, spread: string) {
    if (!mtable.isKind('mtable')) return;
    let rowspacing = mtable.attributes.get('rowspacing') as string;
    const add = UnitUtil.dimen2em(spread);
    rowspacing = rowspacing
      .split(/ /)
      .map((s) => UnitUtil.em(Math.max(0, UnitUtil.dimen2em(s) + add)))
      .join(' ');
    mtable.attributes.set('rowspacing', rowspacing);
  },

  /**
   * Check if a string is a number and return it with an explicit plus if there isn't one.
   *
   * @param {string} name   The name of the macro doing the checking.
   * @param {string} n      The string to test as a number.
   * @returns {string}      The number with an explicit sign.
   */
  plusOrMinus(name: string, n: string): string {
    n = n.trim();
    if (!n.match(/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/)) {
      throw new TexError('NotANumber', 'Argument to %1 is not a number', name);
    }
    return n.match(/^[-+]/) ? n : '+' + n;
  },

  /**
   * Parse a \prescript argument, with its associated format, if any.
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} name        The name of the calling macro (\prescript).
   * @param {string} pos         The position for the argument (sub, sup, arg).
   * @returns {MmlNode}          The parsed MML version of the argument.
   */
  getScript(parser: TexParser, name: string, pos: string): MmlNode {
    let arg = UnitUtil.trimSpaces(parser.GetArgument(name));
    if (arg === '') {
      return parser.create('node', 'none');
    }
    const format = parser.options.mathtools[`prescript-${pos}-format`];
    if (format) {
      arg = `${format}{${arg}}`;
    }
    const mml = new TexParser(
      arg,
      parser.stack.env,
      parser.configuration
    ).mml();
    return mml.isKind('TeXAtom') && mml.childNodes[0].childNodes.length === 0
      ? parser.create('node', 'none')
      : mml;
  },
};
