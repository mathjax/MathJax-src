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
 * @fileoverview Configuration for the Base LaTeX parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from './Configuration.js';
import {MapHandler} from './MapHandler.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import TexError from './TexError.js';
import {TreeHelper} from './TreeHelper.js';
import TexParser from './TexParser.js';
import {ParseMethod} from './Types.js';
import {CharacterMap} from './SymbolMap.js';


/**
 * Remapping some ASCII characters to their Unicode operator equivalent.
 */
new CharacterMap('remap', null, {
  '-':   '\u2212',
  '*':   '\u2217',
  '`':   '\u2018'   // map ` to back quote
});


/**
 * Default handling of characters (as <mo> elements).
 * @param {TexParser} parser The calling parser.
 * @param {string} char The character to parse.
 */
function Other(parser: TexParser, char: string) {
  const font = parser.stack.env['font'];
  let def = font ?
    // @test Other Font
    {mathvariant: parser.stack.env['font']} : {};
  const remap = (MapHandler.getInstance().getMap('remap') as CharacterMap).
    lookup(char);
  // @test Other
  // @test Other Remap
  const textNode = TreeHelper.createText(remap ? remap.char : char);
  let mo = TreeHelper.createNode('mo', [], def, textNode) as MmlMo;
  parser.toClean(mo);
  parser.Push(parser.mmlToken(mo));
};


/**
 * Handle undefined control sequence.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
function csUndefined(parser: TexParser, name: string) {
  // @test Undefined-CS 
  throw new TexError(['UndefinedControlSequence',
                      'Undefined control sequence %1', '\\' + name]);
};


/**
 * Handle undefined environments.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
function envUndefined(parser: TexParser, env: string) {
  // @test Undefined-Env
  throw new TexError(['UnknownEnv', 'Unknown environment \'%1\'', env]);
};


// Some concrete definitions.
export const BaseConfiguration = new Configuration({
  character: ['command', 'special', 'letter', 'digit'],
  delimiter: ['delimiter'],
  // Note, that the position of the delimiters here is important!
  macro: ['delimiter', 'macros', 'mathchar0mi', 'mathchar0mo', 'mathchar7'],
  environment: ['environment']
}, {
  character: Other,
  macro: csUndefined,
  environment: envUndefined
});

