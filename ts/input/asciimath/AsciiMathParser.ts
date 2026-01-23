/*************************************************************
 *
 *  Copyright (c) 2025 The MathJax Consortium
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
 * @fileThe AsciiMath Parser. Implements the basic parsing functionality.
 *
 * @author mathjax@mathjax.org (MathJax Consortium)
 */

import ParseOptions from './ParseOptions.js';
import NodeUtil from './NodeUtil.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import {
  Symbol,
  TokenType,
  AMsymbols,
  AMquote,
} from './AsciiMathSymbols.js';

/**
 * Parse result tuple [node, remaining string]
 */
type ParseResult = [MmlNode | null, string];

/**
 * The main AsciiMath Parser class.
 */
export default class AsciiMathParser {
  /**
   * Current nesting depth for tracking brackets
   *
   * @type {number}
   */
  private nestingDepth: number = 0;

  /**
   * Previous symbol type
   *
   * @type {TokenType}
   */
  private previousSymbol: TokenType;

  /**
   * Current symbol type
   *
   * @type {TokenType}
   */
  private currentSymbol: TokenType;

  /**
   * Sorted array of symbol names for binary search
   *
   * @type {string[]}
   */
  private symbolNames: string[] = [];

  /**
   * Symbol table including TeX aliases
   *
   * @type {Symbol[]}
   */
  private symbols: Symbol[] = [];

  /**
   * Decimal sign character
   *
   * @type {string}
   */
  private decimalsign: string = '.';

  /**
   * Display style (for limits)
   *
   * @type {boolean}
   */
  private displaystyle: boolean = true;


  /**
   * @constructor
   * @param {string} _string The string to parse.
   * @param {ParseOptions} configuration A parser configuration.
   */
  constructor(
    private _string: string,
    public configuration: ParseOptions
  ) {
    this.decimalsign = configuration.options.decimalsign;
    this.displaystyle = configuration.options.displaystyle;
    this.initSymbols();
  }

  private TokenTypeMap: Record<string, TokenType> = {
    CONST: TokenType.CONST,
    UNARY: TokenType.UNARY,
    BINARY: TokenType.BINARY,
    INFIX: TokenType.INFIX,
    LEFTBRACKET: TokenType.LEFTBRACKET,
    RIGHTBRACKET: TokenType.RIGHTBRACKET,
    SPACE: TokenType.SPACE,
    UNDEROVER: TokenType.UNDEROVER,
    DEFINITION: TokenType.DEFINITION,
    LEFTRIGHT: TokenType.LEFTRIGHT,
    TEXT: TokenType.TEXT,
    UNARYUNDEROVER: TokenType.UNARYUNDEROVER
  };

  /**
   * Initialize the symbol table
   */
  private initSymbols() {
    // Copy base symbols
    this.symbols = [...AMsymbols];

    if (this.configuration.options.additionalSymbols) {
      for (const sym of this.configuration.options.additionalSymbols) {
        const ttypeUpper = sym.ttype?.toUpperCase();
        if (ttypeUpper && (ttypeUpper in this.TokenTypeMap) && sym.input && sym.tag && sym.output) {
          this.symbols.push({
            ...sym,
            ttype: this.TokenTypeMap[ttypeUpper],
            tex: sym.tex ?? null,
          });
        }
      }
    }

    // Add TeX aliases
    const symlen = this.symbols.length;
    for (let i = 0; i < symlen; i++) {
      if (this.symbols[i].tex) {
        this.symbols.push({
          input: this.symbols[i].tex,
          tag: this.symbols[i].tag,
          output: this.symbols[i].output,
          tex: null,
          ttype: this.symbols[i].ttype,
          acc: this.symbols[i].acc || false,
        });
      }
    }

    this.refreshSymbols();
  }

  /**
   * Refresh the symbol name list (sort and extract names)
   */
  private refreshSymbols() {
    this.symbols.sort((a, b) => (a.input > b.input ? 1 : -1));
    this.symbolNames = this.symbols.map((s) => s.input);
  }

  /**
   * Remove n characters and any following blanks from the string
   *
   * @param {string} str The string to process
   * @param {number} n Number of characters to remove
   * @returns {string} The processed string
   */
  private removeCharsAndBlanks(str: string, n: number): string {
    let st: string;
    if (str.charAt(n) === '\\' && str.charAt(n + 1) !== '\\' && str.charAt(n + 1) !== ' ') {
      st = str.slice(n + 1);
    } else {
      st = str.slice(n);
    }
    let i = 0;
    while (i < st.length && st.charCodeAt(i) <= 32) {
      i++;
    }
    return st.slice(i);
  }

  /**
   * Binary search for position where str appears or would be inserted
   *
   * @param {string[]} arr Sorted array
   * @param {string} str String to find
   * @param {number} n Starting position
   * @returns {number} Position index
   */
  private position(arr: string[], str: string, n: number): number {
    if (n === 0) {
      let h: number;
      let m: number;
      n = -1;
      h = arr.length;
      while (n + 1 < h) {
        m = (n + h) >> 1;
        if (arr[m] < str) {
          n = m;
        } else {
          h = m;
        }
      }
      return h;
    } else {
      let i: number;
      for (i = n; i < arr.length && arr[i] < str; i++);
      return i;
    }
  }

  /**
   * Get the maximal initial substring of str that appears in symbol names
   *
   * @param {string} str Input string
   * @returns {Symbol | null} The matched symbol or null
   */
  private getSymbol(str: string): Symbol | null {
    let k = 0;
    let j = 0;
    let mk: number;
    let st: string;
    let tagst: string;
    let match = '';
    let more = true;

    for (let i = 1; i <= str.length && more; i++) {
      st = str.slice(0, i);
      j = k;
      k = this.position(this.symbolNames, st, j);
      if (
        k < this.symbolNames.length &&
        str.slice(0, this.symbolNames[k].length) === this.symbolNames[k]
      ) {
        match = this.symbolNames[k];
        mk = k;
        i = match.length;
      }
      more =
        k < this.symbolNames.length &&
        str.slice(0, this.symbolNames[k].length) >= this.symbolNames[k];
    }

    this.previousSymbol = this.currentSymbol;
    if (match !== '') {
      this.currentSymbol = this.symbols[mk].ttype;
      return this.symbols[mk];
    }

    // Check for number
    this.currentSymbol = TokenType.CONST;
    k = 1;
    st = str.slice(0, 1);
    let integ = true;
    while ('0' <= st && st <= '9' && k <= str.length) {
      st = str.slice(k, k + 1);
      k++;
    }
    if (st === this.decimalsign) {
      st = str.slice(k, k + 1);
      if ('0' <= st && st <= '9') {
        integ = false;
        k++;
        while ('0' <= st && st <= '9' && k <= str.length) {
          st = str.slice(k, k + 1);
          k++;
        }
      }
    }
    if ((integ && k > 1) || k > 2) {
      st = str.slice(0, k - 1);
      tagst = 'mn';
    } else {
      k = 2;
      st = str.slice(0, 1);
      tagst = 'A' > st || st > 'Z' ? ('a' > st || st > 'z' ? 'mo' : 'mi') : 'mi';
    }

    // Handle minus sign
    if (
      st === '-' &&
      str.charAt(1) !== ' ' &&
      this.previousSymbol === TokenType.INFIX
    ) {
      this.currentSymbol = TokenType.INFIX;
      return { input: st, tag: tagst, output: st, tex: null, ttype: TokenType.UNARY, func: true };
    }

    return { input: st, tag: tagst, output: st, tex: null, ttype: TokenType.CONST };
  }

  /**
   * Append, unwrapping if needed
   * Since MmlNodes don't have document fragments,
   * we'll treat inferredMrow as a fragment here, so 
   * its children get appended instead of the inferredMrow itself.
   *
   * @param {MmlNode} toappend The node to append
   * @param {MmlNode} node The node to append to
   */
  private appendUnwrap(toappend: MmlNode, node: MmlNode) {
    if (toappend.kind === 'inferredMrow') { // 
      for (const child of toappend.childNodes) {
        node.appendChild(child);
      }
    } else {
      node.appendChild(toappend);
    }
  }

  /**
   * Parse a simple expression
   *
   * @param {string} str The string to parse
   * @returns {ParseResult} [node, remaining string]
   */
  private parseSexpr(str: string): ParseResult {
    let symbol: Symbol;
    let node: MmlNode;
    let result: ParseResult;
    let result2: ParseResult;
    let i: number;
    let st: string;
    let newFrag: MmlNode;

    str = this.removeCharsAndBlanks(str, 0);
    symbol = this.getSymbol(str);

    if (
      symbol == null ||
      (symbol.ttype === TokenType.RIGHTBRACKET && this.nestingDepth > 0)
    ) {
      return [null, str];
    }

    if (symbol.ttype === TokenType.DEFINITION) {
      str = symbol.output + this.removeCharsAndBlanks(str, symbol.input.length);
      symbol = this.getSymbol(str);
    }

    switch (symbol.ttype) {
      case TokenType.UNDEROVER:
      case TokenType.CONST:
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        node = this.configuration.create(symbol.tag);
        node.appendChild(this.configuration.createText(symbol.output));
        return [node, str];

      case TokenType.LEFTBRACKET:
        this.nestingDepth++;
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        result = this.parseExpr(str, true);
        this.nestingDepth--;
        if (symbol.invisible) {
          node = this.configuration.create('mrow');
          if (result[0]) {
            this.appendUnwrap(result[0], node);
          }
        } else {
          const mo = this.configuration.create('mo');
          mo.appendChild(this.configuration.createText(symbol.output));
          node = this.configuration.create('mrow');
          node.appendChild(mo);
          if (result[0]) {
            this.appendUnwrap(result[0], node);
          }
        }
        return [node, result[1]];

      case TokenType.TEXT:
        if (symbol !== AMquote) {
          str = this.removeCharsAndBlanks(str, symbol.input.length);
        }
        if (str.charAt(0) === '{') {
          i = str.indexOf('}');
        } else if (str.charAt(0) === '(') {
          i = str.indexOf(')');
        } else if (str.charAt(0) === '[') {
          i = str.indexOf(']');
        } else if (symbol === AMquote) {
          i = str.slice(1).indexOf('"') + 1;
        } else {
          i = 0;
        }
        if (i === -1) i = str.length;
        st = str.slice(1, i);

        node = this.configuration.create('mrow');
        if (st.charAt(0) === ' ') {
          const mspace = this.configuration.create('mspace');
          NodeUtil.setAttribute(mspace, 'width', '1ex');
          node.appendChild(mspace);
        }
        const mtext = this.configuration.create(symbol.tag);
        mtext.appendChild(this.configuration.createText(st));
        node.appendChild(mtext);
        if (st.charAt(st.length - 1) === ' ') {
          const mspace = this.configuration.create('mspace');
          NodeUtil.setAttribute(mspace, 'width', '1ex');
          node.appendChild(mspace);
        }
        str = this.removeCharsAndBlanks(str, i + 1);
        return [node, str];

      case TokenType.UNARYUNDEROVER:
      case TokenType.UNARY:
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        result = this.parseSexpr(str);
        if (result[0] == null) {
          if (symbol.tag=="mi" || symbol.tag=="mo") {
            node = this.configuration.create(symbol.tag);
            node.appendChild(this.configuration.createText(symbol.output));
            return [node, str];
          } else {
            result[0] = this.configuration.create('mi');
          }
        }

        if (symbol.func) {
          st = str.charAt(0);
          if (
            st === '^' ||
            st === '_' ||
            st === '/' ||
            st === '|' ||
            st === ',' ||
            (symbol.input.length === 1 &&
              symbol.input.match(/\w/) &&
              st !== '(')
          ) {
            node = this.configuration.create(symbol.tag);
            node.appendChild(this.configuration.createText(symbol.output));
            return [node, str];
          } else {
            const mo = this.configuration.create(symbol.tag);
            mo.appendChild(this.configuration.createText(symbol.output));
            node = this.configuration.create('mrow');
            node.appendChild(mo);
            this.appendUnwrap(result[0], node);
            return [node, result[1]];
          }
        }

        NodeUtil.removeBrackets(result[0]);

        if (symbol.input === 'sqrt') {
          node = this.configuration.create(symbol.tag);
          this.appendUnwrap(result[0], node);
          return [node, result[1]];
        } else if (symbol.rewriteleftright) {
          const mo1 = this.configuration.create('mo');
          mo1.appendChild(
            this.configuration.createText(symbol.rewriteleftright[0])
          );
          const mo2 = this.configuration.create('mo');
          mo2.appendChild(
            this.configuration.createText(symbol.rewriteleftright[1])
          );
          node = this.configuration.create('mrow');
          node.appendChild(mo1);
          this.appendUnwrap(result[0], node);
          node.appendChild(mo2);
          return [node, result[1]];
        } else if (symbol.input === 'cancel') {
          node = this.configuration.create(symbol.tag);
          this.appendUnwrap(result[0], node);
          NodeUtil.setAttribute(node, 'notation', 'updiagonalstrike');
          return [node, result[1]];
        } else if (symbol.acc) {
          node = this.configuration.create(symbol.tag);
          this.appendUnwrap(result[0], node);
          const accnode = this.configuration.create('mo');
          accnode.appendChild(this.configuration.createText(symbol.output));
          if (symbol.tag == 'mover' && symbol.ttype === TokenType.UNARY) {
            NodeUtil.setAttribute(accnode, 'accent', 'true');
          } else if (symbol.tag == 'munder' && symbol.ttype === TokenType.UNARY) {
            NodeUtil.setAttribute(accnode, 'accentunder', 'true');
          }
          NodeUtil.setAttribute(accnode, 'stretchy', 'true');
          node.appendChild(accnode);
          return [node, result[1]];
        } else {
          // Font change command
          if (symbol.codes) {
            for (i = 0; i < result[0].childNodes.length; i++) {
              const child = result[0].childNodes[i];
              if (child.kind === 'mi' || result[0].kind === 'mi') {
                const textNode =
                  result[0].kind === 'mi'
                    ? result[0].childNodes[0]
                    : child.childNodes[0];
                if (textNode && (textNode as any).text) {
                  st = (textNode as any).text;
                  let newst = '';
                  for (let j = 0; j < st.length; j++) {
                    const code = st.charCodeAt(j);
                    if (code > 64 && code < 91) {
                      newst += symbol.codes[code - 65];
                    } else if (code > 96 && code < 123) {
                      newst += symbol.codes[code - 71];
                    } else {
                      newst += st.charAt(j);
                    }
                  }
                  const newNode = this.configuration.create('mo');
                  newNode.appendChild(this.configuration.createText(newst));
                  if (result[0].kind === 'mi') {
                    result[0] = newNode;
                  } else {
                    result[0].childNodes[i] = newNode;
                  }
                }
              }
            }
          }
          node = this.configuration.create(symbol.tag);
          this.appendUnwrap(result[0], node);
          if (symbol.atname && symbol.atval) {
            NodeUtil.setAttribute(node, symbol.atname, symbol.atval);
          }
          return [node, result[1]];
        }

      case TokenType.BINARY:
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        result = this.parseSexpr(str);
        if (result[0] == null) {
          node = this.configuration.create('mo');
          node.appendChild(this.configuration.createText(symbol.input));
          return [node, str];
        }
        NodeUtil.removeBrackets(result[0]);

        result2 = this.parseSexpr(result[1]);
        if (result2[0] == null) {
          node = this.configuration.create('mo');
          node.appendChild(this.configuration.createText(symbol.input));
          return [node, str];
        }
        NodeUtil.removeBrackets(result2[0]);

        if (['color', 'class', 'id'].indexOf(symbol.input) >= 0) {
          if (str.charAt(0) === '{') {
            i = str.indexOf('}');
          } else if (str.charAt(0) === '(') {
            i = str.indexOf(')');
          } else if (str.charAt(0) === '[') {
            i = str.indexOf(']');
          }
          st = str.slice(1, i);

          node = this.configuration.create(symbol.tag);
          this.appendUnwrap(result2[0], node);
          if (symbol.input === 'color') {
            NodeUtil.setAttribute(node, 'mathcolor', st);
          } else if (symbol.input === 'class') {
            NodeUtil.setAttribute(node, 'class', st);
          } else if (symbol.input === 'id') {
            NodeUtil.setAttribute(node, 'id', st);
          }
          return [node, result2[1]];
        }

        newFrag = this.configuration.create('inferredMrow');
        if (symbol.input === 'root' || symbol.output === 'stackrel') {
          newFrag.appendChild(result2[0]);
        }
        this.appendUnwrap(result[0], newFrag);
        if (symbol.input === 'frac') {
          this.appendUnwrap(result2[0], newFrag);
        }

        node = this.configuration.create(symbol.tag);
        this.appendUnwrap(newFrag, node);
        return [node, result2[1]];

      case TokenType.INFIX:
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        node = this.configuration.create('mo');
        node.appendChild(this.configuration.createText(symbol.output));
        return [node, str];

      case TokenType.SPACE:
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        node = this.configuration.create('mrow');

        const mspace1 = this.configuration.create('mspace');
        NodeUtil.setAttribute(mspace1, 'width', '1ex');
        node.appendChild(mspace1);

        const mtext2 = this.configuration.create(symbol.tag);
        mtext2.appendChild(this.configuration.createText(symbol.output));
        node.appendChild(mtext2);

        const mspace2 = this.configuration.create('mspace');
        NodeUtil.setAttribute(mspace2, 'width', '1ex');
        node.appendChild(mspace2);

        return [node, str];

      case TokenType.LEFTRIGHT:
        this.nestingDepth++;
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        result = this.parseExpr(str, false);
        this.nestingDepth--;

        st = '';
        if (
          result[0] &&
          result[0].childNodes.length > 0 &&
          result[0].childNodes[result[0].childNodes.length - 1]
        ) {
          const lastChild =
            result[0].childNodes[result[0].childNodes.length - 1];
          if (
            lastChild.kind === 'mo' &&
            lastChild.childNodes[0] &&
            (lastChild.childNodes[0] as any).text
          ) {
            st = (lastChild.childNodes[0] as any).text;
          }
        }

        if (st === '|' && str.charAt(0) !== ',') { // its an absolute value subterm
          const mo = this.configuration.create('mo');
          mo.appendChild(this.configuration.createText(symbol.output));
          node = this.configuration.create('mrow');
          node.appendChild(mo);
          this.appendUnwrap(result[0], node);
          return [node, result[1]];
        } else { // the "|" is a \mid so use unicode 2223 (divides) for spacing
          const mo = this.configuration.create('mo');
          mo.appendChild(this.configuration.createText('\u2223'));
          node = this.configuration.create('mrow');
          node.appendChild(mo);
          return [node, str];
        }

      default:
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        node = this.configuration.create(symbol.tag);
        node.appendChild(this.configuration.createText(symbol.output));
        return [node, str];
    }
  }

  /**
   * Parse an intermediate expression (handles subscripts and superscripts)
   *
   * @param {string} str The string to parse
   * @returns {ParseResult} [node, remaining string]
   */
  private parseIexpr(str: string): ParseResult {
    let symbol: Symbol;
    let sym1: Symbol;
    let sym2: Symbol;
    let node: MmlNode;
    let result: ParseResult;
    let underover: boolean;

    str = this.removeCharsAndBlanks(str, 0);
    sym1 = this.getSymbol(str);
    result = this.parseSexpr(str);
    node = result[0];
    str = result[1];
    symbol = this.getSymbol(str);

    if (symbol.ttype === TokenType.INFIX && symbol.input !== '/') {
      str = this.removeCharsAndBlanks(str, symbol.input.length);
      result = this.parseSexpr(str);
      if (result[0] == null) {
        const box = this.configuration.create('mo');
        box.appendChild(this.configuration.createText('\u25A1'));
        result[0] = box;
      } else {
        NodeUtil.removeBrackets(result[0]);
      }
      str = result[1];

      underover =
        sym1.ttype === TokenType.UNDEROVER ||
        sym1.ttype === TokenType.UNARYUNDEROVER;

      if (symbol.input === '_') {
        sym2 = this.getSymbol(str);
        if (sym2.input === '^') {
          str = this.removeCharsAndBlanks(str, sym2.input.length);
          const res2 = this.parseSexpr(str);
          NodeUtil.removeBrackets(res2[0]);
          str = res2[1];
          const tag = underover ? 'munderover' : 'msubsup';
          const lastnode = node;
          node = this.configuration.create(tag);
          this.appendUnwrap(lastnode, node);
          this.appendUnwrap(result[0], node);
          this.appendUnwrap(res2[0], node);
          const mrow = this.configuration.create('mrow');
          mrow.appendChild(node);
          node = mrow;
        } else {
          const tag = underover ? 'munder' : 'msub';
          const lastnode = node;
          node = this.configuration.create(tag);
          this.appendUnwrap(lastnode, node);
          this.appendUnwrap(result[0], node);
        }
      } else if (symbol.input === '^' && underover) {
        const lastnode = node;
        node = this.configuration.create('mover');
        this.appendUnwrap(lastnode, node);
        this.appendUnwrap(result[0], node);
      } else {
        const lastnode = node;
        node = this.configuration.create(symbol.tag);
        this.appendUnwrap(lastnode, node);
        this.appendUnwrap(result[0], node);
      }

      if (sym1.func) {
        sym2 = this.getSymbol(str);
        if (
          sym2.ttype !== TokenType.INFIX &&
          sym2.ttype !== TokenType.RIGHTBRACKET &&
          (sym1.input.length > 1 || sym2.ttype === TokenType.LEFTBRACKET)
        ) {
          result = this.parseIexpr(str);
          const mrow = this.configuration.create('mrow');
          this.appendUnwrap(node, mrow);
          this.appendUnwrap(result[0], mrow);
          node = mrow;
          str = result[1];
        }
      }
    }

    return [node, str];
  }
  /**
   * Parse a full expression
   *
   * @param {string} str The string to parse
   * @param {boolean} rightbracket Whether we're inside brackets
   * @returns {ParseResult} [node, remaining string]
   */
  private parseExpr(str: string, rightbracket: boolean): ParseResult {
    let symbol: Symbol;
    let node: MmlNode;
    let result: ParseResult;
    const newFrag = this.configuration.create('inferredMrow');

    do {
      str = this.removeCharsAndBlanks(str, 0);
      result = this.parseIexpr(str);
      node = result[0];
      str = result[1];
      symbol = this.getSymbol(str);

      if (symbol.ttype === TokenType.INFIX && symbol.input === '/') {
        str = this.removeCharsAndBlanks(str, symbol.input.length);
        result = this.parseIexpr(str);
        if (result[0] == null) {
          const box = this.configuration.create('mo');
          box.appendChild(this.configuration.createText('\u25A1'));
          result[0] = box;
        } else {
          NodeUtil.removeBrackets(result[0]);
        }
        str = result[1];
        NodeUtil.removeBrackets(node);
        const frac = this.configuration.create(symbol.tag);
        this.appendUnwrap(node, frac);
        this.appendUnwrap(result[0], frac);
        newFrag.appendChild(frac);
        symbol = this.getSymbol(str);
      } else if (node != null) {
        this.appendUnwrap(node, newFrag);
      }
    } while (
      ((symbol.ttype !== TokenType.RIGHTBRACKET &&
        (symbol.ttype !== TokenType.LEFTRIGHT || rightbracket)) ||
        this.nestingDepth === 0) &&
      symbol != null &&
      symbol.output !== ''
    );

    if (
      symbol.ttype === TokenType.RIGHTBRACKET ||
      symbol.ttype === TokenType.LEFTRIGHT
    ) {
      // Matrix detection logic
      const len = newFrag.childNodes.length;
      if (
        len > 0 &&
        newFrag.childNodes[len - 1].kind === 'mrow' &&
        newFrag.childNodes[len - 1].childNodes.length > 0
      ) {
        const lastMrow = newFrag.childNodes[len - 1];
        const lastChild = lastMrow.childNodes[lastMrow.childNodes.length - 1];
        const firstChild = lastMrow.childNodes[0];
        if (
          lastChild &&
          lastChild.childNodes.length > 0 &&
          firstChild &&
          firstChild.childNodes.length > 0
        ) {
          const right = (lastChild.childNodes[0] as any).text;
          const left = (firstChild.childNodes[0] as any).text;
          if (
            right === ')' || right === ']'
          ) {
            if (
              (left === '(' && right === ')' && symbol.output !== '}') ||
              (left === '[' && right === ']')
            ) {
              const pos: number[][] = []; // positions of commas
              let matrix = true;
              const m = newFrag.childNodes.length;
              let i: number, j: number;

              for (i = 0; matrix && i < m; i = i + 2) {
                pos[i] = [];
                node = newFrag.childNodes[i];
                if (matrix) {
                  matrix =
                    node.kind === 'mrow' && // current el is row
                    node.childNodes.length > 0 &&
                    (i === m - 1 ||  // last row, or next el is comma
                      (newFrag.childNodes[i + 1] &&
                        newFrag.childNodes[i + 1].kind === 'mo' &&
                        (newFrag.childNodes[i + 1].childNodes[0] as any).text === ','
                      )
                    ) && // row starts and ends with left/right brackets
                    (node.childNodes[0].childNodes[0] as any).text === left &&
                    (node.childNodes[node.childNodes.length - 1].childNodes[0] as any).text === right;
                }
                if (matrix) {
                  // record positions of commas
                  for (j = 0; j < node.childNodes.length; j++) {
                    if (
                      node.childNodes[j].childNodes.length > 0 &&
                      (node.childNodes[j].childNodes[0] as any).text === ','
                    ) {
                      pos[i][pos[i].length] = j;
                    }
                  }
                }
                if (matrix && i > 1) {
                  // check that number of commas matches previous row
                  matrix = pos[i].length === pos[i - 2].length;
                }
              }
              // At least two rows or two columns
              matrix = matrix && (pos.length > 1 || pos[0].length > 0);
              const columnlines: string[] = [];

              if (matrix) {
                const table = this.configuration.create('inferredMrow');
                for (i = 0; i < m; i = i + 2) {
                  const row = this.configuration.create('inferredMrow');
                  const frag = this.configuration.create('inferredMrow');
                  node = newFrag.childNodes[0]; // <mrow>(-,-,...,-,-)</mrow>
                  const n = node.childNodes.length;
                  let k = 0;
                  node.childNodes.shift(); // remove (

                  for (j = 1; j < n - 1; j++) {
                    if (typeof pos[i][k] !== 'undefined' && j === pos[i][k]) {
                      node.childNodes.shift(); // remove ,
                      if (
                        node.childNodes[0] &&
                        node.childNodes[0].kind === 'mrow' &&
                        node.childNodes[0].childNodes.length === 1 &&
                        node.childNodes[0].childNodes[0].childNodes.length > 0 &&
                        (node.childNodes[0].childNodes[0].childNodes[0] as any).text === '\u2223'
                      ) {
                        // is columnline marker - skip it
                        if (i === 0) {
                          columnlines.push('solid');
                        }
                        node.childNodes.shift(); // remove mrow
                        node.childNodes.shift(); // remove ,
                        j += 2;
                        k++;
                      } else if (i === 0) {
                        columnlines.push('none');
                      }
                      const mtd = this.configuration.create('mtd');
                      for (const child of frag.childNodes) {
                        mtd.appendChild(child);
                      }
                      row.appendChild(mtd);
                      frag.childNodes.length = 0; // clear frag
                      k++;
                    } else {
                      frag.appendChild(node.childNodes[0]);
                      node.childNodes.shift();
                    }
                  }
                  const mtd = this.configuration.create('mtd');
                  for (const child of frag.childNodes) {
                    mtd.appendChild(child);
                  }
                  row.appendChild(mtd);
                  if (i === 0) {
                    columnlines.push('none');
                  }
                  if (newFrag.childNodes.length > 2) {
                    newFrag.childNodes.shift(); // remove <mrow>)</mrow>
                    newFrag.childNodes.shift(); // remove <mo>,</mo>
                  }
                  const mtr = this.configuration.create('mtr');
                  for (const child of row.childNodes) {
                    mtr.appendChild(child);
                  }
                  table.appendChild(mtr);
                }
                node = this.configuration.create('mtable');
                node.attributes.set('columnlines', columnlines.join(' '));
                if (
                  typeof symbol.invisible === 'boolean' &&
                  symbol.invisible
                ) {
                  node.attributes.set('columnalign', 'left');
                }
                for (const child of table.childNodes) {
                  node.appendChild(child);
                }
                newFrag.childNodes[0] = node;
              }
            }
          }
        }
      }
      str = this.removeCharsAndBlanks(str, symbol.input.length);
      if (!symbol.invisible) {
        const mo = this.configuration.create('mo');
        mo.appendChild(this.configuration.createText(symbol.output));
        newFrag.appendChild(mo);
      }
    }

    return [newFrag, str];
  }

  /**
   * Main parse method - returns the MML tree
   *
   * @returns {MmlNode} The parsed MML node
   */
  public mml(): MmlNode {
    this.nestingDepth = 0;

    // Cleanup
    let str = this._string.replace(/&nbsp;/g, '');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&lt;/g, '<');

    const frag = this.parseExpr(str.replace(/^\s+/g, ''), false)[0];
    const node = this.configuration.create('mstyle', [frag]);

    if (this.displaystyle) {
      NodeUtil.setAttribute(node, 'displaystyle', 'true');
    }

    return node;
  }
}
