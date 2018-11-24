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
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import ParseUtil from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';


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


PhysicsMethods.Macro = BaseMethods.Macro;

PhysicsMethods.NamedFn = BaseMethods.NamedFn;


export default PhysicsMethods;
