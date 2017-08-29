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
import {ParseResult} from './types.js';
import Stack from './stack.js';


export default class MapHandler {

  private static instance: MapHandler;
  private maps: Map<string, SymbolMap> = new Map();
  private configuration: Array<SymbolMap> = [];

  private constructor() { }
  
  public register(map: SymbolMap): void {
    this.maps.set(map.getName(), map);
  }
  
  public configure(configuration: Array<string>): void {
    for (let config of configuration) {
      let map = this.maps.get(config);
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
    // for (let map of this.configuration) {
    for (let [name, map] of this.maps) {
      console.log('Testing the symbol for: ' + name);
      console.log(map.contains(symbol));
      if (map.contains(symbol)) {
        return map;
      }
    }
    return null;
  }

  // I think here we should return the JSON value that can be handled by the
  // parser. Meaning we should give the symbol_map a function that actually
  // performs the parsing. E.g., a singular method for RegExp and Character. An
  // execution method for custom functions on Macro.
  // 
  // This can then be actually put into the interface. We can then avoid casting!
  //
  // Also: How are we to know "outside" what the actual value is?
  /**
   * Maps a symbol to its "parse value" if it exists.
   * @param {string} symbol The symbol to parse.
   * @return {T} A boolean, Character, or Macro.
   */
  public lookup<T>(symbol: string): T {
    let map = this.applicable(symbol) as AbstractSymbolMap<T>;
    return map ? map.lookup(symbol) : null;
  }
  
  public parse(symbol: string, rest: string, stack: Stack): ParseResult {
    let map = this.applicable(symbol);
    console.log(this.lookup(symbol));
    console.log("PARSING");
    console.log(map.parse(symbol, rest, stack));
    return map ? map.parse(symbol, rest, stack) : null;
  }

  // TODO: Turn this into a global warning and error functionality
  private warn(message: string) {
    console.log('TexParser Warning: ' + message);
  }

  static getInstance(): MapHandler {
    if (!MapHandler.instance) {
      MapHandler.instance = new MapHandler();
    }
    return MapHandler.instance;
  }

}
