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
 * @fileoverview Configuration file for the bbox package. Note that this is
 *     based on AMS package and Newcommand utilities.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import AmsMethods from '../ams/AmsMethods.js';
import NewcommandUtil from '../newcommand/NewcommandUtil.js';
import TexError from '../TexError.js';


// Namespace
export let BboxMethods: Record<string, ParseMethod> = {};

/**
 * Implements \Newextarrow to define a new arrow.
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 */
BboxMethods.BBox = function(parser: TexParser, name: string) {
  const bbox = parser.GetBrackets(name, '');
  let math = parser.ParseArg(name);
  const parts = bbox.split(/,/);
  let def, background, style;
  for (let i = 0, m = parts.length; i < m; i++) {
    const part = parts[i].replace(/^\s+/, '').replace(/\s+$/, '');
    const match = part.match(/^(\.\d+|\d+(\.\d*)?)(pt|em|ex|mu|px|in|cm|mm)$/);
    if (match) {
      if (def) {
        throw new TexError('MultipleBBoxProperty', '%1 specified twice in %2', 'Padding', name);
      }
      const pad = BBoxPadding(match[1] + match[3]);
      if (pad) {
        def = {
          height: '+' + pad,
          depth: '+' + pad,
          lspace: pad,
          width: '+' + (2 * parseInt(match[1], 10)) + match[3]
        };
      }
    } else if (part.match(/^([a-z0-9]+|\#[0-9a-f]{6}|\#[0-9a-f]{3})$/i)) {
      if (background) {
        throw new TexError('MultipleBBoxProperty', '%1 specified twice in %2',
                           'Background', name);
      }
      background = part;
    } else if (part.match(/^[-a-z]+:/i)) {
      if (style) {
        throw new TexError('MultipleBBoxProperty', '%1 specified twice in %2',
                           'Style', name);
      }
      style = BBoxStyle(part);
    } else if (part !== '') {
      throw new TexError(
        'InvalidBBoxProperty',
        '"%1" doesn\'t look like a color, a padding dimension, or a style',
        part);
    }
  }
  if (def) {
    math = parser.create('node', 'mpadded', [math], def);
  }
  if (background || style) {
    math = parser.create('node', 'mstyle', [math],
                         {mathbackground: background, style: style});
  }
  parser.Push(math);
};


// Dummy methods. Need to be made Safe with security check.
let BBoxStyle = function(styles: string) {
  return styles;
};

let BBoxPadding = function(pad: string) {
  return pad;
};


new CommandMap('bbox', {bbox: 'BBox'}, BboxMethods);


export const BboxConfiguration = Configuration.create(
  'bbox', {handler: {macro: ['bbox']}}
);
