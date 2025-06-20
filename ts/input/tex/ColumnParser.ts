/*************************************************************
 *
 *  Copyright (c) 2022-2025 The MathJax Consortium
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
 * @file  Implements a parser for array column declarations.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { ArrayItem } from './base/BaseItems.js';
import TexParser from './TexParser.js';
import TexError from './TexError.js';
import { lookup } from '../../util/Options.js';
import { ParseUtil } from './ParseUtil.js';
import { UnitUtil } from './UnitUtil.js';

/***********************************************************************/

/**
 * The state of the columns analyzed so far.
 */
/* prettier-ignore */
export type ColumnState = {
  parser: TexParser,                    // the current TexParser
  template: string;                     // the template string for the columns
  i: number;                            // the current location in the template
  c: string;                            // the current column identifier
  j: number;                            // the current column number
  calign: string[];                     // the column alignments
  cwidth: string[];                     // the explicit column widths
  cspace: string[];                     // the column spacing
  clines: string[];                     // the column lines
  cstart: string[];                     // the '>' declarations
  cend:   string[];                     // the '<' declarations
  cextra: boolean[];                    // the extra columns from '@' and '!' declarations
  ralign: [string, string, string][];   // the row alignment and column width/align when specified
}

/**
 * A function to handle a column declaration
 */
export type ColumnHandler = (state: ColumnState) => void;

/***********************************************************************/

/**
 * The ColumnParser class for processing array environment column templates.
 */
export class ColumnParser {
  /**
   * The handlers for each column character type (future: can be augmented by \newcolumntype)
   */
  public columnHandler: { [c: string]: ColumnHandler } = {
    l: (state) => (state.calign[state.j++] = 'left'),
    c: (state) => (state.calign[state.j++] = 'center'),
    r: (state) => (state.calign[state.j++] = 'right'),
    p: (state) => this.getColumn(state, 'top'),
    m: (state) => this.getColumn(state, 'middle'),
    b: (state) => this.getColumn(state, 'bottom'),
    w: (state) => this.getColumn(state, 'top', ''),
    W: (state) => this.getColumn(state, 'top', ''),
    '|': (state) => this.addRule(state, 'solid'),
    ':': (state) => this.addRule(state, 'dashed'),
    '>': (state) =>
      (state.cstart[state.j] =
        (state.cstart[state.j] || '') + this.getBraces(state)),
    '<': (state) =>
      (state.cend[state.j - 1] =
        (state.cend[state.j - 1] || '') + this.getBraces(state)),
    '@': (state) => this.addAt(state, this.getBraces(state)),
    '!': (state) => this.addBang(state, this.getBraces(state)),
    '*': (state) => this.repeat(state),
    //
    // Non-standard for math-mode versions
    //
    P: (state) => this.macroColumn(state, '>{$}p{#1}<{$}', 1),
    M: (state) => this.macroColumn(state, '>{$}m{#1}<{$}', 1),
    B: (state) => this.macroColumn(state, '>{$}b{#1}<{$}', 1),
    //
    // Ignored
    //
    ' ': (_state) => {},
  };

  /**
   * The maximum number of column specifiers to process (prevents loops from \newcolumntype).
   */
  public MAXCOLUMNS: number = 10000;

  /**
   * Process an array column template
   *
   * @param {TexParser} parser   The active TexParser
   * @param {string} template    The alignment template
   * @param {ArrayItem} array    The ArrayItem for the template
   */
  public process(parser: TexParser, template: string, array: ArrayItem) {
    //
    // Initialize the state
    //
    const state: ColumnState = {
      parser,
      template,
      i: 0,
      j: 0,
      c: '',
      cwidth: [],
      calign: [],
      cspace: [],
      clines: [],
      cstart: array.cstart,
      cend: array.cend,
      ralign: array.ralign,
      cextra: array.cextra,
    };
    //
    // Loop through the template to process the column specifiers
    //
    let n = 0;
    while (state.i < state.template.length) {
      if (n++ > this.MAXCOLUMNS) {
        throw new TexError(
          'MaxColumns',
          'Too many column specifiers (perhaps looping column definitions?)'
        );
      }
      const code = state.template.codePointAt(state.i);
      const c = (state.c = String.fromCodePoint(code));
      state.i += c.length;
      if (!Object.hasOwn(this.columnHandler, c)) {
        throw new TexError('BadPreamToken', 'Illegal pream-token (%1)', c);
      }
      this.columnHandler[c](state);
    }
    //
    // Set array definition values
    //
    this.setColumnAlign(state, array);
    this.setColumnWidths(state, array);
    this.setColumnSpacing(state, array);
    this.setColumnLines(state, array);
    this.setPadding(state, array);
  }

  /**
   * @param {ColumnState} state   The current state of the parser
   * @param {ArrayItem} array     The array stack item to adjust
   */
  protected setColumnAlign(state: ColumnState, array: ArrayItem) {
    array.arraydef.columnalign = state.calign.join(' ');
  }

  /**
   * @param {ColumnState} state   The current state of the parser
   * @param {ArrayItem} array     The array stack item to adjust
   */
  protected setColumnWidths(state: ColumnState, array: ArrayItem) {
    if (!state.cwidth.length) return;
    const cwidth = [...state.cwidth];
    if (cwidth.length < state.calign.length) {
      cwidth.push('auto');
    }
    array.arraydef.columnwidth = cwidth.map((w) => w || 'auto').join(' ');
  }

  /**
   * @param {ColumnState} state   The current state of the parser
   * @param {ArrayItem} array     The array stack item to adjust
   */
  protected setColumnSpacing(state: ColumnState, array: ArrayItem) {
    if (!state.cspace.length) return;
    const cspace = [...state.cspace];
    if (cspace.length < state.calign.length) {
      cspace.push('1em');
    }
    array.arraydef.columnspacing = cspace
      .slice(1)
      .map((d) => d || '1em')
      .join(' ');
  }

  /**
   * @param {ColumnState} state   The current state of the parser
   * @param {ArrayItem} array     The array stack item to adjust
   */
  protected setColumnLines(state: ColumnState, array: ArrayItem) {
    if (!state.clines.length) return;
    const clines = [...state.clines];
    if (clines[0]) {
      // @test Enclosed left right, Enclosed left
      array.frame.push(['left', clines[0]]);
    }
    if (clines.length > state.calign.length) {
      // @test Enclosed left right, Enclosed right
      array.frame.push(['right', clines.pop()]);
    } else if (clines.length < state.calign.length) {
      clines.push('none');
    }
    if (clines.length > 1) {
      // @test Enclosed left right
      array.arraydef.columnlines = clines
        .slice(1)
        .map((l) => l || 'none')
        .join(' ');
    }
  }

  /**
   * @param {ColumnState} state   The current state of the parser
   * @param {ArrayItem} array     The array stack item to adjust
   */
  protected setPadding(state: ColumnState, array: ArrayItem) {
    if (!state.cextra[0] && !state.cextra[state.calign.length - 1]) return;
    const i = state.calign.length - 1;
    const cspace = state.cspace;
    const space = !state.cextra[i] ? null : cspace[i];
    array.arraydef['data-array-padding'] =
      `${cspace[0] || '.5em'} ${space || '.5em'}`;
  }

  /**
   * Read a p/m/b/w/W column declaration
   *
   * @param {ColumnState} state   The current state of the parser
   * @param {number} ralign       The vertical alignment for the column
   * @param {string=} calign      The column alignment ('' means get it as an argument)
   */
  public getColumn(
    state: ColumnState,
    ralign: string,
    calign: string = 'left'
  ) {
    state.calign[state.j] = calign || this.getAlign(state);
    state.cwidth[state.j] = this.getDimen(state);
    state.ralign[state.j] = [
      ralign,
      state.cwidth[state.j],
      state.calign[state.j],
    ];
    state.j++;
  }

  /**
   * Get a dimension argument
   *
   * @param {ColumnState} state   The current state of the parser
   *
   * @returns {string} The dimension string
   */
  public getDimen(state: ColumnState): string {
    const dim = this.getBraces(state);
    if (!UnitUtil.matchDimen(dim)[0]) {
      throw new TexError(
        'MissingColumnDimOrUnits',
        'Missing dimension or its units for %1 column declaration',
        state.c
      );
    }
    return dim;
  }

  /**
   * Get an alignment argument
   *
   * @param {ColumnState} state   The current state of the parser
   *
   * @returns {string} The alignment string
   */
  public getAlign(state: ColumnState): string {
    const align = this.getBraces(state);
    return lookup(
      align.toLowerCase(),
      { l: 'left', c: 'center', r: 'right' },
      ''
    );
  }

  /**
   * Get a braced argument
   *
   * @param {ColumnState} state   The current state of the parser
   *
   * @returns {string} The argument string
   */
  public getBraces(state: ColumnState): string {
    while (state.template[state.i] === ' ') state.i++;
    if (state.i >= state.template.length) {
      throw new TexError(
        'MissingArgForColumn',
        'Missing argument for %1 column declaration',
        state.c
      );
    }
    if (state.template[state.i] !== '{') {
      return state.template[state.i++];
    }
    const i = ++state.i;
    let braces = 1;
    while (state.i < state.template.length) {
      switch (state.template.charAt(state.i++)) {
        case '\\':
          state.i++;
          break;
        case '{':
          braces++;
          break;
        case '}':
          if (--braces === 0) {
            return state.template.slice(i, state.i - 1);
          }
          break;
      }
    }
    throw new TexError('MissingCloseBrace', 'Missing close brace');
  }

  /**
   * Handle \newcolumntype declarations
   *
   * @param {ColumnState} state   The current state of the parser
   * @param {string} macro        The replacement string for the column type
   * @param {number} n            The number of arguments for the column type
   */
  public macroColumn(state: ColumnState, macro: string, n: number) {
    const args: string[] = [];
    while (n > 0 && n--) {
      args.push(this.getBraces(state));
    }
    state.template =
      ParseUtil.substituteArgs(state.parser, args, macro) +
      state.template.slice(state.i);
    state.i = 0;
  }

  /**
   * @param {ColumnState} state   The current state of the parser
   * @param {string} rule         The type of rule to add (solid or dashed)
   */
  public addRule(state: ColumnState, rule: string) {
    if (state.clines[state.j]) {
      this.addAt(state, '\\,');
    }
    state.clines[state.j] = rule;
    if (state.cspace[state.j] === '0') {
      state.cstart[state.j] = '\\hspace{.5em}';
    }
  }

  /**
   * Add an @{...} entry
   *
   * @param {ColumnState} state   The current state of the parser
   * @param {string} macro        The replacement string for the column type
   */
  public addAt(state: ColumnState, macro: string) {
    const { cstart, cspace, j } = state;
    state.cextra[j] = true;
    state.calign[j] = 'center';
    if (state.clines[j]) {
      if (cspace[j] === '.5em') {
        cstart[j - 1] += '\\hspace{.25em}';
      } else if (!cspace[j]) {
        state.cend[j - 1] = (state.cend[j - 1] || '') + '\\hspace{.5em}';
      }
    }
    cstart[j] = macro;
    cspace[j] = '0';
    cspace[++state.j] = '0';
  }

  /**
   * Add a !{...} entry
   *
   * @param {ColumnState} state   The current state of the parser
   * @param {string} macro        The replacement string for the column type
   */
  public addBang(state: ColumnState, macro: string) {
    const { cstart, cspace, j } = state;
    state.cextra[j] = true;
    state.calign[j] = 'center';
    cstart[j] =
      (cspace[j] === '0' && state.clines[j] ? '\\hspace{.25em}' : '') + macro;
    if (!cspace[j]) {
      cspace[j] = '.5em';
    }
    cspace[++state.j] = '.5em';
  }

  /**
   * Add a *{n}{...} entry
   *
   * @param {ColumnState} state   The current state of the parser
   */
  public repeat(state: ColumnState) {
    const num = this.getBraces(state);
    const cols = this.getBraces(state);
    const n = parseInt(num);
    if (String(n) !== num) {
      throw new TexError(
        'ColArgNotNum',
        'First argument to %1 column specifier must be a number',
        '*'
      );
    }
    state.template =
      new Array(n).fill(cols).join('') + state.template.substring(state.i);
    state.i = 0;
  }
}
