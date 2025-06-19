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
 * @file The TexParser. Implements the basic parsing functionality and
 *     administers the global stack and tree objects.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType } from './HandlerTypes.js';
import { UnitUtil } from './UnitUtil.js';
import Stack from './Stack.js';
import StackItemFactory from './StackItemFactory.js';
import { Tags } from './Tags.js';
import TexError from './TexError.js';
import { MmlNode, AbstractMmlNode } from '../../core/MmlTree/MmlNode.js';
import { ParseInput, ParseResult } from './Types.js';
import ParseOptions from './ParseOptions.js';
import { BaseItem, StackItem, EnvList } from './StackItem.js';
import { Token } from './Token.js';
import { OptionList } from '../../util/Options.js';
import { TexConstant } from './TexConstants.js';

/**
 * The main Tex Parser class.
 */
export default class TexParser {
  /**
   * Counter for recursive macros.
   *
   * @type {number}
   */
  public macroCount: number = 0;

  /**
   * The stack for items and created nodes.
   *
   * @type {Stack}
   */
  public stack: Stack;

  /**
   * Current position in the string that is parsed.
   *
   * @type {number}
   */
  public i: number = 0;

  /**
   * The last command sequence
   *
   * @type {string}
   */
  public currentCS: string = '';

  /**
   * A stack to save the string positions when we restart the parser.
   */
  private saveI: number = 0;

  /**
   * @class
   * @param {string} _string The string to parse.
   * @param {EnvList} env The intial environment representing the current parse
   *     state of the overall expression translation.
   * @param {ParseOptions} configuration A parser configuration.
   */
  constructor(
    private _string: string,
    env: EnvList,
    public configuration: ParseOptions
  ) {
    const inner = Object.hasOwn(env, 'isInner');
    const isInner = env['isInner'] as boolean;
    delete env['isInner'];
    let ENV: EnvList;
    if (env) {
      ENV = {};
      for (const id of Object.keys(env)) {
        ENV[id] = env[id];
      }
    }
    this.configuration.pushParser(this);
    this.stack = new Stack(this.itemFactory, ENV, inner ? isInner : true);
    this.Parse();
    this.Push(this.itemFactory.create('stop'));
    this.updateResult(this.string, this.i);
    this.stack.env = ENV;
  }

  /**
   * @returns {OptionList} The configuration options.
   */
  get options(): OptionList {
    return this.configuration.options;
  }

  /**
   * @returns {StackItemFactory} The factory for stack items.
   */
  get itemFactory(): StackItemFactory {
    return this.configuration.itemFactory;
  }

  /**
   * @returns {Tags} The tags style of this configuration.
   */
  get tags(): Tags {
    return this.configuration.tags;
  }

  /**
   * Sets the string that should be parsed.
   *
   * @param {string} str The new string to parse.
   */
  set string(str: string) {
    this._string = str;
  }

  /**
   * @returns {string} The string that is currently parsed.
   */
  get string(): string {
    return this._string;
  }

  /**
   * Parses the input with the specified kind of map.
   *
   * @param {HandlerType} kind Configuration name.
   * @param {ParseInput} input Input to be parsed.
   * @returns {ParseResult} The output of the parsing function.
   */
  public parse(kind: HandlerType, input: ParseInput): ParseResult {
    const i = this.saveI;
    this.saveI = this.i;
    const result = this.configuration.handlers.get(kind).parse(input);
    this.updateResult(input[1], i);
    this.saveI = i;
    return result;
  }

  /**
   * Maps a token to its "parse value" if it exists.
   *
   * @param {HandlerType} kind Configuration name.
   * @param {string} token The token to parse.
   * @returns {any} A boolean, Character, or Macro.
   */
  public lookup(kind: HandlerType, token: string): any {
    return this.configuration.handlers.get(kind).lookup(token);
  }

  /**
   * Checks if a token is contained in one of the token mappings of the
   * specified kind.
   *
   * @param {HandlerType} kind Configuration name.
   * @param {string} token The token to parse.
   * @returns {boolean} True if the token is contained in the given types of
   *     token mapping.
   */
  public contains(kind: HandlerType, token: string): boolean {
    return this.configuration.handlers.get(kind).contains(token);
  }

  /**
   * @override
   */
  public toString(): string {
    let str = '';
    for (const config of Array.from(this.configuration.handlers.keys())) {
      str +=
        config +
        ': ' +
        this.configuration.handlers.get(config as HandlerType) +
        '\n';
    }
    return str;
  }

  /**
   * Parses the current input string.
   */
  public Parse() {
    let c: string;
    while (this.i < this.string.length) {
      c = this.getCodePoint();
      this.i += c.length;
      this.parse(HandlerType.CHARACTER, [this, c]);
    }
  }

  /**
   * Pushes a new item onto the stack. The item can also be a Mml node,
   * but if the mml item is an inferred row, push its children instead.
   *
   * @param {StackItem|MmlNode} arg The new item.
   */
  public Push(arg: StackItem | MmlNode) {
    if (arg instanceof BaseItem) {
      arg.startI = this.saveI;
      arg.stopI = this.i;
      arg.startStr = this.string;
    }
    if (arg instanceof AbstractMmlNode && arg.isInferred) {
      this.PushAll(arg.childNodes);
    } else {
      this.stack.Push(arg);
    }
  }

  /**
   * Pushes a list of new items onto the stack.
   *
   * @param {StackItem|MmlNode[]} args The new items.
   */
  public PushAll(args: (StackItem | MmlNode)[]) {
    for (const arg of args) {
      this.stack.Push(arg);
    }
  }

  /**
   * @returns {MmlNode} The internal Mathml structure.
   */
  public mml(): MmlNode {
    if (!this.stack.Top().isKind('mml')) {
      return null;
    }
    const node = this.stack.Top().First;
    this.configuration.popParser();
    node.attributes.set(TexConstant.Attr.LATEX, this.string);
    return node;
  }

  /************************************************************************
   *
   *   String handling routines
   */

  /**
   * Convert delimiter to character.
   *
   * @param {string} c The delimiter name.
   * @returns {string} The corresponding character.
   */
  public convertDelimiter(c: string): string {
    const token = this.lookup(HandlerType.DELIMITER, c) as Token;
    return token?.char ?? null;
  }

  /**
   * @returns {string}   Get the next unicode character in the string
   */
  public getCodePoint(): string {
    const code = this.string.codePointAt(this.i);
    return code === undefined ? '' : String.fromCodePoint(code);
  }

  /**
   * @returns {boolean} True if the next character to parse is a space.
   */
  public nextIsSpace(): boolean {
    return !!this.string.charAt(this.i).match(/\s/);
  }

  /**
   * @returns {string} Get the next non-space character.
   */
  public GetNext(): string {
    while (this.nextIsSpace()) {
      this.i++;
    }
    return this.getCodePoint();
  }

  /**
   * @returns {string} Get and return a control-sequence name
   */
  public GetCS(): string {
    const CS = this.string
      .slice(this.i)
      .match(/^(([a-z]+) ?|[\uD800-\uDBFF].|.)/i);
    if (CS) {
      this.i += CS[0].length;
      return CS[2] || CS[1];
    } else {
      this.i++;
      return ' ';
    }
  }

  /**
   * Get and return a TeX argument (either a single character or control
   * sequence, or the contents of the next set of braces).
   *
   * @param {string} _name Name of the current control sequence.
   * @param {boolean} noneOK True if no argument is OK.
   * @returns {string} The next argument.
   */
  public GetArgument(_name: string, noneOK: boolean = false): string {
    switch (this.GetNext()) {
      case '':
        if (!noneOK) {
          // @test MissingArgFor
          throw new TexError(
            'MissingArgFor',
            'Missing argument for %1',
            this.currentCS
          );
        }
        return null;
      case '}':
        if (!noneOK) {
          // @test ExtraCloseMissingOpen
          throw new TexError(
            'ExtraCloseMissingOpen',
            'Extra close brace or missing open brace'
          );
        }
        return null;
      case '\\':
        this.i++;
        return '\\' + this.GetCS();
      case '{': {
        const j = ++this.i;
        let parens = 1;
        while (this.i < this.string.length) {
          switch (this.string.charAt(this.i++)) {
            case '\\':
              this.i++;
              break;
            case '{':
              parens++;
              break;
            case '}':
              if (--parens === 0) {
                return this.string.slice(j, this.i - 1);
              }
              break;
          }
        }
        // @test MissingCloseBrace
        throw new TexError('MissingCloseBrace', 'Missing close brace');
      }
    }
    const c = this.getCodePoint();
    this.i += c.length;
    return c;
  }

  /**
   * Get an optional LaTeX argument in brackets.
   *
   * @param {string} _name Name of the current control sequence.
   * @param {string?} def The default value for the optional argument.
   * @param {boolean=} matchBrackets True if indernal brackets must match.
   * @returns {string} The optional argument.
   */
  public GetBrackets(
    _name: string,
    def?: string,
    matchBrackets: boolean = false
  ): string {
    if (this.GetNext() !== '[') {
      return def;
    }
    const j = ++this.i;
    let braces = 0;
    let brackets = 0;
    while (this.i < this.string.length) {
      switch (this.string.charAt(this.i++)) {
        case '{':
          braces++;
          break;
        case '\\':
          this.i++;
          break;
        case '}':
          if (braces-- <= 0) {
            // @test ExtraCloseLooking1
            throw new TexError(
              'ExtraCloseLooking',
              'Extra close brace while looking for %1',
              "']'"
            );
          }
          break;
        case '[':
          if (braces === 0) brackets++;
          break;
        case ']':
          if (braces === 0) {
            if (!matchBrackets || brackets === 0) {
              return this.string.slice(j, this.i - 1);
            }
            brackets--;
          }
          break;
      }
    }
    // @test MissingCloseBracket
    throw new TexError(
      'MissingCloseBracket',
      "Could not find closing ']' for argument to %1",
      this.currentCS
    );
  }

  /**
   *  Get the name of a delimiter (check it in the delimiter list).
   *
   * @param {string} name Name of the current control sequence.
   * @param {boolean=} braceOK Are braces around the delimiter OK.
   * @returns {string} The delimiter name.
   */
  public GetDelimiter(name: string, braceOK: boolean = false): string {
    let c = this.GetNext();
    this.i += c.length;
    if (this.i <= this.string.length) {
      if (c === '\\') {
        c += this.GetCS();
      } else if (c === '{' && braceOK) {
        this.i--;
        c = this.GetArgument(name).trim();
      }
      if (this.contains(HandlerType.DELIMITER, c)) {
        return this.convertDelimiter(c);
      }
    }
    // @test MissingOrUnrecognizedDelim1, MissingOrUnrecognizedDelim2
    throw new TexError(
      'MissingOrUnrecognizedDelim',
      'Missing or unrecognized delimiter for %1',
      this.currentCS
    );
  }

  /**
   * Get a dimension (including its units).
   *
   * @param {string} name Name of the current control sequence.
   * @returns {string} The dimension string.
   */
  public GetDimen(name: string): string {
    if (this.GetNext() === '{') {
      const dimen = this.GetArgument(name);
      const [value, unit] = UnitUtil.matchDimen(dimen);
      if (value) {
        // @test Raise In Line, Lower 2, (Raise|Lower) Negative
        return value + unit;
      }
    } else {
      // @test Above, Raise, Lower, Modulo, Above With Delims
      const dimen = this.string.slice(this.i);
      const [value, unit, length] = UnitUtil.matchDimen(dimen, true);
      if (value) {
        this.i += length;
        return value + unit;
      }
    }
    // @test MissingDimOrUnits
    throw new TexError(
      'MissingDimOrUnits',
      'Missing dimension or its units for %1',
      this.currentCS
    );
  }

  /**
   *  Get everything up to the given control sequence (token)
   *
   * @param {string} _name Name of the current control sequence.
   * @param {string} token The element until where to parse.
   * @returns {string} The text between the current position and the given token.
   */
  public GetUpTo(_name: string, token: string): string {
    while (this.nextIsSpace()) {
      this.i++;
    }
    const j = this.i;
    let braces = 0;
    while (this.i < this.string.length) {
      const k = this.i;
      let c = this.GetNext();
      this.i += c.length;
      switch (c) {
        case '\\':
          c += this.GetCS();
          break;
        case '{':
          braces++;
          break;
        case '}':
          if (braces === 0) {
            // @test ExtraCloseLooking2
            throw new TexError(
              'ExtraCloseLooking',
              'Extra close brace while looking for %1',
              token
            );
          }
          braces--;
          break;
      }
      if (braces === 0 && c === token) {
        return this.string.slice(j, k);
      }
    }
    // @test TokenNotFoundForCommand
    throw new TexError(
      'TokenNotFoundForCommand',
      'Could not find %1 for %2',
      token,
      this.currentCS
    );
  }

  /**
   * Parse the arguments of a control sequence in a new parser instance.
   *
   * @param {string} name Name of the current control sequence.
   * @returns {MmlNode} The parsed node.
   */
  public ParseArg(name: string): MmlNode {
    return new TexParser(
      this.GetArgument(name),
      this.stack.env,
      this.configuration
    ).mml();
  }

  /**
   * Parses a given string up to a given token in a new parser instance.
   *
   * @param {string} name Name of the current control sequence.
   * @param {string} token A Token at which to end parsing.
   * @returns {MmlNode} The parsed node.
   */
  public ParseUpTo(name: string, token: string): MmlNode {
    return new TexParser(
      this.GetUpTo(name, token),
      this.stack.env,
      this.configuration
    ).mml();
  }

  /**
   * Get a delimiter or empty argument
   *
   * @param {string} name Name of the current control sequence.
   * @returns {string} The delimiter.
   */
  public GetDelimiterArg(name: string): string {
    const c = UnitUtil.trimSpaces(this.GetArgument(name));
    if (c === '') {
      return null;
    }
    if (this.contains(HandlerType.DELIMITER, c)) {
      return c;
    }
    // @test MissingOrUnrecognizedDelim
    throw new TexError(
      'MissingOrUnrecognizedDelim',
      'Missing or unrecognized delimiter for %1',
      this.currentCS
    );
  }

  /**
   * @returns {boolean} True if a star follows the control sequence name.
   */
  public GetStar(): boolean {
    const star = this.GetNext() === '*';
    if (star) {
      this.i++;
    }
    return star;
  }

  /**
   * Convenience method to create nodes with the node factory of the current
   * configuration.
   *
   * @param {string} kind The kind of node to create.
   * @param {any[]} rest The remaining arguments for the creation method.
   * @returns {MmlNode} The newly created node.
   */
  public create(kind: string, ...rest: any[]): MmlNode {
    const node = this.configuration.nodeFactory.create(kind, ...rest);
    if (node.isToken && node.attributes.hasExplicit('mathvariant')) {
      if ((node.attributes.get('mathvariant') as string).charAt(0) === '-') {
        node.setProperty('ignore-variant', true);
      }
    }
    return node;
  }

  /**
   * Finalizes the LaTeX for the topmost Mml element on the stack after parsing
   * has been completed.
   *
   * @param {string} input The LaTeX input string for the parser.
   * @param {number} old The last parsing position.
   */
  // Currently works without translating environments that generate typesetting.
  private updateResult(input: string, old: number) {
    const node = this.stack.Prev(true) as MmlNode;
    if (!node) {
      return;
    }
    // TODO: This can probably be removed once processed. But needs more
    // testing.
    const existing = node.attributes.get(TexConstant.Attr.LATEXITEM);
    if (existing !== undefined) {
      node.attributes.set(TexConstant.Attr.LATEX, existing);
      return;
    }
    old = old < this.saveI ? this.saveI : old;
    let str = old !== this.i ? this.string.slice(old, this.i) : input;
    str = str.trim();
    if (!str) {
      return;
    }
    if (input === '\\') {
      str = '\\' + str;
    }
    // These are the cases to handle sub and superscripts.
    if (
      node.attributes.get(TexConstant.Attr.LATEX) === '^' &&
      str !== '^' &&
      str !== '\\^'
    ) {
      if (node.childNodes[2]) {
        if (str === '}') {
          this.composeBraces(node.childNodes[2]);
        } else {
          node.childNodes[2].attributes.set(TexConstant.Attr.LATEX, str);
        }
      }
      if (node.childNodes[1]) {
        const sub = node.childNodes[1].attributes.get(TexConstant.Attr.LATEX);
        this.composeLatex(node, `_${sub}^`, 0, 2);
      } else {
        this.composeLatex(node, '^', 0, 2);
      }
      return;
    }
    if (
      node.attributes.get(TexConstant.Attr.LATEX) === '_' &&
      str !== '_' &&
      str !== '\\_'
    ) {
      if (node.childNodes[1]) {
        if (str === '}') {
          this.composeBraces(node.childNodes[1]);
        } else {
          node.childNodes[1].attributes.set(TexConstant.Attr.LATEX, str);
        }
      }
      if (node.childNodes[2]) {
        const sub = node.childNodes[2].attributes.get(TexConstant.Attr.LATEX);
        this.composeLatex(node, `^${sub}_`, 0, 1);
      } else {
        this.composeLatex(node, '_', 0, 1);
      }
      return;
    }
    if (str === '}') {
      this.composeBraces(node);
      return;
    }
    node.attributes.set(TexConstant.Attr.LATEX, str);
  }

  /**
   * Composing the LaTeX expression for sub or superscript elements.
   *
   * @param {MmlNode} node The Mml node.
   * @param {string} comp Intermediate string.
   * @param {number} pos1 Position of child for lefthand side of string.
   * @param {number} pos2 Position of child for righthand side of string.
   */
  private composeLatex(
    node: MmlNode,
    comp: string,
    pos1: number,
    pos2: number
  ) {
    if (!node.childNodes[pos1] || !node.childNodes[pos2]) return;
    const expr =
      (node.childNodes[pos1].attributes.get(TexConstant.Attr.LATEX) || '') +
      comp +
      node.childNodes[pos2].attributes.get(TexConstant.Attr.LATEX);
    node.attributes.set(TexConstant.Attr.LATEX, expr);
  }

  /**
   * Adds the LaTeX content for this node as a braced expression.
   *
   * @param {MmlNode} atom The current Mml node.
   */
  private composeBraces(atom: MmlNode) {
    const str = this.composeBracedContent(atom);
    atom.attributes.set(TexConstant.Attr.LATEX, `{${str}}`);
  }

  /**
   * Composes the content of a braced expression.
   *
   * @param {MmlNode} atom The current Mml node.
   *
   * @returns {string} The braced expression.
   */
  private composeBracedContent(atom: MmlNode): string {
    const children = atom.childNodes[0]?.childNodes || [];
    let expr = '';
    for (const child of children) {
      const att = (child?.attributes?.get(TexConstant.Attr.LATEX) ||
        '') as string;
      if (!att) continue;
      expr +=
        expr && expr.match(/[a-zA-Z]$/) && att.match(/^[a-zA-Z]/)
          ? ' ' + att
          : att;
    }
    return expr;
  }
}
