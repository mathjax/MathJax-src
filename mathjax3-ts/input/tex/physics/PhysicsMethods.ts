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
 * @fileoverview Methods for TeX parsing of the physics package.
 *                                            
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {ParseMethod} from '../Types.js';
import BaseMethods from '../base/BaseMethods.js';
import {MapHandler} from '../MapHandler.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {TexConstant} from '../TexConstants.js';
import {TEXCLASS, MmlNode} from '../../../core/MmlTree/MmlNode.js';
import ParseUtil from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';
import {NodeFactory} from '../NodeFactory.js';


let PhysicsMethods: Record<string, ParseMethod> = {};

const pairs: {[fence: string]: string} = {
  '(': ')',
  '[': ']',
  '{': '}',
  '|': '|',
};

// Maybe regexp?
const biggs = /^(b|B)i(g{1,2})$/;

PhysicsMethods.Quantity = function(parser: TexParser, name: string,
                                   open: string = '(', close: string = ')',
                                   arg: boolean = false, named: string = '',
                                   variant: string = '') {
  let star = arg ? parser.GetStar() : false;
  let next = parser.GetNext();
  let position = parser.i;
  let big = null;
  if (next === '\\') {
    parser.i++;
    big = parser.GetCS();
    if (!big.match(biggs)) {
      // empty
      let empty = parser.create('node', 'mrow');
      parser.Push(ParseUtil.fenced(parser.configuration, open, empty, close));
      parser.i = position;
      return;
    }
    next = parser.GetNext();
  }
  let right = pairs[next];
  if (arg && next !== '{') {
    throw new TexError('MissingArgFor', 'Missing argument for %1', parser.currentCS);
  }
  if (!right) {
    let empty = parser.create('node', 'mrow');
    parser.Push(ParseUtil.fenced(parser.configuration, open, empty, close));
    parser.i = position;
    return;
  }
  // Get the fences
  let argument = parser.GetUpTo(name, right).slice(1);
  if (arg) {
    next = open;
    right = close;
  } else if (next === '{') {
    next = '\\{';
    right = '\\}';
  }
  argument = star ? next + ' ' + argument + ' ' + right :
    (big ?
     '\\' + big + 'l' + next + ' ' + argument + ' ' + '\\' + big + 'r' + right :
     '\\left' + next + ' ' + argument + ' ' + '\\right' + right);
  if (named) {
    const mml = parser.create('token', 'mi', {texClass: TEXCLASS.OP}, named);
    if (variant) {
      NodeUtil.setAttribute(mml, 'mathvariant', variant);
    }
    parser.Push(parser.itemFactory.create('fn', mml));
  }
  // TODO: Maybe include this in the old parser via replacement?
  parser.Push(new TexParser(argument, parser.stack.env,
                            parser.configuration).mml());
};


PhysicsMethods.Eval = function(parser: TexParser, name: string) {
  let star = parser.GetStar();
  let next = parser.GetNext();
  let arg, left: string;
  if (next === '{') {
    next = '.';
    arg = parser.GetArgument(name);
  } else if (next === '(' || next === '[') {
    parser.i++;
    arg = parser.GetUpTo(name, '|');
  } else {
    throw new TexError('MissingArgFor', 'Missing argument for %1', parser.currentCS);
  }
  let replace = '\\left' + next + ' ' +
    (star ? '\\smash{' + arg + '}' : arg) +
    ' ' + '\\vphantom{\\int}\\right|';
  parser.string = parser.string.slice(0, parser.i) + replace +
    parser.string.slice(parser.i);
};


PhysicsMethods.Commutator = function(parser: TexParser, name: string,
                                     open: string = '[', close: string = ']') {
  let star = parser.GetStar();
  let next = parser.GetNext();
  let big = null;
  if (next === '\\') {
    parser.i++;
    big = parser.GetCS();
    if (!big.match(biggs)) {
      // Actually a commutator error arg1 error.
      throw new TexError('MissingArgFor', 'Missing argument for %1', parser.currentCS);
    }
    next = parser.GetNext();
  }
  if (next !== '{') {
    throw new TexError('MissingArgFor', 'Missing argument for %1', parser.currentCS);
  }
  let arg1 = parser.GetArgument(name);
  let arg2 = parser.GetArgument(name);
  let argument = arg1 + ',' + arg2;
  argument = star ? open + ' ' + argument + ' ' + close :
    (big ?
     '\\' + big + 'l' + open + ' ' + argument + ' ' + '\\' + big + 'r' + close :
     '\\left' + open + ' ' + argument + ' ' + '\\right' + close);
  // TODO: Maybe include this in the old parser via replacement?
  parser.Push(new TexParser(argument, parser.stack.env,
                            parser.configuration).mml());
};



/**
 * An operator that needs to be parsed and applied. Applications can involve
 * bracketed expressions.
 * @param {TexParser} parser 
 * @param {string} name 
 * @param {boolean = true} opt 
 * @param {string = ''} id 
 */
PhysicsMethods.OperatorApplication = function(
  parser: TexParser, name: string, operator: string) {
  let first = parser.GetNext();
  let lfence = '', rfence = '', arg = '';
  switch (first) {
  case '(':
    parser.i++;
    arg = parser.GetUpTo(name, ')');
    lfence = '\\left(';
    rfence = '\\right)';
    break;
  case '[':
    arg = parser.GetBrackets(name);
    lfence = '\\left[';
    rfence = '\\right]';
    break;
  case '{':
    arg = parser.GetArgument(name);
    break;
  default:
  }
  let macro = operator + ' ' + lfence + ' ' + arg + ' ' + rfence;
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};


PhysicsMethods.Differential = function(parser: TexParser, name: string,
                                       op: string) {
  const optArg = parser.GetBrackets(name);
  const power = optArg != null ? '^{' + optArg + '}' : ' ';
  const parens = parser.GetNext() === '(';
  const braces = parser.GetNext() === '{';
  let macro = op + power;
  if (!(parens || braces)) {
    macro += parser.GetArgument(name, true) || '';
    let mml = new TexParser(macro, parser.stack.env,
                            parser.configuration).mml();
    parser.Push(mml);
    return;
  }
  if (parens) {
    parser.i++;
    macro += '{\\left(' + parser.GetUpTo(name, ')') + '\\right)}';
  } else {
    macro += parser.GetArgument(name);
  }
  const mml = new TexParser(macro, parser.stack.env,
                            parser.configuration).mml();
  // Ideally I would like to set this row to be a TEXCLASS.OP.
  const lspace = parser.create('node', 'mspace', [], {width: TexConstant.Length.THINMATHSPACE});
  const rspace = parser.create('node', 'mspace', [], {width: TexConstant.Length.THINMATHSPACE});
  parser.Push(parser.create('node', 'mrow', [lspace, mml, rspace]));
};

PhysicsMethods.Derivative = function(parser: TexParser, name: string,
                                     argMax: number, op: string) {
  const star = parser.GetStar();
  const optArg = parser.GetBrackets(name);
  let argCounter = 1;
  const args = [];
  args.push(parser.GetArgument(name));
  while (parser.GetNext() === '{' && argCounter < argMax) {
    args.push(parser.GetArgument(name));
    argCounter++;
  }
  let parens = '';
  if (parser.GetNext() === '(') {
    parser.i++;
    parens = '\\left(' + parser.GetUpTo(name, ')') + '\\right)';
  }
  let power1 = ' ';
  let power2 = ' ';
  if (argMax > 2 && args.length > 2) {
    power1 = '^{' + (args.length - 1) + '}';
    parens = '';  // This is a potential error in the physics
                  // package. Parenthesised arguments are "swallowed" in the \dv
                  // commands if all arguments are given.
  } else if (optArg != null) {
    power1 = '^{' + optArg + '}';
    power2 = power1;
  }
  const frac = star ? '\\flatfrac' : '\\frac';
  const first = args.length > 1 ? args[0] : '';
  const second = args.length > 1 ? args[1] : args[0];
  let rest = '';
  for (let i = 2, arg; arg = args[i]; i++) {
    rest += op + ' ' + arg;
  }
  const macro = frac + '{' + op + power1 + first + '}' +
    '{' + op + ' ' + second + power2 + ' ' + rest + '}' + parens;
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};


PhysicsMethods.Expression = function(parser: TexParser, name: string,
                                     opt: boolean = true, id: string = '') {
  id = id || name.slice(1);
  const exp = opt ? parser.GetBrackets(name) : null;
  let mml = parser.create('token', 'mi', {texClass: TEXCLASS.OP}, id);
  if (exp) {
    const sup = new TexParser(exp, parser.stack.env, parser.configuration).mml();
    mml = parser.create('node', 'msup', [mml, sup]);
  }
  parser.Push(parser.itemFactory.create('fn', mml));
  if (parser.GetNext() !== '(') {
    return;
  }
  parser.i++;
  let arg = parser.GetUpTo(name, ')');
  parser.Push(new TexParser('\\left(' + arg + '\\right)', parser.stack.env,
                            parser.configuration).mml());
};


PhysicsMethods.Qqtext = function(parser: TexParser, name: string, text: string) {
  let star = parser.GetStar();
  let arg = text ? text : parser.GetArgument(name);
  let replace = (star ? '' : '\\quad') + '\\text{' + arg + '}\\quad ';
  parser.string = parser.string.slice(0, parser.i) + replace +
    parser.string.slice(parser.i);
};

let latinCap: [number, number] = [0x41, 0x5A];
let latinSmall: [number, number] = [0x61, 0x7A];
let greekCap: [number, number] = [0x391, 0x3A9];
let greekSmall: [number, number] = [0x3B1, 0x3C9];
let digits: [number, number] = [0x30, 0x39];

function inRange(value: number, range: [number, number]) {
  return (value >= range[0] && value <= range[1]);
};

export function createVectorToken(factory: NodeFactory, kind: string,
                                  def: any, text: string): MmlNode  {
  let parser = factory.configuration.parser;
  let token = NodeFactory.createToken(factory, kind, def, text);
  let code: number = text.charCodeAt(0);
  if (text.length === 1 && !parser.stack.env.font &&
      parser.stack.env.vectorFont &&
      (inRange(code, latinCap) || inRange(code, latinSmall) ||
       inRange(code, greekCap) || inRange(code, digits) ||
       (inRange(code, greekSmall) && parser.stack.env.vectorStar) ||
       NodeUtil.getAttribute(token, 'accent'))) {
    NodeUtil.setAttribute(token, 'mathvariant', parser.stack.env.vectorFont);
  }
  return token;
}

// Vector bold should be combined with all other vector methods.
PhysicsMethods.VectorBold = function(parser: TexParser, name: string, text: string) {
  let star = parser.GetStar();
  let arg = parser.GetArgument(name);
  let oldToken = parser.configuration.nodeFactory.get('token');
  let oldFont = parser.stack.env.font;
  delete parser.stack.env.font;
  parser.configuration.nodeFactory.set('token', createVectorToken);
  parser.stack.env.vectorFont = star ? 'bold-italic' : 'bold';
  parser.stack.env.vectorStar = star;
  let node = new TexParser(arg, parser.stack.env, parser.configuration).mml();
  if (oldFont) {
    parser.stack.env.font = oldFont;
  }
  delete parser.stack.env.vectorFont;
  delete parser.stack.env.vectorStar;
  parser.configuration.nodeFactory.set('token', oldToken);
  parser.Push(node);
};


/**
 * Macros that can have an optional star.
 */
PhysicsMethods.StarMacro = function(parser: TexParser, name: string,
                                argcount: number, ...parts: string[]) {
  let star = parser.GetStar();
  const args: string[] = [];
  if (argcount) {
    for (let i = args.length; i < argcount; i++) {
      args.push(parser.GetArgument(name));
    }
  }
  let macro = parts.join(star ? '*' : '');
  macro = ParseUtil.substituteArgs(parser, args, macro);
  parser.string = ParseUtil.addArgs(parser, macro, parser.string.slice(parser.i));
  parser.i = 0;
  if (++parser.macroCount > parser.configuration.options['maxMacros']) {
    throw new TexError('MaxMacroSub1',
                        'MathJax maximum macro substitution count exceeded; ' +
                        'is there a recursive macro call?');
  }
};


PhysicsMethods.Bra = function(parser: TexParser, name: string) {
  let starBra = parser.GetStar();
  let bra = parser.GetArgument(name);
  let ket = '';
  let hasKet = false;
  let starKet = false;
  if (parser.GetNext() === '\\') {
    let saveI = parser.i;
    parser.i++;
    if (parser.GetCS() === 'ket') {   // TODO: This won't work with a let!
      hasKet = true;
      saveI = parser.i;
      starKet = parser.GetStar();
      if (parser.GetNext() === '{') {
        ket = parser.GetArgument('ket', true);
      } else {
        parser.i = saveI;
        starKet = false;
      }
    } else {
      parser.i = saveI;
    }
  }
  let macro = '';
  if (hasKet) {
    macro = (starBra || starKet) ?
    `\\langle{${bra}}\\vert{${ket}}\\rangle` :
      `\\left\\langle{${bra}}\\middle\\vert{${ket}}\\right\\rangle`;
  } else {
    macro = (starBra || starKet) ?
    `\\langle{${bra}}\\vert` : `\\left\\langle{${bra}}\\right\\vert{${ket}}`;
  }
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};


PhysicsMethods.Ket = function(parser: TexParser, name: string) {
  let star = parser.GetStar();
  let ket = parser.GetArgument(name);
  let macro = star ? `\\vert{${ket}}\\rangle` :
    `\\left\\vert{${ket}}\\right\\rangle`;
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};


PhysicsMethods.BraKet = function(parser: TexParser, name: string) {
  let star = parser.GetStar();
  let bra = parser.GetArgument(name);
  let ket = null;
  if (parser.GetNext() === '{') {
    ket = parser.GetArgument(name, true);
  }
  let macro = '';
  if (ket == null) {
    macro = star ?
      `\\langle{${bra}}\\vert{${bra}}\\rangle` :
      `\\left\\langle{${bra}}\\middle\\vert{${bra}}\\right\\rangle`;
  } else {
    macro = star ?
      `\\langle{${bra}}\\vert{${ket}}\\rangle` :
      `\\left\\langle{${bra}}\\middle\\vert{${ket}}\\right\\rangle`;
  }
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};


PhysicsMethods.KetBra = function(parser: TexParser, name: string) {
  let star = parser.GetStar();
  let ket = parser.GetArgument(name);
  let bra = null;
  if (parser.GetNext() === '{') {
    bra = parser.GetArgument(name, true);
  }
  let macro = '';
  if (bra == null) {
    macro = star ?
      `\\vert{${ket}}\\rangle\\!\\langle{${ket}}\\vert` :
      `\\left\\vert{${ket}}\\middle\\rangle\\!\\middle\\langle{${ket}}\\right\\vert`;
  } else {
    macro = star ?
      `\\vert{${ket}}\\rangle\\!\\langle{${bra}}\\vert` :
      `\\left\\vert{${ket}}\\middle\\rangle\\!\\middle\\langle{${bra}}\\right\\vert`;
  }
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};


function outputBraket([arg1, arg2, arg3]: [string, string, string],
                      star1: boolean, star2: boolean) {
  return (star1 && star2) ?
    `\\left\\langle{${arg1}}\\middle\\vert{${arg2}}\\middle\\vert{${arg3}}\\right\\rangle` :
    (star1 ? `\\langle{${arg1}}\\vert{${arg2}}\\vert{${arg3}}\\rangle` :
     `\\left\\langle{${arg1}}\\right\\vert{${arg2}}\\left\\vert{${arg3}}\\right\\rangle`);
};

PhysicsMethods.Expectation = function(parser: TexParser, name: string) {
  let star1 = parser.GetStar();
  let star2 = star1 && parser.GetStar();
  let braket = parser.GetNext() === '{';
  let arg1 = parser.GetArgument(name);
  let arg2 = null;
  if (parser.GetNext() === '{') {
    arg2 = parser.GetArgument(name, true);
  }
  let macro = (arg1 && arg2) ?
    outputBraket([arg2, arg1, arg2], star1, star2) :
    // Braces for semantics, similar to braket package.
    (star1 ? `\\langle {${arg1}} \\rangle` :
     `\\left\\langle {${arg1}} \\right\\rangle`);
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};

PhysicsMethods.MatrixElement = function(parser: TexParser, name: string) {
  let star1 = parser.GetStar();
  let star2 = star1 && parser.GetStar();
  let braket = parser.GetNext() === '{';
  let arg1 = parser.GetArgument(name);
  let arg2 = parser.GetArgument(name);
  let arg3 = parser.GetArgument(name);
  let macro = outputBraket([arg1, arg2, arg3], star1, star2);
  parser.Push(new TexParser(macro, parser.stack.env,
                            parser.configuration).mml());
};

PhysicsMethods.Macro = BaseMethods.Macro;

PhysicsMethods.NamedFn = BaseMethods.NamedFn;


export default PhysicsMethods;
