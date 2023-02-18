/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview Methods for TeX parsing of the braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {ParseMethod, ParseResult} from '../Types.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import TexError from '../TexError.js';
import {BraketItem} from './BraketItems.js';


let BraketMethods: Record<string, ParseMethod> = {};

BraketMethods.Macro = BaseMethods.Macro;


/**
 * Generate a bra-ket expression.
 * @param {TexParser} parser The current TeX parser.
 * @param {string} name Name of the current control sequence.
 * @param {string} open Opening delimiter.
 * @param {string} close Closing delimiter.
 * @param {boolean} stretchy Is it stretchy.
 * @param {number} barmax Maximum number of bars allowed.
 * @param {boolean} space True to add space inside the delimiters
 */
BraketMethods.Braket = function(parser: TexParser, _name: string,
                                open: string, close: string,
                                stretchy: boolean, barmax: number, space: boolean = false) {
  let next = parser.GetNext();
  if (next === '') {
    throw new TexError('MissingArgFor', 'Missing argument for %1', parser.currentCS);
  }
  let single = true;
  if (next === '{') {
    parser.i++;
    single = false;
  }
  parser.Push(
    parser.itemFactory.create('braket')
      .setProperties({barcount: 0, barmax, open, close, stretchy, single, space}));
};


/**
 * Generate a bar. If inside a bra-ket expressions it's handled accordingly.
 * @param {TexParser} parser The current TeX parser.
 * @param {string} name Name of the current control sequence.
 * @return {ParseResult} False if the bar isn't to be processed here.
 */
BraketMethods.Bar = function(parser: TexParser, name: string): ParseResult {
  let c = name === '|' ? '|' : '\u2016';
  let top = parser.stack.Top() as BraketItem;
  if (top.isKind('over')) {
    // If the top item is from \over, use the previous one
    top = parser.stack.Top(2) as BraketItem;
  }
  if (!top.isKind('braket') || top.getProperty('barcount') >= top.getProperty('barmax')) {
    return false;
  }
  if (c === '|' && parser.GetNext() === '|') {
    parser.i++;
    c = '\u2016';
  }
  let stretchy = top.getProperty('stretchy');
  if (!stretchy) {
    let node = parser.create('token', 'mo', {stretchy: false, 'data-braketbar': true, texClass: TEXCLASS.ORD}, c);
    parser.Push(node);
    return;
  }
  //
  // Close any pending \over constructs using a specially marked CloseItem
  //
  let close = parser.itemFactory.create('close').setProperty('braketbar', true);
  parser.Push(close);
  //
  // Push a CLOSE atom, the bar as a BIN, and an OPEN atom onto the barNodes,
  //  which will be added into the toMml() output.  This allows \over to be used
  //  after any bars
  //
  top.barNodes.push(
    parser.create('node', 'TeXAtom', [], {texClass: TEXCLASS.CLOSE}),
    parser.create('token', 'mo', {stretchy: true, 'data-braketbar': true, texClass: TEXCLASS.BIN}, c),
    parser.create('node', 'TeXAtom', [], {texClass: TEXCLASS.OPEN})
  );
  top.setProperty('barcount', top.getProperty('barcount') as number + 1);
};


export default BraketMethods;
