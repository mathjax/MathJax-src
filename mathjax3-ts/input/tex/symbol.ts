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
 * @fileoverview Symbol classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Args, Attributes} from './types';


export class Symbol {

  private symbol: string;
  private char: string;
  private attributes: Attributes;

  constructor(symbol: string, char: string, attributes: Attributes) {
    this.symbol = symbol;
    this.char = Symbol.parse(char);
    this.attributes = attributes;
  }

  public getSymbol(): string {
    return this.symbol;
  }

  public getChar(): string {
    return this.char;
  }

  public getAttributes(): Attributes {
    return this.attributes;
  }
  
  private static parse(char: string): string {
    if (char.length < 4) {
      return char;
    }
    var keyValue = parseInt(char, 16);
    if (keyValue < 0x10000) {
      return String.fromCharCode(keyValue);
    }
    keyValue -= 0x10000;
    var hiSurrogate = (keyValue >> 10) + 0xD800;
    var lowSurrogate = (keyValue & 0x3FF) + 0xDC00;
    return String.fromCharCode(hiSurrogate, lowSurrogate);
  }
  
};


export class Macro {

  private symbol: string;
  //  private func: (str: string) => JSON;
  private func: string;
  private args: Args[];

  //constructor(symbol: string, func: (str: string) => JSON, args: Args[]) {
  constructor(symbol: string, func: string, args: Args[]) {
    this.symbol = symbol,
    this.func = func;
    this.args = args || [];
  }

  public getSymbol(): string {
    return this.symbol;
  }

  //  public getFunction(): (str: string) => JSON {
  public getFunction(): string {
    return this.func;
  }

  public getArguments(): Args[] {
    return this.args;
  }
  
};



