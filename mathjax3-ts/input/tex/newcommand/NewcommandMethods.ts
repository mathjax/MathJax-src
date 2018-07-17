/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview Mappings for TeX parsing for definitorial commands.
 *                                            
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {Args, Attributes, ParseMethod} from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import * as sm from '../SymbolMap.js';
import {ExtensionConf, ExtensionMaps, MapHandler} from '../MapHandler.js';
import {Symbol, Macro} from '../Symbol.js';
import BaseMethods from '../base/BaseMethods.js';
import ParseUtil from '../ParseUtil.js';
import {StackItem} from '../StackItem.js';
import NewcommandUtil from './NewcommandUtil.js';


// Namespace
let NewcommandMethods: Record<string, ParseMethod> = {};

/**
 * Implements \newcommand{\name}[n][default]{...}
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the calling command.
 */
NewcommandMethods.NewCommand = function(parser: TexParser, name: string) {
  // @test Newcommand Simple
  let cs = ParseUtil.trimSpaces(parser.GetArgument(name));
  let n = parser.GetBrackets(name);
  let opt = parser.GetBrackets(name);
  let def = parser.GetArgument(name);
  if (cs.charAt(0) === '\\') {
    // @test Newcommand Simple
    cs = cs.substr(1);
  }
  if (!cs.match(/^(.|[a-z]+)$/i)) {
    // @test Illegal CS
    throw new TexError('IllegalControlSequenceName',
                        'Illegal control sequence name for %1', name);
  }
  if (n) {
    // @test Newcommand Optional, Newcommand Arg, Newcommand Arg Optional
    n = ParseUtil.trimSpaces(n);
    if (!n.match(/^[0-9]+$/)) {
      // @test Illegal Argument Number
      throw new TexError('IllegalParamNumber',
                          'Illegal number of parameters specified in %1', name);
    }
  }
  let newMacros = MapHandler.getInstance().getMap(ExtensionMaps.NEW_COMMAND) as sm.CommandMap;
  newMacros.add(cs,
                new Macro(cs, NewcommandMethods.Macro, [def, n, opt]));
};


/**
 * Implements \newenvironment{name}[n][default]{begincmd}{endcmd}
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the calling command.
 */
NewcommandMethods.NewEnvironment = function(parser: TexParser, name: string) {
  // @test Newenvironment Empty, Newenvironment Content
  let env = ParseUtil.trimSpaces(parser.GetArgument(name));
  let n = parser.GetBrackets(name);
  let opt = parser.GetBrackets(name);
  let bdef = parser.GetArgument(name);
  let edef = parser.GetArgument(name);
  if (n) {
    // @test Newenvironment Optional, Newenvironment Arg Optional
    n = ParseUtil.trimSpaces(n);
    if (!n.match(/^[0-9]+$/)) {
      // @test Illegal Parameter Number
      throw new TexError('IllegalParamNumber',
                          'Illegal number of parameters specified in %1', name);
        }
  }
  let newEnv = MapHandler.getInstance().getMap(ExtensionMaps.NEW_ENVIRONMENT) as sm.EnvironmentMap;
  newEnv.add(env, new Macro(env, NewcommandMethods.BeginEnv, [true, bdef, edef, n, opt]));
};


/**
 * Implements \def command.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the calling command.
 */
NewcommandMethods.MacroDef = function(parser: TexParser, name: string) {
  // @test Def DoubleLet, DefReDef
  let cs = NewcommandUtil.GetCSname(parser, name);
  let params = NewcommandUtil.GetTemplate(parser, name, '\\' + cs);
  let def = parser.GetArgument(name);
  let newMacros = MapHandler.getInstance().getMap(ExtensionMaps.NEW_COMMAND) as sm.CommandMap;
  let macro = !(params instanceof Array) ?
    // @test Def DoubleLet, DefReDef
    new Macro(cs, NewcommandMethods.Macro, [def, params]) :
    // @test Def Let
    new Macro(cs, NewcommandMethods.MacroWithTemplate,
              [def].concat(params));
  newMacros.add(cs, macro);
};


/**
 * Implements the \let command.
 *
 * All \let commands create either new delimiters or macros in the extension
 * maps. In the latter case if the let binds a symbol we have to generate a
 * macro with the appropriate parse methods from the SymbolMap. Otherwise we
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
NewcommandMethods.Let = function(parser: TexParser, name: string) {
  let cs = NewcommandUtil.GetCSname(parser, name);
  let c = parser.GetNext();
  // @test Let Bar, Let Caret
  if (c === '=') {
    // @test Let Brace Equal, Let Brace Equal Stretchy
    parser.i++;
    c = parser.GetNext();
  }
  const handlers = parser.configuration.handlers;
  if (c === '\\') {
    // @test Let Bar, Let Brace Equal Stretchy
    name = NewcommandUtil.GetCSname(parser, name);
    let macro = handlers.get('delimiter').lookup('\\' + name) as Symbol;
    if (macro) {
      // @test Let Bar, Let Brace Equal Stretchy
      (MapHandler.getInstance().getMap(ExtensionMaps.NEW_DELIMITER) as sm.DelimiterMap).
        add('\\' + cs, new Symbol('\\' + cs, macro.char, macro.attributes));
      return;
    }
    let map = handlers.get('macro').applicable(name);
    if (!map) {
      // @test Let Undefined CS
      return;
    }
    let extension = ExtensionConf.handler['macro'].indexOf(map.name) !== -1;
    if (map instanceof sm.MacroMap) {
      // @test Def Let, Newcommand Let
      let macro = (map as sm.CommandMap).lookup(name) as Macro;
      let func = function(...args: any[]) {
        let parser = args[0];
        let symbol = args[1];
        let rest = args.slice(2);
        ((macro as Macro).func as ParseMethod).apply(macro, [parser].concat(rest));
      };
      (MapHandler.getInstance().getMap(ExtensionMaps.NEW_COMMAND) as sm.CommandMap).
        add(cs, new Macro(macro.symbol, macro.func, macro.args));
      return;
    }
    macro = (map as sm.CharacterMap).lookup(name) as Symbol;
    let newArgs = NewcommandUtil.disassembleSymbol(cs, macro);
    let method = (p: TexParser, cs: string, ...rest: any[]) => {
      // @test Let Relet, Let Let, Let Circular Macro
      let symb = NewcommandUtil.assembleSymbol(rest);
      return map.parser(p, symb);
    };
    let newMacro = new Macro(cs, method as any, newArgs);
    (MapHandler.getInstance().getMap(ExtensionMaps.NEW_COMMAND) as sm.CommandMap).
      add(cs, newMacro);
    return;
  }
  // @test Let Brace Equal, Let Caret
  parser.i++;
  let macro = handlers.get('delimiter').lookup(c) as Symbol;
  if (macro) {
    // @test Let Paren Delim, Let Paren Stretchy
    (MapHandler.getInstance().getMap(ExtensionMaps.NEW_DELIMITER) as sm.DelimiterMap).
      add('\\' + cs, new Symbol('\\' + cs, macro.char, macro.attributes));
    return;
  }
  // @test Let Brace Equal, Let Caret
  let newMacros = MapHandler.getInstance().getMap(ExtensionMaps.NEW_COMMAND) as sm.CommandMap;
  newMacros.add(cs,
                new Macro(cs, NewcommandMethods.Macro, [c]));
};


let MAXMACROS = 10000;    // maximum number of macro substitutions per equation


/**
 * Process a macro with a parameter template by replacing parameters in the
 * parser's string.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the calling command.
 * @param {string} text The text template of the macro.
 * @param {string} n The number of parameters.
 * @param {string[]} ...params The parameter values.
 */
NewcommandMethods.MacroWithTemplate = function (parser: TexParser, name: string,
                                                text: string, n: string,
                                                ...params: string[]) {
  const argCount = parseInt(n, 10);
  // @test Def Let
  if (argCount) {
    // @test Def Let
    let args = [];
    parser.GetNext();
    if (params[0] && !NewcommandUtil.MatchParam(parser, params[0])) {
      // @test Missing Arguments
      throw new TexError('MismatchUseDef',
                          'Use of %1 doesn\'t match its definition', name);
    }
    for (let i = 0; i < argCount; i++) {
      // @test Def Let
      args.push(NewcommandUtil.GetParameter(parser, name, params[i + 1]));
    }
    text = ParseUtil.substituteArgs(args, text);
  }
  parser.string = ParseUtil.addArgs(text, parser.string.slice(parser.i));
  parser.i = 0;
  if (++parser.macroCount > MAXMACROS) {
    throw new TexError('MaxMacroSub1',
                        'MathJax maximum macro substitution count exceeded; ' +
                        'is here a recursive macro call?');
  }
};


/**
 * Process a user-defined environment.
 * @param {TexParser} parser The calling parser.
 * @param {StackItem} begin The begin stackitem.
 * @param {string} bdef The begin definition in the newenvironment macro.
 * @param {string} edef The end definition in the newenvironment macro. 
 * @param {number} n The number of parameters.
 * @param {string} def Default for an optional parameter.
 */
NewcommandMethods.BeginEnv = function(parser: TexParser, begin: StackItem,
                                      bdef: string, edef: string, n: number, def: string) {
  // @test Newenvironment Empty, Newenvironment Content
  if (parser.stack.env['closing'] === begin.getProperty('end')) {
    // @test Newenvironment Empty, Newenvironment Content
    delete parser.stack.env['closing'];
    parser.string = edef + parser.string.slice(parser.i);
    parser.i = 0;
    parser.Parse();
    return parser.itemFactory.create('end').setProperties({name: begin.getName()});
  }
  if (n) {
    // @test Newenvironment Optional, Newenvironment Arg Optional
    let args: string[] = [];
    if (def != null) {
      // @test Newenvironment Optional, Newenvironment Arg Optional
      let optional = parser.GetBrackets('\\begin{' + begin.getName() + '}');
      args.push(optional == null ? def : optional);
    }
    for (let i = args.length; i < n; i++) {
      // @test Newenvironment Arg Optional
      args.push(parser.GetArgument('\\begin{' + begin.getName() + '}'));
    }
    bdef = ParseUtil.substituteArgs(args, bdef);
    edef = ParseUtil.substituteArgs([], edef); // no args, but get errors for #n in edef
  }
  parser.string = ParseUtil.addArgs(bdef, parser.string.slice(parser.i));
  parser.i = 0;
  return parser.itemFactory.create('beginEnv').setProperties({name: begin.getName()});
};

NewcommandMethods.Macro = BaseMethods.Macro;

export default NewcommandMethods;
