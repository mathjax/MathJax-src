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


import {TEXCLASS} from '../../../../../mathjax3/core/MmlTree/MmlNode.js';
import {imp} from './imp.js';
import {OldParser} from './Parser.js';

// A namespace for utility functions for the TeX Parser.
//
// Will become a Typescript namespace.

export let ParserUtil = {};


ParserUtil.emPerInch = 7.2;
ParserUtil.pxPerInch = 72;


ParserUtil.matchDimen = function (dim) {
  // imp.printMethod("matchDimen");
  return dim.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(px|pt|em|ex|mu|pc|in|mm|cm)$/);
};


ParserUtil.dimen2em = function (dim) {
  // imp.printMethod("dimen2em");
  var match = ParserUtil.matchDimen(dim);
  var m = parseFloat(match[1]||"1"), unit = match[2];
  if (unit === "em") {return m}
  if (unit === "ex") {return m * .43}
  if (unit === "pt") {return m / 10}                    // 10 pt to an em
  if (unit === "pc") {return m * 1.2}                   // 12 pt to a pc
  if (unit === "px") {return m * ParserUtil.emPerInch / ParserUtil.pxPerInch}
  if (unit === "in") {return m * ParserUtil.emPerInch}
  if (unit === "cm") {return m * ParserUtil.emPerInch / 2.54} // 2.54 cm to an inch
  if (unit === "mm") {return m * ParserUtil.emPerInch / 25.4} // 10 mm to a cm
  if (unit === "mu") {return m / 18}
  return 0;
};


ParserUtil.Em = function (m) {
  // imp.printMethod("Em");
  if (Math.abs(m) < .0006) {return "0em"}
  return m.toFixed(3).replace(/\.?0+$/,"") + "em";
};


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
  if (imp.isType(mml, 'mrow') && imp.isInferred(mml)) {
    // @test Fenced, Middle
    // Don't work with new structure yet.
    imp.appendChildren(mrow, imp.getChildren(mml));
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
ParserUtil.fixedFence = function (open, mml, close) {
  // @test Choose, Over With Delims, Above with Delims
  imp.printMethod('fixedFence');
  var mrow = imp.createNode(
    'mrow', [], {open: open, close: close, texClass: TEXCLASS.ORD});
  // VS: OLD
  // var mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.ORD});
  if (open) {
    imp.appendChildren(mrow, [ParserUtil.mathPalette(open, 'l')]);
  }
  if (imp.isType(mml, 'mrow')) {
    imp.appendChildren(mrow, imp.getChildren(mml));
  } else {
    imp.appendChildren(mrow, [mml]);
  }
  if (close) {
    imp.appendChildren(mrow, [ParserUtil.mathPalette(close, 'r')]);
  }
  return mrow;
};


// TODO: Handling the parser here is a bit awkward!
ParserUtil.mathPalette = function (fence, side) {
  imp.printMethod('mathPalette');
  if (fence === '{' || fence === '}') {
    fence = '\\' + fence;
  }
  let D = '{\\bigg' + side + ' ' + fence + '}';
  let T = '{\\big' + side + ' ' + fence + '}';
  // TODO: This only works with new stack item!
  return new OldParser('\\mathchoice' + D + T + T + T, {}, [], {}).mml();
};


//
//  Combine adjacent <mo> elements that are relations
//    (since MathML treats the spacing very differently)
//
ParserUtil.combineRelations = function (mml) {
  imp.printMethod('combineRelations: ');
  var i, m, m1, m2;
  var children = imp.getChildren(mml);
  for (i = 0, m = children.length; i < m; i++) {
    if (children[i]) {
      if (imp.isType(mml, 'mrow')) {
        while (i+1 < m && (m1 = children[i]) && (m2 = children[i+1]) &&
               imp.isType(m1, 'mo') && imp.isType(m2, 'mo') &&
               imp.getTexClass(m1) === TEXCLASS.REL &&
               imp.getTexClass(m2) === TEXCLASS.REL) {
          if (imp.getProperty(m1, 'variantForm') == imp.getProperty(m2, 'variantForm') &&
              imp.getAttribute(m1, 'mathvariant') == imp.getAttribute(m2, 'mathvariant')) {
            // @test Shift Left, Less Equal
            imp.appendChildren(m1, imp.getChildren(m2));
            children.splice(i+1,1);
            m--;
          } else {
            imp.untested('Combine Relations Case 2');
            imp.setAttribute(m1, 'rspace', '0pt');
            imp.setAttribute(m2, 'lspace', '0pt');
            i++;
          }
        }
      }
      if (!children[i].isToken) {
        ParserUtil.combineRelations(children[i]);
      }
    }
  }
};


// AMS

/**
 *  If the initial child, skipping any initial space or
 *  empty braces (TeXAtom with child being an empty inferred row),
 *  is an <mo>, preceed it by an empty <mi> to force the <mo> to
 *  be infix.
 */
ParserUtil.fixInitialMO = function (data) {
  imp.printMethod('AMS-fixInitialMO');
  for (var i = 0, m = data.length; i < m; i++) {
    var child = data[i];
    if (child && (!imp.isType(child, 'mspace') &&
                  (!imp.isType(child, 'TeXAtom') ||
                   (imp.getChildren(child)[0] &&
                    imp.getChildren(imp.getChildren(child)[0]).length)))) {
      if (imp.isEmbellished(child)) {
        var mi = imp.createNode('mi', [], {});
        data.unshift(mi);
      }
      break;
    }
  }
};


