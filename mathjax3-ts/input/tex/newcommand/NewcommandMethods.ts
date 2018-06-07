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


import {ParseMethod} from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import {MacroMap, EnvironmentMap, CommandMap} from '../SymbolMap.js';
import {MapHandler} from '../MapHandler.js';
import {Symbol, Macro} from '../Symbol.js';
import BaseMethods from '../base/BaseMethods.js';
import ParseUtil from '../ParseUtil.js';
import {StackItem} from '../StackItem.js';


// Namespace
let NewcommandMethods: Record<string, ParseMethod> = {};

/*
 *  Implement \newcommand{\name}[n][default]{...}
 */
NewcommandMethods.NewCommand = function(parser: TexParser, name: string) {
  let cs = ParseUtil.trimSpaces(parser.GetArgument(name));
  let n = parser.GetBrackets(name);
  let opt = parser.GetBrackets(name);
  let def = parser.GetArgument(name);
  if (cs.charAt(0) === '\\') {
    cs = cs.substr(1);
  }
  if (!cs.match(/^(.|[a-z]+)$/i)) {
    throw new TexError(['IllegalControlSequenceName',
                        'Illegal control sequence name for %1', name]);
  }
  if (n) {
    n = ParseUtil.trimSpaces(n);
    if (!n.match(/^[0-9]+$/)) {
      throw new TexError(['IllegalParamNumber',
                          'Illegal number of parameters specified in %1', name]);
    }
  }
  let newMacros = MapHandler.getInstance().getMap('new-Command') as CommandMap;
  newMacros.add(cs,
                new Macro('Macro', NewcommandMethods.Macro, [def, n, opt]));
  // this.setDef(cs, ['Macro', def, n, opt]);
};

/**
 *  Implement \newenvironment{name}[n][default]{begincmd}{endcmd}
 */
NewcommandMethods.NewEnvironment = function(parser: TexParser, name: string) {
  let env = ParseUtil.trimSpaces(parser.GetArgument(name));
  let n = parser.GetBrackets(name);
  let opt = parser.GetBrackets(name);
  let bdef = parser.GetArgument(name);
  let edef = parser.GetArgument(name);
  if (n) {
    n = ParseUtil.trimSpaces(n);
    if (!n.match(/^[0-9]+$/)) {
      throw new TexError(['IllegalParamNumber',
                          'Illegal number of parameters specified in %1', name]);
        }
  }
  let newEnv = MapHandler.getInstance().getMap('new-Environment') as EnvironmentMap;
  newEnv.add(env, new Macro(env, NewcommandMethods.BeginEnv, [true, bdef, edef, n, opt]));
};
    
/**
 *  Implement \def command
 */
NewcommandMethods.MacroDef = function(parser: TexParser, name: string) {
  let cs = GetCSname(parser, name);
  let params = GetTemplate(parser, name, '\\' + cs);
  let def = parser.GetArgument(name);
  let newMacros = MapHandler.getInstance().getMap('new-Command') as CommandMap;
  if (!(params instanceof Array)) {
    newMacros.add(cs,
                  new Macro('Macro', NewcommandMethods.Macro, [def, params]));
    // this.setDef(cs,['Macro', def, params]);
  }
  else {
    newMacros.add(cs, new Macro('MacroWithTemplate', NewcommandMethods.MacroWithTemplate,
                                [def].concat(params)));
    // this.setDef(cs, ['MacroWithTemplate', def].concat(params));
  }
};


let cloneMacro = function(macro: Macro | Symbol): Macro | Symbol {
  return (macro instanceof Macro) ?
    new Macro(macro.symbol, macro.func, macro.args) :
    new Symbol(macro.symbol, macro.char, macro.attributes);
};


/**
 *  Implements the \let command
 */
// NewcommandMethods.Let = function(parser: TexParser, name: string) {
//   let cs = GetCSname(parser, name), macro;
//   let c = parser.GetNext();
//   if (c === '=') {
//     parser.i++;
//     c = parser.GetNext();
//   }
//   //
//   //  All \let commands create entries in the macros array, but we
//   //  have to look in the various mathchar and delimiter arrays if
//   //  the source isn't a macro already, and attach the data to a
//   //  macro with the proper routine to process it.
//   //
//   //  A command of the form \let\cs=char produces a macro equivalent
//   //  to \def\cs{char}, which is as close as MathJax can get for this.
//   //  So \let\bgroup={ is possible, but doesn't work as it does in TeX.
//   //
//   if (c === '\\') {
//     name = GetCSname(parser, name);
//     // macro = parser.configuration.handlers.lookup(name);
//     // csFindMacro(name);
//     const handlers = parser.configuration.handlers;
//     let macro: Symbol | Macro = handlers.get('macro').lookup(name) as Macro;
//     if (macro) {
//       (MapHandler.getInstance().getMap('new-Command') as CommandMap).
//         add(name, new Macro(macro.symbol, macro.func, macro.args));
//       return;
//     }
//     macro = handlers.get('character').lookup(name) as Macro;
//     if (macro) {
//       (MapHandler.getInstance().getMap('new-Character') as MacroMap).
//         add(name, new Macro(macro.symbol, macro.func, macro.args));
//       return;
//     }
//     macro = handlers.get('delimiter').lookup(name) as Macro;
//     if (macro) {
//       (MapHandler.getInstance().getMap('new-Character') as MacroMap).
//         add(name, new Macro(macro.symbol, macro.func, macro.args));
//       return;
//     }
    
//       || handlers.get('delimiter').lookup(name);
//     if (!macro) {
//       return;
//     }
//     if (macro instanceof Macro) {
      
//     } else {
      
//     }
//     if (!macro) {
//       if (TEXDEF.mathchar0mi[name])            {macro = ['csMathchar0mi',TEXDEF.mathchar0mi[name]]}  else
//         if (TEXDEF.mathchar0mo[name])            {macro = ['csMathchar0mo',TEXDEF.mathchar0mo[name]]}  else
//           if (TEXDEF.mathchar7[name])              {macro = ['csMathchar7',TEXDEF.mathchar7[name]]}      else 
//             if (TEXDEF.delimiter['\\'+name] != null) {macro = ['csDelimiter',TEXDEF.delimiter['\\'+name]]} else
//               return;
//     }
//   } else {
//     macro = ['Macro', c];
//     parser.i++;
//   }
//   // parser.setDef(cs, macro);
// };


/**
 *  Get a CS name or give an error
 */
// Utility
let GetCSname = function(parser: TexParser, cmd: string) {
  let c = parser.GetNext();
  if (c !== '\\') {
    throw new TexError(['MissingCS',
                        '%1 must be followed by a control sequence', cmd]);
  }
  let cs = ParseUtil.trimSpaces(parser.GetArgument(cmd));
  return cs.substr(1);
};

/**
 *  Get a \def parameter template
 */
// Utility
  let GetTemplate = function(parser: TexParser, cmd: string, cs: string): number | string[] {
  let c, params = [], n = 0;
  c = parser.GetNext();
  let i = parser.i;
  while (parser.i < parser.string.length) {
    c = parser.GetNext();
    if (c === '#') {
      if (i !== parser.i) {
        params[n] = parser.string.substr(i, parser.i - i);
      }
      c = parser.string.charAt(++parser.i);
      if (!c.match(/^[1-9]$/)) {
        throw new TexError(['CantUseHash2',
                            'Illegal use of # in template for %1', cs]);
      }
      if (parseInt(c) !== ++n) {
        throw new TexError(['SequentialParam',
                            'Parameters for %1 must be numbered sequentially', cs]);
      }
      i = parser.i + 1;
    } else if (c === '{') {
      if (i !== parser.i) {
        params[n] = parser.string.substr(i, parser.i - i);
      }
      if (params.length > 0) {
        return [n.toString()].concat(params);
      } else {
        return n;
      }
    }
    parser.i++;
  }
  throw new TexError(['MissingReplacementString',
                      'Missing replacement string for definition of %1',cmd]);
};

let MAXMACROS = 10000;    // maximum number of macro substitutions per equation

/**
 *  Process a macro with a parameter template
 */
NewcommandMethods.MacroWithTemplate = function (parser: TexParser, name: string,
                                                text: string, n: string,
                                                ...params: string[]) {
  const argCount = parseInt(n, 10);
  if (argCount) {
    let args = [];
    parser.GetNext();
    if (params[0] && !MatchParam(parser, params[0])) {
      throw new TexError(['MismatchUseDef',
                          'Use of %1 doesn\'t match its definition', name]);
    }
    for (let i = 0; i < argCount; i++) {
      args.push(GetParameter(parser, name, params[i + 1]));
    }
    text = ParseUtil.substituteArgs(args, text);
  }
  parser.string = ParseUtil.addArgs(text, parser.string.slice(parser.i));
  parser.i = 0;
  if (++parser.macroCount > MAXMACROS) {
    throw new TexError(['MaxMacroSub1',
                        'MathJax maximum macro substitution count exceeded; ' +
                        'is here a recursive macro call?']);
  }
};
    
/*
 *  Process a user-defined environment
 */
NewcommandMethods.BeginEnv = function(parser: TexParser, begin: StackItem,
                                      bdef: string, edef: string, n: number, def: string) {
  if (parser.stack.env['closing'] === begin.getProperty('end')) {
    delete parser.stack.env['closing'];
    parser.string = edef + parser.string.slice(parser.i);
    parser.i = 0;
    parser.Parse();
    return parser.itemFactory.create('endEnv').setProperties({name: begin.getName()});
  }
  if (n) {
    let args = [];
    if (def != null) {
      let optional = parser.GetBrackets('\\begin{' + begin.getName() + '}');
      args.push(optional == null ? def : optional);
    }
    for (let i = args.length; i < n; i++) {
      args.push(parser.GetArgument('\\begin{' + begin.getName() + '}'));
    }
    bdef = ParseUtil.substituteArgs(args, bdef);
    edef = ParseUtil.substituteArgs([], edef); // no args, but get errors for #n in edef
  }
  parser.string = ParseUtil.addArgs(bdef, parser.string.slice(parser.i));
  parser.i = 0;
  return parser.itemFactory.create('beginEnv').setProperties({name: begin.getName()});
};

/**
 *  Find a single parameter delimited by a trailing template
 */
let GetParameter = function(parser: TexParser, name: string, param: string) {
  if (param == null) {
    return parser.GetArgument(name);
  }
  let i = parser.i, j = 0, hasBraces = 0;
  while (parser.i < parser.string.length) {
    let c = parser.string.charAt(parser.i);
    if (c === '{') {
      if (parser.i === i) {
        hasBraces = 1;
      }
      parser.GetArgument(name); j = parser.i - i;
    } else if (MatchParam(parser, param)) {
      if (hasBraces) {
        i++;
        j -= 2;
      }
      return parser.string.substr(i, j);
    } else if (c === '\\') {
      parser.i++; j++; hasBraces = 0;
      let match = parser.string.substr(parser.i).match(/[a-z]+|./i);
      if (match) {
        parser.i += match[0].length;
        j = parser.i - i;
      }
    } else {
      parser.i++; j++; hasBraces = 0;
    }
  }
  throw new TexError(['RunawayArgument', 'Runaway argument for %1?', name]);
};


/**
 *  Check if a template is at the current location.
 *  (The match must be exact, with no spacing differences.  TeX is
 *   a little more forgiving than this about spaces after macro names)
 */
let MatchParam = function(parser: TexParser, param: string) {
  if (parser.string.substr(parser.i, param.length) !== param) {
    return 0;
  }
  if (param.match(/\\[a-z]+$/i) &&
      parser.string.charAt(parser.i + param.length).match(/[a-z]/i)) {
    return 0;
  }
  parser.i += param.length;
  return 1;
};

NewcommandMethods.Macro = BaseMethods.Macro;

export default NewcommandMethods;
