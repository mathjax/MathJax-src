/*************************************************************
 *
 *  Copyright (c) 2018-2023 The MathJax Consortium
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
 * @fileoverview Configuration file for the unicode package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {EnvList} from '../StackItem.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {CommandMap} from '../TokenMap.js';
import {ParseMethod} from '../Types.js';
import ParseUtil from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';
import {numeric} from '../../../util/Entities.js';
import {Other} from '../base/BaseConfiguration.js';

// Namespace
export let UnicodeMethods: Record<string, ParseMethod> = {};

let UnicodeCache: {[key: number]: [number, number, string, number]} = {};

/**
 * Parse function for unicode macro.
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the macro.
 */
UnicodeMethods.Unicode = function(parser: TexParser, name: string) {
  let HD = parser.GetBrackets(name);
  let HDsplit = null;
  let font = '';
  if (HD) {
    if (HD.replace(/ /g, '').
        match(/^(\d+(\.\d*)?|\.\d+),(\d+(\.\d*)?|\.\d+)$/)) {
      HDsplit = HD.replace(/ /g, '').split(/,/);
      font = parser.GetBrackets(name);
    } else {
      font = HD;
    }
  }
  if (font.match(/;/)) {
    throw new TexError('BadFont', 'Font name for %1 can\'t contain semicolons',  parser.currentCS);
  }
  let n = ParseUtil.trimSpaces(parser.GetArgument(name)).replace(/^0x/, 'x');
  if (!n.match(/^(x[0-9A-Fa-f]+|[0-9]+)$/)) {
    throw new TexError('BadUnicode', 'Argument to %1 must be a number', parser.currentCS);
  }
  let N = parseInt(n.match(/^x/) ? '0' + n : n);
  if (!UnicodeCache[N]) {
    UnicodeCache[N] = [800, 200, font, N];
  } else if (!font) {
    font = UnicodeCache[N][2];
  }
  if (HDsplit) {
    UnicodeCache[N][0] = Math.floor(parseFloat(HDsplit[0]) * 1000);
    UnicodeCache[N][1] = Math.floor(parseFloat(HDsplit[1]) * 1000);
  }
  let variant = parser.stack.env.font as string;
  let def: EnvList = {};
  if (font) {
    UnicodeCache[N][2] = def.fontfamily = font.replace(/'/g, '\'');
    if (variant) {
      if (variant.match(/bold/)) {
        def.fontweight = 'bold';
      }
      if (variant.match(/italic|-mathit/)) {
        def.fontstyle = 'italic';
      }
    }
  } else if (variant) {
    def.mathvariant = variant;
  }
  let node = parser.create('token', 'mtext', def, numeric(n));
  NodeUtil.setProperty(node, 'unicode', true);
  parser.Push(node);
};

/**
 * Create a raw unicode character in TeX input.
 *
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the macro.
 */
UnicodeMethods.RawUnicode = function (parser: TexParser, name: string) {
  const hex = parser.GetArgument(name).trim();
  if (!hex.match(/^[0-9A-F]{1,6}$/)) {
    throw new TexError('BadRawUnicode',
                       'Argument to %1 must a hexadecimal number with 1 to 6 digits', parser.currentCS);
  }
  const n = parseInt(hex, 16);
  parser.string = String.fromCodePoint(n) + parser.string.substring(parser.i);
  parser.i = 0;
}

/**
 * Implements the \char control sequence.
 *
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the macro.
 */
UnicodeMethods.Char = function (parser: TexParser, _name: string) {
  let match;
  let next = parser.GetNext();
  let c = '';
  const text = parser.string.substring(parser.i);
  if (next === '\'') {
    match = text.match(/^'(?:([0-7]{1,7}) ?|(\\\S)|(.))/u);
    if (match) {
      if (match[1]) {
        c = String.fromCodePoint(parseInt(match[1], 8));
      } else if (match[3]) {
        c = match[3];
      } else {
        parser.i += 2;
        const cs = [...parser.GetCS()];
        if (cs.length > 1) {
          throw new TexError('InvalidAlphanumeric', 'Invalid alphanumeric constant for %1', parser.currentCS);
        }
        c = cs[0];
        match = [''];

      }
    }
  } else if (next === '"') {
    match = text.match(/^"([0-9A-F]{1,6}) ?/);
    if (match) {
      c = String.fromCodePoint(parseInt(match[1], 16));
    }
  } else {
    match = text.match(/^([0-9]{1,7}) ?/);
    if (match) {
      c = String.fromCodePoint(parseInt(match[1]));
    }
  }
  if (!c) {
    throw new TexError('MissingNumber', 'Missing numeric constant for %1', parser.currentCS);
  }
  parser.i += match[0].length;
  if (c >= '0' && c <= '9') {
    parser.Push(parser.create('token', 'mn', {}, c));
  } else if (c.match(/[A-Za-z]/)) {
    parser.Push(parser.create('token', 'mi', {}, c));
  } else {
    Other(parser, c);
  }
}



new CommandMap('unicode', {
  unicode: 'Unicode',
  U: 'RawUnicode',
  char: 'Char'
}, UnicodeMethods);


export const UnicodeConfiguration = Configuration.create(
  'unicode', {handler: {macro: ['unicode']}}
);
