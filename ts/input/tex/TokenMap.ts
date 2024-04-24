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
 * @fileoverview Token map classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Attributes, Args, ParseMethod, ParseInput, ParseResult} from './Types.js';
import {Token, Macro} from './Token.js';
import {MapHandler} from './MapHandler.js';


/**
 * TokenMaps are the base components for the input parsers.
 *
 * They provide a contains method that checks if a map is applicable (contains)
 * a particular string. Implementing classes then perform the actual token
 * parsing, from simple regular expression test, straight forward token mapping
 * to transformational functionality on the parsed string.
 *
 * @interface
 */
export interface TokenMap {

  /**
   * @return {string} The name of the map.
   */
  name: string;

  /**
   * @return {ParseMethod} The default parsing method.
   */
  parser: ParseMethod;

  /**
   * @param {string} token A token to parse.
   * @return {boolean} True if the token map applies to the token.
   */
  contains(token: string): boolean;

  /**
   * @param {string} token A token to parse.
   * @return {ParseMethod} A parse method for the token.
   */
  parserFor(token: string): ParseMethod;

  /**
   * @param {TexParser} env The current parser.
   * @param {string} token A token to parse.
   * @return {ParseResult} The parsed token and the rest of the string.
   */
  parse([env, token]: ParseInput): ParseResult;

}

/**
 * @param {ParseResult} result    The result to check
 * @return {ParseResult}          True if result was void, result otherwise
 */
export function parseResult(result: ParseResult): ParseResult {
  return result === void 0 ? true : result;
}

/**
 * Abstract implementation of token maps.
 * @template T
 */
export abstract class AbstractTokenMap<T> implements TokenMap {

  /**
   * @constructor
   * @implements {TokenMap}
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   */
  constructor(private _name: string, private _parser: ParseMethod) {
    MapHandler.register(this);
  }


  /**
   * @override
   */
  public get name(): string {
    return this._name;
  }


  /**
   * @override
   */
  public abstract contains(token: string): boolean;


  /**
   * @override
   */
  public parserFor(token: string) {
    return this.contains(token) ? this.parser : null;
  }


  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    let parser = this.parserFor(token);
    let mapped = this.lookup(token);
    return (parser && mapped) ? parseResult(parser(env, mapped as any)) : null;
  }


  public set parser(parser: ParseMethod) {
    this._parser = parser;
  }

  public get parser(): ParseMethod {
    return this._parser;
  }


  /**
   * @param {string} token
   * @return {T}
   */
  public abstract lookup(token: string): T;

}



/**
 * Regular expressions used for parsing strings.
 */
export class RegExpMap extends AbstractTokenMap<string> {

  /**
   * @constructor
   * @extends {AbstractTokenMap}
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   * @param {RegExp} regexp The regular expression.
   */
  constructor(name: string, parser: ParseMethod, private _regExp: RegExp) {
    super(name, parser);
  }


  /**
   * @override
   */
  public contains(token: string) {
    return this._regExp.test(token);
  }


  /**
   * @override
   */
  public lookup(token: string): string {
    return this.contains(token) ? token : null;
  }

}


/**
 * Parse maps associate strings with parsing functionality.
 * @constructor
 * @extends {AbstractTokenMap}
 * @template K
 */
export abstract class AbstractParseMap<K> extends AbstractTokenMap<K> {

  private map: Map<string, K> = new Map<string, K>();

  /**
   * @override
   */
  public lookup(token: string): K {
    return this.map.get(token);
  }

  /**
   * @override
   */
  public contains(token: string) {
    return this.map.has(token);
  }

  /**
   * Sets mapping for a token.
   * @param {string} token The token to map.
   * @param {K} object The tokens value in the mapping's codomain.
   */
  public add(token: string, object: K) {
    this.map.set(token, object);
  }

  /**
   * Removes a token from the map
   * @param {string} token The token to remove
   */
  public remove(token: string) {
    this.map.delete(token);
  }

}


/**
 * Maps tokens that can all be parsed with the same method.
 *
 * @constructor
 * @extends {AbstractParseMap}
 */
export class CharacterMap extends AbstractParseMap<Token> {

  /**
   * @constructor
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mapping.
   * @param {JSON} json The JSON representation of the character mapping.
   */
  constructor(name: string, parser: ParseMethod,
              json: {[index: string]: string | [string, Attributes]}) {
    super(name, parser);
    for (const key of Object.keys(json)) {
      let value = json[key];
      let [char, attrs] = (typeof(value) === 'string') ? [value, null] : value;
      let character = new Token(key, char, attrs);
      this.add(key, character);
    }
  }

}


/**
 * Maps tokens that are delimiters, that are all parsed with the same method.
 *
 * @constructor
 * @extends {CharacterMap}
 */
export class DelimiterMap extends CharacterMap {

  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    return super.parse([env, '\\' + token]);
  }

}


/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {AbstractParseMap}
 */
export class MacroMap extends AbstractParseMap<Macro> {

  /**
   * @constructor
   * @param {string} name Name of the mapping.
   * @param {JSON} json The JSON representation of the macro map.
   * @param {Record<string, ParseMethod>} functionMap Collection of parse
   *     functions for the single macros.
   */
  constructor(name: string,
              json: {[index: string]: string | Args[]},
              functionMap: Record<string, ParseMethod>) {
    super(name, null);
    for (const key of Object.keys(json)) {
      let value = json[key];
      let [func, ...attrs] = (typeof(value) === 'string') ? [value] : value;
      let character = new Macro(key, functionMap[func as string], attrs);
      this.add(key, character);
    }
  }


  /**
   * @override
   */
  public parserFor(token: string) {
    let macro = this.lookup(token);
    return macro ? macro.func : null;
  }


  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    let macro = this.lookup(token);
    let parser = this.parserFor(token);
    if (!macro || !parser) {
      return null;
    }
    return parseResult(parser(env, macro.token, ...macro.args));
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
   * @override
   */
  public parse([env, token]: ParseInput) {
    let macro = this.lookup(token);
    let parser = this.parserFor(token);
    if (!macro || !parser) {
      return null;
    }
    let saveCommand = env.currentCS;
    env.currentCS = '\\' + token;
    let result = parser(env, '\\' + macro.token, ...macro.args);
    env.currentCS = saveCommand;
    return parseResult(result);
  }

}


/**
 * Maps macros for environments. It has a general parsing method for
 * environments, i.e., one that deals with begin/end, and each environment has
 * its own parsing method returning the content.
 *
 * @constructor
 * @extends {MacroMap}
 */
export class EnvironmentMap extends MacroMap {

  /**
   * @constructor
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the environments.
   * @param {JSON} json The JSON representation of the macro map.
   * @param {Record<string, ParseMethod>} functionMap Collection of parse
   *     functions for the single macros.
   */
  constructor(name: string,
              parser: ParseMethod,
              json: {[index: string]: string | Args[]},
              functionMap: Record<string, ParseMethod>) {
    super(name, json, functionMap);
    this.parser = parser;
  }


  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    let macro = this.lookup(token);
    let envParser = this.parserFor(token);
    if (!macro || !envParser) {
      return null;
    }
    return parseResult(this.parser(env, macro.token, envParser, macro.args));
  }

}
