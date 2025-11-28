/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file Methods for TeX parsing of the braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { ParseMethod, ParseResult } from '../Types.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';
import { TEXCLASS } from '../../../core/MmlTree/MmlNode.js';
import { BraketItem } from './BraketItems.js';

const BraketMethods: { [key: string]: ParseMethod } = {
  /**
   * Generate a bra-ket expression.
   *
   * @param {TexParser} parser The current TeX parser.
   * @param {string} name Name of the current control sequence.
   * @param {string} open Opening delimiter.
   * @param {string} close Closing delimiter.
   * @param {boolean} stretchy Is it stretchy.
   * @param {number} barmax Maximum number of bars allowed.
   * @param {boolean} space True to add space inside the delimiters
   */
  Braket(
    parser: TexParser,
    name: string,
    open: string,
    close: string,
    stretchy: boolean,
    barmax: number,
    space: boolean = false
  ) {
    const i = parser.i;
    parser.GetArgument(name); // Error if there isn't a proper argument
    parser.i = i;
    const next = parser.GetNext();
    let single = true;
    if (next === '{') {
      parser.i++;
      single = false;
    }
    const node = parser.itemFactory.create('braket');
    node.setProperties({
      barcount: 0,
      barmax,
      open,
      close,
      stretchy,
      single,
      space,
    });
    parser.Push(node);
    node.env.braketItem = parser.stack.height - 1;
  },

  /**
   * Generate a bar. If inside a bra-ket expressions it's handled accordingly.
   *
   * @param {TexParser} parser The current TeX parser.
   * @param {string} name Name of the current control sequence.
   * @returns {ParseResult} False if the bar isn't to be processed here.
   */
  Bar(parser: TexParser, name: string): ParseResult {
    let c = name === '|' ? '|' : '\u2016';
    const n = parser.stack.height - (parser.stack.env.braketItem as number);
    const top = parser.stack.Top(n) as BraketItem;
    if (
      !top ||
      !top.isKind('braket') ||
      top.getProperty('barcount') >= top.getProperty('barmax')
    ) {
      return false;
    }
    if (c === '|' && parser.GetNext() === '|') {
      parser.i++;
      c = '\u2016';
    }
    if (!top.getProperty('stretchy')) {
      const node = parser.create(
        'token',
        'mo',
        { stretchy: false, 'data-braketbar': true, texClass: TEXCLASS.ORD },
        c
      );
      parser.Push(node);
      return true;
    }
    //
    // Close any pending \over constructs using a specially marked CloseItem
    //
    const close = parser.itemFactory
      .create('close')
      .setProperty('braketbar', true);
    parser.Push(close);
    //
    // Push a CLOSE atom, the bar as a BIN, and an OPEN atom onto the barNodes,
    //  which will be added into the toMml() output.  This allows \over to be used
    //  before, between, or after any bars
    //
    top.barNodes.push(
      parser.create('node', 'TeXAtom', [], { texClass: TEXCLASS.CLOSE }),
      parser.create(
        'token',
        'mo',
        { stretchy: true, 'data-braketbar': true, texClass: TEXCLASS.BIN },
        c
      ),
      parser.create('node', 'TeXAtom', [], { texClass: TEXCLASS.OPEN })
    );
    top.setProperty('barcount', (top.getProperty('barcount') as number) + 1);
    return true;
  },

  Macro: BaseMethods.Macro,
};

export default BraketMethods;
