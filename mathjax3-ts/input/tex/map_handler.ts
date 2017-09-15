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
import {ParseResult, ParseInput} from './types.js';
import Stack from './stack.js';


export default class MapHandler {

  private static instance: MapHandler;

  public delimiter: Configuration;
  public character: Configuration;
  public macro: Configuration;
  public environment: Configuration;
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
   * 
   * @param {{character: Array.<string>,
   *          delimiter: Array.<string>,
   *          macro: Array.<string>,
   *          environment: Array.<string>}} configuration A setting for the
   *    map handler.
   */
  public configure(configuration: {
    delimiter: Array<string>,
    character: Array<string>,
    macro: Array<string>,
    environment: Array<string>
  }): void {
    this.delimiter = new Configuration(configuration.delimiter);
    this.character = new Configuration(configuration.character);
    this.macro = new Configuration(configuration.macro);
    this.environment = new Configuration(configuration.environment);
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

  /**
   * Dummy constructor
   * @constructor
   */
  private constructor() { }


}


export class Configuration {

  private configuration: Array<SymbolMap> = [];

  /**
   * @constructor
   */
  constructor(maps: Array<string>) {
    for (const name of maps) {
      let map = MapHandler.getInstance().getMap(name);
      if (!map) {
        this.warn('Configuration ' + map + ' not found! Omitted.');
        continue;
      }
      this.configuration.push(map);
    }
  }


  /**
   * Retrieves the first applicable symbol map in the configuration.
   * @param {string} symbol The symbol to parse.
   * @return {SymbolMap} A map that can parse the symbol.
   */
  private applicable(symbol: string): SymbolMap {
    for (let map of this.configuration) {
      if (map.contains(symbol)) {
        return map;
      }
    }
    return null;
  }


  public parse(input: ParseInput): ParseResult {
    // TODO: Can't be done with applicable due to delimiter parsing!
    for (let map of this.configuration) {
      const result = map.parse(input);
      if (result) {
        return result;
      }
    }
    return null;
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
   * Maps a symbol to its "parse value" if it exists.
   * 
   * @param {string} symbol The symbol to parse.
   * @return {T} A boolean, Character, or Macro.
   */
  public contains(symbol: string): boolean {
    return this.applicable(symbol) ? true : false;
  }


  // // TODO: Turn this into a global warning and error functionality
  private warn(message: string) {
    console.log('TexParser Warning: ' + message);
  }

}
