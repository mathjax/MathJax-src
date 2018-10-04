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
 * @fileoverview Configuration file for the cancel package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {TexConstant} from '../TexConstants.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';


/**
 * The attributes allowed in \enclose{notation}[attributes]{math}
 * @type {{[key: string]: number}}
 */
const ALLOWED: {[key: string]: number} = {
  color: 1, mathcolor: 1,
  background: 1, mathbackground: 1,
  padding: 1,
  thickness: 1
};


/**
 * Rewrites tex parameter string into allowable attributes list.
 * @param {any} def 
 * @param {string} attrib 
 */
function setAttributes(def: any, attrib: string) {
    if (attrib !== '') {
      const attr = attrib.replace(/ /g, '').split(/,/);
      for (let i = 0, m = attr.length; i < m; i++) {
        const keyvalue = attr[i].split(/[:=]/);
        if (ALLOWED[keyvalue[0]]) {
          let value = keyvalue[1];
          def[keyvalue[0]] = (value === 'true') ? true :
            (value === 'false') ? false : value;
        }
      }
    }
    return def;
  };


// Namespace
export let CancelMethods: Record<string, ParseMethod> = {};


/**
 * Parse function for cancel macros of the form \(b|x)cancel[attributes]{math}
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 * @param {string} notation The type of cancel notation to use.
 */
CancelMethods.Cancel = function(parser: TexParser, name: string, notation: string) {
  const attr = parser.GetBrackets(name, '');
  const math = parser.ParseArg(name);
  const def = setAttributes({notation: notation}, attr);
  parser.Push(parser.create('node', 'menclose', [math], def));
};


/**
 * Parse function implementing \cancelto{value}[attributes]{math}
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 * @param {string} notation The type of cancel notation to use.
 */

CancelMethods.CancelTo = function(parser: TexParser, name: string, notation: string) {
  let value = parser.ParseArg(name);
  const attr = parser.GetBrackets(name, '');
  const math = parser.ParseArg(name);
  const def = setAttributes(
    {notation: TexConstant.Notation.UPDIAGONALSTRIKE + ' ' +
     TexConstant.Notation.UPDIAGONALARROW}, attr);
  value = parser.create('node', 'mpadded', [value],
                        {depth: '-.1em', height: ' + .1em', voffset: '.1em'});
  parser.Push(parser.create('node', 'msup',
                            [parser.create('node', 'menclose', [math], def), value]));
};


new CommandMap('cancel', {
  cancel:   ['Cancel', TexConstant.Notation.UPDIAGONALSTRIKE],
  bcancel:  ['Cancel', TexConstant.Notation.DOWNDIAGONALSTRIKE],
  xcancel:  ['Cancel', TexConstant.Notation.UPDIAGONALSTRIKE + ' ' +
             TexConstant.Notation.DOWNDIAGONALSTRIKE],
  cancelto: 'CancelTo'
}, CancelMethods);


export const CancelConfiguration = Configuration.create(
  'cancel', {handler: {macro: ['cancel']}}
);


