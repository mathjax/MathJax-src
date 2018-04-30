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

import {Attributes, Args, ParseMethod, ParseInput, ParseResult} from './Types.js';
import {Symbol, Macro} from './Symbol.js';
import MapHandler from './MapHandler.js';


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
  name: string;

  /**
   * @return {ParseMethod} The default parsing method.
   */
  parser: ParseMethod;

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
   * @return {ParseResult} The parsed symbol and the rest of the string.
   */
  parse([symbol, env]: ParseInput): ParseResult;

}


/**
 * Abstract implementation of symbol maps.
 * @template T
 */
export abstract class AbstractSymbolMap<T> implements SymbolMap {

  private _parser: ParseMethod;

  /**
   * @constructor
   * @implements {SymbolMap}
   */
  constructor(private _name: string) {
    MapHandler.getInstance().register(this);
  };


  /**
   * @override
   */
  public get name(): string {
    return this._name;
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
    return (parser && mapped) ? (parser.bind(env)(env, mapped) || true) : null;
  }


  public set parser(parser: ParseMethod) {
    this._parser = parser;
  }

  public get parser(): ParseMethod {
    return this._parser;
  }


  /**
   * @param {string} symbol
   * @return {T}
   */
  public abstract lookup(symbol: string): T;

}



/**
 * Regular expressions used for parsing strings.
 */
export class RegExpMap extends AbstractSymbolMap<string> {


  /**
   * Static method to create a new regular expression mapping.
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   * @param {RegExp} regexp The regular expression.
   */
  public static create(
    name: string, parser: ParseMethod,
    regexp: RegExp): RegExpMap {
      let map = new RegExpMap(name, regexp);
      map.parser = parser;
      return map;
    }


  /**
   * @constructor
   * @extends {AbstractSymbolMap}
   */
  constructor(name: string, private _regExp: RegExp) {
    super(name);
  };


  /**
   * @override
   */
  public contains(symbol: string) {
    return this._regExp.test(symbol);
  }


  /**
   * @override
   */
  public lookup(symbol: string) {
    return this.contains(symbol) ? symbol : null;
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
   * @param {string} symbol The symbol that is translated.
   ;   * @param {JSON} object Element given in MathJax's configuration format.
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

  /**
   * Adds a character to a given map parsing it first from a JSON representation.
   * @param {CharacterMap} map The character map.
   * @param {JSON} json The representation of a character.
   */
  // TODO: Some of this is due to the legacy code format. Cleanup.
  protected static addCharacters(map: CharacterMap,
                                 json: {[index: string]: string|[string, Attributes]}): void {
    for (let key in json) {
      let value = json[key];
      map.addElement(key, (typeof(value) === 'string') ? [value, null] : value);
    }
  }


  /**
   * Static method to create a character mapping.
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   * @param {JSON} json The JSON representation of the character mapping.
   */
  public static create(
    name: string, parser: ParseMethod,
    json: {[index: string]: string|[string, Attributes]}): CharacterMap {
      let map = new CharacterMap(name);
      CharacterMap.addCharacters(map, json);
      map.parser = parser;
      return map;
    }


  /**
   * @override
   */
  public addElement(symbol: string, pair: [string, null] | [string, Attributes]): void {
    let character = new Symbol(symbol, pair[0], pair[1]);
    this.add(symbol, character);
  }

}


/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {CharacterMap}
 */
export class DelimiterMap extends CharacterMap {

  /**
   * Static method to create a delimiter mapping.
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   * @param {JSON} json The JSON representation of the delimiter mapping.
   */
  public static create(
    name: string, parser: ParseMethod,
    json: {[index: string]: string|[string, Attributes]}): DelimiterMap {
      let map = new DelimiterMap(name);
      map.parser = parser;
      CharacterMap.addCharacters(map, json);
      return map;
    }


  /**
   * @override
   */
  public parse([symbol, env]: ParseInput) {
    return super.parse(['\\' + symbol, env]);
  }

}


/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {AbstractParseMap}
 */
export class MacroMap extends AbstractParseMap<Macro> {

  // TODO: Currently the record is effectively a MathJax legacy object. This is
  // the correct type:
  //
  // private _functionMap: Map<string, ParseMethod> = new Map();
  private _functionMap: Record<string, ParseMethod>;

  /**
   * Adds a macro to a given map parsing it first from a JSON representation.
   * @param {CharacterMap} map The macro map.
   * @param {JSON} json The representation of a command macro.
   */
  // TODO: Some of this is due to the legacy code format. Cleanup.
  protected static addCommands(map: MacroMap, json: {[index: string]: string|Args[]}): void {
    for (let key in json) {
      let value = json[key];
      map.addElement(key, (typeof(value) === 'string') ? [value] : value);
    }
  }


  /**
   * Static method to create a new macro mapping.
   * @param {string} name Name of the mapping.
   * @param {JSON} json The JSON representation of the macro map.
   */
  public static create(name: string, json: {[index: string]: string|Args[]},
                       funcs: Record<string, ParseMethod>): MacroMap {
    let map = new MacroMap(name);
    map.functionMap = funcs;
    MacroMap.addCommands(map, json);
    return map;
  }


  // TODO: This needs to be set explicitly from an object.
  // public set functionMap(map: Map<string, ParseMethod>) {
  public set functionMap(map: Record<string, ParseMethod>) {
    this._functionMap = map;
  }


  /**
   * @override
   */
  public parserFor(symbol: string) {
    let macro = this.lookup(symbol);
    return macro ? macro.func : null;
    // return macro ? this._functionMap.get(macro.func) : null;
  }


  /**
   * @override
   */
  public addElement(symbol: string, object: Args[]): void {
    let character = new Macro(symbol, this._functionMap[object[0] as string],
                              object.slice(1));
    this.add(symbol, character);
  }

  // TODO: Refactor the parse methods for this and the following subclasses.
  /**
   * @override
   */
  public parse([symbol, env]: ParseInput) {
    let macro = this.lookup(symbol);
    let parser = this.parserFor(symbol);
    if (!macro || !parser) {
      return null;
    }
    let args = [env, symbol].concat(macro.args as string[]);
    return parser ? (parser.bind(env).apply(env, args) || true) : null;
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
   * Static method to create a command mapping.
   * @param {string} name Name of the mapping.
   * @param {JSON} json The JSON representation of the command mapping.
   */
  public static create(name: string,
                       json: {[index: string]: string|Args[]},
                       funcs: Record<string, ParseMethod>): MacroMap {
    let map = new CommandMap(name);
    map.functionMap = funcs;
    MacroMap.addCommands(map, json);
    return map;
  }


  /**
   * @override
   */
  public parse([symbol, env]: ParseInput) {
    let macro = this.lookup(symbol);
    let parser = this.parserFor(symbol);
    if (!macro || !parser) {
      return null;
    }
    let args = [env, '\\' + symbol].concat(macro.args as string[]);
    return parser ? (parser.bind(env).apply(env, args) || true) : null;
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
   * Static method to create an environment mapping.
   * @param {string} name Name of the mapping.
   * @param {JSON} json The JSON representation of the environment mapping.
   */
  public static create(name: string, json: {[index: string]: string|Args[]},
                       funcs: Record<string, ParseMethod>): MacroMap {
    let map = new EnvironmentMap(name);
    map.functionMap = funcs;
    MacroMap.addCommands(map, json);
    return map;
  }


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
    this.parser.bind(env)(env, symbol, envParser.bind(env), macro.args);
    return true;
  }

}
