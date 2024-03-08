/*************************************************************
 *
 *  Copyright (c) 2023-2024 The MathJax Consortium
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
 * @fileoverview Methods for IEEE macros package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import BaseMethods from '../../base/BaseMethods.js';
import {ParseMethod} from '../../Types.js';
import TexParser from '../../TexParser.js';
import { ParseUtil } from '../../ParseUtil.js';
import NodeUtil from '../../NodeUtil.js';
import TexError from '../../TexError.js';


let IeeeMacrosMethods: Record<string, ParseMethod> = {};

IeeeMacrosMethods.Macro = BaseMethods.Macro;
IeeeMacrosMethods.Spacer = BaseMethods.Spacer;
IeeeMacrosMethods.Accent = BaseMethods.Accent;
IeeeMacrosMethods.UnderOver = BaseMethods.UnderOver;
IeeeMacrosMethods.HBox = BaseMethods.HBox;

IeeeMacrosMethods.SetFont = BaseMethods.SetFont;
IeeeMacrosMethods.Matrix = BaseMethods.Matrix;
IeeeMacrosMethods.Array = BaseMethods.Array;

IeeeMacrosMethods.Hskip = function(parser: TexParser, name: string) {
  ParseUtil.UNIT_CASES.set('pi', 1 / 10); // Same as points
  return BaseMethods.Hskip(parser, name);
}

IeeeMacrosMethods.RotateBox = function(parser: TexParser, name: string) {
  // We currently ignoring optional arguments.
  parser.GetBrackets(name);
  const deg = parseInt(parser.GetArgument(name));
  if (isNaN(deg)) {
    throw new TexError('InvalidArgument', 'Invalid argument number for rotatebox');
  }
  const arg = parser.ParseArg(name);
  const mrow = parser.create('node', 'mrow', [arg]);
  NodeUtil.setAttribute(mrow, 'style', `rotate: ${deg}deg`);
  parser.Push(mrow);
}

IeeeMacrosMethods.Ignore = function(parser: TexParser, name: string, ignore: number) {
  const start = parser.i - name.length; // includes the \
  while (ignore) {
    parser.GetArgument(name);
    ignore--;
  }
  parser.string = parser.string.slice(0, start) + parser.string.slice(parser.i);
  parser.i = start;
}

export default IeeeMacrosMethods;
