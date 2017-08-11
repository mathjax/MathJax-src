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

import {TexConstant} from './tex_constants';
import {ParseMethod} from './types';


export namespace BaseMethods {
  
  export let variable: ParseMethod = function(symbol, rest, stack) {
    // if () {def.mathvariant = this.stack.env.font}
    let font = stack.env['font'];
    let attributes = font ? {mathvariant: font} : {};
    return {rest: rest, item: {kind: 'mml',
                               content: {type: 'mi',
                                         attributes: attributes,
                                         text: symbol}
                              }}
  };

  export let digit: ParseMethod = function(symbol, rest, stack) {
    return {rest: '', item: ''};
  };

  export let num: ParseMethod = function(symbol, rest, stack) {
    return {rest: '', item: ''};
  };

  export let controlSequence: ParseMethod = function(symbol, rest, stack) {
    return {rest: '', item: ''};
  };

}

