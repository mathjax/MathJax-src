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
 * @file Configuration file for the mhchem package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { CommandMap, CharacterMap } from '../TokenMap.js';
import { Token } from '../Token.js';
import { ParseMethod } from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import BaseMethods from '../base/BaseMethods.js';
import { AmsMethods } from '../ams/AmsMethods.js';
import { mhchemParser } from '#mhchem/mhchemParser.js';
import { TEXCLASS } from '../../../core/MmlTree/MmlNode.js';

/**
 * Creates mo token elements with the proper attributes
 */
export const MhchemUtils = {
  relmo(parser: TexParser, mchar: Token) {
    const def = {
      stretchy: true,
      texClass: TEXCLASS.REL,
      mathvariant: '-mhchem',
      ...(mchar.attributes || {}),
    };
    const node = parser.create('token', 'mo', def, mchar.char);
    parser.Push(node);
  },
};

/**
 * Replace these constructs in mhchem output now that we have stretchy versions
 * of the needed arrows
 *
 * @param {string} match   The matching macro name
 * @param {string} arrow   The arrow name (without the backslash).
 * @returns {string}       The mhchem arrow name, if there is one.
 */
export const MhchemReplacements = new Map<
  string | ((match: string, arrow: string) => string),
  RegExp
>([
  [
    '\\mhchemx$3[$1]{$2}',
    /\\underset{\\lower2mu{(.*?)}}{\\overset{(.*?)}{\\long(.*?)}}/g,
  ],
  ['\\mhchemx$2{$1}', /\\overset{(.*?)}{\\long(.*?)}/g],
  [
    '\\mhchemBondTD',
    /\\rlap\{\\lower\.1em\{-\}\}\\raise\.1em\{\\tripledash\}/g,
  ],
  [
    '\\mhchemBondTDD',
    /\\rlap\{\\lower\.2em\{-\}\}\\rlap\{\\raise\.2em\{\\tripledash\}\}-/g,
  ],
  [
    '\\mhchemBondDTD',
    /\\rlap\{\\lower\.2em\{-\}\}\\rlap\{\\raise.2em\{-\}\}\\tripledash/g,
  ],
  [
    (match: string, arrow: string) => {
      const mharrow = `mhchem${arrow}`;
      return mhchemChars.lookup(mharrow) || mhchemMacros.lookup(mharrow)
        ? `\\${mharrow}`
        : match;
    },
    /\\(x?(?:long)?(?:left|right|[Ll]eftright|[Rr]ightleft)(?:arrow|harpoons))/g,
  ],
]);

// Namespace
export const MhchemMethods: { [key: string]: ParseMethod } = {
  /**
   * @param {TexParser} parser   The parser for this expression
   * @param {string} name        The macro name being called
   * @param {string} machine     The name of the finite-state machine to use
   */
  Machine(parser: TexParser, name: string, machine: 'tex' | 'ce' | 'pu') {
    const arg = parser.GetArgument(name);
    let tex;
    try {
      tex = mhchemParser.toTex(arg, machine);
      for (const [name, pattern] of MhchemReplacements.entries()) {
        tex = tex.replace(pattern, name as string);
      }
    } catch (err) {
      throw new TexError(err[0], err[1]);
    }
    parser.string = tex + parser.string.substring(parser.i);
    parser.i = 0;
  },

  Macro: BaseMethods.Macro,
  xArrow: AmsMethods.xArrow,
};

/**
 * The command macros
 */
const mhchemMacros = new CommandMap('mhchem', {
  ce: [MhchemMethods.Machine, 'ce'],
  pu: [MhchemMethods.Machine, 'pu'],
  mhchemxrightarrow: [MhchemMethods.xArrow, 0xe429, 5, 9],
  mhchemxleftarrow: [MhchemMethods.xArrow, 0xe428, 9, 5],
  mhchemxleftrightarrow: [MhchemMethods.xArrow, 0xe42a, 9, 9],
  mhchemxleftrightarrows: [MhchemMethods.xArrow, 0xe42b, 9, 9],
  mhchemxrightleftharpoons: [MhchemMethods.xArrow, 0xe408, 5, 9],
  mhchemxRightleftharpoons: [MhchemMethods.xArrow, 0xe409, 5, 9],
  mhchemxLeftrightharpoons: [MhchemMethods.xArrow, 0xe40a, 9, 11],
});

/**
 * The character macros
 */
const mhchemChars = new CharacterMap('mhchem-chars', MhchemUtils.relmo, {
  tripledash: ['\uE410', { stretchy: false }],
  mhchemBondTD: ['\uE411', { stretchy: false }],
  mhchemBondTDD: ['\uE412', { stretchy: false }],
  mhchemBondDTD: ['\uE413', { stretchy: false }],
  mhchemlongleftarrow: '\uE428',
  mhchemlongrightarrow: '\uE429',
  mhchemlongleftrightarrow: '\uE42A',
  mhchemlongrightleftharpoons: '\uE408',
  mhchemlongRightleftharpoons: '\uE409',
  mhchemlongLeftrightharpoons: '\uE40A',
  mhchemlongleftrightarrows: '\uE42B',
  mhchemrightarrow: '\uE42D',
  mhchemleftarrow: '\uE42C',
  mhchemleftrightarrow: '\uE42E',
});

/**
 * The mhchem configuration
 */
export const MhchemConfiguration = Configuration.create('mhchem', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.MACRO]: ['mhchem', 'mhchem-chars'],
  },
});
