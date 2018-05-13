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

import FallbackMethods from './FallbackMethods.js';
import MapHandler from './MapHandler.js';
import ParseUtil from './ParseUtil.js';
import Stack from './Stack.js';
import StackItemFactory from './StackItemFactory.js';
import TexError from './TexError.js';
import {AbstractSymbolMap, SymbolMap} from './SymbolMap.js';
import {HandlerType, Configuration, DefaultConfig} from './Configuration.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {NewTex} from './Translate.js';
import {ParseInput, ParseResult, ParseMethod} from './Types.js';
import {StackItem, EnvList} from './StackItem.js';
import {Symbol} from './Symbol.js';


/**
 * The main Tex Parser class.
 */
export default class TexParser {

  /**
   * Counter for recursive macros.
   * @type {number}
   */
  public macroCount: number = 0;

  /**
   * The factory for stack items.
   * @type {StackItemFactory}
   */
  public itemFactory = new StackItemFactory();

  /**
   * The stack for items and created nodes.
   * @type {Stack}
   */
  public stack: Stack;

  /**
   * Current position in the string that is parsed.
   * @type {number}
   */
  public i: number = 0;

  private input: string = '';
  private remainder: string = '';
  private configurations: Map<HandlerType, SubHandler> = new Map();


  /**
   * @constructor
   * @param {string} _string The string to parse.
   * @param {EnvList} env The intial environment representing the current parse
   *     state of the overall expression translation.
   * @param {Configuration=} config A parser configuration.
   */
  constructor(private _string: string, env: EnvList, config?: Configuration) {
    this.configure(config);
    const inner = env.isInner as boolean;
    delete env.isInner;
    let ENV: EnvList;
    if (env) {
      ENV = {};
      for (let id in env) {
        if (env.hasOwnProperty(id)) {
          ENV[id] = env[id];
        }
      }
    }
    this.stack = new Stack(this.itemFactory, ENV, inner);
    this.Parse();
    this.Push(this.itemFactory.create('stop'));
  }


  set string(str: string) {
    this._string = str;
  }

  get string() {
    return this._string;
  }


  /**
   * Sets a new configuration for the map handler.
   * @param {Configuration} configuration A setting for the map handler.
   */
  public configure(config: Configuration): void {
    // TODO (VS):
    // * Defaults for configuration and fallback should be handled cleaner.
    // * Maybe move the subhandlers in with the maphandler.
    config = config || DefaultConfig;
    for (const key of Object.keys(config.handler)) {
      let name = key as HandlerType;
      let subHandler = new SubHandler(config.handler[name] || [],
                                      config.fallback[name] ||
                                      FallbackMethods.get(name));
      this.configurations.set(name, subHandler);
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
   * Adds an operator node to be cleaned up at the end of the translation of the
   * entire expression.
   *
   * @param {MmlMo} node The mo node.
   */
  public toClean(node: MmlMo) {
    NewTex.secondPass.push(node);
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

  public Parse() {
    let c, n;
    while (this.i < this.string.length) {
      c = this.string.charAt(this.i++); n = c.charCodeAt(0);
      if (n >= 0xD800 && n < 0xDC00) {
        c += this.string.charAt(this.i++);
      }
      this.parse('character', [this, c]);
    }
  }

  public Push(arg: StackItem|MmlNode) {
    this.stack.Push(arg);
  }

  public PushAll(args: (StackItem|MmlNode)[]) {
    for (let i = 0, m = args.length; i < m; i++) {
      this.stack.Push(args[i]);
    }
  }


  /**
   * @return {MmlNode} The internal Mathml structure.
   */
  public mml(): MmlNode {
    if (!this.stack.Top().isKind('mml')) {
      return null;
    }
    let node = this.stack.Top().Top;
    return node;
  }

  // VS: Forget this for now!
  public mmlToken(token: MmlNode): MmlNode {
    return token;
  } // used by boldsymbol extension


  /************************************************************************/
  /*
   *   String handling routines
   */

  /**
   *  Convert delimiter to character
   */
  public convertDelimiter(c: string): string {
    const symbol = this.lookup('delimiter', c) as Symbol;
    return symbol ? symbol.char : null;
  }

  /**
   *   Check if the next character is a space
   */
  public nextIsSpace() {
    return this.string.charAt(this.i).match(/\s/);
  }


  /**
   *  Get the next non-space character
   */
  public GetNext(): string {
    while (this.nextIsSpace()) {
      this.i++;
    }
    return this.string.charAt(this.i);
  }

  /**
   *  Get and return a control-sequence name
   */
  public GetCS() {
    let CS = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
    if (CS) {
      this.i += CS[1].length;
      return CS[1];
    } else {
      this.i++;
      return ' ';
    }
  }

  /**
   *  Get and return a TeX argument (either a single character or control sequence,
   *  or the contents of the next set of braces).
   */
  public GetArgument(name: string, noneOK?: boolean) {
    switch (this.GetNext()) {
    case '':
      if (!noneOK) {
        throw new TexError(['MissingArgFor', 'Missing argument for %1', name]);
      }
      return null;
    case '}':
      if (!noneOK) {
        throw new TexError(['ExtraCloseMissingOpen',
                            'Extra close brace or missing open brace']);
      }
      return null;
    case '\\':
      this.i++;
      return '\\' + this.GetCS();
    case '{':
      let j = ++this.i, parens = 1;
      while (this.i < this.string.length) {
        switch (this.string.charAt(this.i++)) {
        case '\\':  this.i++; break;
        case '{':   parens++; break;
        case '}':
          if (--parens === 0) {
            return this.string.slice(j, this.i - 1);
          }
          break;
        }
      }
      throw new TexError(['MissingCloseBrace', 'Missing close brace']);
    }
    return this.string.charAt(this.i++);
  }


  /**
   *  Get an optional LaTeX argument in brackets
   */
  public GetBrackets(name: string, def?: string): string {
    if (this.GetNext() !== '[') {
      return def;
    }
    let j = ++this.i, parens = 0;
    while (this.i < this.string.length) {
      switch (this.string.charAt(this.i++)) {
      case '{':   parens++; break;
      case '\\':  this.i++; break;
      case '}':
        if (parens-- <= 0) {
          throw new TexError(['ExtraCloseLooking',
                              'Extra close brace while looking for %1', '\']\'']);
        }
        break;
      case ']':
        if (parens === 0) {
          return this.string.slice(j, this.i - 1);
        }
        break;
      }
    }
    throw new TexError(['MissingCloseBracket',
                        'Could not find closing \']\' for argument to %1', name]);
  }

  /**
   *  Get the name of a delimiter (check it in the delimiter list).
   */
  public GetDelimiter(name: string, braceOK?: boolean) {
    while (this.nextIsSpace()) {
      this.i++;
    }
    let c = this.string.charAt(this.i); this.i++;
    if (this.i <= this.string.length) {
      if (c === '\\') {
        c += this.GetCS();
      } else if (c === '{' && braceOK) {
        this.i--;
        c = this.GetArgument(name);
      }
      if (this.contains('delimiter', c)) {
        return this.convertDelimiter(c);
      }
    }
    throw new TexError(['MissingOrUnrecognizedDelim',
                        'Missing or unrecognized delimiter for %1', name]);
  }

  /**
   *  Get a dimension (including its units).
   */
  public GetDimen(name: string) {
    if (this.nextIsSpace()) {
      this.i++;
    }
    if (this.string.charAt(this.i) === '{') {
      let dimen = this.GetArgument(name);
      if (ParseUtil.matchDimen(dimen)) {
        // @test Raise In Line, Lower 2, (Raise|Lower) Negative
        return dimen.replace(/ /g, '').replace(/,/, '.');
      }
    } else {
      // @test Above, Raise, Lower, Modulo, Above With Delims
      let dimen = this.string.slice(this.i);
      // let match = dimen.match(RegExp('^\\s*(' + num + '\\s*' + unit + ') ?'));
      let match = ParseUtil.matchDimen(dimen, true);
      if (match) {
        this.i += match[0].length;
        return match[1].replace(/ /g, '').replace(/,/, '.');
      }
    }
    throw new TexError(['MissingDimOrUnits',
                        'Missing dimension or its units for %1', name]);
  }


  /**
   *  Get everything up to the given control sequence (token)
   */
  public GetUpTo(name: string, token: string) {
    while (this.nextIsSpace()) {
      this.i++;
    }
    let j = this.i;
    let parens = 0;
    while (this.i < this.string.length) {
      let k = this.i;
      let c = this.string.charAt(this.i++);
      switch (c) {
      case '\\':  c += this.GetCS(); break;
      case '{':   parens++; break;
      case '}':
        if (parens === 0) {
          throw new TexError(['ExtraCloseLooking',
                              'Extra close brace while looking for %1', token]);
        }
        parens--;
        break;
      }
      if (parens === 0 && c === token) {
        return this.string.slice(j, k);
      }
    }
    throw new TexError(['TokenNotFoundForCommand',
                        'Could not find %1 for %2', token, name]);
  }

  /**
   *  Parse various substrings
   */
  public ParseArg(name: string) {
    let object = new TexParser(this.GetArgument(name), this.stack.env);
    return object.mml();
  }

  /**
   * Parses a given string up to a given token.
   * @param {string} name The string to parse.
   * @param {string} token A Token at which to end parsing.
   * @return {MmlNode} The parsed node.
   */
  public ParseUpTo(name: string, token: string) {
    return new TexParser(this.GetUpTo(name, token), this.stack.env).mml();
  }


  /**
   *  Get a delimiter or empty argument
   */
  public GetDelimiterArg(name: string) {
    let c = ParseUtil.trimSpaces(this.GetArgument(name));
    if (c === '') {
      return null;
    }
    if (this.contains('delimiter', c)) {
      return c;
    }
    throw new TexError(['MissingOrUnrecognizedDelim',
                        'Missing or unrecognized delimiter for %1', name]);
  }

  /**
   *  Get a star following a control sequence name, if any
   */
  public GetStar() {
    let star = (this.GetNext() === '*');
    if (star) {
      this.i++;
    }
    return star;
  }

}



/**
 * Class of symbol mappings that are active in a configuration.
 */
class SubHandler {

  private _configuration: SymbolMap[] = [];

  /**
   * @constructor
   * @param {Array.<string>} maps Names of the maps included in this
   *     configuration.
   */
  constructor(maps: string[], private _fallback: ParseMethod) {
    for (const name of maps) {
      this.add(name);
    }
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
    for (let map of this._configuration) {
      const result = map.parse(input);
      if (result) {
        return result;
      }
    }
    let [env, symbol] = input;
    this._fallback(env, symbol);
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
      .map(function(x: SymbolMap) {return x.name; })
      .join(', ');
  }


  /**
   * Retrieves the first applicable symbol map in the configuration.
   * @param {string} symbol The symbol to parse.
   * @return {SymbolMap} A map that can parse the symbol.
   */
  private applicable(symbol: string): SymbolMap {
    for (let map of this._configuration) {
      if (map.contains(symbol)) {
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
