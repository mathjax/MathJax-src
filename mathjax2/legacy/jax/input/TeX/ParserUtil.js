/*************************************************************
 *
 *  MathJax/jax/input/TeX/ParserUtil.js
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


import {TEXCLASS} from 'mathjax3/core/MmlTree/MmlNode.js';
import {imp} from './imp.js';

// A namespace for utility functions for the TeX Parser.
//
// Will become a Typescript namespace.

export let ParserUtil = {};


/**
 *  Create an mrow that has stretchy delimiters at either end, as needed
 */
ParserUtil.fenced = function (open, mml, close) {
  imp.printMethod('fenced');
  // @test Fenced, Fenced3
  var mrow = imp.createNode(
    'mrow', [], {open: open, close: close, texClass: TEXCLASS.INNER});
  var openNode = imp.createText(open);
  var mo = imp.createNode(
    'mo', [],
    {fence: true, stretchy: true, symmetric: true, texClass: TEXCLASS.OPEN},
    openNode);
  imp.appendChildren(mrow, [mo]);
  // VS: OLD
  // var mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.INNER});
  // mrow.Append(
  //   MML.mo(open).With({fence:true, stretchy:true, symmetric:true, texClass:MML.TEXCLASS.OPEN})
  // );
  // TODO: Rewrite the inferred and mml.data
  if (imp.isType(mml, 'mrow') && mml.inferred) {
    // @test Fenced
    imp.appendChildren(mrow, mml.data);
  } else {
    // @test Fenced3
    imp.appendChildren(mrow, [mml]);
  }
  var closeNode = imp.createText(close);
  mo = imp.createNode(
    'mo', [],
    {fence: true, stretchy: true, symmetric: true, texClass: TEXCLASS.CLOSE},
    closeNode);
  imp.appendChildren(mrow, [mo]);
  // VS: OLD
  // mrow.Append(
  //   MML.mo(close).With({fence:true, stretchy:true, symmetric:true, texClass:MML.TEXCLASS.CLOSE})
  // );
  return mrow;
};


/**
 *  Create an mrow that has \mathchoice using \bigg and \big for the delimiters
 */
ParserUtil.fixedFence = function (open, mml, close, parser) {
  // @test Choose, Over With Delims, Above with Delims
  imp.printMethod('fixedFence');
  var mrow = imp.createNode(
    'mrow', [], {open: open, close: close, texClass: TEXCLASS.ORD});
  // VS: OLD
  // var mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.ORD});
  if (open) {
    imp.appendChildren(mrow, [ParserUtil.mathPalette(open, 'l', parser)]);
  }
  if (imp.isType(mml, 'mrow')) {
    imp.appendChildren(mrow, [mrow, mml.data]);
  } else {
    imp.appendChildren(mrow, [mml]);
  }
  if (close) {
    imp.appendChildren(mrow, [ParserUtil.mathPalette(close, 'r', parser)]);
  }
  return mrow;
};


// TODO: Handling the parser here is a bit awkward!
ParserUtil.mathPalette = function (fence, side, parser) {
  imp.printMethod('mathPalette');
  if (fence === '{' || fence === '}') {
    fence = '\\' + fence;
  }
  let D = '{\\bigg' + side + ' ' + fence + '}';
  let T = '{\\big' + side + ' ' + fence + '}';
  return parser('\\mathchoice' + D + T + T + T, {}).mml();
};
