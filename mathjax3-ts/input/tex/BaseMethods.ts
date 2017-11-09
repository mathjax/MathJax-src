/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview Base parsing methods for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {TexConstant} from './TexConstants.js';
import {ParseMethod, ParseInput} from './Types.js';


export namespace BaseMethods {

  // export let variable: ParseMethod = function([symbol, rest, stack]) {
  //   // if () {def.mathvariant = this.stack.env.font}
  //   let font = stack.env['font'];
  //   let attributes = font ? {mathvariant: font} : {};
  //   return {rest: rest, item: {kind: 'mml',
  //                              content: {type: 'mi',
  //                                        attributes: attributes,
  //                                        text: symbol}
  //                             }}
  // };

  // export let digit: ParseMethod = function([symbol, rest, stack]) {
  //   return {rest: '', item: ''};
  // };

  // export let num: ParseMethod = function([symbol, rest, stack]) {
  //   return {rest: '', item: ''};
  // };

  // export let controlSequence: ParseMethod = function([symbol, rest, stack]) {
  //   return {rest: '', item: ''};
  // };

  export let variable: ParseMethod = function(input: ParseInput) {
    return 'Variable';
  };

  export let digit: ParseMethod = function(input: ParseInput) {
    return 'Number';
  };

  export let controlSequence: ParseMethod = function(input: ParseInput) {
    return 'ControlSequence';
  };

  export let mathchar0mi: ParseMethod = function(input: ParseInput) {
    return 'csMathchar0mi';
  };

  export let mathchar0mo: ParseMethod = function(input: ParseInput) {
    return 'csMathchar0mo';
  };

  export let mathchar7: ParseMethod = function(input: ParseInput) {
    return 'csMathchar7';
  };

  export let delimiter: ParseMethod = function(input: ParseInput) {
    return 'csDelimiter';
  };

  export let environment: ParseMethod = function(input: ParseInput) {
    return 'BeginEnvironment';
  };

}

// TODO: Temporary for importing base methods into MathJax legacy code.
export default BaseMethods;
