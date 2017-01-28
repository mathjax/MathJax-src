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
 * @fileoverview Singleton class for handling symbol maps.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {SymbolMap} from './symbol_map';
import {Symbol, Macro} from './symbol';

type Lookup = boolean|Symbol|Macro;

export class MapHandler {

  private static instance: MapHandler;
  private maps: Map<string, SymbolMap<Lookup>> = new Map<string, SymbolMap<Lookup>>();
  private configuration: Array<SymbolMap<Lookup>> = [];

  public static getInstance(): MapHandler {
    if (!MapHandler.instance) {
      MapHandler.instance = new MapHandler();
    }
    return MapHandler.instance;
  }

  public register(map: SymbolMap<Lookup>): void {
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

  // TODO: Turn this into a global warning and error functionality
  private warn(message: string) {
    console.log('TexParser Warning: ' + message);
  }

}
