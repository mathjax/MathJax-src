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
 * @file Mappings for TeX parsing for definitorial commands.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType } from '../HandlerTypes.js';
import { ParseResult, ParseMethod } from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import * as sm from '../TokenMap.js';
import { Token } from '../Token.js';
import BaseMethods from '../base/BaseMethods.js';
import { ParseUtil } from '../ParseUtil.js';
import { UnitUtil } from '../UnitUtil.js';
import { StackItem } from '../StackItem.js';
import { NewcommandUtil } from './NewcommandUtil.js';

// Namespace
const NewcommandMethods: { [key: string]: ParseMethod } = {
  /**
   * Implements \newcommand{\name}[n][default]{...}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   */
  NewCommand(parser: TexParser, name: string) {
    // @test Newcommand Simple
    const cs = NewcommandUtil.GetCsNameArgument(parser, name);
    const n = NewcommandUtil.GetArgCount(parser, name);
    const opt = parser.GetBrackets(name);
    const def = parser.GetArgument(name);
    NewcommandUtil.addMacro(parser, cs, NewcommandMethods.Macro, [def, n, opt]);
    parser.Push(parser.itemFactory.create('null'));
  },

  /**
   * Implements \newenvironment{name}[n][default]{begincmd}{endcmd}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   */
  NewEnvironment(parser: TexParser, name: string) {
    // @test Newenvironment Empty, Newenvironment Content
    const env = UnitUtil.trimSpaces(parser.GetArgument(name));
    const n = NewcommandUtil.GetArgCount(parser, name);
    const opt = parser.GetBrackets(name);
    const bdef = parser.GetArgument(name);
    const edef = parser.GetArgument(name);
    NewcommandUtil.addEnvironment(parser, env, NewcommandMethods.BeginEnv, [
      true,
      bdef,
      edef,
      n,
      opt,
    ]);
    parser.Push(parser.itemFactory.create('null'));
  },

  /**
   * Implements \def command.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   */
  MacroDef(parser: TexParser, name: string) {
    // @test Def DoubleLet, DefReDef
    const cs = NewcommandUtil.GetCSname(parser, name);
    const params = NewcommandUtil.GetTemplate(parser, name, '\\' + cs);
    const def = parser.GetArgument(name);
    !(params instanceof Array)
      ? // @test Def DoubleLet, DefReDef
        NewcommandUtil.addMacro(parser, cs, NewcommandMethods.Macro, [
          def,
          params,
        ])
      : // @test Def Let
        NewcommandUtil.addMacro(
          parser,
          cs,
          NewcommandMethods.MacroWithTemplate,
          [def].concat(params)
        );
    parser.Push(parser.itemFactory.create('null'));
  },

  /**
   * Implements the \let command.
   *
   * All \let commands create either new delimiters or macros in the extension
   * maps. In the latter case if the let binds a token we have to generate a
   * macro with the appropriate parse methods from the TokenMap. Otherwise we
   * simply copy the macro under a new name.
   *
   * Let does not always work on special characters as TeX does.  For example
   * "\let\car^ a\car b" will yield a superscript, on the otherhand
   * \let\bgroup={ is possible and will work fine in \bgroup a } but will fail
   * in \sqrt\bgroup a}.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   */
  Let(parser: TexParser, name: string) {
    const cs = NewcommandUtil.GetCSname(parser, name);
    let c = parser.GetNext();
    // @test Let Bar, Let Caret
    if (c === '=') {
      // @test Let Brace Equal, Let Brace Equal Stretchy
      parser.i++;
      c = parser.GetNext();
    }
    const handlers = parser.configuration.handlers;
    parser.Push(parser.itemFactory.create('null'));
    if (c === '\\') {
      // @test Let Bar, Let Brace Equal Stretchy
      name = NewcommandUtil.GetCSname(parser, name);
      if (cs === name) {
        return;
      }
      const map = handlers.get(HandlerType.MACRO).applicable(name);
      if (map instanceof sm.MacroMap) {
        // @test Def Let, Newcommand Let
        const macro = map.lookup(name);
        NewcommandUtil.addMacro(
          parser,
          cs,
          macro.func,
          macro.args,
          macro.token
        );
        return;
      }
      if (map instanceof sm.CharacterMap && !(map instanceof sm.DelimiterMap)) {
        const macro = map.lookup(name);
        // @test Let Relet, Let Let, Let Circular Macro
        const method = (p: TexParser) => map.parser(p, macro);
        NewcommandUtil.addMacro(parser, cs, method, [cs, macro.char]);
        return;
      }
      const macro = handlers
        .get(HandlerType.DELIMITER)
        .lookup('\\' + name) as Token;
      if (macro) {
        // @test Let Bar, Let Brace Equal Stretchy
        NewcommandUtil.addDelimiter(
          parser,
          '\\' + cs,
          macro.char,
          macro.attributes
        );
        return;
      }
      // @test Let Undefined CS
      NewcommandUtil.checkProtectedMacros(parser, cs);
      NewcommandUtil.undefineMacro(parser, cs);
      NewcommandUtil.undefineDelimiter(parser, '\\' + cs);
      return;
    }
    // @test Let Brace Equal, Let Caret
    parser.i++;
    const macro = handlers.get(HandlerType.DELIMITER).lookup(c) as Token;
    if (macro) {
      // @test Let Paren Delim, Let Paren Stretchy
      NewcommandUtil.addDelimiter(
        parser,
        '\\' + cs,
        macro.char,
        macro.attributes
      );
      return;
    }
    // @test Let Brace Equal, Let Caret
    NewcommandUtil.addMacro(parser, cs, NewcommandMethods.Macro, [c]);
  },

  /**
   * Process a macro with a parameter template by replacing parameters in the
   * parser's string.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   * @param {string} text The text template of the macro.
   * @param {string} n The number of parameters.
   * @param {string[]} params The parameter values.
   */
  MacroWithTemplate(
    parser: TexParser,
    name: string,
    text: string,
    n: string,
    ...params: string[]
  ) {
    const argCount = parseInt(n, 10);
    // @test Def Let
    if (params.length) {
      // @test Def Let
      const args = [];
      parser.GetNext();
      if (params[0] && !NewcommandUtil.MatchParam(parser, params[0])) {
        // @test Missing Arguments
        throw new TexError(
          'MismatchUseDef',
          "Use of %1 doesn't match its definition",
          name
        );
      }
      if (argCount) {
        for (let i = 0; i < argCount; i++) {
          // @test Def Let
          args.push(NewcommandUtil.GetParameter(parser, name, params[i + 1]));
        }
        text = ParseUtil.substituteArgs(parser, args, text);
      }
    }
    parser.string = ParseUtil.addArgs(
      parser,
      text,
      parser.string.slice(parser.i)
    );
    parser.i = 0;
    ParseUtil.checkMaxMacros(parser);
  },

  /**
   * Process a user-defined environment.
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The begin stackitem.
   * @param {string} bdef The begin definition in the newenvironment macro.
   * @param {string} edef The end definition in the newenvironment macro.
   * @param {number} n The number of parameters.
   * @param {string} def Default for an optional parameter.
   * @returns {ParseResult} The begin environment stack item.
   */
  BeginEnv(
    parser: TexParser,
    begin: StackItem,
    bdef: string,
    edef: string,
    n: number,
    def: string
  ): ParseResult {
    // @test Newenvironment Empty, Newenvironment Content
    // We have an end item, and we are supposed to close this environment.
    const name = begin.getName();
    if (parser.stack.env['closing'] === name) {
      // @test Newenvironment Empty, Newenvironment Content
      delete parser.stack.env['closing'];
      const beginN = parser.stack.global['beginEnv'] as number;
      if (beginN) {
        (parser.stack.global['beginEnv'] as number)--;
        if (edef) {
          // Parse the commands in the end environment definition.
          const rest = parser.string.slice(parser.i);
          parser.string = ParseUtil.addArgs(
            parser,
            parser.string.substring(0, parser.i),
            edef
          );
          parser.Parse();
          // Reset to parsing the remainder of the expression.
          parser.string = rest;
          parser.i = 0;
        }
      }
      // Close this environment.
      return parser.itemFactory.create('end').setProperty('name', name);
    }
    if (n) {
      // @test Newenvironment Optional, Newenvironment Arg Optional
      const args: string[] = [];
      // Note, here we test against undefined and null, so need `!=`.
      if (def != null) {
        // @test Newenvironment Optional, Newenvironment Arg Optional
        const optional = parser.GetBrackets(`\\begin{${name}}`);
        // Note, here we test against undefined and null, so need `==`.
        args.push(optional == null ? def : optional);
      }
      for (let i = args.length; i < n; i++) {
        // @test Newenvironment Arg Optional
        args.push(parser.GetArgument(`\\begin{${name}}`));
      }
      bdef = ParseUtil.substituteArgs(parser, args, bdef);
      edef = ParseUtil.substituteArgs(parser, [], edef); // no args, but get errors for #n in edef
    }
    parser.string = ParseUtil.addArgs(
      parser,
      bdef,
      parser.string.slice(parser.i)
    );
    parser.i = 0;
    parser.stack.global['beginEnv'] =
      ((parser.stack.global['beginEnv'] as number) || 0) + 1;
    return parser.itemFactory.create('beginEnv').setProperty('name', name);
  },

  Macro: BaseMethods.Macro,
};

export default NewcommandMethods;
