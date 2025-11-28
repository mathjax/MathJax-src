/*************************************************************
 *
 *  Copyright (c) 2009-2025 The MathJax Consortium
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
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import { Macro, Token } from '../Token.js';
import { Args, Attributes, ParseMethod } from '../Types.js';
import * as tm from '../TokenMap.js';

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

export const NewcommandUtil = {
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
      throw new TexError(
        'MissingCS',
        '%1 must be followed by a control sequence',
        cmd
      );
    }
    const cs = UnitUtil.trimSpaces(parser.GetArgument(cmd)).substring(1);
    this.checkProtectedMacros(parser, cs);
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
      throw new TexError(
        'IllegalControlSequenceName',
        'Illegal control sequence name for %1',
        name
      );
    }
    this.checkProtectedMacros(parser, cs);
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
        throw new TexError(
          'IllegalParamNumber',
          'Illegal number of parameters specified in %1',
          name
        );
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
   * @returns {number | string[]} The number of parameters or a string array if
   *     there is an optional argument.
   */
  GetTemplate(parser: TexParser, cmd: string, cs: string): number | string[] {
    // @test Def Double Let, Def ReDef, Def Let
    let c = parser.GetNext();
    const params: string[] = [];
    let n = 0;
    let i = parser.i;
    while (parser.i < parser.string.length) {
      c = parser.GetNext();
      if (c === '#') {
        // @test Def ReDef, Def Let, Def Optional Brace
        if (i !== parser.i) {
          // @test Def Let, Def Optional Brace
          // parser.i >= i!
          params[n] = parser.string.substring(i, parser.i);
        }
        c = parser.string.charAt(++parser.i);
        if (!c.match(/^[1-9]$/)) {
          // @test Illegal Hash
          throw new TexError(
            'CantUseHash2',
            'Illegal use of # in template for %1',
            cs
          );
        }
        if (parseInt(c) !== ++n) {
          // @test No Sequence
          throw new TexError(
            'SequentialParam',
            'Parameters for %1 must be numbered sequentially',
            cs
          );
        }
        i = parser.i + 1;
      } else if (c === '{') {
        // @test Def Double Let, Def ReDef, Def Let
        if (i !== parser.i) {
          // @test Optional Brace Error
          // parser.i >= i!
          params[n] = parser.string.substring(i, parser.i);
        }
        if (params.length > 0) {
          // @test Def Let, Def Optional Brace
          return [n.toString()].concat(params);
        } else {
          // @test Def Double Let, Def ReDef
          return n;
        }
      }
      parser.i++;
    }
    // @test No Replacement
    throw new TexError(
      'MissingReplacementString',
      'Missing replacement string for definition of %1',
      cmd
    );
  },

  /**
   * Find a single parameter delimited by a trailing template.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   * @param {string} param The parameter for the macro.
   * @returns {string} The parameter.
   */
  GetParameter(parser: TexParser, name: string, param: string): string {
    if (param == null) {
      // @test Def Let, Def Optional Brace, Def Options CS
      return parser.GetArgument(name);
    }
    let i = parser.i;
    let j = 0;
    let hasBraces = false;
    while (parser.i < parser.string.length) {
      const c = parser.string.charAt(parser.i);
      // @test Def Let, Def Optional Brace, Def Options CS
      if (c === '{') {
        // @test Def Optional Brace, Def Options CS
        hasBraces = parser.i === i;
        parser.GetArgument(name);
        j = parser.i - i;
      } else if (this.MatchParam(parser, param)) {
        // @test Def Let, Def Optional Brace, Def Options CS
        if (hasBraces) {
          // @test Def Optional Brace
          i++;
          j -= 2;
        }
        return parser.string.substring(i, i + j);
      } else if (c === '\\') {
        // @test Def Options CS
        parser.i++;
        j++;
        hasBraces = false;
        const match = parser.string.substring(parser.i).match(/[a-z]+|./i);
        if (match) {
          // @test Def Options CS
          parser.i += match[0].length;
          j = parser.i - i;
        }
      } else {
        // @test Def Let
        parser.i++;
        j++;
        hasBraces = false;
      }
    }
    // @test Runaway Argument
    throw new TexError('RunawayArgument', 'Runaway argument for %1?', name);
  },

  /**
   * Check if a template is at the current location.
   * (The match must be exact, with no spacing differences. TeX is
   * a little more forgiving than this about spaces after macro names)
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} param Tries to match an optional parameter.
   * @returns {number} The number of optional parameters, either 0 or 1.
   */
  MatchParam(parser: TexParser, param: string): number {
    // @test Def Let, Def Optional Brace, Def Options CS
    if (parser.string.substring(parser.i, parser.i + param.length) !== param) {
      // @test Def Let, Def Options CS
      return 0;
    }
    if (
      param.match(/\\[a-z]+$/i) &&
      parser.string.charAt(parser.i + param.length).match(/[a-z]/i)
    ) {
      // @test (missing)
      return 0;
    }
    // @test Def Let, Def Optional Brace, Def Options CS
    parser.i += param.length;
    return 1;
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
      throw new TexError(
        'ProtectedMacro',
        "The control sequence %1 can't be redefined",
        `\\${cs}`
      );
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
    this.checkProtectedMacros(parser, name);
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
    this.checkProtectedMacros(parser, cs);
    const macros = NewcommandUtil.checkGlobal<Macro>(
      parser,
      [cs],
      [NewcommandTables.NEW_COMMAND]
    )[0];
    this.undefineDelimiter(parser, '\\' + cs);
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
      this.undefineDelimiter(parser, '\\' + cs);
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
