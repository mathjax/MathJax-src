/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
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
 * @file Configuration and implementation of the esdiff package.
 *
 * Implements \diff and \diffp (and their starred forms) from the LaTeX
 * esdiff package, with its default settings (display-style fractions in
 * in-line math, upright d, and no extra spacing).
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import TexParser from '../TexParser.js';
import { CommandMap } from '../TokenMap.js';
import { ParseMethod } from '../Types.js';
import { texError } from '../TexError.js';
import { AbstractMmlTokenNode } from '../../../core/MmlTree/MmlNode.js';
import { COMPONENT } from './__locales__/Component.js';
export { COMPONENT };

/**
 * The `esdiff` utility functions.
 */
export const EsdiffUtil = {

  /**
   * Get the variables of a crossed partial derivative and the total order
   * of the derivative.  As in esdiff, each token of the list is one
   * variable, with braces used to group a variable with its power (so
   * {x}{y^2} is x and y squared), and the order is the sum of the powers,
   * which must be numbers (or at least prefixed by one).
   *
   * @param {TexParser} parser The current tex parser.
   * @param {string} text The denominator variables.
   * @returns {[string[], number]} The variables and the total order.
   */
  crossedVariables(parser: TexParser, text: string): [string[], number] {
    const name = parser.currentCS;
    const PARSER = new TexParser('', parser.stack.env, parser.configuration);
    PARSER.configuration.popParser();
    PARSER.string = text;
    const args = [];
    while (PARSER.i < PARSER.string.length) {
      args.push(PARSER.GetArgument(name));
    }
    let order = 0;
    for (const arg of args) {
      PARSER.string = arg + '^1';
      PARSER.i = 0;
      PARSER.GetUpTo(name, '^')
      order += this.getPower(PARSER, parser, name);
    }
    return [args, order];
  },

  /**
   * Get a number from the next argument (either as a direct string,
   * or after parsing, as a single `mn` element, as an `mn` followed
   * by other content, or as an `mo` minus sign followed by an `mn`.
   * Any additional nodes are pushed immediately (as they are in the
   * actual LaTeX package, though that should probably be considered a
   * bug in that package).  If there is no number, an error is thrown.
   *
   * @param {TexParser} PARSER   The temprary parser for the cross variables.
   * @param {TexParser} parser   The original parser.
   * @param {string} name        The name of the macro currently running.
   * @returns {number|void}      The leading integer from the argument.
   */
  getPower(PARSER: TexParser, parser: TexParser, name: string): number | void {
    const power = PARSER.GetArgument(name);
    if (power.trim().match(/^-?\d+$/)) {
      return parseInt(power);
    }
    const mml = new TexParser(power, PARSER.stack.env, PARSER.configuration).mml();
    if (mml.kind === 'mn') {
      return parseInt((mml as AbstractMmlTokenNode).getText());
    }
    if (mml.isInferred && mml.childNodes.length) {
      const child = mml.childNodes[0] as AbstractMmlTokenNode;
      if (child.kind === 'mn') {
        mml.childNodes.shift();
        parser.Push(mml);
        return parseInt(child.getText());
      }
      if (child.kind === 'mo' && child.getText() === '\u2212' && mml.childNodes[1].kind === 'mn') {
        mml.childNodes.shift();
        const n = '-' + (mml.childNodes.shift() as AbstractMmlTokenNode).getText();
        parser.Push(mml);
        return parseInt(n);
      }
    }
    texError(COMPONENT, 'PowerNotNumber', name, power);
  }
};

/**
 * The `esdiff` macro methods.
 */
export const EsdiffMethods: { [key: string]: ParseMethod } = {
  /**
   * Implements \diff and \diffp, and their starred versions.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {string} name The name of the calling macro.
   * @param {string} d The differential operator to use.
   * @param {boolean} crossed True if crossed derivatives are allowed.
   */
  Diff(parser: TexParser, name: string, d: string, crossed: boolean) {
    const star = parser.GetStar();
    const order = parser.GetBrackets(name);
    const f = parser.GetArgument(name);
    const x = parser.GetArgument(name);
    const at = star ? parser.GetArgument(name) : '';
    let frac;
    if (order || !crossed) {
      const n = order ? `^{${order}}` : '';
      frac = `\\frac{${d}${n} ${f}}{${d} ${x}${n}}`;
    } else {
      const [vars, n] = EsdiffUtil.crossedVariables(parser, x);
      const den = vars.map((v) => `{${d} ${v}}`).join('');
      frac = `\\frac{${d}${n > 1 ? `^{${n}}` : ''} ${f}}{${den}}`;
    }
    if (star) {
      frac = `\\left(${frac}\\right)_{\\mkern-7mu ${at}}`;
    }
    parser.string =
      `\\mathchoice{${frac}}{\\displaystyle${frac}}` +
      `{\\scriptstyle${frac}}{\\scriptstyle${frac}}` +
      parser.string.slice(parser.i);
    parser.i = 0;
  },
};

/**
 * The `esdiff` macros.
 */
new CommandMap('esdiff', {
  diff: [EsdiffMethods.Diff, '\\mathrm{d}', false],
  diffp: [EsdiffMethods.Diff, '\\partial', true],
});

/**
 * The configuration object for the `esdiff` package.
 */
export const EsdiffConfiguration = Configuration.create('esdiff', {
  [ConfigurationType.HANDLER]: { [HandlerType.MACRO]: ['esdiff'] },
});
