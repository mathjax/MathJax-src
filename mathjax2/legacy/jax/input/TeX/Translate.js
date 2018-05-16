/*************************************************************
 *
 *  MathJax/jax/input/TeX/Translate.js
 *
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2009-2017 The MathJax Consortium
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

import {imp} from './imp.js';
// import {OldParser} from './Parser.js';
import {OldParser} from '../../../../../mathjax3/input/tex/OldParser.js';
import {ParserUtil} from '../../../../../mathjax3/input/tex/ParserUtil.js';
// import {ParseMethods} from './ParseMethods.js';
import {ParseMethods} from '../../../../../mathjax3/input/tex/ParseMethods.js';
import TexError from '../../../../../mathjax3/input/tex/TexError.js';

// A wrapper for translating scripts with LaTeX content.

let formatError = function (err,math,display,script) {
  var message = err.message.replace(/\n.*/,"");
  return imp.createError(message);
};


export default function Translate(script, configurations, stackitem) {
  imp.printMethod('Translate');
  imp.printSimple(script);
  var mml, isError = false, math = script.innerText;
  var display = (script.type.replace(/\n/g," ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null);
  try {
    // mml = new OldParser(math, null, configurations, stackitem).mml();
    // mml = new OldParser(math, null, [], stackitem).mml();
    mml = new OldParser(math, null, ParseMethods).mml();
    // mml = TEX.Parse(math).mml();
    imp.printSimple(mml.toString());
  } catch(err) {
    if (!err instanceof TexError) {throw err}
    mml = formatError(err,math,display,script);
    isError = true;
  }
  mml = imp.cleanSubSup(mml);
  if (imp.isType(mml, 'mtable') &&
      imp.getAttribute(mml, 'displaystyle') === 'inherit') {
    // for tagged equations
    imp.untested('Tagged equations');
    imp.setAttribute(mml, 'displaystyle', display);
  }
  let mathNode = imp.createMath(mml);
  let root = imp.getRoot(mathNode);
  if (display) {
    imp.setAttribute(root, 'display', 'block');
  }
  if (isError) {
    mathNode.texError = true;
  }
  ParserUtil.combineRelations(root);
  return mathNode;
};
