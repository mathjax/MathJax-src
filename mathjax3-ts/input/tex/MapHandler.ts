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

import {AbstractSymbolMap, SymbolMap} from './SymbolMap.js';
import {ParseMethod, ParseResult, ParseInput} from './Types.js';


export default class MapHandler {

  private static instance: MapHandler;

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
   * Dummy constructor
   * @constructor
   */
  private constructor() {
  }

}
