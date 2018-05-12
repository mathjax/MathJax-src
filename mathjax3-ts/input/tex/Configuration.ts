/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview Configuration options for the TexParser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {ParseMethod} from './Types.js';
import FallbackMethods from './FallbackMethods.js';


export type HandlerType = 'delimiter' | 'macro' | 'character' | 'environment';

export type HandlerConfig = {
  [P in HandlerType]?: string[]
}

export type FallbackConfig = {
  [P in HandlerType]?: ParseMethod
}

export class Configuration {

  /**
   * @constructor
   */
  constructor(private _handler: HandlerConfig,
              private _fallback?: FallbackConfig) {
    let _default: HandlerConfig = {character: [], delimiter: [], macro: [], environment: []};
    let handlers = Object.keys(_handler) as HandlerType[];
    for (const key of handlers) {
      _default[key] = _handler[key];
    }
    this._handler = _default;
    this._fallback = _fallback || {};
  }

  public get handler(): HandlerConfig {
    return this._handler;
  }
  
  public get fallback(): FallbackConfig {
    return this._fallback;
  }
  
  /**
   * Appends configurations to this configuration. Note that fallbacks are
   * overwritten.
   * 
   * @param {Configuration} configuration A configuration setting for the TeX
   *       parser.
   */
  public append(config: Configuration): void {
    let handlers = Object.keys(config.handler) as HandlerType[];
    for (const key of handlers) {
      for (const map of config.handler[key]) {
        this.handler[key].push(map);
      }
    }
    handlers = Object.keys(config.fallback) as HandlerType[];
    for (const key of handlers) {
      let name = key as HandlerType;
      this.fallback[name] = config.fallback[name];
    }
  }

};


// Some concrete definitions.
const BaseConfiguration = new Configuration({
    character: ['command', 'special', 'letter', 'digit'],
    delimiter: ['delimiter'],
  macro: ['empty', 'macros', 'mathchar0mi', 'mathchar0mo', 'mathchar7', 'delimiter'],
    environment: ['environment']
});

const AmsSymbolsConf = new Configuration({
  delimiter: ['AMSsymbols-delimiter'],
  macro: ['AMSsymbols-mathchar0mi', 'AMSsymbols-mathchar0m0',
          'AMSsymbols-delimiter', 'AMSsymbols-macros'],
});

const AmsMathConf = new Configuration({
    delimiter: ['AMSmath-delimiter'],
    macro: ['AMSmath-mathchar0mo', 'AMSmath-macros', 'AMSmath-delimiter'],
    environment: ['AMSmath-environment']
});

// const NoUndef = new Configuration({ }, {macro: FallbackMethods.noUndefined});

export const DefaultConfig = new Configuration({});
DefaultConfig.append(BaseConfiguration);
DefaultConfig.append(AmsSymbolsConf);
DefaultConfig.append(AmsMathConf);

