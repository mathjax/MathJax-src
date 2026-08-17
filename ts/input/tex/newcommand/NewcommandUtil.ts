/*************************************************************
 *
 *  Copyright (c) 2009-2026 The MathJax Consortium
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
 * @file Utility functions for the newcommand package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType } from '../HandlerTypes.js';
import { SubHandler } from '../MapHandler.js';
import { UnitUtil } from '../UnitUtil.js';
import { texError } from '../TexError.js';
import TexParser from '../TexParser.js';
import { Macro, Token } from '../Token.js';
import { Args, Attributes, ParseMethod } from '../Types.js';
import * as tm from '../TokenMap.js';

import { COMPONENT } from './__locales__/Component.js';

/**
 * Naming constants for the extension mappings.
 */
export enum NewcommandTables {
  NEW_DELIMITER = 'new-Delimiter',
  NEW_COMMAND = 'new-Command',
  NEW_ENVIRONMENT = 'new-Environment',
}

/**
 * The priority for the maps where definitions are stored.
 */
export const NewcommandPriority = -100;

const tokenPattern = String.raw`\\[a-zA-Z]+\s*|\\.|[\n\s]+|%.*?(?:\n\s*|$)|.`;

export const NewcommandUtil = {
  tokenPattern,
  tokenMatch: new RegExp(`^(?:${tokenPattern})`, 'u'),
  tokenTemplate: new RegExp(`^(?:#[1-9]?|${tokenPattern})`, 'u'),

  /**
   * Convert a latex string into template tokens.
   *
   * @param {string} text The string to be tokenized
   * @param {boolean} legacy True if legacy spacing is to be used.
   * @returns {string[]|void} The array of tokens from the string
   */
  tokenize(text: string, legacy: boolean): string[] | void {
    if (text === undefined) return;
    const tokens: string[] = [];
    text = text.replace(/^\s+/, '');
    while (text) {
      const token = text.match(NewcommandUtil.tokenMatch)[0];
      text = text.slice(token.length);
      tokens.push(NewcommandUtil.trimToken(token, legacy));
    }
    return tokens;
  },

  /**
   * Collapse spaces and newlines into a single space.
   *
   * @param {string} token The token whose spaces are to be collapsed.
   * @param {boolean} legacy True if legacy spacing is to be used.
   * @returns {string} The trimmed token.
   */
  trimToken(token: string, legacy: boolean): string {
    return legacy
      ? token
      : token
          .replace(/\n+/g, ' ')
          .replace(/(.)\s+$/, '$1')
          .replace(/\s$/, ' ');
  },

  /**
   * Get the next CS name or give an error.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} cmd The string starting with a control sequence.
   * @returns {string} The control sequence.
   */
  GetCSname(parser: TexParser, cmd: string): string {
    // @test Def ReDef, Let Bar, Let Brace Equal
    const c = parser.GetNext();
    if (c !== '\\') {
      // @test No CS
      texError(COMPONENT, 'MissingCS', cmd);
    }
    const cs = UnitUtil.trimSpaces(parser.GetArgument(cmd)).substring(1);
    NewcommandUtil.checkProtectedMacros(parser, cs);
    return cs;
  },

  /**
   * Get a control sequence name as an argument (doesn't require the backslash)
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro that is getting the name.
   * @returns {string} The control sequence.
   */
  GetCsNameArgument(parser: TexParser, name: string): string {
    let cs = UnitUtil.trimSpaces(parser.GetArgument(name));
    if (cs.charAt(0) === '\\') {
      // @test Newcommand Simple
      cs = cs.substring(1);
    }
    if (!cs.match(/^(.|[a-z]+)$/i)) {
      // @test Illegal CS
      texError(COMPONENT, 'IllegalControlSequenceName', name);
    }
    NewcommandUtil.checkProtectedMacros(parser, cs);
    return cs;
  },

  /**
   * Get the number of arguments for a macro definition
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro that is getting the argument count.
   * @returns {string} The number of arguments (or blank).
   */
  GetArgCount(parser: TexParser, name: string): string {
    let n = parser.GetBrackets(name);
    if (n) {
      // @test Newcommand Optional, Newcommand Arg, Newcommand Arg Optional
      // @test Newenvironment Optional, Newenvironment Arg Optional
      n = UnitUtil.trimSpaces(n);
      if (!n.match(/^[0-9]+$/)) {
        // @test Illegal Argument Number
        texError(COMPONENT, 'IllegalParamNumber', name);
      }
    }
    return n;
  },

  /**
   * Get a \def parameter template.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} cmd The string starting with the template.
   * @param {string} cs The control sequence of the \def.
   * @returns {number | (string | string[])[] | undefined} The number of parameters or a string array
   *   of the tokens that delimit the arguments.
   */
  GetTemplate(
    parser: TexParser,
    cmd: string,
    cs: string
  ): number | (string | string[])[] {
    const { legacyComments, legacyMacroTemplates } =
      parser.configuration.options;
    parser.GetNext(); // Move past whitespace characters
    const params: string[][] = [];
    let arg: string[] = [];
    let n = 0;
    while (parser.i < parser.string.length) {
      let token = parser.string
        .slice(parser.i)
        .match(NewcommandUtil.tokenTemplate)[0];
      parser.i += token.length;
      if (token.charAt(0) === '%') {
        if (!legacyComments) continue;
        parser.i -= token.length - 1;
        token = '%';
      }
      if (token === '{') {
        parser.i--;
        if (arg.length && arg.join('') !== ' ') {
          params.push(arg);
        }
        return params.length ? [String(n), ...params] : n;
      }
      if (token.charAt(0) === '#') {
        if (token === '#') {
          // @test Illegal Hash
          texError(COMPONENT, 'CantUseHash2', cs);
        }
        if (parseInt(token.charAt(1)) !== ++n) {
          // @test No Sequence
          texError(COMPONENT, 'SequentialParam', cs);
        }
        params.push(arg.length ? arg : undefined);
        arg = [];
        continue;
      }
      arg.push(NewcommandUtil.trimToken(token, legacyMacroTemplates));
    }
    // @test No Replacement
    texError(COMPONENT, 'MissingReplacementString', cmd);
  },

  /**
   * Find a single parameter delimited by a trailing template.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   * @param {string[]} tokens The tokens that end the argument.
   * @param {boolean} initial True when this is the initial token list with no parameter
   * @returns {string|undefined} The parameter.
   */
  GetParameter(
    parser: TexParser,
    name: string,
    tokens: string[],
    initial: boolean = false
  ): string {
    if (!tokens) {
      // @test Def Let, Def Optional Brace, Def Options CS
      return parser.GetArgument(name);
    }
    const { legacyComments, legacyMacroTemplates } =
      parser.configuration.options;
    let t = 0;
    const i = parser.i;
    let hasBraces = false;
    const arg = [];
    while (parser.i < parser.string.length) {
      let token = parser.string
        .slice(parser.i)
        .match(NewcommandUtil.tokenMatch)[0];
      parser.i += token.length;
      if (token.charAt(0) === '%') {
        if (!legacyComments) continue;
        parser.i -= token.length - 1;
        token = '%';
      }
      if (NewcommandUtil.trimToken(token, legacyMacroTemplates) === tokens[t]) {
        if (++t < tokens.length) continue;
        return (hasBraces ? arg.slice(1, -1) : arg).join('');
      }
      if (t) {
        arg.push(...tokens.slice(0, t));
        t = 0;
      }
      if (token === '{') {
        parser.i--;
        hasBraces = parser.i === i;
        arg.push('{', parser.GetArgument(name), '}');
      } else {
        hasBraces = false;
        arg.push(token);
      }
    }
    if (initial) return null;
    // @test Runaway Argument
    texError(COMPONENT, 'RunawayArgument', name);
  },

  /**
   * Gets the proper maps depending on whether \global is in effect.
   * If it is, begingroup is called to clear any definitions and return the global maps
   * Otherwise, the named maps are retrieved.
   *
   * @param {TexParser} parser  The current parser.
   * @param {string[]} tokens   The tokens to delete from each begingroup map if global
   * @param {string[]} maps     The map names to return
   * @returns {tm.AbstractParseMap}   The array of requested maps
   *
   * @template T  the type of AbstractParseMap to get (Token or Macro)
   */
  checkGlobal<T>(
    parser: TexParser,
    tokens: string[],
    maps: string[]
  ): tm.AbstractParseMap<T>[] {
    return (
      parser.stack.env.isGlobal
        ? parser.configuration.packageData
            .get('begingroup')
            .stack.checkGlobal(tokens, maps)
        : maps.map((name) => parser.configuration.handlers.retrieve(name))
    ) as tm.AbstractParseMap<T>[];
  },

  /**
   * Checks if a control sequence is protected from being redefined.
   *
   * @param {TexParser} parser  The current parser.
   * @param {string} cs         The control sequence name to check
   */
  checkProtectedMacros(parser: TexParser, cs: string) {
    if (parser.options.protectedMacros?.includes(cs)) {
      texError(COMPONENT, 'ProtectedMacro', `\\${cs}`);
    }
  },

  /**
   * Adds a new delimiter as extension to the parser.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} cs The control sequence of the delimiter.
   * @param {string} char The corresponding character.
   * @param {Attributes} attr The attributes needed for parsing.
   */
  addDelimiter(parser: TexParser, cs: string, char: string, attr: Attributes) {
    const name = cs.substring(1);
    NewcommandUtil.checkProtectedMacros(parser, name);
    const [macros, delims] = NewcommandUtil.checkGlobal<Token>(
      parser,
      [name, cs],
      [NewcommandTables.NEW_COMMAND, NewcommandTables.NEW_DELIMITER]
    );
    if (name !== cs) {
      macros.remove(name);
    }
    delims.add(cs, new Token(cs, char, attr));
    delete parser.stack.env.isGlobal;
  },

  /**
   * Adds a new macro as extension to the parser.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} cs The control sequence of the macro.
   * @param {ParseMethod} func The parse method for this macro.
   * @param {Args[]} attr The attributes needed for parsing.
   * @param {string=} token Optionally original token for macro, in case it is
   *     different from the control sequence.
   */
  addMacro(
    parser: TexParser,
    cs: string,
    func: ParseMethod,
    attr: Args[],
    token: string = ''
  ) {
    NewcommandUtil.checkProtectedMacros(parser, cs);
    const macros = NewcommandUtil.checkGlobal<Macro>(
      parser,
      [cs],
      [NewcommandTables.NEW_COMMAND]
    )[0];
    NewcommandUtil.undefineDelimiter(parser, '\\' + cs);
    macros.add(cs, new Macro(token ? token : cs, func, attr));
    delete parser.stack.env.isGlobal;
  },

  /**
   * Adds a new environment as extension to the parser.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} env The environment name.
   * @param {ParseMethod} func The parse method for this macro.
   * @param {Args[]} attr The attributes needed for parsing.
   */
  addEnvironment(
    parser: TexParser,
    env: string,
    func: ParseMethod,
    attr: Args[]
  ) {
    const envs = NewcommandUtil.checkGlobal<Macro>(
      parser,
      [env],
      [NewcommandTables.NEW_ENVIRONMENT]
    )[0];
    envs.add(env, new Macro(env, func, attr));
    delete parser.stack.env.isGlobal;
  },

  /**
   * Removes a user-defined macro, if there is one, and
   * Adds an undefined macro (to block ones in later maps),
   *   if needed.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} cs The control sequence to undefine.
   */
  undefineMacro(parser: TexParser, cs: string) {
    const macros = NewcommandUtil.checkGlobal<Macro>(
      parser,
      [cs],
      [NewcommandTables.NEW_COMMAND]
    )[0];
    macros.remove(cs);
    if (parser.configuration.handlers.get(HandlerType.MACRO).applicable(cs)) {
      //
      // This will hide the macro that is in a later mapping
      // by forcing the parser to jump directly to the fallback
      // handler.
      //
      macros.add(cs, new Macro(cs, () => SubHandler.FALLBACK, []));
      NewcommandUtil.undefineDelimiter(parser, '\\' + cs);
    }
    delete parser.stack.env.isGlobal;
  },

  /**
   * Removes a user-defined delimiter, if there is one, and
   * Adds an undefined one (to block ones in later maps),
   *   if needed.
   *
   * @param {TexParser} parser The current parser.
   * @param {string} cs The control sequence to undefine.
   */
  undefineDelimiter(parser: TexParser, cs: string) {
    const delims = NewcommandUtil.checkGlobal<Token>(
      parser,
      [cs],
      [NewcommandTables.NEW_DELIMITER]
    )[0];
    delims.remove(cs);
    if (
      parser.configuration.handlers.get(HandlerType.DELIMITER).applicable(cs)
    ) {
      //
      // This will hide the delimiter that is in a later mapping
      // by forcing the parser to skip any additional maps.
      //
      delims.add(cs, new Token(cs, null, {}));
    }
    delete parser.stack.env.isGlobal;
  },
};
