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
 * @fileoverview Symbol map classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

// Can eventually be removed!
import {Attributes, Args, ParseMethod, ParseResult} from './types';
import {Symbol, Macro} from './symbol';
import MapHandler from './map_handler';


/**
 * SymbolMaps are the base components for the input parsers.
 * 
 * They provide a contains method that checks if a map is applicable (contains)
 * a particular string. Implementing classes then perform the actual symbol
 * parsing, from simple regular expression test, straight forward symbol mapping
 * to transformational functionality on the parsed string.
 * 
 * @interface
 */
export interface SymbolMap {
  
  /**
   * @return {string} The name of the map.
   */
  getName(): string;

  /**
   * @param {string} symbol A symbol to parse.
   * @return {boolean} True if the symbol map applies to the symbol.
   */
  contains(symbol: string): boolean;

  /**
   * @param {string} symbol A symbol to parse.
   * @return {function(string): ParseResult} A parse method for the symbol.
   */
  parserFor(symbol: string): (str: string) => ParseResult;

  /**
   * @param {string} symbol A symbol to parse.
   * @return {ParseResult} The parsed symbol and the rest
   * string.
   */
  parse(symbol: string): ParseResult;
  
}


export abstract class AbstractSymbolMap<T> implements SymbolMap {

  private name: string;
  private parser: (str: string) => ParseResult;
  
  constructor(name: string) {
    this.name = name;
    MapHandler.getInstance().register(this);
  };

  /**
   * @override
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @override
   */
  public abstract contains(symbol: string): boolean;

  /**
   * @override
   */
  public parserFor(symbol: string) {
    return this.contains(symbol) ? this.parser : null;
  }
  
  /**
   * @override
   */
  public parse(symbol: string) {
    let parser = this.parserFor(symbol);
    return parser ? parser(symbol) : null;
  }
  
  /**
   * @param {function(string): ParseResult} parser Sets the central parser
   * function.
   */
  public setParser(parser: (str: string) => ParseResult):void {
    console.log(parser);
    this.parser = parser;
  }

  /**
   * @param {string} symbol
   * @return {T} 
   */
  public abstract lookup(symbol: string): T;

}


export class RegExpMap extends AbstractSymbolMap<boolean> {

  private regExp: RegExp;
  
  constructor(name: string, regExp: RegExp) {
    super(name);
    this.regExp = regExp;
  };

  /**
   * @override
   */
  public contains(symbol: string) {
    return this.lookup(symbol);
  }

  /**
   * @override
   */
  public lookup(symbol: string) {
    return this.regExp.test(symbol);
  }
  
  // TODO: Some of this is due to the legacy code format.  In particular working
  //       with nullable Attributes should not be necessary!
  // These should evolve into the fromJSON methods.
  public static create(
    name: string, parser: ParseMethod,
    regexp: RegExp): RegExpMap {
      let map = new RegExpMap(name, regexp);
      map.setParser(parser);
      return map;
    }
}


export abstract class AbstractParseMap<K> extends AbstractSymbolMap<K> {

  private map: Map<string, K> = new Map<string, K>();

  /**
   * @override
   */
  public lookup(symbol: string) {
    return this.map.get(symbol);
  }

  /**
   * @override
   */
  public contains(symbol: string) {
    return this.map.has(symbol);
  }
  
  /**
   * 
   * @param {string} symbol
   * @param {T} object
   */
  protected add(symbol: string, object: K) {
    this.map.set(symbol, object);
  }

  /**
   * Adds the a new element to the map.
   * @param {string} symbol
   * @param {JSON} object Element given in MathJax's configuration format.
   */
  public abstract addElement<K>(symbol: string, object: K): void;

}


export class CharacterMap extends AbstractParseMap<Symbol> {

  public addElement(symbol: string, object: [string, null] | [string, Attributes]): void {
    let character = new Symbol(symbol, object[0], object[1]);
    this.add(symbol, character);
  }

  // TODO: Some of this is due to the legacy code format.  In particular working
  //       with nullable Attributes should not be necessary!
  // These should evolve into the fromJSON methods.
  public static create(
    name: string, parser: (str: string) => ParseResult,
    json: {[index: string]: string|[string, Attributes]}): CharacterMap {
      let map = new CharacterMap(name);
      for (let key in json) {
        let value = json[key];
        map.addElement(key, (typeof(value) === "string") ? [value, null] : value);
      }
      map.setParser(parser);
      return map;
    }
}


export class MacroMap extends AbstractParseMap<Macro> {

  public addElement(symbol: string, object: Args[]): void {
    let character = new Macro(symbol, object[0] as string, object.slice(1));
    this.add(symbol, character);
  }

  public setParser(parser: (str: string) => ParseResult) { }

  // public parserFor(symbol: string) {
  //   let macro = this.lookup(symbol);
  //   return macro ? macro.getFunction() : null;
  // }
  
  // TODO: Some of this is due to the legacy code format.
  public static create(name: string,
                       json: {[index: string]: string|Args[]}): MacroMap {
    let map = new MacroMap(name);
    for (let key in json) {
      let value = json[key];
      map.addElement(key, (typeof(value) === "string") ? [value] : value);
    }
    return map;
  }
  
}

