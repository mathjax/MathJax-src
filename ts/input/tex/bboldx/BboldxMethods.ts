/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file Parse methods for the bboldx package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { Token } from '../Token.js';
import { TextParser } from '../textmacros/TextParser.js';
import { TextMacrosMethods } from '../textmacros/TextMacrosMethods.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';

/**
 * The methods that implement the bboldx package.
 */
export const BboldxMethods = {
  Macro: BaseMethods.Macro,

  ChooseFont: function (
    parser: TexParser,
    name: string,
    normal: string,
    light: string,
    bfbb: string
  ) {
    const font = getBbxFont(parser, normal, light, bfbb);
    BaseMethods.MathFont(parser, name, font);
  },

  ChooseTextFont: function (
    parser: TextParser,
    name: string,
    normal: string,
    light: string,
    bfbb: string
  ) {
    const font = getBbxFont(parser, normal, light, bfbb);
    TextMacrosMethods.TextFont(parser, name, font);
  },

  /**
   * Handle bboldx symbols as mi in normal variant.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} mchar The parsed token.
   */
  mathchar0miNormal: function (parser: TexParser, mchar: Token) {
    const font = getBbxFont(parser, '-bboldx', '-bboldx-light', '-bboldx-bold');
    const node = parser.create(
      'token',
      'mi',
      { mathvariant: font },
      mchar.char
    );
    parser.Push(node);
  },

  /**
   * Handle bboldx delimiters as mo in normal variant.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} delim The parsed token.
   */
  delimiterNormal: function (parser: TexParser, delim: Token) {
    const font = getBbxFont(parser, '-bboldx', '-bboldx-light', '-bboldx-bold');
    const def = { stretchy: false, mathvariant: font };
    const node = parser.create('token', 'mo', def, delim.char);
    parser.Push(node);
  },

  /**
   * Handle bboldx symbols as mi in bold variant.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} mchar The parsed token.
   */
  mathchar0miBold: function (parser: TexParser, mchar: Token) {
    const font = getBbxFont(parser, '-bboldx-bold', '-bboldx', '-bboldx-bold');
    const node = parser.create(
      'token',
      'mi',
      { mathvariant: font },
      mchar.char
    );
    parser.Push(node);
  },

  /**
   * Handle bboldx delimiters as mo in bold variant.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} delim The parsed token.
   */
  delimiterBold: function (parser: TexParser, delim: Token) {
    const font = getBbxFont(parser, '-bboldx-bold', '-bboldx', '-bboldx-bold');
    const def = { stretchy: false, mathvariant: font };
    const node = parser.create('token', 'mo', def, delim.char);
    parser.Push(node);
  },
};

/**
 * Returns the font selection for normal, light, bold for the given parser
 * options.
 *
 * @param {TexParser} parser The current parser.
 * @param {string} normal Variant string for normal mode.
 * @param {string} light Variant string for light mode.
 * @param {string} bfbb Variant string for bold mode.
 * @returns {string} The selected variant string.
 */
function getBbxFont(
  parser: TexParser,
  normal: string,
  light: string,
  bfbb: string
): string {
  const options = parser.options.bboldx;
  return options.bfbb ? bfbb : options.light ? light : normal;
}
