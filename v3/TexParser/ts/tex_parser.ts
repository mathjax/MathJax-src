/*************************************************************
 *
 *  Copyright (c) 2015-2017 The MathJax Consortium
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
 * @fileoverview The TexParser. Implements the basic parsing functionality and
 *     administers the global stack and tree objects.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import MapHandler from './map_handler';
import {Environment} from './types';
import Stack from './stack';
import {BaseMappings} from './base_mappings';
import {BaseMethods} from './base_methods';
import {Tree} from '../../TreeJax/lib/tree';


// TODO: Make this into a singleton?
export default class TexParser {

  private stack: Stack;
  private input: string = '';
  private remainder: string = '';
  private macroCount: number = 0;

  constructor(input: string, env: Environment) {
    // We might want to put this explicitly elsewhere.
    MapHandler.getInstance().configure(BaseMappings.Configuration);
    this.input = input;
    this.remainder = input;
    this.stack = new Stack(env, false, null, null);
    this.parse();
    this.stack.push({kind: 'stop', content: {}});
  }
  
  public parse() {
    // Main parse loop!
    while (this.remainder) {
      let char = this.getChar();
      let result = MapHandler.getInstance().parse(char, this.remainder, this.stack);
      this.remainder = result.rest;
      this.stack.push(result.item);
    }
  }

  private getChar(): string {
    let char = this.remainder.charAt(0);
    this.remainder = this.remainder.slice(1);
    let charCode = char.charCodeAt(0);
    // Surrogate pairs. Refactor with util function in symbol.ts
    if (charCode >= 0xD800 && charCode < 0xDC00) {
      char += this.remainder.charAt(0)
      this.remainder = this.remainder.slice(1);
    }
    return char;
  }
  
  public static parse(input: string): Tree {
    let parser = new TexParser(input, {});
    console.log(parser);
    return parser.stack.getResult();
  }

}
