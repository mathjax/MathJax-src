/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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
 * @file  Implements the TeX version of the FindMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractFindMath } from '../../core/FindMath.js';
import { OptionList } from '../../util/Options.js';
import { sortLength, quotePattern } from '../../util/string.js';
import { ProtoItem, protoItem } from '../../core/MathItem.js';
import { DOM_TYPES } from '../../types/Types.js';

/**
 * Shorthand types for data about end delimiters and delimiter pairs
 */
export type EndItem = [string, boolean, RegExp];
export type Delims = [string, string];

/*****************************************************************/

/**
 * The FindTeX option types.
 */
export type FINDTEX_OPTIONS = {
  inlineMath: [string, string][]; //    The start/end delimiter pairs for in-line math
  displayMath: [string, string][]; //   The start/end delimiter pairs for display math
  processEscapes: boolean; //           True allows \$ to produce a literal dollar sign
  processEnvironments: boolean; //      True processes \begin{xxx}...\end{xxx} outside math mode
  processRefs: boolean; //              True processed \ref{...} outside of math mode
};

/**
 * The FindTeX option defaults.
 */
const options: FINDTEX_OPTIONS = {
  inlineMath: [['\\(', '\\)']],
  displayMath: [
    ['$$', '$$'],
    ['\\[', '\\]'],
  ],
  processEscapes: true,
  processEnvironments: true,
  processRefs: true,
};

/*****************************************************************/
/*
 *  Implements the FindTeX class (extends AbstractFindMath)
 *
 *  Locates TeX expressions within strings
 */

/**
 * @template DOM   The DOM node types
 */
export class FindTeX<DOM extends DOM_TYPES> extends AbstractFindMath<DOM> {
  /**
   * the default options
   */
  public static OPTIONS = options;

  /**
   * The regular expression for any starting delimiter
   */
  protected start: RegExp;

  /**
   * The end-delimiter data keyed to the opening delimiter string
   */
  protected end: { [name: string]: EndItem };

  /**
   * False if the configuration has no delimiters (so search can be skipped), true otherwise
   */
  protected hasPatterns: boolean;

  /**
   * The index of the \begin...\end pattern in the regex match array
   */
  protected env: number;

  /**
   * The index of the \ref and escaped character patters in the regex match array
   */
  protected sub: number;

  /**
   * @override
   */
  constructor(options: OptionList) {
    super(options);
    this.getPatterns();
  }

  /**
   * Create the patterns needed for searching the strings for TeX
   *   based on the configuration options
   */
  protected getPatterns() {
    const options = this.options;
    const starts: string[] = [];
    const parts: string[] = [];
    const subparts: string[] = [];
    this.end = {};
    this.env = this.sub = 0;
    let i = 1;
    options['inlineMath'].forEach((delims: Delims) =>
      this.addPattern(starts, delims, false)
    );
    options['displayMath'].forEach((delims: Delims) =>
      this.addPattern(starts, delims, true)
    );
    if (starts.length) {
      parts.push(starts.sort(sortLength).join('|'));
    }
    if (options['processEnvironments']) {
      parts.push('\\\\begin\\s*\\{([^}]*)\\}');
      this.env = i;
      i++;
    }
    if (options['processEscapes']) {
      subparts.push('\\\\([\\\\$])');
    }
    if (options['processRefs']) {
      subparts.push('(\\\\(?:eq)?ref\\s*\\{[^}]*\\})');
    }
    if (subparts.length) {
      parts.push('(' + subparts.join('|') + ')');
      this.sub = i;
    }
    this.start = new RegExp(parts.join('|'), 'g');
    this.hasPatterns = parts.length > 0;
  }

  /**
   * Add the needed patterns for a pair of delimiters
   *
   * @param {string[]} starts  Array of starting delimiter strings
   * @param {Delims} delims    Array of delimiter strings, as [start, end]
   * @param {boolean} display  True if the delimiters are for display mode
   */
  protected addPattern(starts: string[], delims: Delims, display: boolean) {
    const [open, close] = delims;
    starts.push(quotePattern(open));
    this.end[open] = [close, display, this.endPattern(close)];
  }

  /**
   * Create the pattern for a close delimiter
   *
   * @param {string} end   The end delimiter text
   * @param {string} endp  The end delimiter pattern (overrides the literal end pattern)
   * @returns {RegExp}      The regular expression for the end delimiter
   */
  protected endPattern(end: string, endp?: string): RegExp {
    return new RegExp(
      (endp || quotePattern(end)) + '|\\\\(?:[a-zA-Z]|.)|[{}]',
      'g'
    );
  }

  /**
   * Search for the end delimiter given the start delimiter,
   *   skipping braced groups, and control sequences that aren't
   *   the close delimiter.
   *
   * @param {string} text            The string being searched for the end delimiter
   * @param {number} n               The index of the string being searched
   * @param {RegExpExecArray} start  The result array from the start-delimiter search
   * @param {EndItem} end            The end-delimiter data corresponding to the start delimiter
   * @returns {ProtoItem<DOM>}       The proto math item for the math, if found
   */
  protected findEnd(
    text: string,
    n: number,
    start: RegExpExecArray,
    end: EndItem
  ): ProtoItem<DOM> {
    const [close, display, pattern] = end;
    const i = (pattern.lastIndex = start.index + start[0].length);
    let match: RegExpExecArray,
      braces: number = 0;
    while ((match = pattern.exec(text))) {
      if ((match[1] || match[0]) === close && braces === 0) {
        return protoItem<DOM>(
          start[0],
          text.substring(i, match.index),
          match[0],
          n,
          start.index,
          match.index + match[0].length,
          display
        );
      } else if (match[0] === '{') {
        braces++;
      } else if (match[0] === '}' && braces) {
        braces--;
      }
    }
    return null;
  }

  /**
   * Search a string for math delimited by one of the delimiter pairs,
   *   or by \begin{env}...\end{env}, or \eqref{...}, \ref{...}, \\, or \$.
   *
   * @param {ProtoItem[]} math  The array of proto math items located so far
   * @param {number} n          The index of the string being searched
   * @param {string} text       The string being searched
   */
  protected findMathInString(math: ProtoItem<DOM>[], n: number, text: string) {
    let start, match;
    this.start.lastIndex = 0;
    while ((start = this.start.exec(text))) {
      if (start[this.env] !== undefined && this.env) {
        const end = '\\\\end\\s*(\\{' + quotePattern(start[this.env]) + '\\})';
        match = this.findEnd(text, n, start, [
          '{' + start[this.env] + '}',
          true,
          this.endPattern(null, end),
        ]);
        if (match) {
          match.math = match.open + match.math + match.close;
          match.open = match.close = '';
        }
      } else if (start[this.sub] !== undefined && this.sub) {
        const math = start[this.sub];
        const end = start.index + start[this.sub].length;
        if (math.length === 2) {
          match = protoItem<DOM>(
            '\\',
            math.substring(1),
            '',
            n,
            start.index,
            end
          );
        } else {
          match = protoItem<DOM>('', math, '', n, start.index, end, false);
        }
      } else {
        match = this.findEnd(text, n, start, this.end[start[0]]);
      }
      if (match) {
        math.push(match);
        this.start.lastIndex = match.end.n;
      }
    }
  }

  /**
   * Search for math in an array of strings and return an array of matches.
   *
   * @override
   */
  public findMath(strings: string[]) {
    const math: ProtoItem<DOM>[] = [];
    if (this.hasPatterns) {
      for (let i = 0, m = strings.length; i < m; i++) {
        this.findMathInString(math, i, strings[i]);
      }
    }
    return math;
  }
}
