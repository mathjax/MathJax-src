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


import {TEXCLASS, MmlNode} from '../../core/MmlTree/MmlNode.js';
import {TreeHelper} from './TreeHelper.js';
import TexParser from './TexParser.js';

// A namespace for utility functions for the TeX Parser.
//
// Will become a Typescript namespace.

export namespace ParserUtil {

  const emPerInch = 7.2;
  const pxPerInch = 72;
  const UNIT_CASES: {[key: string]: ((m: number) => number)}  = {
    'em': m => m,
    'ex': m => m * .43,
    'pt': m => m / 10,                    // 10 pt to an em
    'pc': m => m * 1.2,                   // 12 pt to a pc
    'px': m => m * emPerInch / pxPerInch,
    'in': m => m * emPerInch,
    'cm': m => m * emPerInch / 2.54, // 2.54 cm to an inch
    'mm': m => m * emPerInch / 25.4, // 10 mm to a cm
    'mu': m => m / 18,
  };


  export function matchDimen(dim: string): string[] {
    return dim.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(px|pt|em|ex|mu|pc|in|mm|cm)$/);
  };


  export function dimen2em(dim: string) {
    let match = matchDimen(dim);
    let m = parseFloat(match[1] || '1'), unit = match[2];
    let func = UNIT_CASES[unit];
    return func ? func(m) : 0;
  };


  export function Em(m: number) {
    if (Math.abs(m) < .0006) {
      return '0em';
    }
    return m.toFixed(3).replace(/\.?0+$/, '') + 'em';
  };


  /**
   *  Create an mrow that has stretchy delimiters at either end, as needed
   */
  export function fenced(open: string, mml: MmlNode, close: string) {
    TreeHelper.printMethod('fenced');
    // @test Fenced, Fenced3
    let mrow = TreeHelper.createNode(
      'mrow', [], {open: open, close: close, texClass: TEXCLASS.INNER});
    let openNode = TreeHelper.createText(open);
    let mo = TreeHelper.createNode(
      'mo', [],
      {fence: true, stretchy: true, symmetric: true, texClass: TEXCLASS.OPEN},
      openNode);
    TreeHelper.appendChildren(mrow, [mo]);
    // VS: OLD
    // let mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.INNER});
    // mrow.Append(
    //   MML.mo(open).With({fence:true, stretchy:true, symmetric:true, texClass:MML.TEXCLASS.OPEN})
    // );
    // TODO: Rewrite the inferred and mml.data
    if (TreeHelper.isType(mml, 'mrow') && TreeHelper.isInferred(mml)) {
      // @test Fenced, Middle
      // Don't work with new structure yet.
      TreeHelper.appendChildren(mrow, TreeHelper.getChildren(mml));
    } else {
      // @test Fenced3
      TreeHelper.appendChildren(mrow, [mml]);
    }
    let closeNode = TreeHelper.createText(close);
    mo = TreeHelper.createNode(
      'mo', [],
      {fence: true, stretchy: true, symmetric: true, texClass: TEXCLASS.CLOSE},
      closeNode);
    TreeHelper.appendChildren(mrow, [mo]);
    // VS: OLD
    // mrow.Append(
    //   MML.mo(close).With({fence:true, stretchy:true, symmetric:true, texClass:MML.TEXCLASS.CLOSE})
    // );
    return mrow;
  };


  /**
   *  Create an mrow that has \mathchoice using \bigg and \big for the delimiters
   */
  export function fixedFence(open: string, mml: MmlNode, close: string) {
    // @test Choose, Over With Delims, Above with Delims
    TreeHelper.printMethod('fixedFence');
    let mrow = TreeHelper.createNode(
      'mrow', [], {open: open, close: close, texClass: TEXCLASS.ORD});
    // VS: OLD
    // let mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.ORD});
    if (open) {
      TreeHelper.appendChildren(mrow, [mathPalette(open, 'l')]);
    }
    if (TreeHelper.isType(mml, 'mrow')) {
      TreeHelper.appendChildren(mrow, TreeHelper.getChildren(mml));
    } else {
      TreeHelper.appendChildren(mrow, [mml]);
    }
    if (close) {
      TreeHelper.appendChildren(mrow, [mathPalette(close, 'r')]);
    }
    return mrow;
  };


  // TODO: Handling the parser here is a bit awkward!
  //       This and the previous method should go into the ParseMethods.
  export function mathPalette(fence: string, side: string) {
    TreeHelper.printMethod('mathPalette');
    if (fence === '{' || fence === '}') {
      fence = '\\' + fence;
    }
    let D = '{\\bigg' + side + ' ' + fence + '}';
    let T = '{\\big' + side + ' ' + fence + '}';
    return new TexParser('\\mathchoice' + D + T + T + T, {}).mml();
    // let parser = new TexParser();
    // return parser.parse('\\mathchoice' + D + T + T + T, {}).mml();
  };


  //
  //  Combine adjacent <mo> elements that are relations
  //    (since MathML treats the spacing very differently)
  //
  export function combineRelations(mml: MmlNode) {
    TreeHelper.printMethod('combineRelations: ');
    let m1: MmlNode, m2: MmlNode;
    let children = TreeHelper.getChildren(mml);
    for (let i = 0, m = children.length; i < m; i++) {
      if (children[i]) {
        if (TreeHelper.isType(mml, 'mrow')) {
          while (i + 1 < m && (m1 = children[i]) && (m2 = children[i + 1]) &&
                 TreeHelper.isType(m1, 'mo') && TreeHelper.isType(m2, 'mo') &&
                 TreeHelper.getTexClass(m1) === TEXCLASS.REL &&
                 TreeHelper.getTexClass(m2) === TEXCLASS.REL) {
            if (TreeHelper.getProperty(m1, 'variantForm') === TreeHelper.getProperty(m2, 'variantForm') &&
                TreeHelper.getAttribute(m1, 'mathvariant') === TreeHelper.getAttribute(m2, 'mathvariant')) {
              // @test Shift Left, Less Equal
              TreeHelper.appendChildren(m1, TreeHelper.getChildren(m2));
              children.splice(i + 1, 1);
              m--;
            } else {
              TreeHelper.untested('Combine Relations Case 2');
              TreeHelper.setAttribute(m1, 'rspace', '0pt');
              TreeHelper.setAttribute(m2, 'lspace', '0pt');
              i++;
            }
          }
        }
        if (!children[i].isToken) {
          combineRelations(children[i]);
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
  export function fixInitialMO(data: MmlNode[]) {
    TreeHelper.printMethod('AMS-fixInitialMO');
    for (let i = 0, m = data.length; i < m; i++) {
      let child = data[i];
      if (child && (!TreeHelper.isType(child, 'mspace') &&
                    (!TreeHelper.isType(child, 'TeXAtom') ||
                     (TreeHelper.getChildren(child)[0] &&
                      TreeHelper.getChildren(TreeHelper.getChildren(child)[0]).length)))) {
        if (TreeHelper.isEmbellished(child)) {
          let mi = TreeHelper.createNode('mi', [], {});
          data.unshift(mi);
        }
        break;
      }
    }
  };

}
