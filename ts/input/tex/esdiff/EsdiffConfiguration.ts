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
import { ParseUtil } from '../ParseUtil.js';
import { CommandMap } from '../TokenMap.js';
import { ParseMethod } from '../Types.js';
import { texError } from '../TexError.js';
import { COMPONENT as TEX_COMPONENT } from '../__locales__/Component.js';
import { COMPONENT } from './__locales__/Component.js';
export { COMPONENT };

/**
 * Get the next token from a TeX string: a braced group, a control
 * sequence, or a single character.
 *
 * @param {string} text The string to scan.
 * @param {number} i The starting position.
 * @returns {number} The position following the token.
 */
function nextToken(text: string, i: number): number {
  if (i >= text.length) {
    return text.length;
  }
  const c = text.charAt(i);
  if (c === '{') {
    let braces = 0;
    for (; i < text.length; i++) {
      const d = text.charAt(i);
      if (d === '\\') {
        i++;
      } else if (d === '{') {
        braces++;
      } else if (d === '}' && --braces === 0) {
        return i + 1;
      }
    }
    return i;
  }
  if (c === '\\') {
    const match = text.slice(i + 1).match(/^(?:[a-z]+|.)/i);
    return i + 1 + (match ? match[0].length : 0);
  }
  return i + String.fromCodePoint(text.codePointAt(i)).length;
}

/**
 * Remove one level of braces surrounding a TeX string.
 *
 * @param {string} text The string to unbrace.
 * @returns {string} The string without its outer braces.
 */
function unbrace(text: string): string {
  text = text.trim();
  return text.charAt(0) === '{' && nextToken(text, 0) === text.length
    ? text.slice(1, -1).trim()
    : text;
}

/**
 * Get the variables of a crossed partial derivative and the total order
 * of the derivative.  As in esdiff, each token of the list is one
 * variable, with braces used to group a variable with its power (so
 * {x}{y^2} is x and y squared), and the order is the sum of the powers,
 * which must be numbers.
 *
 * @param {TexParser} parser The current tex parser.
 * @param {string} text The denominator variables.
 * @returns {[string[], number]} The variables and the total order.
 */
function crossedVariables(parser: TexParser, text: string): [string[], number] {
  const vars: string[] = [];
  let order = 0;
  let i = 0;
  while (i < text.length) {
    if (text.charAt(i).match(/\s/)) {
      i++;
      continue;
    }
    const j = nextToken(text, i);
    const item = unbrace(text.slice(i, j));
    let power = null;
    for (let p = 0; p < item.length; p = nextToken(item, p)) {
      const c = item.charAt(p);
      if (c === '^' || c === '_') {
        let k = p + 1;
        while (k < item.length && item.charAt(k).match(/\s/)) k++;
        if (k >= item.length) {
          texError(TEX_COMPONENT, 'MissingScript');
        }
        if (c === '^' && power === null) {
          power = unbrace(item.slice(k, nextToken(item, k)));
        }
      }
    }
    power = power ?? '1';
    if (!power.match(/^\d+$/)) {
      texError(COMPONENT, 'PowerNotNumber', parser.currentCS, power);
    }
    order += parseInt(power);
    vars.push(item);
    i = j;
  }
  return [vars, order];
}

// Namespace
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
    if (order != null || !crossed) {
      const n = order != null ? `^{${order}}` : '';
      frac = `\\frac{${d}${n} ${f}}{${d} ${x}${n}}`;
    } else {
      const [vars, n] = crossedVariables(parser, x);
      const den = vars.map((v) => `{${d} ${v}}`).join('');
      frac = `\\frac{${d}${n > 1 ? `^{${n}}` : ''} ${f}}{${den}}`;
    }
    if (star) {
      frac = `\\left(${frac}\\right)_{\\mkern-7mu ${at}}`;
    }
    const macro =
      `\\mathchoice{${frac}}{\\displaystyle{${frac}}}` +
      `{\\scriptstyle{${frac}}}{\\scriptstyle{${frac}}}`;
    parser.string = ParseUtil.addArgs(
      parser,
      macro,
      parser.string.slice(parser.i)
    );
    parser.i = 0;
    ParseUtil.checkMaxMacros(parser);
  },
};

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
