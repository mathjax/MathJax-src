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
 * @fileoverview Singleton class for handling symbol maps.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {AbstractSymbolMap, SymbolMap} from './symbol_map.js';
import {MapType, Configuration, ParseMethod, ParseResult, ParseInput} from './types.js';


export default class MapHandler {

  private static instance: MapHandler;

  private configurations: Map<MapType, SubMap> = new Map();

  private maps: Map<string, SymbolMap> = new Map();

  /**
   * @return {MapHandler} The singleton MapHandler object.
   */
  public static getInstance(): MapHandler {
    if (!MapHandler.instance) {
      MapHandler.instance = new MapHandler();
    }
    return MapHandler.instance;
  }


  /**
   * Adds a new symbol map to the map handler. Might overwrite an existing
   * symbol map of the same name.
   *
   * @param {SymbolMap} map Registers a new symbol map.
   */
  public register(map: SymbolMap): void {
    this.maps.set(map.getName(), map);
  }


  /**
   * Looks up a symbol map if it exists.
   *
   * @param {string} name The name of the symbol map.
   * @return {SymbolMap} The symbol map with the given name or null.
   */
  public getMap(name: string): SymbolMap {
    return this.maps.get(name);
  }

  // Temporary function to allow setting values from legacy code.
  public allMaps(): SymbolMap[] {
    return Array.from(this.maps.values());
  }

  /**
   * Sets a new configuration for the map handler.
   * @param {{character: Array.<string>,
   *          delimiter: Array.<string>,
   *          macro: Array.<string>,
   *          environment: Array.<string>}} configuration A setting for the
   *    map handler.
   */
  public configure(config: Configuration): void {
    for (let key in config) {
      let name = key as MapType;
      this.configurations.set(name, new SubMap(config[name] || []));
    }
  }


  /**
   * Appends configurations to the current map handler configuration.
   * @param {{character: Array.<string>,
   *          delimiter: Array.<string>,
   *          macro: Array.<string>,
   *          environment: Array.<string>}} configuration A setting for the
   *    map handler.
   */
  public append(config: Configuration): void {
    for (let key in config) {
      let name = key as MapType;
      for (const map of config[name]) {
        this.configurations.get(name).add(map);
      }
    }
  }


  /**
   * Parses the input with the specified kind of map.
   * @param {MapType} kind Configuration name.
   * @param {ParseInput} input Input to be parsed.
   * @return {ParseResult} The output of the parsing function.
   */
  public parse(kind: MapType, input: ParseInput): ParseResult {
    return this.configurations.get(kind).parse(input);
  }


  /**
   * Maps a symbol to its "parse value" if it exists.
   *
   * @param {MapType} kind Configuration name.
   * @param {string} symbol The symbol to parse.
   * @return {T} A boolean, Character, or Macro.
   */
  public lookup(kind: MapType, symbol: string) {
    return this.configurations.get(kind).lookup(symbol);
  }


  public fallback(kind: MapType, method: (input: string) => ParseResult) {
    return this.configurations.get(kind).fallback(method);
  }

  /**
   * Checks if a symbol is contained in one of the symbol mappings of the
   * specified kind.
   *
   * @param {string} symbol The symbol to parse.
   * @return {boolean} True if the symbol is contained in the given types of
   *     symbol mapping.
   */
  public contains(kind: MapType, symbol: string): boolean {
    return this.configurations.get(kind).contains(symbol);
  }


  /**
   * @override
   */
  public toString(): string {
    let str = '';
    for (const config of Array.from(this.configurations.keys())) {
      str += config + ': ' +
        this.configurations.get(config as MapType) + '\n';
    }
    return str;
  }


  /**
   * Dummy constructor
   * @constructor
   */
  private constructor() {
    this.configure({});
  }


}


/**
 * Class of symbol mappings that are active in a configuration.
 */
class SubMap {

  private _configuration: SymbolMap[] = [];
  // TODO: This is the proper type for fallback:
  //
  // private _fallback: ParseMethod = x => { return null; };
  private _fallback: (input: string) => ParseResult = x => { return null; };

  /**
   * @constructor
   * @param {Array.<string>} maps Names of the maps included in this
   *     configuration.
   */
  constructor(maps: string[]) {
    for (const name of maps) {
      this.add(name);
    }
  }


  /**
   * Sets the default method to call when parsing fails.
   * @param {function(string): ParseResult} method The fallback method.
   */
  public fallback(method: (input: string) => ParseResult) {
    this._fallback = method;
  }


  /**
   * Adds a symbol map to the configuration if it exists.
   * @param {string} name of the symbol map.
   */
  public add(name: string): void {
    let map = MapHandler.getInstance().getMap(name);
    if (!map) {
      this.warn('Configuration ' + name + ' not found! Omitted.');
      return;
    }
    this._configuration.push(map);
  }


  /**
   * Parses the given input with the first applicable symbol map.
   * @param {ParseInput} input The input for the parser.
   * @return {ParseResult} The output of the parsing function.
   */
  public parse(input: ParseInput): ParseResult {
    // TODO: Can't be done with applicable due to delimiter parsing!
    for (let map of this._configuration) {
      const result = map.parse(input);
      if (result) {
        return result;
      }
    }
    let [symbol, env] = input;
    return this._fallback.bind(env)(symbol);
  }


  /**
   * Maps a symbol to its "parse value" if it exists.
   *
   * @param {string} symbol The symbol to parse.
   * @return {T} A boolean, Character, or Macro.
   */
  public lookup<T>(symbol: string): T {
    let map = this.applicable(symbol) as AbstractSymbolMap<T>;
    return map ? map.lookup(symbol) : null;
  }


  /**
   * Checks if a symbol is contained in one of the symbol mappings of this
   * configuration.
   *
   * @param {string} symbol The symbol to parse.
   * @return {boolean} True if the symbol is contained in the mapping.
   */
  public contains(symbol: string): boolean {
    return this.applicable(symbol) ? true : false;
  }


  /**
   * @override
   */
  public toString(): string {
    return this._configuration
      .map(function(x: SymbolMap) {return x.getName(); })
      .join(', ');
  }


  /**
   * Retrieves the first applicable symbol map in the configuration.
   * @param {string} symbol The symbol to parse.
   * @return {SymbolMap} A map that can parse the symbol.
   */
  private applicable(symbol: string): SymbolMap {
    for (let map of this._configuration) {
      if (map.contains(symbol)) {
        return map;
      }
    }
    return null;
  }


  // // TODO: Turn this into a global warning and error functionality
  private warn(message: string) {
    console.log('TexParser Warning: ' + message);
  }

}
