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
 * @fileoverview Symbol map classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Attributes, Args, ParseMethod, ParseInput, ParseResult} from './types.js';
import {Symbol, Macro} from './symbol.js';
import MapHandler from './map_handler.js';


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
  parserFor(symbol: string): ParseMethod;

  /**
   * @param {string} symbol A symbol to parse.
   * @param {Object} env The current calling object. // (This is temporary!)
   * @return {ParseResult} The parsed symbol and the rest
   * string.
   */
  parse([symbol, env]: ParseInput): ParseResult;

}


/**
 * @constructor
 * @implements {SymbolMap}
 * @template T
 */
export abstract class AbstractSymbolMap<T> implements SymbolMap {

  private name: string;
  private parser: ParseMethod;


  /**
   * @constructor
   * @implements {SymbolMap}
   */
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
  public parse([symbol, env]: ParseInput) {
    let parser = this.parserFor(symbol);
    let mapped = this.lookup(symbol);
    return (parser && mapped) ? (parser.bind(env)(mapped) || true) : null;
  }

  /**
   * @param {function(string): ParseResult} parser Sets the central parser
   * function.
   */
  public setParser(parser: ParseMethod):void {
    this.parser = parser;
  }

  public getParser(): ParseMethod {
    return this.parser;
  }
  
  /**
   * @param {string} symbol
   * @return {T}
   */
  public abstract lookup(symbol: string): T;

}



/**
 * Regular expressions used for parsing.
 * @constructor
 * @extends {AbstractSymbolMap}
 */
export class RegExpMap extends AbstractSymbolMap<string> {

  private regExp: RegExp;

  constructor(name: string, regExp: RegExp) {
    super(name);
    this.regExp = regExp;
  };

  /**
   * @override
   */
  public contains(symbol: string) {
    return this.regExp.test(symbol);
  }

  /**
   * @override
   */
  public lookup(symbol: string) {
    return this.contains(symbol) ? symbol : null;
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


/**
 * Parse maps associate strings with parsing functionality.
 * @constructor
 * @extends {AbstractSymbolMap}
 * @template K
 */
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


/**
 * Maps symbols that can all be parsed with the same method.
 *
 * @constructor
 * @extends {AbstractParseMap}
 */
export class CharacterMap extends AbstractParseMap<Symbol> {

  public addElement(symbol: string, object: [string, null] | [string, Attributes]): void {
    let character = new Symbol(symbol, object[0], object[1]);
    this.add(symbol, character);
  }


  // TODO: Some of this is due to the legacy code format.  In particular working
  //       with nullable Attributes should not be necessary!
  protected static addCharacters(map: CharacterMap,
                                 json: {[index: string]: string|[string, Attributes]}): void {
    for (let key in json) {
      let value = json[key];
      map.addElement(key, (typeof(value) === 'string') ? [value, null] : value);
    }
  }
  
  // These should evolve into the fromJSON methods.
  public static create(
    name: string, parser: ParseMethod,
    json: {[index: string]: string|[string, Attributes]}): CharacterMap {
      let map = new CharacterMap(name);
      CharacterMap.addCharacters(map, json);
      map.setParser(parser);
      return map;
    }
}


// TODO: The need for this class is questionable!
/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {CharacterMap}
 */
export class DelimiterMap extends CharacterMap {

  /**
   * @override
   */
  public parse([symbol, env]: ParseInput) {
    return super.parse(['\\' + symbol, env]);
  }

  public static create(
    name: string, parser: ParseMethod,
    json: {[index: string]: string|[string, Attributes]}): DelimiterMap {
      let map = new DelimiterMap(name);
      map.setParser(parser);
      CharacterMap.addCharacters(map, json);
      return map;
    }

}


// TODO: Maybe have this as the base class.
/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {AbstractParseMap}
 */
export class MacroMap extends AbstractParseMap<Macro> {

  // TODO: This is the correct type.
  // private functionMap: Map<string, ParseMethod> = new Map();
  private functionMap: any;

  
  // TODO: This needs to be set explicitly from an object.
  public setFunctionMap(map: Map<string, ParseMethod>) {
    this.functionMap = map;
  }

  public parserFor(symbol: string) {
    let macro = this.lookup(symbol);
    return macro ? this.functionMap[macro.getFunction()] : null;
  }

  public addElement(symbol: string, object: Args[]): void {
    let character = new Macro(symbol, object[0] as string, object.slice(1));
    this.add(symbol, character);
  }

  // TODO: Some of this is due to the legacy code format.
  protected static addCommands(map: MacroMap, json: {[index: string]: string|Args[]}): void {
    for (let key in json) {
      let value = json[key];
      map.addElement(key, (typeof(value) === 'string') ? [value] : value);
    }
  }
  
  public static create(name: string, json: {[index: string]: string|Args[]}): MacroMap {
    let map = new MacroMap(name);
    MacroMap.addCommands(map, json);
    return map;
  }

}


/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {MacroMap}
 */
export class CommandMap extends MacroMap {

  /**
   * @override
   */
  public parse([symbol, env]: ParseInput) {
    let macro = this.lookup(symbol);
    let parser = this.parserFor(symbol);
    if (!macro || !parser) {
      return null;
    }
    let args = ['\\' + symbol].concat(macro.getArguments() as string[]);
    return parser ? (parser.bind(env).apply(env, args) || true) : null;
  }

  // TODO: Some of this is due to the legacy code format.
  public static create(name: string,
                       json: {[index: string]: string|Args[]}): MacroMap {
    let map = new CommandMap(name);
    MacroMap.addCommands(map, json);
    return map;
  }

}


/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {MacroMap}
 */
export class EnvironmentMap extends MacroMap {

  /**
   * @override
   */
  public parse([symbol, env]: ParseInput) {
    let macro = this.lookup(symbol);
    let envParser = this.parserFor(symbol);
    if (!macro || !envParser) {
      return null;
    }
    // TODO: Here we cheat with the type for the time being!
    this.getParser().bind(env)(envParser.bind(env),
                               symbol, macro.getArguments());
    return true;
  }

  public static create(name: string, json: {[index: string]: string|Args[]}): MacroMap {
   let map = new EnvironmentMap(name);
    MacroMap.addCommands(map, json);
    return map;
  }

}
