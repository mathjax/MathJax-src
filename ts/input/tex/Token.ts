/*************************************************************
 *
 *  Copyright (c) 2017-2024 The MathJax Consortium
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
 * @fileoverview Token classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Args, Attributes, ParseMethod} from './Types.js';


/**
 * Token class
 */
export class Token {

  /**
   * @constructor
   * @param {string} token The token parsed.
   * @param {string} char The corresponding translation.
   * @param {Attributes} attributes The attributes for the translation.
   */
  constructor(private _token: string, private _char: string,
              private _attributes: Attributes) {
  }

  public get token(): string {
    return this._token;
  }

  public get char(): string {
    return this._char;
  }

  public get attributes(): Attributes {
    return this._attributes;
  }

}

export class Macro {

  /**
   * @constructor
   * @param {string} token The token parsed
   * @param {ParseMethod} func The parsing function for that token.
   * @param {Args[]} args Additional arguments for the function.
   */
  constructor(private _token: string, private _func: ParseMethod,
              private _args: Args[] = []) {
  }

  public get token(): string {
    return this._token;
  }

  public get func(): ParseMethod {
    return this._func;
  }

  public get args(): Args[] {
    return this._args;
  }

}
