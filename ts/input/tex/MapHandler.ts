/*************************************************************
 *
 *  Copyright (c) 2017-2024 The MathJax Consortium
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

import {HandlerType} from './HandlerTypes.js';
import {AbstractTokenMap, TokenMap} from './TokenMap.js';
import {ParseInput, ParseResult, ParseMethod} from './Types.js';
import {PrioritizedList} from '../../util/PrioritizedList.js';
import {FunctionList} from '../../util/FunctionList.js';


export type HandlerConfig = {[P in HandlerType]?: string[]};
export type FallbackConfig = {[P in HandlerType]?: ParseMethod};

let maps: Map<string, TokenMap> = new Map();

export const MapHandler = {

  /**
   * Adds a new token map to the map handler. Might overwrite an existing
   * token map of the same name.
   *
   * @param {TokenMap} map Registers a new token map.
   */
  register(map: TokenMap): void {
    maps.set(map.name, map);
  },


  /**
   * Looks up a token map if it exists.
   *
   * @param {string} name The name of the token map.
   * @return {TokenMap} The token map with the given name or null.
   */
  getMap(name: string): TokenMap {
    return maps.get(name);
  }

}


/**
 * Class of token mappings that are active in a configuration.
 */
export class SubHandler {

  private _configuration: PrioritizedList<TokenMap> = new PrioritizedList<TokenMap>();
  private _fallback: FunctionList = new FunctionList();

  /**
   * Adds a list of token maps to the handler.
   * @param {string[]} maps The names of the token maps to add.
   * @param {ParseMethod} fallback A fallback method.
   * @param {number} priority Optionally a priority.
   */
  public add(maps: string[], fallback: ParseMethod,
             priority: number = PrioritizedList.DEFAULTPRIORITY) {
    for (const name of maps.slice().reverse()) {
      let map = MapHandler.getMap(name);
      if (!map) {
        this.warn('Configuration ' + name + ' not found! Omitted.');
        return;
      }
      this._configuration.add(map, priority);
    }
    if (fallback) {
      this._fallback.add(fallback, priority);
    }
  }

  /**
   * Parses the given input with the first applicable token map.
   * @param {ParseInput} input The input for the parser.
   * @return {ParseResult} The output of the parsing function.
   */
  public parse(input: ParseInput): ParseResult {
    for (let {item: map} of this._configuration) {
      const result = map.parse(input);
      if (result) {
        return result;
      }
    }
    let [env, token] = input;
    Array.from(this._fallback)[0].item(env, token);
  }


  /**
   * Maps a token to its "parse value" if it exists.
   *
   * @param {string} token The token to parse.
   * @return {T} A boolean, Character, or Macro.
   */
  public lookup<T>(token: string): T {
    let map = this.applicable(token) as AbstractTokenMap<T>;
    return map ? map.lookup(token) : null;
  }


  /**
   * Checks if a token is contained in one of the token mappings of this
   * configuration.
   *
   * @param {string} token The token to parse.
   * @return {boolean} True if the token is contained in the mapping.
   */
  public contains(token: string): boolean {
    return this.applicable(token) ? true : false;
  }


  /**
   * @override
   */
  public toString(): string {
    let names = [];
    for (let {item: map} of this._configuration) {
      names.push(map.name);
    }
    return names.join(', ');
  }


  /**
   * Retrieves the first applicable token map in the configuration.
   * @param {string} token The token to parse.
   * @return {TokenMap} A map that can parse the token.
   */
  public applicable(token: string): TokenMap {
    for (let {item: map} of this._configuration) {
      if (map.contains(token)) {
        return map;
      }
    }
    return null;
  }


  /**
   * Retrieves the map of the given name.
   * @param {string} name Name of the token map.
   * @return {TokenMap} The map if it exists.
   */
  public retrieve(name: string): TokenMap {
    for (let {item: map} of this._configuration) {
      if (map.name === name) {
        return map;
      }
    }
    return null;
  }


  /**
   * Prints a warning message.
   * @param {string} message The warning.
   */
  private warn(message: string) {
    console.log('TexParser Warning: ' + message);
  }

}


export class SubHandlers {

  private map = new Map<HandlerType, SubHandler>();

  /**
   * Adds a token map to the configuration if it exists.
   * @param {string} name of the token map.
   */
  public add(handlers: HandlerConfig, fallbacks: FallbackConfig,
             priority: number = PrioritizedList.DEFAULTPRIORITY): void {
    for (const key of Object.keys(handlers)) {
      let name = key as HandlerType;
      let subHandler = this.get(name);
      if (!subHandler) {
        subHandler = new SubHandler();
        this.set(name, subHandler);
      }
      subHandler.add(handlers[name], fallbacks[name], priority);
    }
  }


  /**
   * Setter for subhandlers.
   * @param {HandlerType} name The name of the subhandler.
   * @param {SubHandler} subHandler The subhandler.
   */
  public set(name: HandlerType, subHandler: SubHandler) {
    this.map.set(name, subHandler);
  }


  /**
   * Getter for subhandler.
   * @param {HandlerType} name Name of the subhandler.
   * @return {SubHandler} The subhandler by that name if it exists.
   */
  public get(name: HandlerType): SubHandler {
    return this.map.get(name);
  }


  /**
   * Retrieves a token map of the given name.
   * @param {string} name Name of the token map.
   * @return {TokenMap} The map if it exists. O/w null.
   */
  public retrieve(name: string): TokenMap {
    for (const handler of this.map.values()) {
      let map = handler.retrieve(name);
      if (map) {
        return map;
      }
    }
    return null;
  }


  /**
   * All names of registered subhandlers.
   * @return {IterableIterator<string>} Iterable list of keys.
   */
  public keys(): IterableIterator<string> {
    return this.map.keys();
  }

}
