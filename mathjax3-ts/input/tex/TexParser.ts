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

import {AbstractSymbolMap, SymbolMap} from './SymbolMap.js';
import MapHandler from './MapHandler.js';
import FallbackMethods from './FallbackMethods.js';
import {ParseInput, ParseResult, ParseMethod} from './Types.js';
import {HandlerType, Configuration, DefaultConfig} from './Configuration.js';
// From OLD Parser
import {TreeHelper} from './TreeHelper.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {StackItem, EnvList} from './StackItem.js';
import Stack from './Stack.js';
import {Symbol} from './Symbol.js';
import TexError from './TexError.js';
import {NewTex} from './Translate.js';
import StackItemFactory from './StackItemFactory.js';


/**
 * The main Tex Parser class.
 */
export default class TexParser {

  public macroCount: number = 0;
  public itemFactory = new StackItemFactory();
  
  private input: string = '';
  private remainder: string = '';
  private configurations: Map<HandlerType, SubHandler> = new Map();

  
  
  // From OLD Parser
  NBSP = '\u00A0'; 
  i: number = 0;
  stack: Stack;
  
  
  /**
   * @constructor
   */
  constructor(private _string: string, env: EnvList, config?: Configuration) {
    // TODO: Move this into a configuration object.
    this.configure(config || DefaultConfig);
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
   * The main parsing method.
   * @param {string} tex The TeX string.
   * @return {MmlNode} The parsing result.
   */
  // TODO (VS): This will eventually become the actual parsing method.
  public process(tex: string): void { }


  /**
   * Sets a new configuration for the map handler.
   * @param {Configuration} configuration A setting for the map handler.
   */
  public configure(config: Configuration): void {
    for (const key of Object.keys(config.handler)) {
      let name = key as HandlerType;
      let subHandler = new SubHandler(config.handler[name] || [],
                                      // TODO (VS): This needs to be cleaner.
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

  // From OLD Parser
  public Parse() {
    TreeHelper.printMethod('Parse (Old Parser Object)');
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
    TreeHelper.printMethod('Push (Old Parser Object)');
    this.stack.Push(arg);
  }

  public PushAll(args: (StackItem|MmlNode)[]) {
    TreeHelper.printMethod('PushAll (Old Parser Object)');
    for (let i = 0, m = args.length; i < m; i++) {
      this.stack.Push(args[i]);
    }
  }


  /**
   * @return {MmlNode} The internal Mathml structure. 
   */
  public mml(): MmlNode {
    TreeHelper.printMethod('mml (Old Parser Object)');
    if (!this.stack.Top().isKind('mml')) {
      return null;
    }
    let node = this.stack.Top().Top;
    // Makes sure TeXclasses are properly set, so none is null.
    node.setTeXclass(null);
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
    TreeHelper.printMethod('convertDelimiter (Old Parser Object)');
    const symbol = this.lookup('delimiter', c) as Symbol;
    return symbol ? symbol.char : null;
  }

  /**
   *  Trim spaces from a string
   */
  // static
  public trimSpaces(text: string): string {
    TreeHelper.printMethod('trimSpaces (Old Parser Object)');
    if (typeof(text) != 'string') {return text}
    let TEXT = text.replace(/^\s+|\s+$/g,'');
    if (TEXT.match(/\\$/) && text.match(/ $/)) TEXT += ' ';
    return TEXT;
  }

  /**
   *   Check if the next character is a space
   */
  public nextIsSpace() {
    TreeHelper.printMethod('nextIsSpace (Old Parser Object)');
    return this.string.charAt(this.i).match(/\s/);
  }

  
  /**
   *  Get the next non-space character
   */
  public GetNext(): string {
    TreeHelper.printMethod('GetNext (Old Parser Object)');
    while (this.nextIsSpace()) {this.i++}
    return this.string.charAt(this.i);
  }
  
  /**
   *  Get and return a control-sequence name
   */
  // TODO: The argument is given once in GetDelimiter, but never used!
  //       Check with Davide!
  public GetCS(name?: string) {
    TreeHelper.printMethod('GetCS (Old Parser Object)');
    let CS = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
    if (CS) {
      this.i += CS[1].length;
      return CS[1]
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
    TreeHelper.printMethod('GetArgument (Old Parser Object)');
    switch (this.GetNext()) {
    case '':
      if (!noneOK) {throw new TexError(['MissingArgFor','Missing argument for %1',name])}
      return null;
    case '}':
      if (!noneOK) {
        throw new TexError(['ExtraCloseMissingOpen',
                            'Extra close brace or missing open brace']);
      }
      return null;
    case '\\':
      this.i++; return '\\'+this.GetCS();
    case '{':
      let j = ++this.i, parens = 1;
      while (this.i < this.string.length) {
        switch (this.string.charAt(this.i++)) {
        case '\\':  this.i++; break;
        case '{':   parens++; break;
        case '}':
          if (--parens == 0) {return this.string.slice(j,this.i-1)}
          break;
        }
      }
      throw new TexError(['MissingCloseBrace','Missing close brace']);
    }        
    return this.string.charAt(this.i++);
  }

  
  /**
   *  Get an optional LaTeX argument in brackets
   */
  public GetBrackets(name: string, def?: string): string {
    TreeHelper.printMethod('GetBrackets (Old Parser Object)');
    if (this.GetNext() != '[') {return def};
    let j = ++this.i, parens = 0;
    while (this.i < this.string.length) {
      switch (this.string.charAt(this.i++)) {
      case '{':   parens++; break;
      case '\\':  this.i++; break;
      case '}':
        if (parens-- <= 0) {
          throw new TexError(['ExtraCloseLooking',
                              'Extra close brace while looking for %1','\']\'']);
        }
        break;   
      case ']':
        if (parens == 0) {
          return this.string.slice(j,this.i-1)
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
    TreeHelper.printMethod('GetDelimiter (Old Parser Object)');
    while (this.nextIsSpace()) {this.i++}
    let c = this.string.charAt(this.i); this.i++;
    if (this.i <= this.string.length) {
      if (c == '\\') {
        c += this.GetCS(name);
      } else if (c === '{' && braceOK) {
        this.i--;
        c = this.GetArgument(name);
      }
      if (this.contains('delimiter', c)) {
        return this.convertDelimiter(c);
      }
    }
    throw new TexError(['MissingOrUnrecognizedDelim',
                        'Missing or unrecognized delimiter for %1',name]);
  }

  /**
   *  Get a dimension (including its units).
   */
  public GetDimen(name: string) {
    TreeHelper.printMethod('GetDimen (Old Parser Object)');
    if (this.nextIsSpace()) {this.i++}
    if (this.string.charAt(this.i) == '{') {
      let dimen = this.GetArgument(name);
      if (dimen.match(/^\s*([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/))
      {return dimen.replace(/ /g,'').replace(/,/,'.')}
    } else {
      let dimen = this.string.slice(this.i);
      let match = dimen.match(/^\s*(([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);
      if (match) {
        this.i += match[0].length;
        return match[1].replace(/ /g,'').replace(/,/,'.');
      }
    }
    throw new TexError(['MissingDimOrUnits',
                        'Missing dimension or its units for %1',name]);
  }

  
  /**
   *  Get everything up to the given control sequence (token)
   */
  public GetUpTo(name: string, token: string) {
    TreeHelper.printMethod('GetUpTo (Old Parser Object)');
    while (this.nextIsSpace()) {this.i++}
    let j = this.i;
    let parens = 0;
    while (this.i < this.string.length) {
      let k = this.i;
      let c = this.string.charAt(this.i++);
      switch (c) {
      case '\\':  c += this.GetCS(); break;
      case '{':   parens++; break;
      case '}':
        if (parens == 0) {
          throw new TexError(['ExtraCloseLooking',
                              'Extra close brace while looking for %1',token])
        }
        parens--;
        break;
      }
      if (parens == 0 && c == token) {return this.string.slice(j,k)}
    }
    throw new TexError(['TokenNotFoundForCommand',
                        'Could not find %1 for %2',token,name]);
  }

  /**
   *  Parse various substrings
   */
  ParseArg(name: string) {
    TreeHelper.printMethod('ParseArg (Old Parser Object)');
    let object = new TexParser(this.GetArgument(name), this.stack.env);
    return object.mml();
  }

  ParseUpTo(name: string, token: string) {
    TreeHelper.printMethod('ParseUpTo (Old Parser Object)');
    return new TexParser(this.GetUpTo(name, token), this.stack.env).mml();
  }

  
  // AMS
  
  /**
   *  Get a delimiter or empty argument
   */
  public GetDelimiterArg(name: string) {
    TreeHelper.printMethod('AMS-GetDelimiterArg (Old Parser Object)');
    let c = this.trimSpaces(this.GetArgument(name));
    if (c == '') return null;
    if (this.contains('delimiter', c)) {
      return c;
    }
    // if (c in TEXDEF.delimiter) return c;
    throw new TexError(['MissingOrUnrecognizedDelim','Missing or unrecognized delimiter for %1',name]);
  }
  
  /**
   *  Get a star following a control sequence name, if any
   */
  public GetStar() {
    TreeHelper.printMethod('AMS-GetStar (Old Parser Object)');
    let star = (this.GetNext() === '*');
    if (star) {this.i++}
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
    // TODO: Can't be done with applicable due to delimiter parsing!
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


  // TODO: Turn this into a global warning and error functionality
  /**
   * Prints a warning message.
   * @param {string} message The warning.
   */
  private warn(message: string) {
    console.log('TexParser Warning: ' + message);
  }

}
