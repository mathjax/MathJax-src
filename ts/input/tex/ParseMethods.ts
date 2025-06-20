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
 * @file Base methods for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType } from './HandlerTypes.js';
import { Token } from './Token.js';
import TexParser from './TexParser.js';
import NodeUtil from './NodeUtil.js';
import { TexConstant } from './TexConstants.js';
import { ParseUtil } from './ParseUtil.js';
import { ParseMethod, ParseResult } from './Types.js';
import { StackItem } from './StackItem.js';

const MATHVARIANT = TexConstant.Variant;

const ParseMethods = {
  /**
   * Handle a variable (a single letter or multi-letter if allowed).
   *
   * @param {TexParser} parser The current tex parser.
   * @param {string} c The letter to transform into an mi.
   */
  variable(parser: TexParser, c: string) {
    // @test Identifier Font
    const def = ParseUtil.getFontDef(parser);
    const env = parser.stack.env;
    if (env.multiLetterIdentifiers && env.font !== '') {
      c =
        parser.string
          .substring(parser.i - 1)
          .match(env.multiLetterIdentifiers as any as RegExp)?.[0] || c;
      parser.i += c.length - 1;
      if (
        def.mathvariant === MATHVARIANT.NORMAL &&
        env.noAutoOP &&
        c.length > 1
      ) {
        def.autoOP = false;
      }
    }
    if (!def.mathvariant && ParseUtil.isLatinOrGreekChar(c)) {
      const variant = parser.configuration.mathStyle(c);
      if (variant) {
        def.mathvariant = variant;
      }
    }
    // @test Identifier
    const node = parser.create('token', 'mi', def, c);
    parser.Push(node);
  },

  /**
   * Handle a number (a sequence of digits, with decimal separator, etc.).
   *
   * @param {TexParser} parser The current tex parser.
   * @param {string} _c The first character of a number that can be parsed with
   *     the digits pattern.
   * @returns {ParseResult}  false if the string doesn't match a number
   *     (e.g., a decimal with no following digit).
   */
  digit(parser: TexParser, _c: string): ParseResult {
    const pattern = parser.configuration.options['numberPattern'];
    const n = parser.string.slice(parser.i - 1).match(pattern);
    // @test Integer Font
    const def = ParseUtil.getFontDef(parser);
    if (!n) {
      // @test Decimal Point, Decimal Point European
      return false;
    }
    // @test Integer, Number, Decimal (European)
    const mml = parser.create('token', 'mn', def, n[0].replace(/[{}]/g, ''));
    parser.i += n[0].length - 1;
    parser.Push(mml);
    return true;
  },

  /**
   * Lookup a control-sequence and process it.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {string} _c The string '\'.
   */
  controlSequence(parser: TexParser, _c: string) {
    const name = parser.GetCS();
    parser.parse(HandlerType.MACRO, [parser, name]);
  },

  /**
   * Handle lower-case Greek (as an mi).
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} mchar The parsed token.
   */
  lcGreek(parser: TexParser, mchar: Token) {
    const def = {
      mathvariant:
        parser.configuration.mathStyle(mchar.char) || MATHVARIANT.ITALIC,
    };
    // @test Greek
    const node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
  },

  /**
   * Handle upper-case Greek in current family.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} mchar The parsed token.
   */
  ucGreek(parser: TexParser, mchar: Token) {
    const def = {
      mathvariant:
        parser.stack.env['font'] ||
        parser.configuration.mathStyle(mchar.char, true) ||
        MATHVARIANT.NORMAL,
    };
    // @test MathChar7 Single, MathChar7 Operator, MathChar7 Multi
    const node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
  },

  /**
   * Handle normal mathchar (as an mi).
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} mchar The parsed token.
   */
  mathchar0mi(parser: TexParser, mchar: Token) {
    const def = mchar.attributes || { mathvariant: MATHVARIANT.ITALIC };
    const node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
  },

  /**
   * Handle normal mathchar (as an mo).
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} mchar The parsed token.
   */
  mathchar0mo(parser: TexParser, mchar: Token) {
    const def = mchar.attributes || {};
    def['stretchy'] = false;
    // @test Large Set
    const node = parser.create('token', 'mo', def, mchar.char);
    NodeUtil.setProperty(node, 'fixStretchy', true);
    parser.configuration.addNode('fixStretchy', node);
    // PROBLEM: Attributes stop working when Char7 are explicitly set.
    parser.Push(node);
  },

  /**
   * Handle mathchar in current family.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} mchar The parsed token.
   */
  mathchar7(parser: TexParser, mchar: Token) {
    const def = mchar.attributes || { mathvariant: MATHVARIANT.NORMAL };
    if (parser.stack.env['font']) {
      // @test MathChar7 Single Font
      def['mathvariant'] = parser.stack.env['font'];
    }
    // @test MathChar7 Single, MathChar7 Operator, MathChar7 Multi
    const node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
  },

  /**
   * Handle delimiter.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {Token} delim The parsed delimiter token.
   */
  delimiter(parser: TexParser, delim: Token) {
    let def = delim.attributes || {};
    // @test Fenced2, Delimiter (AMS)
    def = Object.assign({ fence: false, stretchy: false }, def);
    const node = parser.create('token', 'mo', def, delim.char);
    parser.Push(node);
  },

  /**
   * Parse an environment.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {string} env The name of the environment.
   * @param {ParseMethod} func The parse method for the environment.
   * @param {any[]} args A list of additional arguments.
   */
  environment(parser: TexParser, env: string, func: ParseMethod, args: any[]) {
    const mml = parser.itemFactory.create('begin').setProperty('name', env);
    parser.Push(func(parser, mml, ...args.slice(1)) as StackItem);
  },
};

export default ParseMethods;
