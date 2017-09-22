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

import * as sm from './SymbolMap.js';
import MapHandler from './MapHandler.js';
import {HandlerType, Configuration, ParseInput, ParseResult, ParseMethod} from './Types.js';
import {BaseMappings} from './BaseMappings.js';


/**
 * The main Tex Parser class.
 */
export default class TexParser {

  private input: string = '';
  private remainder: string = '';
  private macroCount: number = 0;
  private configurations: Map<HandlerType, SubHandler> = new Map();


  /**
   * @constructor
   */
  constructor() {
    this.configure(BaseMappings.CONFIGURATION);
  }


  /**
   * The main parsing method.
   * @param {string} tex The TeX string.
   * @return {MmlNode} The parsing result.
   */
  // TODO (VS): This will eventually become the actual parsing method.
  public process(tex: string): void { }


  /**
   * Sets up parsing methods etc. from legacy code.
   * @param {Record.<string, ParseMethod} env The MathJax legacy object.
   */
  // TODO (VS): Temporary for setting up parsing in SymbolMaps.
  public setup(env: Record<string, ParseMethod>) {
    const maps = MapHandler.getInstance().allMaps();
    for (let i = 0, map; map = maps[i]; i++) {
      if (map instanceof sm.CharacterMap ||
          map instanceof sm.RegExpMap ||
          map instanceof sm.EnvironmentMap) {
        try {
          let parser = map.parser(null);
          if (typeof parser === 'string') {
            map.parser = env[parser];
          }
        } catch (e) {}
      }
      if (map instanceof sm.MacroMap) {
        map.functionMap = env;
      }
    }
    this.fallback('character', env['Other']);
    this.fallback('macro', env['csUndefined']);
    this.fallback('environment', env['envUndefined']);
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
      let name = key as HandlerType;
      this.configurations.set(name, new SubHandler(config[name] || []));
    }
  }


  /**
   * Appends configurations to the current map handlers.
   * @param {{character: Array.<string>,
   *          delimiter: Array.<string>,
   *          macro: Array.<string>,
   *          environment: Array.<string>}} configuration A setting for the
   *    map handler.
   */
  public append(config: Configuration): void {
    for (let key in config) {
      let name = key as HandlerType;
      for (const map of config[name]) {
        this.configurations.get(name).add(map);
      }
    }
  }


  /**
   * Parses the input with the specified kind of map.
   * @param {HandlerType} kind Configuration name.
   * @param {ParseInput} input Input to be parsed.
   * @return {ParseResult} The output of the parsing function.
   */
  public parse(kind: HandlerType, input: ParseInput): ParseResult {
    return this.configurations.get(kind).parse(input);
  }


  /**
   * Maps a symbol to its "parse value" if it exists.
   *
   * @param {HandlerType} kind Configuration name.
   * @param {string} symbol The symbol to parse.
   * @return {T} A boolean, Character, or Macro.
   */
  public lookup(kind: HandlerType, symbol: string) {
    return this.configurations.get(kind).lookup(symbol);
  }


  /**
   * Maps a symbol to its "parse value" if it exists.
   *
   * @param {HandlerType} kind Configuration name.
   * @param {string} symbol The symbol to parse.
   * @return {T} A boolean, Character, or Macro.
   */
  public fallback(kind: HandlerType, method: ParseMethod) {
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
  public contains(kind: HandlerType, symbol: string): boolean {
    return this.configurations.get(kind).contains(symbol);
  }


  /**
   * @override
   */
  public toString(): string {
    let str = '';
    for (const config of Array.from(this.configurations.keys())) {
      str += config + ': ' +
        this.configurations.get(config as HandlerType) + '\n';
    }
    return str;
  }

}




/**
 * Class of symbol mappings that are active in a configuration.
 */
class SubHandler {

  private _configuration: sm.SymbolMap[] = [];
  private _fallback: ParseMethod = (x => { return null; });

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
  public fallback(method: ParseMethod) {
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
    let map = this.applicable(symbol) as sm.AbstractSymbolMap<T>;
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
      .map(function(x: sm.SymbolMap) {return x.name; })
      .join(', ');
  }


  /**
   * Retrieves the first applicable symbol map in the configuration.
   * @param {string} symbol The symbol to parse.
   * @return {SymbolMap} A map that can parse the symbol.
   */
  private applicable(symbol: string): sm.SymbolMap {
    for (let map of this._configuration) {
      if (map.contains(symbol)) {
        return map;
      }
    }
    return null;
  }


  // TODO: Turn this into a global warning and error functionality
  /**
   * Prints a warning message.
   * @param {string} message The warning.
   */
  private warn(message: string) {
    console.log('TexParser Warning: ' + message);
  }

}
