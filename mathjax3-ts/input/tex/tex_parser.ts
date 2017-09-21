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
 * @fileoverview The TexParser. Implements the basic parsing functionality and
 *     administers the global stack and tree objects.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import * as sm from './symbol_map.js';
import MapHandler from './map_handler.js';
import {Environment, ParseInput, ParseMethod} from './types.js';
import {BaseMappings} from './base_mappings.js';


export default class TexParser {

  private input: string = '';
  private remainder: string = '';
  private macroCount: number = 0;

  constructor(input: ParseInput) {
    MapHandler.getInstance().configure(BaseMappings.CONFIGURATION);
  }


  // TODO (VS): Temporary for setting up parsing in SymbolMaps.
  public setup(env: Record<string, ParseMethod>) {
    const maps = MapHandler.getInstance().allMaps();
    for (let i = 0, map; map = maps[i]; i++) {
      if (map instanceof sm.CharacterMap ||
          map instanceof sm.RegExpMap ||
          map instanceof sm.EnvironmentMap) {
        try {
          let parser = map.getParser()(null);
          if (typeof parser === 'string') {
            map.setParser(env[map.getParser()(null) as string]);
          }
        } catch (e) {}
      }
      if (map instanceof sm.MacroMap) {
        map.setFunctionMap(env);
      }
    }
    MapHandler.getInstance().fallback('character', env['Other']);
    MapHandler.getInstance().fallback('macro', env['csUndefined']);
    MapHandler.getInstance().fallback('environment', env['envUndefined']);
  }


  public parse(input: string): void { }

  private getChar(): string {
    let char = this.remainder.charAt(0);
    this.remainder = this.remainder.slice(1);
    let charCode = char.charCodeAt(0);
    // Surrogate pairs. Refactor with util function in symbol.ts
    if (charCode >= 0xD800 && charCode < 0xDC00) {
      char += this.remainder.charAt(0);
      this.remainder = this.remainder.slice(1);
    }
    return char;
  }

}
