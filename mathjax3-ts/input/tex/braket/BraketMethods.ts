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
 * @fileoverview Methods for TeX parsing of the braket package.
 *                                            
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {ParseMethod} from '../Types.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';


let BraketMethods: Record<string, ParseMethod> = {};

BraketMethods.Macro = BaseMethods.Macro;

BraketMethods.Braket = function(parser: TexParser, name: string) {
  // let argument = parser.GetArgument(name);
  // console.log(argument);
  // console.log(parser.string.slice(parser.i));
  parser.i++;
  // let bra = parser.GetUpTo(name, '|');
  // console.log(bra);
  parser.Push(parser.itemFactory.create('braket'));
};

let splitString = function(str: string, split: string[]): string[] {
  str = str.trim();
  let j = 0;
  let parens = 0;
  return [];
};


BraketMethods.Bar = function(parser: TexParser, name: string) {
  console.log(name);
  console.log(parser.stack.Top());
};


export default BraketMethods;
