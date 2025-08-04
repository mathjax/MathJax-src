/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file Token map classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {
  Attributes,
  Args,
  ParseMethod,
  ParseInput,
  ParseResult,
} from './Types.js';
import { Token, Macro } from './Token.js';
import { MapHandler } from './MapHandler.js';

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
   * @returns {string} The name of the map.
   */
  name: string;

  /**
   * @returns {ParseMethod} The default parsing method.
   */
  parser: ParseMethod;

  /**
   * @param {string} token A token to parse.
   * @returns {boolean} True if the token map applies to the token.
   */
  contains(token: string): boolean;

  /**
   * @param {string} token A token to parse.
   * @returns {ParseMethod} A parse method for the token.
   */
  parserFor(token: string): ParseMethod;

  /**
   * @param {ParseInput} arg The parse input as environment, token duple.
   * @returns {ParseResult} The parsed token and the rest of the string.
   */
  parse([env, token]: ParseInput): ParseResult;
}

/**
 * @param {ParseResult} result    The result to check
 * @returns {ParseResult}          True if result was void, result otherwise
 */
export function parseResult(result: ParseResult): ParseResult {
  return result === void 0 ? true : result;
}

/**
 * Abstract implementation of token maps.
 *
 * @template T
 */
export abstract class AbstractTokenMap<T> implements TokenMap {
  /**
   * @class
   * @implements {TokenMap}
   * @param {string} _name Name of the mapping.
   * @param {ParseMethod} _parser The parser for the mappiong.
   */
  constructor(
    private _name: string,
    private _parser: ParseMethod
  ) {
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
    const parser = this.parserFor(token);
    const mapped = this.lookup(token);
    return parser && mapped ? parseResult(parser(env, mapped as any)) : null;
  }

  public set parser(parser: ParseMethod) {
    this._parser = parser;
  }

  public get parser(): ParseMethod {
    return this._parser;
  }

  /**
   * @param {string} token
   * @returns {T}
   */
  public abstract lookup(token: string): T;
}

/**
 * Regular expressions used for parsing strings.
 */
export class RegExpMap extends AbstractTokenMap<string> {
  /**
   * @class
   * @augments {AbstractTokenMap}
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   * @param {RegExp} _regExp The regular expression.
   */
  constructor(
    name: string,
    parser: ParseMethod,
    private _regExp: RegExp
  ) {
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
 *
 * @class
 * @augments {AbstractTokenMap}
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
   *
   * @param {string} token The token to map.
   * @param {K} object The tokens value in the mapping's codomain.
   */
  public add(token: string, object: K) {
    this.map.set(token, object);
  }

  /**
   * Removes a token from the map
   *
   * @param {string} token The token to remove
   */
  public remove(token: string) {
    this.map.delete(token);
  }
}

/**
 * Maps tokens that can all be parsed with the same method.
 *
 * @class
 * @augments {AbstractParseMap}
 */
export class CharacterMap extends AbstractParseMap<Token> {
  /**
   * @class
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mapping.
   * @param {JSON} json The JSON representation of the character mapping.
   */
  constructor(
    name: string,
    parser: ParseMethod,
    json: { [index: string]: string | [string, Attributes] }
  ) {
    super(name, parser);
    for (const key of Object.keys(json)) {
      const value = json[key];
      const [char, attrs] = typeof value === 'string' ? [value, null] : value;
      const character = new Token(key, char, attrs);
      this.add(key, character);
    }
  }
}

/**
 * Maps tokens that are delimiters, that are all parsed with the same method.
 *
 * @class
 * @augments {CharacterMap}
 */
export class DelimiterMap extends CharacterMap {
  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    return super.parse([env, '\\' + token]);
  }
}

type ParseFunction = string | ParseMethod;

/**
 * Maps macros that all bring their own parsing method.
 *
 * @class
 * @augments {AbstractParseMap}
 */
export class MacroMap extends AbstractParseMap<Macro> {
  /**
   * @class
   * @param {string} name Name of the mapping.
   * @param {JSON} json The JSON representation of the macro map.
   * @param {{[key: string]: ParseMethod}} functionMap Optionally a collection
   *     of parse functions for the single macros. Kept for backward compatibility.
   */
  constructor(
    name: string,
    json: { [index: string]: ParseFunction | [ParseFunction, ...Args[]] },
    functionMap: { [key: string]: ParseMethod } = {}
  ) {
    super(name, null);
    const getMethod = (func: ParseFunction) =>
      typeof func === 'string' ? functionMap[func] : func;
    for (const [key, value] of Object.entries(json)) {
      let func: ParseFunction;
      let args: Args[];
      if (Array.isArray(value)) {
        func = getMethod(value[0]);
        args = value.slice(1) as Args[];
      } else {
        func = getMethod(value);
        args = [];
      }
      const character = new Macro(key, func, args);
      this.add(key, character);
    }
  }

  /**
   * @override
   */
  public parserFor(token: string) {
    const macro = this.lookup(token);
    return macro ? macro.func : null;
  }

  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    const macro = this.lookup(token);
    const parser = this.parserFor(token);
    if (!macro || !parser) {
      return null;
    }
    return parseResult(parser(env, macro.token, ...macro.args));
  }
}

/**
 * Maps macros that all bring their own parsing method.
 *
 * @class
 * @augments {MacroMap}
 */
export class CommandMap extends MacroMap {
  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    const macro = this.lookup(token);
    const parser = this.parserFor(token);
    if (!macro || !parser) {
      return null;
    }
    const saveCommand = env.currentCS;
    env.currentCS = '\\' + token;
    const result = parser(env, '\\' + macro.token, ...macro.args);
    env.currentCS = saveCommand;
    return parseResult(result);
  }
}

/**
 * Maps macros for environments. It has a general parsing method for
 * environments, i.e., one that deals with begin/end, and each environment has
 * its own parsing method returning the content.
 *
 * @class
 * @augments {MacroMap}
 */
export class EnvironmentMap extends MacroMap {
  /**
   * @class
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the environments.
   * @param {JSON} json The JSON representation of the macro map.
   * @param {{[key: string]: ParseMethod}} functionMap Optionally a collection
   *     of parse functions for the single macros. Kept for backward compatibility.
   */
  constructor(
    name: string,
    parser: ParseMethod,
    json: { [index: string]: ParseFunction | [ParseFunction, ...Args[]] },
    functionMap: { [key: string]: ParseMethod } = {}
  ) {
    super(name, json, functionMap);
    this.parser = parser;
  }

  /**
   * @override
   */
  public parse([env, token]: ParseInput) {
    const macro = this.lookup(token);
    const envParser = this.parserFor(token);
    if (!macro || !envParser) {
      return null;
    }
    return parseResult(this.parser(env, macro.token, envParser, macro.args));
  }
}
